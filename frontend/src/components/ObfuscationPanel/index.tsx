import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';

export const ObfuscationPanel = () => {
  const { obfuscation } = useIntelligenceStore();

  if (!obfuscation) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🔒</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING OBFUSCATION PROBE
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Analyze scripting structures to identify packed source configurations or anti-debugger loops.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🔒</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            CODE OBFUSCATION DETECTOR
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          OBF_STATUS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar select-text">
        {/* Core risk rating */}
        <div className="bg-cyber-bg border border-cyber-border p-3.5 rounded flex justify-between items-center">
          <span className="text-[0.58rem] font-mono text-cyber-ash2">OBFUSCATION CONFIDENCE</span>
          <span className={`font-display text-[0.8rem] font-black px-2 py-0.5 rounded border ${
            obfuscation.obfuscationLevel > 50 ? 'text-cyber-red border-cyber-red/30 bg-cyber-red/5' : 'text-cyber-green border-cyber-green/30 bg-cyber-green/5'
          }`}>
            {obfuscation.obfuscationLevel}% ({obfuscation.obfuscationLevel > 50 ? 'HEAVY' : 'MINIMAL'})
          </span>
        </div>

        {/* Obfuscated Scripts listing */}
        <div>
          <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5 select-none">
            SUSPICIOUS CODING TECHNIQUES ({obfuscation.obfuscatedScripts.length})
          </div>
          {obfuscation.obfuscatedScripts.length > 0 ? (
            <div className="space-y-1.5 font-mono text-[0.6rem]">
              {obfuscation.obfuscatedScripts.map((technique: string, idx: number) => (
                <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex items-center gap-2">
                  <span className="text-cyber-red">⚠</span>
                  <span className="text-white">{technique}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-[0.58rem] text-cyber-green text-center select-none">
              ✓ Clean code syntax patterns. No packers identified.
            </div>
          )}
        </div>

        {/* Anti-Debugging logs */}
        <div className="bg-cyber-bg border border-cyber-border p-3.5 rounded font-mono text-[0.58rem] space-y-1.5">
          <div className="flex justify-between items-center text-cyber-ash">
            <span>Anti-Debugging code filters:</span>
            <span className={obfuscation.antiDebuggingDetected ? 'text-cyber-red font-bold' : 'text-cyber-ash3 font-bold'}>
              {obfuscation.antiDebuggingDetected ? 'ALERT_FOUND' : 'CLEAN'}
            </span>
          </div>
          <div className="flex justify-between items-center text-cyber-ash">
            <span>Dynamic compilation helper counts:</span>
            <span className={obfuscation.evalUsageCount > 0 ? 'text-cyber-red font-bold' : 'text-cyber-ash3 font-bold'}>
              {obfuscation.evalUsageCount} FOUND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObfuscationPanel;
