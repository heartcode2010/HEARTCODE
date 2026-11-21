import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';
import * as dns from 'dns';
import { promisify } from 'util';
import { URL } from 'url';

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

export class DomainScanner implements ScannerModule {
  moduleName = 'DomainScanner';
  category = 'DOMAIN INTELLIGENCE';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    
    let hostname: string;
    try {
      const urlObj = new URL(target.url.startsWith('http') ? target.url : `https://${target.url}`);
      hostname = urlObj.hostname;
    } catch (e) {
      return findings;
    }

    try {
      const mxRecords = await resolveMx(hostname);
      if (mxRecords && mxRecords.length > 0) {
        findings.push({
          id: 'DOM-001',
          category: this.category,
          severity: 'Informational',
          confidence: 'Certain',
          name: 'Mail Servers Identified (MX)',
          description: `Found ${mxRecords.length} Mail Exchange (MX) records.`,
          technicalExplanation: 'MX records indicate the servers responsible for receiving email on behalf of the domain.',
          businessImpact: 'Aids in reconnaissance. Can identify third-party email providers (like Google Workspace, Office 365) which might be targeted for social engineering.',
          remediation: 'Ensure DMARC, SPF, and DKIM are properly configured to prevent email spoofing.',
          evidence: mxRecords.map(r => `${r.exchange} (priority ${r.priority})`).join(', '),
        });
      }
    } catch (err: any) {
        if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
           console.error(`DNS MX resolution failed for ${hostname}:`, err);
        }
    }

    try {
        const txtRecords = await resolveTxt(hostname);
        let hasSpf = false;
        let hasDmarc = false;

        if (txtRecords && txtRecords.length > 0) {
            for (const recordArray of txtRecords) {
                const record = recordArray.join('');
                if (record.toLowerCase().startsWith('v=spf1')) {
                    hasSpf = true;
                }
            }
        }

        if (!hasSpf) {
             findings.push({
                id: 'DOM-002',
                category: this.category,
                severity: 'Medium',
                confidence: 'Firm',
                name: 'Missing SPF Record',
                description: 'No Sender Policy Framework (SPF) record found on the root domain.',
                technicalExplanation: 'SPF specifies which mail servers are authorized to send email on behalf of your domain.',
                businessImpact: 'Without SPF, attackers can easily spoof emails appearing to come from your domain, launching phishing campaigns against your customers or employees.',
                remediation: 'Create a TXT record containing a valid SPF policy (e.g., `v=spf1 include:_spf.google.com ~all`).',
                evidence: 'DNS TXT lookup returned no v=spf1 records.',
              });
        }

    } catch (err: any) {
       if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
           console.error(`DNS TXT resolution failed for ${hostname}:`, err);
        }
    }

    return findings;
  }
}
