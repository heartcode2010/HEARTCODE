import { Request, Response } from 'express';

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 12000;

export const getTechnovaStatus = (_req: Request, res: Response) => {
  const configured = Boolean(process.env.OBSYDIA_BASE_URL && process.env.OBSYDIA_API_KEY);
  res.json({ success: true, configured, provider: configured ? 'Dark Obsydia AI' : null, model: process.env.OBSYDIA_MODEL || 'provider-default' });
};

export const novaChat = async (req: Request, res: Response) => {
  const baseUrl = process.env.OBSYDIA_BASE_URL?.trim().replace(/\/$/, '');
  const apiKey = process.env.OBSYDIA_API_KEY;
  if (!baseUrl || !apiKey) return res.status(503).json({ success: false, message: 'NOVA is not configured. Set OBSYDIA_BASE_URL and OBSYDIA_API_KEY on the server.' });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ success: false, message: 'Provide between 1 and 24 chat messages.' });
  }
  const safeMessages = messages.map((message: any) => {
    if (!['user', 'assistant'].includes(message?.role) || typeof message?.content !== 'string' || !message.content.trim() || message.content.length > MAX_CONTENT_LENGTH) {
      throw new Error('Each message must have a valid role and non-empty text under 12,000 characters.');
    }
    return { role: message.role, content: message.content };
  });
  try {
    const response = await fetch(baseUrl + '/api/v1/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OBSYDIA_MODEL || undefined, messages: safeMessages, stream: false }),
      signal: AbortSignal.timeout(90000),
    });
    const payload: any = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ success: false, message: payload?.error?.message || payload?.message || 'Obsydia AI returned an unsuccessful response.' });
    const reply = payload?.choices?.[0]?.message?.content || payload?.reply || payload?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return res.status(502).json({ success: false, message: 'Obsydia AI returned no assistant text.' });
    return res.json({ success: true, reply });
  } catch (error: any) {
    return res.status(502).json({ success: false, message: error?.message || 'Unable to reach Obsydia AI.' });
  }
};
