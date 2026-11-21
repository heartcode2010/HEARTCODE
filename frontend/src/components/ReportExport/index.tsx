import React, { useState, useCallback, useMemo } from 'react';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';

// ══════════════════════════════════════════════════════════════════════════════
// ReportExport — Intelligence report generation & download (#26)
// PDF-styled HTML reports for various intelligence categories
// ══════════════════════════════════════════════════════════════════════════════

interface ReportType {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'full-intelligence',
    label: 'Full Intelligence Report',
    icon: '◈',
    color: '#e02840',
    description: 'Comprehensive analysis across all systems',
  },
  {
    id: 'architecture-audit',
    label: 'Architecture Audit',
    icon: '⎔',
    color: '#06b6d4',
    description: 'Tech stack, DNA profile, infrastructure mapping',
  },
  {
    id: 'ai-forensics',
    label: 'AI Forensics Report',
    icon: '⟐',
    color: '#a855f7',
    description: 'AI detection, human vs AI classification',
  },
  {
    id: 'threat-report',
    label: 'Threat Assessment',
    icon: '⚠',
    color: '#ef4444',
    description: 'Vulnerabilities, secrets, obfuscation, threats',
  },
  {
    id: 'privacy-report',
    label: 'Privacy & Compliance',
    icon: '⛊',
    color: '#f472b6',
    description: 'Tracking, cookies, behavioral analysis',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure Map',
    icon: '⬡',
    color: '#2ea86a',
    description: 'CDN, hosting, DNS, cloud services',
  },
];

