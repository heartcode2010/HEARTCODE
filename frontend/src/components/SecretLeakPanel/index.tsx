import React, { useState } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import secretScanner from '../../services/secretScanner';

export const SecretLeakPanel = () => {
  const { secretFindings } = useIntelligenceStore();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  if (secretFindings.length === 0) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🔑</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-green tracking-[0.2em] uppercase">
          SECURE SCAN RUNNING
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          No active API keys, JWT headers, or credentials leaked in plain text.
        </div>
      </div>
    );
  }

  const stats = secretScanner.getStats(secretFindings);

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🔑</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            SENSITIVE CREDENTIAL AUDITOR
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          KEY_LEAK_WARN
        </span>
      </div>

      {/* Secret Stats Summary */}
      <div className="flex justify-between items-center bg-cyber-bg border border-cyber-border p-2 rounded mb-3 flex-shrink-0 text-[0.6rem] font-mono text-cyber-ash2">
        <span>EXPOSURES DETECTED</span>
        <div className="flex gap-3 font-bold">
          <span className="text-cyber-red">CRIT: {stats.criticalCount}</span>
          <span className="text-cyber-amber">HIGH: {stats.highCount}</span>
          <span className="text-white">MED: {stats.mediumCount}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar select-text">
        {secretFindings.map((finding) => {
          const isRevealed = revealedIds.has(finding.id);
          const color = secretScanner.getSeverityColor(finding.severity);

          return (
            <div
              key={finding.id}
              className="bg-cyber-bg border border-cyber-border p-3 rounded space-y-2.5 relative overflow-hidden"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-display text-[0.62rem] font-black text-white uppercase tracking-wider">
                  {finding.type} LEAKED
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-[0.52rem] font-bold border uppercase tracking-wider select-none"
                  style={{ color, borderColor: `${color}44`, backgroundColor: `${color}11` }}
                >
                  {finding.severity}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-[0.58rem] text-cyber-ash2 uppercase tracking-wider font-mono">CODE PATTERN HINT</div>
                <div className="bg-cyber-surface/60 border border-cyber-border/40 p-2 rounded font-mono text-[0.62rem] text-white flex items-center justify-between gap-3 select-text">
                  <span className="truncate break-all">
                    {isRevealed ? (finding.rawValue || finding.maskedValue) : finding.maskedValue}
                  </span>
                  <button
                    onClick={() => toggleReveal(finding.id)}
                    className="text-[0.52rem] text-cyber-purple hover:text-cyber-purple-hi underline cursor-pointer border-none bg-transparent flex-shrink-0 select-none font-bold"
                  >
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-[0.55rem] text-cyber-ash2 font-mono">
                <span>PATH: {finding.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecretLeakPanel;
