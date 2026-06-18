import { Request, Response, NextFunction } from 'express';
import { AcademyService } from '../services/AcademyService';

export const tutorChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message, mode, scanContext } = req.body;

    if (!message) {
      res.status(400).json({ success: false, message: 'Message parameter is required' });
      return;
    }

    console.log(`[AcademyController] Processing tutor query. Mode: ${mode || 'beginner'}`);
    const explanation = await AcademyService.getTutorResponse(message, mode || 'beginner', scanContext);

    res.status(200).json({
      success: true,
      data: explanation
    });
  } catch (error) {
    console.error('[AcademyController] Tutor chat failed:', (error as Error).message);
    // Let the route fail gracefully, client-side fallback handles it
    next(error);
  }
};

export const scamAnalyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ success: false, message: 'Content parameter is required' });
      return;
    }

    console.log('[AcademyController] Analyzing potential scam contents...');
    const result = await AcademyService.analyzeScam(content);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AcademyController] Scam analysis failed:', (error as Error).message);
    next(error);
  }
};

export const generateCurriculum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { level, topic, duration } = req.body;

    if (!level || !topic || !duration) {
      res.status(400).json({ success: false, message: 'Level, topic, and duration parameters are required' });
      return;
    }

    console.log(`[AcademyController] Generating curriculum for ${level}...`);
    const result = await AcademyService.generateCurriculum(level, topic, duration);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AcademyController] Curriculum generation failed:', (error as Error).message);
    next(error);
  }
};

export const generateCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic, style } = req.body;

    if (!topic || !style) {
      res.status(400).json({ success: false, message: 'Topic and style parameters are required' });
      return;
    }

    console.log(`[AcademyController] Generating campaign for style: ${style}...`);
    const result = await AcademyService.generateCampaign(topic, style);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AcademyController] Campaign generation failed:', (error as Error).message);
    next(error);
  }
};
