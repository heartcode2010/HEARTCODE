import { DiscoveredEndpoint } from '../types';

export const endpointDiscovery = {
  groupByType(endpoints: DiscoveredEndpoint[]): Record<string, DiscoveredEndpoint[]> {
    const groups: Record<string, DiscoveredEndpoint[]> = {
      REST: [],
      GraphQL: [],
      WebSocket: [],
      Firebase: [],
      Supabase: []
    };

    endpoints.forEach(ep => {
      const type = ep.type || 'REST';
      if (!groups[type]) groups[type] = [];
      groups[type].push(ep);
    });

    return groups;
  }
};

export default endpointDiscovery;
