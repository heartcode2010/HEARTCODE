import { RISK_ORDER, RISK_COLORS, MAX_GUTTER_LINES } from '../constants';
import type { VulnerabilityFinding } from '../types';

// ── HTML Utilities ────────────────────────────────────────────────────────────

/** Escape HTML special characters */
export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Syntax-highlight raw HTML source */
export function highlightHtml(html: string): string {
  let e = escHtml(html);
  e = e.replace(/(<!--[\s\S]*?-->)/g,                    '<span class="t-comment">$1</span>');
  e = e.replace(/(<!DOCTYPE[^&]*?&gt;)/gi,               '<span class="t-doctype">$1</span>');
  e = e.replace(/((?:&lt;script[\s\S]*?&lt;\/script&gt;))/gi, '<span class="t-script">$1</span>');
  e = e.replace(/((?:&lt;style[\s\S]*?&lt;\/style&gt;))/gi,   '<span class="t-style">$1</span>');
  e = e.replace(/( [\w:-]+=)(&quot;[^&]*?&quot;)/g,     '<span class="t-attr">$1</span><span class="t-val">$2</span>');
  e = e.replace(/(&lt;\/?)([\w-]+)/g,                   '$1<span class="t-tag">$2</span>');
  return e;
}

/** Strip tags and scripts, return plain text */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

// ── Size Formatting ───────────────────────────────────────────────────────────

/** Convert byte count to human-readable size string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Source Stats ──────────────────────────────────────────────────────────────

export interface SourceStats {
  size: string;
  lines: number;
  tagsCount: number;
  scriptsCount: number;
  stylesCount: number;
  imagesCount: number;
}

/** Compute statistics from raw HTML source string */
export function computeSourceStats(html: string): SourceStats {
  const bytes = new TextEncoder().encode(html).length;
  return {
    size: formatBytes(bytes),
    lines: html.split('\n').length,
    tagsCount: (html.match(/<[a-z][^>]*>/gi) || []).length,
    scriptsCount: (html.match(/<script/gi) || []).length,
    stylesCount: (html.match(/<style/gi) || []).length,
    imagesCount: (html.match(/<img\s/gi) || []).length,
  };
}

// ── Vulnerability Utilities ───────────────────────────────────────────────────

/** Sort vulnerability findings by risk severity (critical first) */
export function sortByRisk(findings: VulnerabilityFinding[]): VulnerabilityFinding[] {
  return [...findings].sort(
    (a, b) => (RISK_ORDER[a.risk || 'info'] ?? 9) - (RISK_ORDER[b.risk || 'info'] ?? 9)
  );
}

/** Get CSS colour for a given risk level */
export function riskColor(risk: string): string {
  return RISK_COLORS[risk] ?? '#5868a0';
}

// ── Line Gutter ───────────────────────────────────────────────────────────────

/** Return capped line count for gutter rendering (perf guard) */
export function cappedLines(count: number): number {
  return Math.min(count, MAX_GUTTER_LINES);
}

// ── Misc ──────────────────────────────────────────────────────────────────────

/** Generate a download link for a blob and trigger it */
export function downloadBlob(content: string, filename: string, mimeType = 'text/html'): void {
  const blob = new Blob([content], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Strip protocol from a URL, return hostname */
export function hostnameFromUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').split('/')[0] || 'source';
}

/** Format a Date to a locale time string */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString();
}

/** Truncate a string to n characters */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str;
}
