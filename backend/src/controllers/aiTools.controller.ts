import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import AIContentService from '../services/AIContentService';

const sendGenerated = async (system: string, prompt: string, res: Response, next: NextFunction) => {
  try {
    const result = await AIContentService.generate(system, prompt);
    return res.json({ success: true, content: result.content, provider: result.provider });
  } catch (error: any) {
    if (error?.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    return next(error);
  }
};

export const generateNexoraScript = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const parsed = z.object({
    promptText: z.string().trim().min(8).max(3000),
    contentType: z.string().trim().min(2).max(40).default('vlog'),
    platform: z.enum(['tiktok', 'instagram', 'youtube', 'facebook', 'linkedin', 'x']).default('tiktok'),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Enter a content brief and choose a supported platform.' });
  return sendGenerated(
    'You are Nexora AI Director, a professional creative producer. Produce original, practical scripts and shot lists. Never claim to have created actual video, images, music or bookings.',
    'Create a ' + parsed.data.contentType + ' script for ' + parsed.data.platform + '. Brief: ' + parsed.data.promptText + '. Include a hook, scene-by-scene shot list, dialogue or voiceover, on-screen text, pacing and a clear call to action.',
    res, next,
  );
};

export const generateNexoraBrandBrief = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const parsed = z.object({
    brandName: z.string().trim().min(2).max(100),
    industry: z.string().trim().min(2).max(100),
    audience: z.string().trim().min(2).max(250),
    tone: z.string().trim().min(2).max(80).default('Confident and modern'),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Complete the brand name, industry, audience and tone.' });
  return sendGenerated(
    'You are a senior brand strategist and creative director. Give specific, commercially useful brand strategy. Avoid unsupported market claims and generic filler.',
    'Create a concise brand strategy brief for ' + parsed.data.brandName + '. Industry: ' + parsed.data.industry + '. Target audience: ' + parsed.data.audience + '. Desired personality: ' + parsed.data.tone + '. Include positioning, value proposition, differentiators to validate, voice, visual direction, sample tagline options and practical next steps.',
    res, next,
  );
};

export const generateEduVerseNotes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const parsed = z.object({
    topic: z.string().trim().min(3).max(250),
    level: z.enum(['junior-secondary', 'senior-secondary', 'jamb', 'waec', 'beginner', 'intermediate']).default('senior-secondary'),
    examType: z.enum(['WAEC', 'JAMB', 'NECO', 'General']).default('General'),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Enter a topic and choose a learning level.' });
  return sendGenerated(
    'You are an experienced Nigerian secondary-school and exam-preparation teacher. Explain accurately, use Nigerian curriculum context where relevant, and distinguish verified syllabus facts from general study advice. Never fabricate official exam questions.',
    'Prepare structured revision notes for the topic: ' + parsed.data.topic + '. Learner level: ' + parsed.data.level + '. Exam context: ' + parsed.data.examType + '. Include clear explanations, worked examples where useful, key terms, common mistakes, a short summary and five original practice questions with answers and explanations. Label practice questions as original practice, not past questions.',
    res, next,
  );
};

export default { generateNexoraScript, generateNexoraBrandBrief, generateEduVerseNotes };
