import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class PrivacyScanner implements ScannerModule {
  moduleName = 'PrivacyScanner';
  category = 'PRIVACY & TRACKING ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html;

    const add = (severity: any, name: string, desc: string, ev: string = '') => {
      findings.push({
        id: `PRIV-${findings.length + 1}`,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description: desc,
        technicalExplanation: 'The application embeds third-party scripts known for tracking user behavior, analytics, or advertising across the web.',
        businessImpact: 'Tracking scripts can violate user privacy and run afoul of regulations like GDPR, CCPA, or HIPAA if explicit user consent is not obtained prior to loading.',
        remediation: 'Implement a robust Cookie Consent Management platform. Ensure these scripts are blocked from executing until the user explicitly opts in.',
        evidence: ev,
      });
    };

    const trackers = [
      { re: /google-analytics\.com|googletagmanager\.com|gtag/i, name: 'Google Analytics / Tag Manager' },
      { re: /connect\.facebook\.net|fbevents\.js|fbq\(/i, name: 'Meta (Facebook) Pixel' },
      { re: /hotjar\.com/i, name: 'Hotjar Session Recording' },
      { re: /clarity\.ms/i, name: 'Microsoft Clarity' },
      { re: /segment\.com|analytics\.js/i, name: 'Segment' },
      { re: /ads\.twitter\.com/i, name: 'Twitter Ads' },
      { re: /snap\.licdn\.com/i, name: 'LinkedIn Insight Tag' },
      { re: /tiktok\.com\/tr|ttq\./i, name: 'TikTok Pixel' },
    ];

    trackers.forEach(t => {
      const m = html.match(t.re);
      if (m) {
        add('Low', `Tracking Technology Detected: ${t.name}`, `Identified signatures associated with ${t.name}.`, m[0]);
      }
    });

    // Exposed Emails (Moved from old ScanService)
    const emails = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g);
    if (emails && emails.length > 0) {
      const unique = Array.from(new Set(emails)).slice(0, 5);
      findings.push({
        id: `PRIV-${findings.length + 1}`,
        category: this.category,
        severity: 'Informational',
        confidence: 'Certain',
        name: `Exposed Email Addresses`,
        description: `Found ${emails.length} email addresses in the page source.`,
        technicalExplanation: 'Email addresses are present in plain text within the HTML document.',
        businessImpact: 'Emails can be harvested by automated scrapers for spam, phishing, or social engineering attacks targeting employees.',
        remediation: 'Use contact forms instead of raw email addresses, or obscure the addresses using JavaScript (e.g., base64 encoding).',
        evidence: unique.join(', '),
      });
    }

    return findings;
  }
}
