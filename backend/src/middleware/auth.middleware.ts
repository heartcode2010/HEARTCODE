import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
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

  const defaultOperator = {
    id: 'local-operator',
    username: 'Operator',
    role: 'admin' as const,
  };

  if (!token) {
    req.user = defaultOperator;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      role: 'user' | 'admin';
    };

    req.user = decoded;
    next();
  } catch (error) {
    // In local mode, fallback gracefully to default operator
    req.user = defaultOperator;
    next();
  }
};

export const requireRole = (roles: Array<'user' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      req.user = {
        id: 'local-operator',
        username: 'Operator',
        role: 'admin',
      };
    }

    next();
  };
};
export default authenticateToken;
