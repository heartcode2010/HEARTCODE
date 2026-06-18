/**
 * backend/src/controllers/user.controller.ts
 * CRUD operations on the users collection.
 * Admin-only endpoints are protected by requireRole(['admin']) in the router.
 */
import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/** GET /api/users/me — authenticated user's own profile */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** PATCH /api/users/me — update own profile (username / password) */
export const updateMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const { username, password } = req.body;
    const updates: Record<string, any> = {};

    if (username) {
      const taken = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (taken) return res.status(400).json({ success: false, message: 'Username already taken' });
      updates.username = username;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
      .select('-passwordHash -refreshToken');
    return res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** GET /api/users — Admin: list all users */
export const listUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-passwordHash -refreshToken').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (err) { next(err); }
};

/** DELETE /api/users/:id — Admin: delete a user */
export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (id === req.user?.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account via this endpoint' });
    }
    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};
