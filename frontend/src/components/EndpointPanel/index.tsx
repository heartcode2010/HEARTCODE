import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import endpointDiscovery from '../../services/endpointDiscovery';

export const EndpointPanel = () => {
  const { endpoints } = useIntelligenceStore();

  if (endpoints.length === 0) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🛠️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          NO ENDPOINTS DISCOVERED
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Inspect external Javascript assets to build the server routes model.
        </div>
      </div>
    );
  }

  const grouped = endpointDiscovery.groupByType(endpoints);

  const getBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WEBSOCKET':
        return 'text-cyber-green bg-cyber-green/10 border-cyber-green/30';
      case 'SUPABASE':
      case 'FIREBASE':
        return 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30';
      case 'GRAPHQL':
        return 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30';
      default:
        return 'text-white bg-cyber-surface2 border-cyber-border';
    }
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🛠️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            RESOLVED SERVER ENDPOINTS
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          API_TRACE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar select-text">
        {Object.entries(grouped).map(([category, list]) => {
          if (list.length === 0) return null;
          return (
            <div key={category} className="space-y-1.5">
              <h4 className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider border-b border-cyber-border pb-1 uppercase">
                {category} ROUTING ({list.length})
              </h4>
              <div className="space-y-1.5 font-mono text-[0.62rem]">
                {list.map((ep, idx) => (
                  <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {ep.method && (
                        <span className="text-cyber-red font-bold flex-shrink-0">
                          {ep.method}
                        </span>
                      )}
                      <span className="text-white truncate font-medium">{ep.url}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-bold border uppercase tracking-wider flex-shrink-0 ${getBadgeColor(category)}`}>
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EndpointPanel;
