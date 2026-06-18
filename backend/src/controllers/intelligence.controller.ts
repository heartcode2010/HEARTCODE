import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { IntelligenceService } from '../services/IntelligenceService';

export const runFullScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }

    console.log(`[IntelligenceController] Running full intelligence OS engines on ScanId: ${scanId}`);
    const analysis = await IntelligenceService.runFullIntelligence(scanId);

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const runSurfaceScan = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For simplicity and compatibility, run full and return standard response
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }
    const analysis = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const runDeepRecon = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ success: false, message: 'Scan ID is required' });
    }
    const analysis = await IntelligenceService.runFullIntelligence(scanId);
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const getInfrastructureMap = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, infrastructureMap: report.infrastructureMap });
  } catch (error) {
    next(error);
  }
};

export const getBehavioralProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, behavioralProfile: report.behavioralProfile });
  } catch (error) {
    next(error);
  }
};

export const getAIForensics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({
      success: true,
      aiForensics: report.aiForensics,
      codeClassifications: report.codeClassifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getThreatRadar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, threatRadar: report.threatRadar });
  } catch (error) {
    next(error);
  }
};

export const getReputationScores = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, reputationScores: report.reputationScores });
  } catch (error) {
    next(error);
  }
};

export const getDNAProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'Scan ID is required' });
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, dnaProfile: report.dnaProfile });
  } catch (error) {
    next(error);
  }
};

export const getIntelligenceReportDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.params;
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export const getTimelineEvents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.params;
    const report = await IntelligenceService.getIntelligenceReport(scanId);
    return res.status(200).json({ success: true, timelineEvents: report.timelineEvents });
  } catch (error) {
    next(error);
  }
};

export default {
  runFullScan,
  runSurfaceScan,
  runDeepRecon,
  getInfrastructureMap,
  getBehavioralProfile,
  getAIForensics,
  getThreatRadar,
  getReputationScores,
  getDNAProfile,
  getIntelligenceReportDetails,
  getTimelineEvents,
};
