import { ScannerModule, ScanTarget, VulnerabilityFinding } from '../types';

export class ObfuscationScanner implements ScannerModule {
  moduleName = 'ObfuscationScanner';
  category = 'OBFUSCATION & MALICIOUS CODE ANALYSIS';

  async scan(target: ScanTarget): Promise<VulnerabilityFinding[]> {
    const findings: VulnerabilityFinding[] = [];
    const html = target.html || '';

    const addFinding = (id: string, name: string, description: string, evidence: string, severity: 'High' | 'Medium' | 'Low' | 'Informational' = 'Informational') => {
      findings.push({
        id,
        category: this.category,
        severity,
        confidence: 'Firm',
        name,
        description,
        technicalExplanation: 'The application source code contains obfuscated Javascript payloads, anti-tamper mechanisms, or potential miner scripts that hide execution paths and hinder dynamic analysis.',
        businessImpact: 'Obfuscation is frequently used by attackers to hide malicious injections, credential stealers, or cryptominers. Legitimate packages may use it for IP protection, but it remains a security concern as security auditing becomes difficult.',
        remediation: 'Deobfuscate the script to audit its behavior. Remove any debugger loops or anti-analysis hooks. Ensure scripts come only from trusted npm packages or verified CDNs.',
        evidence,
      });
    };

    // 1. eval() usage (often used in malicious script loaders or packed scripts)
    const evalMatches = html.match(/(\beval\s*\(|\bnew\s+Function\s*\()/g);
    if (evalMatches) {
      addFinding('OBF-001', 'Dynamic Script Execution via eval/Function', 'Found references to dynamic code compilation helpers, which can bypass static code security audits.', 'eval(...) or new Function(...)', 'Medium');
    }

    // 2. Anti-debugging loops
    if (html.includes('debugger') && (html.includes('setInterval') || html.includes('setTimeout') || html.includes('loop'))) {
      addFinding('OBF-002', 'Anti-Debugging Code Signature Detected', 'Found script loops executing `debugger` directives, designed to crash/freeze browser DevTools when an analyst opens them.', 'debugger; inside setInterval/loop', 'High');
    }

    // 3. Packed JavaScript patterns (e.g. Dean Edwards packer)
    if (html.includes('p,a,c,k,e,d') && html.includes('String.prototype.replace') && html.includes('eval(function(p,a,c,k,e,r)')) {
      addFinding('OBF-003', 'Packed JavaScript Loader (Dean Edwards)', 'Identified the classic Dean Edwards packed script layout, which obfuscates internal logic.', 'eval(function(p,a,c,k,e,r)...', 'Medium');
    }

    // 4. Hex/Unicode script encoding
    const hexPattern = /\\x[0-9a-fA-F]{2}\\x[0-9a-fA-F]{2}\\x[0-9a-fA-F]{2}/g;
    const hexMatches = html.match(hexPattern);
    if (hexMatches && hexMatches.length > 5) {
      addFinding('OBF-004', 'High Density of Hex Encoded Strings', 'Detected scripts utilizing hex formatting (e.g., \\x61\\x6c\\x65\\x72\\x74) to conceal strings or function calls.', hexMatches.slice(0, 3).join(' '), 'Low');
    }

    // 5. Cryptominers
    const minerPatterns = [
      { name: 'Coinhive Miner', regex: /coinhive\.min\.js|CoinHive\.Anonymous/i },
      { name: 'WebMinePool', regex: /webminepool\.com|wmp\.js/i },
      { name: 'CryptoNight Web', regex: /cryptonight\.asm\.js/i },
    ];

    minerPatterns.forEach((p, idx) => {
      const match = html.match(p.regex);
      if (match) {
        addFinding(`OBF-005-${idx}`, `Potential Cryptominer Script: ${p.name}`, `Discovered script imports or initialize calls corresponding to cryptomining engines.`, match[0], 'High');
      }
    });

    return findings;
  }
}
