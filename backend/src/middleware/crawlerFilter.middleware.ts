import { Request, Response, NextFunction } from 'express';

// List of common bot, crawler, scraper, and scanner user-agent keywords
const CRAWLER_KEYWORDS = [
  'crawler', 'spider', 'bot', 'googlebot', 'bingbot', 'yandex', 'baidu',
  'semrush', 'ahrefs', 'moz', 'scrape', 'python', 'curl', 'wget', 'axios',
  'http-client', 'nikto', 'sqlmap', 'nmap', 'hydra', 'dirbuster', 'gobuster',
  'nessus', 'arachni', 'w3af', 'owasp', 'crawler', 'headlesschrome'
];

export const crawlerFilterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Check if user agent matches any crawler or scanner keyword
  const isCrawler = CRAWLER_KEYWORDS.some(kw => userAgent.includes(kw));

  if (isCrawler) {
    console.log(`[CrawlerFilter] Intercepted request from crawler/scanner: ${userAgent}`);

    // If requesting an API endpoint, return mock tech stack only, no source, no vulnerabilities, no AI levels
    if (req.path.startsWith('/api')) {
      return res.status(200).json({
        success: true,
        message: 'Technova OS Secure Shield Active',
        techStack: [
          { name: 'React', version: '18.x', category: 'Frontend Library' },
          { name: 'TypeScript', version: '5.x', category: 'Language' },
          { name: 'Node.js', version: '18.x', category: 'Runtime' },
          { name: 'Express', version: '4.x', category: 'Server Framework' },
          { name: 'Zustand', version: '4.x', category: 'State Management' }
        ],
        vulnerabilities: [],
        aiDetection: 'NOT DISCLOSED'
      });
    }

    // If requesting static page content, return a mock page with only basic tech stack tags
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Technova OS Protected Node</title>
  <meta name="generator" content="React, Node.js, Express">
  <style>
    body { background: #0a0a0b; color: #6e6868; font-family: monospace; padding: 50px; text-align: center; }
    h1 { color: #fff; font-size: 1.2rem; }
  </style>
</head>
<body>
  <h1>TECHNOVA OS SECURE HUB</h1>
  <p>Status: Shield Encrypted</p>
  <p>Tech Stack: React, TypeScript, Node.js, Express, Zustand</p>
</body>
</html>`);
  }

  next();
};
