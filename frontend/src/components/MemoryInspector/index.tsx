import React, { useState } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import memoryInspector from '../../services/memoryInspector';

export const MemoryInspector = () => {
  const { memorySnapshot } = useIntelligenceStore();
  const [activeTab, setActiveTab] = useState<'local' | 'session' | 'cookies'>('cookies');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!memorySnapshot) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">📦</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING MEMORY ACCESS
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Resolve core payloads to inspect internal client variable stacks and cookie arrays.
        </div>
      </div>
    );
  }

  // Search logic
  const filteredLocal = memoryInspector.searchStore(memorySnapshot.localStorage, searchQuery);
  const filteredSession = memoryInspector.searchStore(memorySnapshot.sessionStorage, searchQuery);
  
  const filteredCookies = (memorySnapshot.cookies || []).filter(cookie => 
    !searchQuery || 
    cookie.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cookie.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            CLIENT WORKSPACE MEMORY INSPECTOR
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-[#00ffcc] bg-[#00ffcc]/10 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded uppercase">
          MEM_READY
        </span>
      </div>

      {/* Tabs and search bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3.5 flex-shrink-0">
        <div className="flex gap-1 bg-cyber-bg border border-cyber-border p-0.5 rounded">
          {[
            { id: 'cookies', label: 'Cookies' },
            { id: 'local', label: 'localStorage' },
            { id: 'session', label: 'sessionStorage' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-[0.58rem] font-mono rounded cursor-pointer transition-all duration-150 uppercase font-bold ${
                activeTab === tab.id 
                  ? 'bg-cyber-border-red text-white' 
                  : 'text-cyber-ash2 hover:text-cyber-ash'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-cyber-bg border border-cyber-border px-3 py-1.5 rounded text-[0.68rem] font-mono text-white outline-none focus:border-cyber-red"
        />
      </div>

      {/* Data display grid/table */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {activeTab === 'cookies' && (
          <div className="space-y-2 select-text">
            {filteredCookies.map((cookie, idx) => {
              const grade = memoryInspector.getCookieSecurityGrade(cookie);
              const badgeColor = grade === 'safe' ? 'text-cyber-green' : (grade === 'warning' ? 'text-cyber-amber' : 'text-cyber-red');
              return (
                <div key={idx} className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-[0.62rem] space-y-1.5">
                  <div className="flex justify-between items-center border-b border-cyber-border/40 pb-1.5">
                    <span className="text-white font-bold text-[0.68rem]">{cookie.name}</span>
                    <span className={`text-[0.55rem] font-bold ${badgeColor} uppercase tracking-widest`}>
                      [{grade}]
                    </span>
                  </div>
                  <div className="text-cyber-ash break-all leading-normal">
                    {cookie.value}
                  </div>
                  <div className="flex justify-between text-[0.55rem] text-cyber-ash2 pt-1">
                    <span>DOM: {cookie.domain}</span>
                    <span className="flex gap-2">
                      <span className={cookie.httpOnly ? 'text-cyber-green' : 'text-cyber-ash3'}>HTTPONLY</span>
                      <span className={cookie.secure ? 'text-cyber-green' : 'text-cyber-ash3'}>SECURE</span>
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredCookies.length === 0 && (
              <div className="text-center py-6 text-cyber-ash2 font-mono text-[0.62rem]">
                No active cookies parsed.
              </div>
            )}
          </div>
        )}

        {(activeTab === 'local' || activeTab === 'session') && (
          <div className="space-y-2 select-text font-mono text-[0.62rem]">
            {Object.entries(activeTab === 'local' ? filteredLocal : filteredSession).map(([k, v]) => (
              <div key={k} className="bg-cyber-bg border border-cyber-border p-3 rounded space-y-1.5">
                <div className="text-cyber-purple font-bold text-[0.65rem] border-b border-cyber-border/40 pb-1">{k}</div>
                <div className="text-white break-all leading-normal">{v}</div>
              </div>
            ))}
            {Object.keys(activeTab === 'local' ? filteredLocal : filteredSession).length === 0 && (
              <div className="text-center py-6 text-cyber-ash2 font-mono text-[0.62rem]">
                No active variables configured.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryInspector;
