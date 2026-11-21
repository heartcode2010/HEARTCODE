import axios from 'axios';
import * as dns from 'dns';
import * as http from 'http';
import * as https from 'https';
import { isIP } from 'net';
import { URL } from 'url';

export interface SafeTargetData {
  url: string;
  html: string;
  headers: Record<string, string>;
  ip: string;
}

type ResolvedAddress = { address: string; family: number };

function isPublicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const octets = address.split('.').map(Number);
    const [a, b, c] = octets;
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && (b === 0 || b === 168)) return false;
    if (a === 192 && b === 0 && c === 2) return false;
    if (a === 192 && b === 88 && c === 99) return false;
    if (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) return false;
    if (a === 203 && b === 0 && c === 113) return false;
    return true;
  }

  if (isIP(address) === 6) {
    const normalized = address.toLowerCase();
    // Only globally-routable unicast IPv6 (2000::/3); exclude documentation space.
    if (!/^[23]/.test(normalized)) return false;
    if (normalized.startsWith('2001:db8:')) return false;
    return true;
  }
  return false;
}

async function resolvePublicAddress(hostname: string): Promise<ResolvedAddress[]> {
  if (isIP(hostname)) {
    if (!isPublicAddress(hostname)) throw new Error('Security restriction: private or reserved network addresses cannot be scanned.');
    return [{ address: hostname, family: isIP(hostname) }];
  }

  const addresses = await dns.promises.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((entry) => !isPublicAddress(entry.address))) {
    throw new Error('Security restriction: target resolves to a private, local, or reserved network address.');
  }
  return addresses;
}

function validateTargetUrl(input: string): URL {
  let candidate = input.trim();
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('Enter a valid website URL.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only HTTP and HTTPS websites can be scanned.');
  if (parsed.username || parsed.password) throw new Error('URLs containing embedded credentials are not allowed.');
  if (parsed.port && parsed.port !== (parsed.protocol === 'https:' ? '443' : '80')) throw new Error('Only standard HTTP (80) and HTTPS (443) ports are supported.');
  parsed.hash = '';
  return parsed;
}

export class SafeTargetFetcher {
  static async fetch(input: string): Promise<SafeTargetData> {
    let current = validateTargetUrl(input);

    for (let redirectCount = 0; redirectCount <= 5; redirectCount++) {
      const addresses = await resolvePublicAddress(current.hostname);
      const pinnedLookup = ((_hostname: string, options: any, callback: any) => {
        const requestedFamily = typeof options === 'number' ? options : options?.family;
        const selected = addresses.find((entry) => !requestedFamily || entry.family === requestedFamily) || addresses[0];
        if (!selected) return callback(new Error('No validated public address is available.'));
        if (options?.all) return callback(null, addresses.map((entry) => ({ address: entry.address, family: entry.family })));
        callback(null, selected.address, selected.family);
      }) as any;

      const agentOptions = { keepAlive: false, lookup: pinnedLookup };
      const response = await axios.get(current.toString(), {
        timeout: 15000,
        maxRedirects: 0,
        maxContentLength: 5 * 1024 * 1024,
        responseType: 'text',
        proxy: false,
        httpAgent: new http.Agent(agentOptions),
        httpsAgent: new https.Agent(agentOptions),
        headers: {
          'User-Agent': 'HEARTCODE-Security-Scanner/1.0 (+authorized passive website assessment)',
          'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
        },
        validateStatus: (status) => status >= 200 && status < 400,
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.location;
        if (!location) throw new Error('Target returned a redirect without a Location header.');
        if (redirectCount === 5) throw new Error('Target exceeded the maximum of 5 redirects.');
        current = validateTargetUrl(new URL(location, current).toString());
        continue;
      }

      const contentType = String(response.headers['content-type'] || '').toLowerCase();
      if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        throw new Error('The target did not return an HTML page that can be inspected.');
      }
      if (typeof response.data !== 'string') throw new Error('Target did not return readable HTML source.');

      const headers = Object.fromEntries(
        Object.entries(response.headers).map(([key, value]) => [key.toLowerCase(), Array.isArray(value) ? value.join(', ') : String(value)])
      );
      return { url: current.toString(), html: response.data, headers, ip: addresses[0].address };
    }

    throw new Error('Unable to fetch target after following redirects.');
  }
}
