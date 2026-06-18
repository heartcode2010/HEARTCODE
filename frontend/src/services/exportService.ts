import type { VulnerabilityFinding, AIDetectionResult, TechStackFinding, ExportFormat } from '../types';
import { downloadFile } from '../utils/download';

interface ReportData {
  url: string;
  timestamp: string;
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
  findings: VulnerabilityFinding[];
  aiAnalysis: AIDetectionResult | null;
  techStack: TechStackFinding[];
}

/**
 * Export report in requested format.
 * Port of exportReport() from HEARTCODE.html lines 2491-2635.
 */
export function exportReport(data: ReportData, format: ExportFormat): void {
  const { url, timestamp, size, lines, tagsCount, findings, aiAnalysis, techStack } = data;
  const safeUrl = url.replace(/[^a-z0-9]/gi, '_').substring(0, 40) || 'report';
  const now = new Date().toLocaleString();
  const riskOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  const sorted = [...findings].sort((a, b) => riskOrder[a.risk || 'info'] - riskOrder[b.risk || 'info']);

  if (format === 'json') {
    const payload = {
      generated: now,
      target: url,
      stats: { size, lines, tags: tagsCount },
      vulnerabilities: findings,
      aiDetection: aiAnalysis
        ? { score: aiAnalysis.score, tools: aiAnalysis.tools }
        : null,
      techStack,
    };
    downloadFile(JSON.stringify(payload, null, 2), `heartcode_${safeUrl}.json`, 'application/json');
    return;
  }

  if (format === 'csv') {
    const rows = [
      ['Risk', 'Finding', 'Description', 'Evidence', 'Recommendation'],
      ...sorted.map((f) => [
        f.risk || 'info',
        f.name,
        (f.desc || '').replace(/,/g, ';'),
        f.evidence.replace(/,/g, ';').replace(/\n/g, ' '),
        (f.rec || '').replace(/,/g, ';'),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, `heartcode_${safeUrl}.csv`, 'text/csv');
    return;
  }

  if (format === 'md') {
    const riskEmoji: Record<string, string> = {
      critical: '🔴', high: '🟠', medium: '🟡', low: '🔵', info: 'ℹ️',
    };
    let md = `# HEARTCODE Security Report\n\n`;
    md += `**Target:** ${url}  \n`;
    md += `**Generated:** ${now}  \n`;
    md += `**Stats:** ${size} · ${lines} lines · ${tagsCount} tags\n\n`;
    md += `---\n\n## Vulnerabilities (${findings.length})\n\n`;

    if (findings.length === 0) {
      md += '_No issues detected._\n\n';
    } else {
      sorted.forEach((f) => {
        const r = f.risk || 'info';
        md += `### ${riskEmoji[r] || ''} [${r.toUpperCase()}] ${f.name}\n\n`;
        md += `${f.desc || ''}\n\n`;
        if (f.evidence) md += `**Evidence:** \`${f.evidence.substring(0, 120)}\`\n\n`;
        if (f.rec) md += `**Recommendation:** ${f.rec}\n\n`;
        md += `---\n\n`;
      });
    }

    if (aiAnalysis) {
      md += `## AI Generation Analysis\n\n`;
      md += `**Score:** ${aiAnalysis.score}/100\n\n`;
      if (aiAnalysis.tools.length > 0) {
        md += `**Detected Tools:** ${aiAnalysis.tools.join(', ')}\n\n`;
      }
    }

    if (techStack.length > 0) {
      md += `## Tech Stack (${techStack.length} detected)\n\n`;
      const cats: Record<string, TechStackFinding[]> = {};
      techStack.forEach((t) => {
        if (!cats[t.cat]) cats[t.cat] = [];
        cats[t.cat].push(t);
      });
      Object.entries(cats).forEach(([cat, items]) => {
        md += `### ${cat}\n`;
        items.forEach((t) => { md += `- ${t.icon} **${t.name}** — ${t.evidence}\n`; });
        md += '\n';
      });
    }

    downloadFile(md, `heartcode_${safeUrl}.md`, 'text/markdown');
    return;
  }

  // HTML format (default)
  const riskColors: Record<string, string> = {
    critical: '#e8324a', high: '#e87040', medium: '#f0c040', low: '#22aaff', info: '#9a9ab0',
  };
  const riskBg: Record<string, string> = {
    critical: 'rgba(232,50,74,.12)', high: 'rgba(232,112,64,.12)',
    medium: 'rgba(240,192,64,.1)', low: 'rgba(34,170,255,.1)', info: 'rgba(154,154,176,.1)',
  };

  let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HEARTCODE Report — ${url}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0d12;color:#d4d4e0;font-family:'Segoe UI',system-ui,sans-serif;padding:32px;line-height:1.6}
.wrap{max-width:900px;margin:0 auto}
h1{font-size:1.6rem;color:#e8324a;margin-bottom:4px;font-family:monospace}
.sub{color:#6b6b85;font-size:.8rem;margin-bottom:24px}
.stat-bar{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px}
.stat{background:#161620;border:1px solid #282838;border-radius:6px;padding:8px 16px;font-family:monospace;font-size:.8rem}
.stat span{color:#e8324a;font-weight:700}
h2{font-size:1rem;color:#9a9ab0;text-transform:uppercase;letter-spacing:.1em;margin:24px 0 12px;font-family:monospace}
.card{border-radius:8px;padding:14px 18px;margin-bottom:10px;border:1px solid}
.risk-badge{display:inline-block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:2px 8px;border-radius:3px;margin-bottom:8px}
.name{font-size:.95rem;font-weight:600;margin-bottom:6px}
.desc{font-size:.82rem;color:#9a9ab0;margin-bottom:8px}
.ev{background:#0d0d12;border-radius:4px;padding:6px 10px;font-family:monospace;font-size:.74rem;color:#e87040;margin-bottom:8px;word-break:break-all}
.rec{font-size:.78rem;color:#6b6b85;font-style:italic}
.tech-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.tech-chip{background:#161620;border:1px solid #282838;border-radius:6px;padding:6px 12px;font-size:.78rem;display:flex;align-items:center;gap:6px}
.footer{text-align:center;font-size:.7rem;color:#3a3a4a;margin-top:40px;padding-top:20px;border-top:1px solid #1a1a2a}
.clean{color:#3ecf6e;font-size:1.1rem}
</style></head><body><div class="wrap">
<h1>⚡ HEARTCODE Security Report</h1>
<div class="sub">Generated ${now} · Target: ${url}</div>
<div class="stat-bar">
  <div class="stat">Size <span>${size}</span></div>
  <div class="stat">Lines <span>${lines}</span></div>
  <div class="stat">Tags <span>${tagsCount}</span></div>
  <div class="stat">Findings <span>${findings.length}</span></div>
  ${aiAnalysis ? `<div class="stat">AI Score <span>${aiAnalysis.score}/100</span></div>` : ''}
  ${techStack.length > 0 ? `<div class="stat">Technologies <span>${techStack.length}</span></div>` : ''}
</div>`;

  html += `<h2>Vulnerabilities</h2>`;
  if (findings.length === 0) {
    html += `<div class="clean">✓ No issues detected.</div>`;
  } else {
    sorted.forEach((f) => {
      const r = f.risk || 'info';
      const c = riskColors[r] || '#9a9ab0';
      const bg = riskBg[r] || 'rgba(154,154,176,.1)';
      html += `<div class="card" style="border-color:${c}40;background:${bg}">
<div class="risk-badge" style="background:${c}22;color:${c}">${r}</div>
<div class="name">${f.name}</div>
<div class="desc">${f.desc || ''}</div>
${f.evidence ? `<div class="ev">${f.evidence.substring(0, 200)}</div>` : ''}
${f.rec ? `<div class="rec">💡 ${f.rec}</div>` : ''}
</div>`;
    });
  }

  if (techStack.length > 0) {
    html += `<h2>Tech Stack (${techStack.length} detected)</h2><div class="tech-grid">`;
    techStack.forEach((t) => {
      html += `<div class="tech-chip">${t.icon} ${t.name}</div>`;
    });
    html += `</div>`;
  }

  html += `<div class="footer">HEARTCODE Web Recon Tool · ${timestamp || now}</div>
</div></body></html>`;

  downloadFile(html, `heartcode_${safeUrl}.html`, 'text/html');
}

export default exportReport;
