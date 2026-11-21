import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class HeaderScanner implements ScannerModule {
  moduleName = 'HeaderScanner';
  category = 'SECURITY HEADERS ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const headers = target.headers || {};
    
    // Helper to get case-insensitive header
    const getHeader = (name: string) => {
      const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
      return key ? headers[key] : undefined;
    };

    const csp = getHeader('content-security-policy');
    if (!csp) {
      findings.push({
        id: 'HDR-001',
        category: this.category,
        severity: 'High',
        confidence: 'Firm',
        name: 'Missing Content Security Policy (CSP)',
        description: 'No Content-Security-Policy header found. CSP is a critical defence against XSS and data-injection attacks.',
        technicalExplanation: 'Without a CSP, the browser will execute any scripts requested by the page, making it highly susceptible to Cross-Site Scripting (XSS) attacks if attacker-controlled input is reflected or stored.',
        businessImpact: 'XSS vulnerabilities can lead to account takeover, data theft, and defacement, severely impacting user trust and potentially leading to compliance violations.',
        remediation: 'Implement a strong CSP. Start with `default-src \'self\';` and incrementally add necessary sources. Avoid using `\'unsafe-inline\'` and `\'unsafe-eval\'`.',
        evidence: 'Response headers did not contain Content-Security-Policy',
      });
    }

    const hsts = getHeader('strict-transport-security');
    if (!hsts) {
      findings.push({
        id: 'HDR-002',
        category: this.category,
        severity: 'Medium',
        confidence: 'Firm',
        name: 'Missing Strict-Transport-Security (HSTS)',
        description: 'The HTTP Strict Transport Security (HSTS) header is missing.',
        technicalExplanation: 'HSTS instructs the browser to always use HTTPS for subsequent requests, preventing man-in-the-middle attacks that rely on stripping SSL/TLS (SSL stripping).',
        businessImpact: 'Users accessing the site over unsecured networks might be vulnerable to interception, potentially compromising session tokens or sensitive data.',
        remediation: 'Add the Strict-Transport-Security header. E.g., `Strict-Transport-Security: max-age=31536000; includeSubDomains`.',
        evidence: 'Response headers did not contain Strict-Transport-Security',
      });
    }

    const xfo = getHeader('x-frame-options');
    if (!xfo && (!csp || !csp.toLowerCase().includes('frame-ancestors'))) {
      findings.push({
        id: 'HDR-003',
        category: this.category,
        severity: 'Medium',
        confidence: 'Firm',
        name: 'Missing X-Frame-Options or CSP frame-ancestors',
        description: 'The page can potentially be embedded in an iframe on a third-party site.',
        technicalExplanation: 'Without X-Frame-Options or a CSP frame-ancestors directive, malicious sites can embed the application to conduct clickjacking attacks, tricking users into performing actions they did not intend.',
        businessImpact: 'Attackers could trick authenticated users into changing settings, transferring funds, or performing other sensitive actions without their knowledge.',
        remediation: 'Set the `X-Frame-Options: DENY` or `SAMEORIGIN` header, or use the CSP `frame-ancestors` directive.',
        evidence: 'Neither X-Frame-Options nor CSP frame-ancestors were found.',
      });
    }

    const xcto = getHeader('x-content-type-options');
    if (!xcto || xcto.toLowerCase() !== 'nosniff') {
        findings.push({
            id: 'HDR-004',
            category: this.category,
            severity: 'Low',
            confidence: 'Firm',
            name: 'Missing X-Content-Type-Options: nosniff',
            description: 'The X-Content-Type-Options header is missing or not set to nosniff.',
            technicalExplanation: 'This header prevents the browser from trying to MIME-sniff the content type and forces it to stick with the declared content-type, preventing certain types of XSS attacks (e.g., executing an uploaded image file containing JavaScript).',
            businessImpact: 'A minor risk that could be chained with other vulnerabilities (like open file uploads) to execute malicious scripts.',
            remediation: 'Add the header: `X-Content-Type-Options: nosniff`.',
            evidence: xcto ? `Found: ${xcto}` : 'Header missing',
          });
    }

    return findings;
  }
}
