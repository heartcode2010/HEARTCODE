import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from './auth.middleware';

export const requireVerifiedUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) {
    return res.status(401).json({ success: false, message: 'Sign in with a valid TECHNOVA account to continue.' });
  }
  try {
    const payload = jwt.verify(token, secret) as { id?: string; username?: string; email?: string; role?: 'user' | 'admin' };
    if (!payload.id || !mongoose.isValidObjectId(payload.id)) {
      return res.status(401).json({ success: false, message: 'This account session is not valid for platform services.' });
    }
    req.user = {
      id: payload.id,
      username: payload.username || 'TECHNOVA member',
      email: payload.email,
      role: payload.role === 'admin' ? 'admin' : 'user',
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Sign in again.' });
  }
};
