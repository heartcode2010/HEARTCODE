import React, { useState } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import networkInterceptor from '../../services/networkInterceptor';

export const NetworkConsole = () => {
  const { networkLog } = useIntelligenceStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);

  if (networkLog.length === 0) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">📡</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          CONSOLE STREAM SILENT
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Open connection channels to intercept script packages and HTTP requests.
        </div>
      </div>
    );
  }

  const filteredLogs = networkInterceptor.filterByType(
    networkInterceptor.filterBySearch(networkLog, searchQuery),
    filterType
  );

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'websocket':
      case 'ws':
        return 'text-cyber-green bg-cyber-green/10 border-cyber-green/30';
      case 'xhr':
        return 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30';
      default:
        return 'text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/30';
    }
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">📡</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            CONNECTION INTERCEPT CONSOLE
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          LIVE_PIPE
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3.5 flex-shrink-0 select-none">
        <div className="flex gap-1 bg-cyber-bg border border-cyber-border p-0.5 rounded">
          {['all', 'fetch', 'xhr', 'ws'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-[0.58rem] font-mono rounded cursor-pointer transition-all duration-150 uppercase font-bold ${
                filterType === type 
                  ? 'bg-cyber-border-red text-white' 
                  : 'text-cyber-ash2 hover:text-cyber-ash'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-cyber-bg border border-cyber-border px-3 py-1.5 rounded text-[0.68rem] font-mono text-white outline-none focus:border-cyber-red"
        />
      </div>

      {/* Scrolling Stream list */}
      <div className="flex-1 overflow-y-auto font-mono text-[0.62rem] space-y-2 pr-1 custom-scrollbar">
        {filteredLogs.map((req) => {
          const isExpanded = expandedReqId === req.id;
          return (
            <div
              key={req.id}
              className="bg-cyber-bg border border-cyber-border rounded overflow-hidden transition-all duration-150"
            >
              <div
                onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-cyber-surface/50 transition-colors duration-150"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-1.5 py-0.5 rounded text-[0.52rem] font-bold border uppercase tracking-wider ${getBadgeColor(req.type)}`}>
                    {req.type}
                  </span>
                  <span className="text-cyber-ash2 font-bold">{req.method}</span>
                  <span className="text-white truncate font-medium max-w-xs md:max-w-sm">{req.url}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 select-none">
                  <span className="text-cyber-green font-bold">200 OK</span>
                  <span className="text-cyber-ash2">
                    {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Collapsible details pane */}
              {isExpanded && (
                <div className="border-t border-cyber-border/70 p-3 bg-cyber-surface/30 space-y-2.5 text-cyber-ash select-text border-l-2 border-cyber-red">
                  <div>
                    <div className="text-cyber-red uppercase tracking-wider text-[0.52rem] font-bold mb-1">TARGET HOST</div>
                    <div className="text-white break-all">{req.headers?.['host'] || 'Unknown'}</div>
                  </div>
                  {req.headers && Object.keys(req.headers).length > 0 && (
                    <div>
                      <div className="text-cyber-red uppercase tracking-wider text-[0.52rem] font-bold mb-1">HEADERS</div>
                      <div className="space-y-1">
                        {Object.entries(req.headers).map(([k, v]) => (
                          <div key={k} className="flex">
                            <span className="text-cyber-purple font-bold mr-2.5 flex-shrink-0">{k}:</span>
                            <span className="text-white break-all">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="text-center py-6 text-cyber-ash2 font-mono text-[0.62rem]">
            No matching connections captured.
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkConsole;
