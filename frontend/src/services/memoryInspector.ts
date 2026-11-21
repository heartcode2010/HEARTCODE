import { MemorySnapshot, CookieEntry } from '../types';

export const memoryInspector = {
  getCookieSecurityGrade(cookie: CookieEntry): 'safe' | 'warning' | 'danger' {
    if (cookie.httpOnly && cookie.secure && cookie.sameSite !== 'None') return 'safe';
    if (!cookie.httpOnly && !cookie.secure) return 'danger';
    return 'warning';
  },

  searchStore(store: Record<string, string>, query: string): Record<string, string> {
    if (!query) return store;
    const lower = query.toLowerCase();
    const result: Record<string, string> = {};
    Object.keys(store).forEach(k => {
      if (k.toLowerCase().includes(lower) || store[k].toLowerCase().includes(lower)) {
        result[k] = store[k];
      }
    });
    return result;
  }
};

export default memoryInspector;
