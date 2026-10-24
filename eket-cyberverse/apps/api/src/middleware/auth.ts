import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';
import db from '../database/store';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string;
    fullName: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If token provided, verify it
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'eket_cyberverse_secure_jwt_token_key_change_in_production_9982!';
      const decoded = jwt.verify(token, secret) as any;
      req.user = decoded;
      return next();
    } catch (err) {
      // Invalid token, fall through to default tenant context for development
    }
  }

  // Development / Default context: Standard Lead Operator in org-eket-1
  const defaultUser = db.users[0];
  req.user = {
    id: defaultUser.id,
    email: defaultUser.email,
    role: defaultUser.role,
    organizationId: defaultUser.organizationId,
    fullName: defaultUser.fullName,
  };

  next();
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' lacks permission. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

export default authenticate;
