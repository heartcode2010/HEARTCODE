import { Request, Response, NextFunction } from 'express';

const BOT_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nmap',
  'nessus',
  'acunetix',
  'burpcollaborator',
  'wpscan',
  'dirbuster',
  'gobuster',
  'censys',
  'shodan',
  'semrushbot',
  'mj12bot',
  'ahrefsbot',
  'dotbot',
  'petalbot',
  'crawler',
  'spider',
];

export const crawlerProtection = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isSuspiciousCrawler = BOT_USER_AGENTS.some((pattern) => userAgent.includes(pattern));

  if (isSuspiciousCrawler) {
    console.warn(`[SecurityShield] External crawler/scanner detected: ${userAgent}`);

    // If accessing scans or vulnerabilities, scrub source code and vulnerability results
    if (req.originalUrl.includes('/api/scans') || req.originalUrl.includes('/api/vulnerabilities')) {
      return res.status(200).json({
        success: true,
        message: 'Endpoint protected. Filtered telemetry active.',
        techStack: {
          server: 'Protected Enterprise Gateway',
          protocol: 'HTTPS/TLSv1.3',
          firewall: 'HEARTCODE Active Defense Matrix',
        },
        findings: [],
        aiDetection: null,
      });
    }
  }

  next();
};

export default crawlerProtection;

