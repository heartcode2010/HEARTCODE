import { escHtml } from './escHtml';

/**
 * Highlight HTML source code with syntax-coloured spans.
 * Direct port from HEARTCODE.html lines 1956-1965.
 * Only place innerHTML is used — on pre-escaped content.
 */
export function highlight(html: string): string {
  let e = escHtml(html);
  // Comments
  e = e.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="t-comment">$1</span>');
  // DOCTYPE
  e = e.replace(/(&lt;!DOCTYPE[^&]*?&gt;)/gi, '<span class="t-doctype">$1</span>');
  // Script blocks
  e = e.replace(/(&lt;script[\s\S]*?&lt;\/script&gt;)/gi, '<span class="t-script">$1</span>');
  // Style blocks
  e = e.replace(/(&lt;style[\s\S]*?&lt;\/style&gt;)/gi, '<span class="t-style">$1</span>');
  // Attributes and values
  e = e.replace(/( [\w:-]+=)(&quot;[^&]*?&quot;)/g, '<span class="t-attr">$1</span><span class="t-val">$2</span>');
  // Tag names
  e = e.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="t-tag">$2</span>');
  return e;
}

export default highlight;
