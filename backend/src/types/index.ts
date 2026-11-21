/**
 * backend/src/types/index.ts
 * Shared TypeScript types and interfaces for the backend.
 */

export type UserRole = 'user' | 'admin';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ScanStatus = 'pending' | 'processing' | 'complete' | 'failed';
export type ReportFormat = 'json' | 'pdf' | 'html';

// ── JWT payload shapes ────────────────────────────────────────────────────────

export interface JwtAccessPayload {
  id: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// ── Lean document DTOs (safe to send to client) ───────────────────────────────

export interface UserDTO {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface ScanDTO {
  id: string;
  userId: string;
  url: string;
  htmlSource: string;
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
  status: ScanStatus;
  createdAt: string;
}

export interface VulnerabilityFindingDTO {
  _id: string;
  scanId: string;
  risk: RiskLevel;
  name: string;
  desc: string;
  evidence: string;
  rec: string;
  createdAt: string;
}

export interface AISignalDTO {
  fired: boolean;
  weight: number;
  icon: string;
  label: string;
  detail: string;
}

export interface AIAnalysisDTO {
  _id: string;
  scanId: string;
  score: number;
  tools: string[];
  signals: AISignalDTO[];
  createdAt: string;
}

export interface TechFindingDTO {
  cat: string;
  name: string;
  icon: string;
  evidence: string;
}

export interface ReportDTO {
  id: string;
  scanId: string;
  format: ReportFormat;
  createdAt: string;
}

export interface SettingsDTO {
  defaultView: 'raw' | 'highlighted' | 'stripped';
  enableAutoScan: boolean;
  theme: 'cyberpunk' | 'dark';
}

// ── Generic API response envelopes ────────────────────────────────────────────

export interface ApiSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;
