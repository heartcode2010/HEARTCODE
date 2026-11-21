/**
 * Multi-proxy fetch with fallback.
 * Port of HEARTCODE.html lines 1708-1748.
 * Tries 3 CORS proxies sequentially with 8s timeouts.
 */

type ProxyFn = (url: string) => Promise<string>;

const proxies: ProxyFn[] = [
  // Proxy 1: allorigins
  async (u: string) => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(u), {
        signal: ctrl.signal,
      });
      const j = await r.json();
      if (!j.contents) throw new Error('Empty response');
      return j.contents as string;
    } finally {
      clearTimeout(tid);
    }
  },

  // Proxy 2: corsproxy.io
  async (u: string) => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch('https://corsproxy.io/?' + encodeURIComponent(u), {
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } finally {
      clearTimeout(tid);
    }
  },

  // Proxy 3: codetabs
  async (u: string) => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u), {
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } finally {
      clearTimeout(tid);
    }
  },
];

export async function fetchWithProxy(url: string): Promise<string> {
  let lastErr: Error | null = null;
  for (const proxy of proxies) {
    try {
      const html = await proxy(url);
      if (html && html.trim().length > 30) return html;
    } catch (e) {
      lastErr = e as Error;
    }
  }
  throw new Error(
    lastErr ? lastErr.message : 'All proxies failed — site may block external access.'
  );
}

export default fetchWithProxy;
