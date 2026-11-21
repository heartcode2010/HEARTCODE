import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class CookieScanner implements ScannerModule {
  moduleName = 'CookieScanner';
  category = 'COOKIE SECURITY ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const headers = target.headers || {};
    
    // Extract set-cookie headers. They can be a string or array depending on how Axios/Node parsed them.
    let setCookieHeader = headers['set-cookie'] || headers['Set-Cookie'];
    if (!setCookieHeader) return findings;

    const cookies: string[] = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader as string];

    cookies.forEach((cookieStr, index) => {
      const parts = cookieStr.split(';').map(p => p.trim());
      const cookieName = parts[0].split('=')[0];
      const cookieStrLower = cookieStr.toLowerCase();

      // Check Secure flag
      if (!cookieStrLower.includes('secure')) {
        findings.push({
          id: `CK-001-${index}`,
          category: this.category,
          severity: 'Medium',
          confidence: 'Firm',
          name: `Missing 'Secure' Flag on Cookie (${cookieName})`,
          description: `The cookie '${cookieName}' is set without the Secure attribute.`,
          technicalExplanation: 'Without the Secure flag, the browser might transmit the cookie over unencrypted HTTP connections if the user accidentally navigates to a non-HTTPS link, exposing the cookie to interception.',
          businessImpact: 'Session hijacking or unauthorized access if the cookie is used for authentication or contains sensitive data.',
          remediation: 'Always set the `Secure` flag for cookies, especially those handling sessions or authentication.',
          evidence: `Set-Cookie: ${cookieStr}`,
        });
      }

      // Check HttpOnly flag
      if (!cookieStrLower.includes('httponly')) {
         findings.push({
          id: `CK-002-${index}`,
          category: this.category,
          severity: 'Medium',
          confidence: 'Firm',
          name: `Missing 'HttpOnly' Flag on Cookie (${cookieName})`,
          description: `The cookie '${cookieName}' is set without the HttpOnly attribute.`,
          technicalExplanation: 'Without the HttpOnly flag, the cookie can be accessed via client-side scripts (e.g., JavaScript). If the application is vulnerable to Cross-Site Scripting (XSS), attackers can easily steal this cookie.',
          businessImpact: 'Increases the impact of XSS attacks, directly enabling session hijacking.',
          remediation: 'Set the `HttpOnly` flag for all cookies that do not specifically require client-side script access (like session tokens).',
          evidence: `Set-Cookie: ${cookieStr}`,
        });
      }

      // Check SameSite policy
      if (!cookieStrLower.includes('samesite=')) {
         findings.push({
          id: `CK-003-${index}`,
          category: this.category,
          severity: 'Low',
          confidence: 'Firm',
          name: `Missing 'SameSite' Attribute on Cookie (${cookieName})`,
          description: `The cookie '${cookieName}' does not explicitly set a SameSite attribute.`,
          technicalExplanation: 'The SameSite attribute prevents the browser from sending the cookie along with cross-site requests. Without it (or if set to None without Secure), the application might be vulnerable to Cross-Site Request Forgery (CSRF).',
          businessImpact: 'Potential CSRF vulnerability, allowing attackers to forge state-changing requests on behalf of the user.',
          remediation: 'Set `SameSite=Lax` or `SameSite=Strict` for sensitive cookies.',
          evidence: `Set-Cookie: ${cookieStr}`,
        });
      }
    });

    return findings;
  }
}
