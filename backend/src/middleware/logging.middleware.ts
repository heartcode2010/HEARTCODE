/**
 * backend/src/middleware/logging.middleware.ts
 * Lightweight request logger middleware.
 * Logs: timestamp, method, path, status, response time.
 */
import { Request, Response, NextFunction } from 'express';

const RESET  = '\x1b[0m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';

function statusColor(code: number): string {
  if (code >= 500) return RED;
  if (code >= 400) return YELLOW;
  if (code >= 300) return CYAN;
  return GREEN;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const ms   = Date.now() - start;
    const code = res.statusCode;
    const color = statusColor(code);

    console.log(
      `${DIM}[${timestamp}]${RESET} ` +
      `${CYAN}${req.method.padEnd(6)}${RESET} ` +
      `${req.originalUrl.padEnd(40)} ` +
      `${color}${code}${RESET} ` +
      `${DIM}${ms}ms${RESET}`
    );
  });

  next();
}
