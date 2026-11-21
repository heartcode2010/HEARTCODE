import { Response, NextFunction } from 'express';
import AIAnalysis from '../models/AIAnalysis';
import Scan from '../models/Scan';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import AIService from '../services/AIService';
import Vulnerability from '../models/Vulnerability';

/** GET /api/ai-detection/:scanId — retrieve stored AI analysis */
export const getAnalysis = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.params;

    const scan = await Scan.findById(scanId);
    if (!scan) return res.status(404).json({ success: false, message: 'Scan not found' });

    const analysis = await AIAnalysis.findOne({ scanId });
    if (!analysis) return res.status(404).json({ success: false, message: 'No AI analysis found for this scan' });

    return res.json({ success: true, analysis });
  } catch (err) { next(err); }
};

/** POST /api/ai-detection/deep-report — generate a GPT deep analysis report */
export const deepReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scanId } = req.body;
    if (!scanId) return res.status(400).json({ success: false, message: 'scanId is required' });

    const scan = await Scan.findById(scanId);
    if (!scan) return res.status(404).json({ success: false, message: 'Scan not found' });

    const report = await AIService.generateDeepReport(scan.htmlSource, scan.url);
    return res.json({ success: true, report });
  } catch (err) { next(err); }
};

/** POST /api/ai-detection/explain-finding — generate explanation for a finding */
export const explainFinding = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { findingId } = req.body;
    if (!findingId) return res.status(400).json({ success: false, message: 'findingId is required' });

    const finding = await Vulnerability.findById(findingId);
    if (!finding) return res.status(404).json({ success: false, message: 'Finding not found' });

    const explanation = await AIService.explainFinding(finding as any);
    return res.json({ success: true, explanation });
  } catch (err) { next(err); }
};

/** POST /api/ai-detection/chat — Conversational Talkie-style Cyber Expert Chat */
export const chatCyberExpert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { messages, persona } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const reply = await AIService.chatExpert(messages, persona || 'red_team');
    return res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};

export default { getAnalysis, deepReport, explainFinding, chatCyberExpert };
