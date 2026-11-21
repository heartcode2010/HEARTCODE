import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class InformationDisclosureScanner implements ScannerModule {
  moduleName = 'InformationDisclosureScanner';
  category = 'INFORMATION DISCLOSURE ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const headers = target.headers || {};
    
    const getHeader = (name: string) => {
      const key = Object.keys(headers).find(k => k.toLowerCase() === name.toLowerCase());
      return key ? headers[key] : undefined;
    };

    // Server Header Check
    const serverHeader = getHeader('server');
    if (serverHeader) {
      // Check if it includes version numbers
      if (/[0-9]/.test(serverHeader)) {
        findings.push({
          id: 'INFO-001',
          category: this.category,
          severity: 'Low',
          confidence: 'Certain',
          name: 'Server Version Disclosure',
          description: `The Server header reveals specific version information: ${serverHeader}`,
          technicalExplanation: 'The web server includes its exact software version in the response headers. This helps attackers quickly identify if the server is running an outdated version with known CVEs (Common Vulnerabilities and Exposures).',
          businessImpact: 'Aids attackers in reconnaissance, potentially accelerating an exploit attempt.',
          remediation: 'Configure the web server (e.g., Apache, Nginx, IIS) to hide the version number or remove the Server header entirely.',
          evidence: `Server: ${serverHeader}`,
        });
      }
    }

    // X-Powered-By Header Check
    const xPoweredBy = getHeader('x-powered-by');
    if (xPoweredBy) {
      findings.push({
          id: 'INFO-002',
          category: this.category,
          severity: 'Low',
          confidence: 'Certain',
          name: 'Framework Disclosure (X-Powered-By)',
          description: `The X-Powered-By header reveals the backend technology: ${xPoweredBy}`,
          technicalExplanation: 'This header explicitly identifies the application framework (e.g., Express, ASP.NET, PHP) running the backend. Similar to Server headers, it assists attackers in finding framework-specific exploits.',
          businessImpact: 'Aids attackers in reconnaissance.',
          remediation: 'Remove the X-Powered-By header in the application framework configuration or via a reverse proxy.',
          evidence: `X-Powered-By: ${xPoweredBy}`,
        });
    }

    // X-AspNet-Version or similar
    const xAspNetVersion = getHeader('x-aspnet-version');
    if (xAspNetVersion) {
        findings.push({
            id: 'INFO-003',
            category: this.category,
            severity: 'Low',
            confidence: 'Certain',
            name: 'ASP.NET Version Disclosure',
            description: `The X-AspNet-Version header reveals the framework version: ${xAspNetVersion}`,
            technicalExplanation: 'Exposes the specific version of ASP.NET in use.',
            businessImpact: 'Aids attackers in reconnaissance.',
            remediation: 'Disable the X-AspNet-Version header in web.config.',
            evidence: `X-AspNet-Version: ${xAspNetVersion}`,
          });
    }

    // Check for source map comments in HTML
    if (/\/\/# sourceMappingURL=/.test(target.html)) {
      const m = target.html.match(/\/\/# sourceMappingURL=([^\s]+)/);
      findings.push({
        id: 'INFO-004',
        category: this.category,
        severity: 'Low',
        confidence: 'Firm',
        name: 'Source Map Reference Found',
        description: 'A source map reference was found in the HTML source.',
        technicalExplanation: 'Source maps map minified code back to its original, unminified state, including original file structures, variable names, and comments. This gives attackers a clear blueprint of the client-side application.',
        businessImpact: 'Exposes intellectual property and simplifies reverse engineering of client-side logic.',
        remediation: 'Remove sourceMappingURL references from production builds. Ensure .map files are not served to the public internet.',
        evidence: m ? m[0] : '//# sourceMappingURL found',
      });
    }

    return findings;
  }
}
