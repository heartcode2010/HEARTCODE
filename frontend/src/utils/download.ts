/**
 * Trigger a browser file download.
 * Direct port from HEARTCODE.html lines 2629-2635.
 */
export function downloadFile(content: string, filename: string, type: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Fallback clipboard copy using textarea + execCommand.
 * Direct port from HEARTCODE.html lines 3451-3463.
 */
export function fallbackCopy(text: string): void {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.style.top = '0';
  ta.style.left = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
  } catch (_e) {
    /* fallback failed */
  }
  document.body.removeChild(ta);
}

/**
 * Copy text to clipboard with modern API fallback.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (_e) {
      /* fall through to fallback */
    }
  }
  fallbackCopy(text);
}

/**
 * Strip HTML tags and clean text for "text only" view.
 * Direct port from HEARTCODE.html lines 1923-1928.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
