import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class InfrastructureScanner implements ScannerModule {
  moduleName = 'InfrastructureScanner';
  category = 'INFRASTRUCTURE INTELLIGENCE';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';
    const headers = target.headers || {};
    const lowerHeaders: Record<string, string> = {};
    
    // Normalize headers to lowercase keys
    Object.keys(headers).forEach(k => {
      lowerHeaders[k.toLowerCase()] = String(headers[k]).toLowerCase();
    });

    const addFinding = (id: string, name: string, description: string, evidence: string, severity: 'Low' | 'Informational' = 'Informational') => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Certain',
        name,
        description,
        technicalExplanation: 'Infrastructure elements are identified through HTTP response headers (e.g., Server, X-Powered-By, Via) or CDN-specific header keys, as well as external links, asset sources, or domain references in the HTML source.',
        businessImpact: 'Exposing specific server software, hosting providers, or CDNs aids attackers in mapping out the target\'s infrastructure footprint and tailoring potential exploits.',
        remediation: 'Consider stripping verbose headers (like Server, X-Powered-By, X-Served-By) to prevent information disclosure. Secure infrastructure configurations behind a proxy.',
        evidence,
      });
    };

    // 1. CDN Detection
    if (lowerHeaders['cf-ray'] || lowerHeaders['server'] === 'cloudflare') {
      addFinding('INF-001', 'Content Delivery Network: Cloudflare', 'The website is routing traffic through Cloudflare CDN.', `Server: ${headers['server']}, CF-RAY: ${headers['cf-ray']}`);
    } else if (lowerHeaders['x-amz-cf-id'] || lowerHeaders['via']?.includes('cloudfront')) {
      addFinding('INF-002', 'Content Delivery Network: AWS CloudFront', 'The website is routing traffic through Amazon CloudFront.', `Via: ${headers['via']}, X-Amz-Cf-Id: ${headers['x-amz-cf-id']}`);
    } else if (lowerHeaders['x-served-by']?.includes('fastly') || lowerHeaders['x-cache']?.includes('fastly')) {
      addFinding('INF-003', 'Content Delivery Network: Fastly', 'The website is routing traffic through Fastly CDN.', `X-Served-By: ${headers['x-served-by']}`);
    } else if (lowerHeaders['x-akamai-transformed'] || lowerHeaders['server']?.includes('akamai')) {
      addFinding('INF-004', 'Content Delivery Network: Akamai', 'The website is using Akamai CDN/Edge services.', `Server: ${headers['server']}`);
    }

    // 2. Hosting & Cloud Platforms
    if (lowerHeaders['x-vercel-id'] || lowerHeaders['server'] === 'vercel') {
      addFinding('INF-005', 'Hosting Provider: Vercel', 'The site is hosted on Vercel cloud architecture.', `X-Vercel-Id: ${headers['x-vercel-id']}`);
    } else if (lowerHeaders['x-nf-request-id'] || lowerHeaders['server'] === 'netlify') {
      addFinding('INF-006', 'Hosting Provider: Netlify', 'The site is hosted on Netlify platform.', `X-Nf-Request-Id: ${headers['x-nf-request-id']}`);
    } else if (lowerHeaders['x-github-request-id'] || lowerHeaders['server'] === 'github.com' || html.includes('github.io')) {
      addFinding('INF-007', 'Hosting Provider: GitHub Pages', 'The site is served using GitHub Pages.', `HTML / Server references`);
    } else if (lowerHeaders['x-powered-by']?.includes('wp engine') || html.includes('wp-content')) {
      addFinding('INF-008', 'Hosting Provider: WP Engine / WordPress', 'The site is hosted on a WordPress dedicated environment.', `X-Powered-By: ${headers['x-powered-by']}`);
    } else if (lowerHeaders['server']?.includes('gws') || lowerHeaders['server']?.includes('ghs')) {
      addFinding('INF-009', 'Hosting Provider: Google Cloud Platform', 'The site is served by Google web servers.', `Server: ${headers['server']}`);
    } else if (lowerHeaders['x-powered-by']?.includes('express') || lowerHeaders['x-powered-by']?.includes('next.js')) {
      addFinding('INF-010', 'Application Server: Node.js Framework', `The backend runs on ${headers['x-powered-by']}.`, `X-Powered-By: ${headers['x-powered-by']}`);
    }

    // 3. DNS & Domain/Mail Services
    if (html.includes('google-site-verification')) {
      const match = html.match(/content="(google-site-verification=[^"]+)"/i) || html.match(/google-site-verification/i);
      addFinding('INF-011', 'Cloud Service Verification: Google Workspace', 'The site has Google Workspace domain verification code configured.', match ? match[0] : 'google-site-verification');
    }
    if (html.includes('msvalidate.01')) {
      addFinding('INF-012', 'Cloud Service Verification: Microsoft 365', 'The site has Microsoft Bing/365 webmaster domain verification configured.', 'msvalidate.01');
    }
    if (html.includes('facebook-domain-verification')) {
      addFinding('INF-013', 'Cloud Service Verification: Meta Domain Verification', 'The site uses Facebook business domain ownership validation.', 'facebook-domain-verification');
    }

    return findings;
  }
}
