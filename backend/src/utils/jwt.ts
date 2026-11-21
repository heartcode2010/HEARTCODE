/**
 * backend/src/utils/jwt.ts
 * Centralised JWT sign / verify helpers.
 */
import jwt from 'jsonwebtoken';
import type { JwtAccessPayload, JwtRefreshPayload } from '../types';

function accessSecret(): string {
  return process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
}

function refreshSecret(): string {
  return process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforheartcodenotproductionready456!';
}

export function signAccessToken(payload: Omit<JwtAccessPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, accessSecret(), { expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, refreshSecret(), { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, accessSecret()) as JwtAccessPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, refreshSecret()) as JwtRefreshPayload;
}