function generateReportHTML(
  reportType: string,
  url: string,
  store: ReturnType<typeof useIntelligenceStore.getState>,
  scanStore: { findings: any[]; techStack: any[]; aiAnalysis: any; overallScore: number | null }
): string {
  const timestamp = new Date().toISOString();
  const title = REPORT_TYPES.find(r => r.id === reportType)?.label || 'Intelligence Report';

  // Build sections based on report type
  let sections = '';

  // Header section (always present)
  sections += `
    <div class="report-section">
      <h2>Target Information</h2>
      <table>
        <tr><td><strong>URL</strong></td><td>${url}</td></tr>
        <tr><td><strong>Report Type</strong></td><td>${title}</td></tr>
        <tr><td><strong>Generated</strong></td><td>${timestamp}</td></tr>
        <tr><td><strong>Overall Score</strong></td><td>${scanStore.overallScore ?? 'N/A'}/100</td></tr>
      </table>
    </div>
  `;

  // DNA Profile
  if (['full-intelligence', 'architecture-audit'].includes(reportType) && store.dnaProfile) {
    const dna = store.dnaProfile;
    sections += `
      <div class="report-section">
        <h2>◈ Website DNA Profile</h2>
        <table>
          <tr><td>Architecture Signature</td><td>${dna.architectureSignature}</td></tr>
          <tr><td>Development Style</td><td>${dna.developmentStyle}</td></tr>
          <tr><td>Sophistication Score</td><td>${dna.sophisticationScore}/100</td></tr>
          <tr><td>Estimated Team Size</td><td>${dna.estimatedTeamSize}</td></tr>
          <tr><td>AI Contribution</td><td>${dna.aiContributionLevel}%</td></tr>
        </table>
      </div>
    `;
  }

  // Reputation Scores
  if (['full-intelligence', 'threat-report'].includes(reportType) && store.reputationScores) {
    const rep = store.reputationScores;
    sections += `
      <div class="report-section">
        <h2>⟐ Reputation Scores</h2>
        <table>
          <tr><td>Security</td><td>${rep.security}/100</td></tr>
          <tr><td>Privacy</td><td>${rep.privacy}/100</td></tr>
          <tr><td>Exposure</td><td>${rep.exposure}/100</td></tr>
          <tr><td>Trust</td><td>${rep.trust}/100</td></tr>
          <tr><td>AI Authenticity</td><td>${rep.aiAuthenticity}/100</td></tr>
          <tr><td><strong>Overall</strong></td><td><strong>${rep.overall}/100</strong></td></tr>
        </table>
      </div>
    `;
  }

  // AI Forensics
  if (['full-intelligence', 'ai-forensics'].includes(reportType) && store.aiForensics) {
    const ai = store.aiForensics;
    sections += `
      <div class="report-section">
        <h2>⟐ AI Forensics Analysis</h2>
        <table>
          <tr><td>AI Confidence Score</td><td>${ai.aiConfidenceScore}%</td></tr>
          <tr><td>Probable AI Sources</td><td>${ai.probableAISource.join(', ') || 'None detected'}</td></tr>
          <tr><td>Human vs AI Ratio</td><td>${(ai.humanVsAiRatio * 100).toFixed(1)}% human</td></tr>
          <tr><td>AI Regions Detected</td><td>${ai.aiRegions.length}</td></tr>
        </table>
      </div>
    `;
  }

  // Threat Radar
  if (['full-intelligence', 'threat-report'].includes(reportType) && store.threatRadar) {
    const t = store.threatRadar;
    sections += `
      <div class="report-section">
        <h2>⚠ Threat Radar</h2>
        <table>
          <tr><td>Attack Surface</td><td>${t.attackSurface}/100</td></tr>
          <tr><td>AI Usage</td><td>${t.aiUsage}/100</td></tr>
          <tr><td>Privacy Exposure</td><td>${t.privacyExposure}/100</td></tr>
          <tr><td>Tracking Intensity</td><td>${t.trackingIntensity}/100</td></tr>
          <tr><td>Obfuscation Level</td><td>${t.obfuscationLevel}/100</td></tr>
          <tr><td>Infrastructure Complexity</td><td>${t.infrastructureComplexity}/100</td></tr>
        </table>
      </div>
    `;
  }

  // Behavioral Profile
  if (['full-intelligence', 'privacy-report'].includes(reportType) && store.behavioralProfile) {
    const b = store.behavioralProfile;
    sections += `
      <div class="report-section">
        <h2>◉ Behavioral Analysis</h2>
        <table>
          <tr><td>Privacy Risk Score</td><td>${b.privacyRiskScore}/100</td></tr>
          <tr><td>Tracking Intensity</td><td>${b.trackingIntensity}/100</td></tr>
          <tr><td>Risk Level</td><td>${b.behavioralRiskLevel}</td></tr>
          <tr><td>Trackers Found</td><td>${b.trackers.length}</td></tr>
          <tr><td>Fingerprinters</td><td>${b.fingerprinters.length}</td></tr>
        </table>
        ${b.trackers.length > 0 ? `<h3>Detected Trackers</h3><ul>${b.trackers.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  }

  // Secret Findings
  if (['full-intelligence', 'threat-report'].includes(reportType) && store.secretFindings.length > 0) {
    sections += `
      <div class="report-section">
        <h2>⚠ Secret & Token Leaks</h2>
        <table>
          <tr><th>Type</th><th>Severity</th><th>Location</th><th>Masked Value</th></tr>
          ${store.secretFindings.map(s => `
            <tr>
              <td>${s.type}</td>
              <td style="color:${s.severity === 'Critical' ? '#e02840' : s.severity === 'High' ? '#d4820a' : '#f472b6'}">${s.severity}</td>
              <td>${s.location}</td>
              <td><code>${s.maskedValue}</code></td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }

  // Endpoints
  if (['full-intelligence', 'architecture-audit', 'infrastructure'].includes(reportType) && store.endpoints.length > 0) {
    sections += `
      <div class="report-section">
        <h2>⬡ Discovered Endpoints</h2>
        <table>
          <tr><th>URL</th><th>Type</th><th>Method</th></tr>
          ${store.endpoints.slice(0, 50).map(e => `
            <tr>
              <td><code>${e.url}</code></td>
              <td>${e.type}</td>
              <td>${e.method || 'GET'}</td>
            </tr>
          `).join('')}
        </table>
        ${store.endpoints.length > 50 ? `<p><em>+${store.endpoints.length - 50} more endpoints</em></p>` : ''}
      </div>
    `;
  }

  // Vulnerabilities
  if (['full-intelligence', 'threat-report'].includes(reportType) && scanStore.findings.length > 0) {
    sections += `
      <div class="report-section">
        <h2>⚠ Vulnerability Findings</h2>
        <table>
          <tr><th>Title</th><th>Severity</th><th>Category</th></tr>
          ${scanStore.findings.slice(0, 30).map((f: any) => `
            <tr>
              <td>${f.title}</td>
              <td>${f.severity}</td>
              <td>${f.category}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }

  // Tech Stack
  if (['full-intelligence', 'architecture-audit'].includes(reportType) && scanStore.techStack.length > 0) {
    sections += `
      <div class="report-section">
        <h2>⎔ Technology Stack</h2>
        <table>
          <tr><th>Technology</th><th>Category</th><th>Confidence</th></tr>
          ${scanStore.techStack.map((t: any) => `
            <tr>
              <td>${t.name}</td>
              <td>${t.category}</td>
              <td>${t.confidence}%</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }

  // Full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — HEARTCODE Intelligence</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0b; color: #e8e2e2; padding: 40px; line-height: 1.6; }
    .report-container { max-width: 900px; margin: 0 auto; }
    .report-header { text-align: center; padding: 40px 20px; border: 1px solid #5a1e28; border-radius: 8px; margin-bottom: 32px; background: linear-gradient(135deg, #141416, #1c1c1f); }
    .report-header h1 { font-family: 'Orbitron', monospace; font-size: 1.6rem; color: #e02840; margin-bottom: 8px; letter-spacing: 0.1em; }
    .report-header p { font-size: 0.8rem; color: #6e6868; }
    .report-section { margin-bottom: 28px; padding: 20px; border: 1px solid #2a2a2e; border-radius: 6px; background: #141416; }
    .report-section h2 { font-family: 'Orbitron', monospace; font-size: 0.85rem; color: #e02840; margin-bottom: 16px; letter-spacing: 0.08em; padding-bottom: 8px; border-bottom: 1px solid #2a2a2e; }
    .report-section h3 { font-size: 0.8rem; color: #b0a8a8; margin: 12px 0 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #1c1c1f; }
    th { color: #6e6868; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; }
    td { color: #b0a8a8; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; background: #1c1c1f; padding: 2px 6px; border-radius: 3px; }
    ul { list-style: none; padding: 0; }
    ul li { padding: 4px 0; font-size: 0.8rem; color: #b0a8a8; }
    ul li::before { content: '›'; color: #e02840; margin-right: 8px; }
    .report-footer { text-align: center; padding: 20px; font-size: 0.7rem; color: #3a3535; border-top: 1px solid #2a2a2e; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>◈ HEARTCODE INTELLIGENCE</h1>
      <p>${title} — ${url}</p>
      <p style="margin-top:4px">Generated ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
    ${sections}
    <div class="report-footer">
      HEARTCODE Cyber-Intelligence OS — Confidential Report<br>
      Generated by automated analysis. Manual review recommended.
    </div>
  </div>
</body>
</html>`;
}

export const ReportExport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const { url, findings, techStack, aiAnalysis, overallScore } = useScanStore();

  const handleGenerate = useCallback(async (reportType: string) => {
    setGenerating(reportType);

    // Small delay for UX
    await new Promise(r => setTimeout(r, 600));

    const store = useIntelligenceStore.getState();
    const html = generateReportHTML(reportType, url, store, { findings, techStack, aiAnalysis, overallScore });

    // Download as HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `heartcode-${reportType}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    setGenerating(null);
  }, [url, findings, techStack, aiAnalysis, overallScore]);

  return (
    <div className="report-export-container">
      <button
        className={`report-export-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>REPORTS</span>
      </button>

      {isOpen && (
        <div className="report-export-panel">
          <div className="report-export-header">
            <span>INTELLIGENCE REPORTS</span>
            <button className="report-export-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="report-export-list">
            {REPORT_TYPES.map(report => (
              <button
                key={report.id}
                className="report-export-item"
                style={{ '--report-color': report.color } as React.CSSProperties}
                onClick={() => handleGenerate(report.id)}
                disabled={generating !== null}
              >
                <span className="report-export-icon" style={{ color: report.color }}>{report.icon}</span>
                <div className="report-export-info">
                  <span className="report-export-label">{report.label}</span>
                  <span className="report-export-desc">{report.description}</span>
                </div>
                {generating === report.id ? (
                  <span className="report-export-spinner">⟳</span>
                ) : (
                  <span className="report-export-dl">↓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportExport;
