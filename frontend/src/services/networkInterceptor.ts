import { NetworkRequest } from '../types';

export const networkInterceptor = {
  filterBySearch(requests: NetworkRequest[], query: string): NetworkRequest[] {
    if (!query) return requests;
    const lower = query.toLowerCase();
    return requests.filter(r => 
      r.url.toLowerCase().includes(lower) || 
      r.method.toLowerCase().includes(lower) || 
      r.type.toLowerCase().includes(lower)
    );
  },

  filterByType(requests: NetworkRequest[], type: string): NetworkRequest[] {
    if (type === 'all') return requests;
    return requests.filter(r => r.type.toLowerCase() === type.toLowerCase());
  }
};

export default networkInterceptor;
