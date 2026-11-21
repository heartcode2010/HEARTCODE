import { Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ScanService } from '../services/ScanService';
import { AIService } from '../services/AIService';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import AIAnalysis from '../models/AIAnalysis';

const getScanOwnerId = (req: AuthenticatedRequest): string => {
  const id = req.user?.id || `guest:${req.ip || 'unknown'}`;
  return /^[a-f0-9]{24}$/i.test(id)
    ? id
    : createHash('sha256').update(id).digest('hex').slice(0, 24);
};

const canAccessScan = (scan: { userId: { toString(): string } }, req: AuthenticatedRequest): boolean => {
  const isAuthenticatedAdmin = req.user?.role === 'admin' &&
    !!req.user.id && /^[a-f0-9]{24}$/i.test(req.user.id);
  return scan.userId.toString() === getScanOwnerId(req) || isAuthenticatedAdmin;
};

export const inspectUrl = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    // Self-scan prevention check
    const protectedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'heartcode.io', 'heartcode.vercel.app', 'heartcode.dev'];
    let targetHost = '';
    try {
      const parsed = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`);
      targetHost = parsed.hostname.toLowerCase();
    } catch {
      targetHost = url.toLowerCase();
    }

    if (protectedHosts.some(h => targetHost === h || targetHost.endsWith(`.${h}`))) {
      return res.status(400).json({
        success: false,
        isSelfScan: true,
        message: "Can't scan: HEARTCODE self-scan is restricted. Target represents the application's local or production infrastructure."
      });
    }

    const userId = getScanOwnerId(req);
    const username = req.user?.username || 'Guest';

    console.log(`[ScanController] Inspecting URL: ${url} (User: ${username})`);
    
    // 1. Fetch source code and headers
    const { html, headers } = await ScanService.fetchTargetData(url);

    // 2. Compile page elements statistics
    const stats = ScanService.calculateStats(html);

    // 3. Save Scan mapping into MongoDB
    const scan = new Scan({
      url,
      userId,
      htmlSource: html,
      headers: headers,
      ...stats,
    });
    await scan.save();

    return res.status(200).json({
      success: true,
      message: 'Source code loaded successfully',
      scan: {
        id: scan._id,
        url: scan.url,
        htmlSource: scan.htmlSource,
        size: scan.size,
        lines: scan.lines,
        tagsCount: scan.tagsCount,
        scriptsCount: scan.scriptsCount,
        stylesCount: scan.stylesCount,
        imagesCount: scan.imagesCount,
        createdAt: scan.createdAt,
      },
    });
  } catch (error) {
    console.error('[ScanController] Inspection failed:', (error as Error).message);
    next(error);
  }
};

export const runScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }
    if (!canAccessScan(scan, req)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to scan this record.' });
    }

    console.log(`[ScanController] Running advanced security engine on ScanId: ${scanId}`);

    // 1. Run advanced modular scanning engine
    const report = await ScanService.runAdvancedScan(scan.url, scan.htmlSource, scan.headers ? Object.fromEntries(scan.headers as any) : {});

    // 2. Wipe older findings if any and insert fresh findings
    await Vulnerability.deleteMany({ scanId });
    const insertedFindings = await Vulnerability.insertMany(
      report.findings.map(f => ({
        scanId,
        idString: f.id,
        category: f.category,
        severity: f.severity,
        confidence: f.confidence,
        name: f.name,
        description: f.description,
        technicalExplanation: f.technicalExplanation,
        businessImpact: f.businessImpact,
        remediation: f.remediation,
        evidence: f.evidence,
      }))
    );

    // 3. Run AI Platform checks
    const aiResult = ScanService.runAIDetect(scan.htmlSource);
    await AIAnalysis.deleteMany({ scanId });
    const aiRecord = new AIAnalysis({
      scanId,
      score: aiResult.score,
      tools: aiResult.tools,
      signals: aiResult.signals,
    });
    await aiRecord.save();

    return res.status(200).json({
      success: true,
      findings: insertedFindings,
      aiAnalysis: aiRecord,
      overallScore: report.overallScore,
      riskBreakdown: report.riskBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

export const runAIDeepAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }

    console.log(`[ScanController] Running AI Deep Analysis on ScanId: ${scanId}`);

    // Query AI audit response
    const analysisReport = await AIService.analyzeSourceCode(scan.htmlSource, scan.url);

    return res.status(200).json({
      success: true,
      report: analysisReport,
    });
  } catch (error) {
    next(error);
  }
};

export const getScanHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'guest_user';

    const history = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(15)
      .select('url size lines createdAt');

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const clearScanHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'guest_user';

    await Scan.deleteMany({ userId });
    
    return res.status(200).json({
      success: true,
      message: 'Scan history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const loadScanSource = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.params;
    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }
    if (!canAccessScan(scan, req)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to access this scan.' });
    }

    return res.status(200).json({
      success: true,
      scan,
    });
  } catch (error) {
    next(error);
  }
};

// Note: runVulnerabilityScan and runTechStackScan endpoints are mostly obsolete now 
// since runScan combines everything using the new engine, but kept for compatibility.
export const runVulnerabilityScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }
    if (!canAccessScan(scan, req)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to scan this record.' });
    }

    const report = await ScanService.runAdvancedScan(scan.url, scan.htmlSource, scan.headers ? Object.fromEntries(scan.headers as any) : {});

    await Vulnerability.deleteMany({ scanId });
    const insertedFindings = await Vulnerability.insertMany(
        report.findings.map(f => ({
          scanId,
          idString: f.id,
          category: f.category,
          severity: f.severity,
          confidence: f.confidence,
          name: f.name,
          description: f.description,
          technicalExplanation: f.technicalExplanation,
          businessImpact: f.businessImpact,
          remediation: f.remediation,
          evidence: f.evidence,
        }))
      );

    return res.status(200).json({
      success: true,
      findings: insertedFindings,
      overallScore: report.overallScore,
      riskBreakdown: report.riskBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

export const runAiDetect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }

    console.log(`[ScanController] Running AI detect scan on ScanId: ${scanId}`);
    const aiResult = ScanService.runAIDetect(scan.htmlSource);

    await AIAnalysis.deleteMany({ scanId });
    const aiRecord = new AIAnalysis({
      scanId,
      score: aiResult.score,
      tools: aiResult.tools,
      signals: aiResult.signals,
    });
    await aiRecord.save();

    return res.status(200).json({
      success: true,
      aiAnalysis: aiRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const runTechStackScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan record not found' });
    }

    // Filter just the Tech Stack findings
    const report = await ScanService.runAdvancedScan(scan.url, scan.htmlSource, scan.headers ? Object.fromEntries(scan.headers as any) : {});
    const techStackFindings = report.findings.filter(f => f.category === 'TECHNOLOGY STACK ANALYSIS');
    
    // Map them back to the old format for backwards compatibility if needed
    const techStack = techStackFindings.map(f => ({
       cat: f.name.split(':')[0].replace('Technology Detected', 'Tech').trim(),
       name: f.name.split(':')[1]?.trim() || f.name,
       icon: '⚙️',
       evidence: f.evidence
    }));

    return res.status(200).json({
      success: true,
      techStack,
    });
  } catch (error) {
    next(error);
  }
};

export default { 
  inspectUrl, 
  runScan, 
  runAIDeepAnalysis, 
  getScanHistory, 
  clearScanHistory, 
  loadScanSource,
  runVulnerabilityScan,
  runAiDetect,
  runTechStackScan
};
