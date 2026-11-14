import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email?: string;
    role: 'user' | 'admin';
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      email?: string;
      role: 'user' | 'admin';
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired access token' });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
      const decoded = jwt.verify(token, secret) as {
        id: string;
        username: string;
        email?: string;
        role: 'user' | 'admin';
      };
      req.user = decoded;
      return next();
    } catch {
      // Continue as guest
    }
  }

  // Fallback guest user so users don't get blocked by a login requirement
  req.user = {
    id: 'guest_' + (req.ip || 'local').replace(/[^a-zA-Z0-9]/g, ''),
    username: 'Guest Analyst',
    role: 'user',
  };
  next();
};

export const requireRole = (roles: Array<'user' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of roles: [${roles.join(', ')}]`,
      });
    }

    next();
  };
};

export default authenticateToken;
