/**
 * Escape HTML special characters to prevent XSS when rendering as text.
 * Direct port from HEARTCODE.html line 1427-1429.
 */
export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default escHtml;
