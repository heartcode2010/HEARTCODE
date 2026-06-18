import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class SecurityIntelligenceScanner implements ScannerModule {
  moduleName = 'SecurityIntelligenceScanner';
  category = 'SECURITY INTELLIGENCE & HEADERS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';
    const headers = target.headers || {};
    const lowerHeaders: Record<string, string> = {};
    
    // Normalize headers to lowercase keys
    Object.keys(headers).forEach(k => {
      lowerHeaders[k.toLowerCase()] = String(headers[k]).toLowerCase();
    });

    const addFinding = (id: string, name: string, severity: 'High' | 'Medium' | 'Low' | 'Informational', description: string, technical: string, evidence: string) => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description,
        technicalExplanation: technical,
        businessImpact: 'Missing security headers or bad SSL parameters allow various client-side exploits such as clickjacking, MIME-sniffing attacks, and cross-site scripting (XSS).',
        remediation: 'Implement the missing security response headers in the web server config (Nginx, Apache, or cloud CDN).',
        evidence,
      });
    };

    // 1. CSP (Content Security Policy) Check
    const hasCspHeader = lowerHeaders['content-security-policy'];
    const hasCspMeta = html.includes('http-equiv="Content-Security-Policy"') || html.includes('http-equiv="content-security-policy"');
    if (!hasCspHeader && !hasCspMeta) {
      addFinding(
        'SEC-001',
        'Missing Content Security Policy (CSP)',
        'Medium',
        'No Content Security Policy (CSP) header or meta tag was detected.',
        'A Content Security Policy restricts resource loading paths (JS, CSS, images, etc.) to trusted domains. Without CSP, the application has higher vulnerability exposure to Cross-Site Scripting (XSS) and data injection.',
        'No CSP header or http-equiv tag found'
      );
    }

    // 2. HSTS (HTTP Strict Transport Security) Check
    const hasHsts = lowerHeaders['strict-transport-security'];
    if (!hasHsts && target.url.startsWith('https')) {
      addFinding(
        'SEC-002',
        'Missing HTTP Strict Transport Security (HSTS)',
        'Low',
        'The site does not advertise Strict-Transport-Security.',
        'HSTS ensures browsers only connect to the application over secure HTTPS channels, preventing SSL strip attacks.',
        'No Strict-Transport-Security header found'
      );
    }

    // 3. Clickjacking Protection (X-Frame-Options)
    const hasXFrame = lowerHeaders['x-frame-options'];
    if (!hasXFrame && !lowerHeaders['content-security-policy']?.includes('frame-ancestors')) {
      addFinding(
        'SEC-003',
        'Missing X-Frame-Options Clickjacking Protection',
        'Medium',
        'The site does not configure X-Frame-Options or CSP frame-ancestors.',
        'Without these configs, malicious sites can load the target app in a hidden iframe (clickjacking), tricking users into clicking invisible buttons.',
        'No X-Frame-Options header found'
      );
    }

    // 4. MIME Sniffing Protection (X-Content-Type-Options)
    const hasContentTypeOptions = lowerHeaders['x-content-type-options'];
    if (!hasContentTypeOptions) {
      addFinding(
        'SEC-004',
        'Missing X-Content-Type-Options Header',
        'Low',
        'The X-Content-Type-Options header is not set to nosniff.',
        'Without this header, older browsers might guess (sniff) the MIME type of a file based on its content, executing plain text files or uploads as executable script code.',
        'No X-Content-Type-Options: nosniff found'
      );
    }

    // 5. SSL/TLS Protocol verification hint (informational)
    if (target.url.startsWith('https')) {
      addFinding(
        'SEC-005',
        'SSL/TLS Deployment Active',
        'Informational',
        'The application traffic is encrypted using HTTPS.',
        'HTTPS encrypts all client-server communication, defending against man-in-the-middle sniffing attacks.',
        `Target URL: ${target.url}`
      );
    }

    return findings;
  }
}
