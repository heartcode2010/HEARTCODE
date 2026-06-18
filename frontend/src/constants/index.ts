export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Application name / branding
export const APP_NAME = 'HEARTCODE';
export const APP_TAGLINE = 'DOMAIN INTELLIGENCE SUITE';

// Local storage keys
export const LS_ACCESS_TOKEN = 'hc_access_token';
export const LS_REFRESH_TOKEN = 'hc_refresh_token';
export const LS_USER = 'hc_user';

// Scan status labels
export const STATUS_LABELS = {
  idle: 'Ready',
  working: 'Working…',
  ok: 'Complete',
  fail: 'Failed',
} as const;

// Risk severity ordering (highest → lowest)
export const RISK_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

// Risk colour palette
export const RISK_COLORS: Record<string, string> = {
  critical: '#e02840',
  high: '#d4820a',
  medium: '#c4a020',
  low: '#2ea86a',
  info: '#5868a0',
};

// Default source view mode
export const DEFAULT_VIEW = 'highlighted' as const;

// Max lines rendered in source gutter (perf guard)
export const MAX_GUTTER_LINES = 6000;

// Toast auto-dismiss duration (ms)
export const TOAST_DURATION_MS = 2800;

// Footer ticker items
export const TICKER_ITEMS = [
  '⚡ HEARTCODE DOMAIN INTELLIGENCE',
  '🔬 LIVE THREAT ANALYSIS ENGINE',
  '🛡 VULNERABILITY DETECTION ONLINE',
  '🤖 AI CONTENT FINGERPRINTING ACTIVE',
  '📡 PASSIVE RECON MODULE READY',
  '⚠ ZERO-DAY PATTERN MATCHING ENGAGED',
  '🔐 JWT SECURE SESSION ACTIVE',
  '🌐 TARGET ACQUISITION STANDING BY',
] as const;

// Scan module endpoints
export const SCAN_ENDPOINTS = {
  inspect: '/scans/inspect',
  vulnerability: '/scans/vulnerability',
  aiDetect: '/scans/ai-detect',
  techStack: '/scans/tech-stack',
  history: '/scans/history',
} as const;
