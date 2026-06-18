import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ScanService } from '../services/ScanService';
import { AIService } from '../services/AIService';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import AIAnalysis from '../models/AIAnalysis';

export const inspectUrl = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    console.log(`[ScanController] Inspecting URL: ${url} (User: ${req.user.username})`);
    
    // 1. Fetch source code and headers
    const { html, headers } = await ScanService.fetchTargetData(url);

    // 2. Compile page elements statistics
    const stats = ScanService.calculateStats(html);

    // 3. Save Scan mapping into MongoDB
    const scan = new Scan({
      url,
      userId: req.user.id,
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
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const history = await Scan.find({ userId: req.user.id })
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
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await Scan.deleteMany({ userId: req.user.id });
    
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
