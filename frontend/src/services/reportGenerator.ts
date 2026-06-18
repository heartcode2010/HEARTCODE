import { downloadFile } from '../utils/download';
import { IntelligenceAnalysisResult } from './intelligence.service';

export const reportGenerator = {
  exportJSON(report: IntelligenceAnalysisResult) {
    const filename = `intel_${report.scanId}_full.json`;
    downloadFile(JSON.stringify(report, null, 2), filename, 'application/json');
  },

  exportMarkdown(report: IntelligenceAnalysisResult) {
    const filename = `intel_${report.scanId}_full.md`;
    let md = `# CYBER-INTELLIGENCE OPERATING SYSTEM REPORT\n\n`;
    md += `**Target URL:** ${report.dnaProfile ? report.dnaProfile.estimatedTeamSize : 'Unknown'}\n`;
    md += `**Generated At:** ${new Date().toLocaleString()}\n`;
    md += `**AI Confidence Level:** ${report.aiForensics?.aiConfidenceScore || 0}%\n\n`;
    
    md += `---\n\n## 1. WEBSITE DNA ANALYSIS\n\n`;
    md += `- **Architecture Signature:** ${report.dnaProfile?.architectureSignature || 'N/A'}\n`;
    md += `- **Development Style:** ${report.dnaProfile?.developmentStyle || 'N/A'}\n`;
    md += `- **Estimated Team Size:** ${report.dnaProfile?.estimatedTeamSize || 'N/A'}\n`;
    md += `- **Sophistication Score:** ${report.dnaProfile?.sophisticationScore || 0}/100\n\n`;

    md += `---\n\n## 2. API ENDPOINTS DISCOVERED (${report.endpoints?.length || 0})\n\n`;
    if (report.endpoints && report.endpoints.length > 0) {
      report.endpoints.forEach((ep, idx) => {
        md += `${idx + 1}. **[${ep.type}]** \`${ep.method || 'GET'}\` — ${ep.url}\n`;
      });
    } else {
      md += `*No external API endpoints discovered in code scan.*\n`;
    }

    md += `\n---\n\n## 3. INFRASTRUCTURE & CLOUD NODES\n\n`;
    if (report.infrastructureMap && report.infrastructureMap.nodes) {
      report.infrastructureMap.nodes.forEach(node => {
        md += `- **[${node.type.toUpperCase()}]** ${node.name} (${node.provider})\n`;
      });
    }

    md += `\n---\n\n## 4. SECRET LEAK SUMMARY\n\n`;
    if (report.secretFindings && report.secretFindings.length > 0) {
      report.secretFindings.forEach(f => {
        md += `- **[${f.severity}]** ${f.type} leaked: \`${f.maskedValue}\` (Location: ${f.location})\n`;
      });
    } else {
      md += `*No secret key leaks identified.*\n`;
    }

    downloadFile(md, filename, 'text/markdown');
  },

  exportHTML(report: IntelligenceAnalysisResult) {
    const filename = `intel_${report.scanId}_full.html`;
    const now = new Date().toLocaleString();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Intelligence OS Report</title>
  <style>
    body {
      background: #06060c;
      color: #00ffcc;
      font-family: monospace;
      padding: 40px;
    }
    h1 {
      border-bottom: 2px solid #ff0055;
      padding-bottom: 10px;
      color: #ff0055;
      text-shadow: 0 0 10px rgba(255, 0, 85, 0.4);
    }
    .panel {
      background: #11111d;
      border: 1px solid #ff005533;
      box-shadow: 0 0 15px rgba(255, 0, 85, 0.1);
      margin: 20px 0;
      padding: 20px;
      border-radius: 4px;
    }
    .badge {
      background: #ff005522;
      color: #ff0055;
      padding: 3px 8px;
      border-radius: 3px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>📡 HEARTCODE CYBER-INTELLIGENCE REPORT</h1>
  <p>Generated At: ${now}</p>
  
  <div class="panel">
    <h2>🧬 Website DNA Profile</h2>
    <p>Architecture: <strong>${report.dnaProfile?.architectureSignature || 'N/A'}</strong></p>
    <p>Style Stack: <strong>${report.dnaProfile?.developmentStyle || 'N/A'}</strong></p>
    <p>AI Generation Confidence: <span class="badge">${report.aiForensics?.aiConfidenceScore || 0}%</span></p>
  </div>

  <div class="panel">
    <h2>🖥️ Cloud & CDN Nodes</h2>
    <ul>
      ${report.infrastructureMap?.nodes?.map(n => `<li>[${n.type.toUpperCase()}] ${n.name} (Provider: ${n.provider})</li>`).join('') || '<li>No nodes resolved</li>'}
    </ul>
  </div>

  <div class="panel">
    <h2>🔑 Credentials exposure</h2>
    <ul>
      ${report.secretFindings?.map(s => `<li><span class="badge">${s.severity}</span> ${s.type} location: ${s.location}</li>`).join('') || '<li>No exposed keys identified</li>'}
    </ul>
  </div>

  <div class="panel">
    <h2>📡 Endpoints Discovered</h2>
    <ul>
      ${report.endpoints?.map(e => `<li>[${e.type}] ${e.url}</li>`).join('') || '<li>No endpoints discovered</li>'}
    </ul>
  </div>
</body>
</html>`;
    
    downloadFile(html, filename, 'text/html');
  }
};

export default reportGenerator;
