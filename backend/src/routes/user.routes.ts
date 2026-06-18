/**
 * backend/src/routes/user.routes.ts
 * /api/users/*
 */
import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { getMe, updateMe, listUsers, deleteUser } from '../controllers/user.controller';

const router = Router();

// Authenticated user routes
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);

// Admin-only routes
router.get('/', authenticateToken, requireRole(['admin']), listUsers);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteUser);

export default router;
