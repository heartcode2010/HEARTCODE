import { InfrastructureMap } from '../types';

export const infrastructureMapper = {
  getNodesAndEdges(map: InfrastructureMap | null) {
    if (!map) return { nodes: [], edges: [] };
    
    // Add default icons based on types
    const nodes = map.nodes.map(n => {
      let icon = '🌐';
      if (n.type === 'target') icon = '🎯';
      else if (n.type === 'cdn') icon = '☁️';
      else if (n.type === 'hosting') icon = '🖥️';
      else if (n.type === 'dns') icon = '🔑';
      else if (n.type === 'database') icon = '🛢️';
      
      return {
        ...n,
        icon
      };
    });

    return {
      nodes,
      edges: map.edges
    };
  }
};

export default infrastructureMapper;
