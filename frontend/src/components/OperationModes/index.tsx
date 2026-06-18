import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import { OperationMode } from '../../types';

export const OperationModes = () => {
  const { operationMode, setOperationMode } = useIntelligenceStore();

  const modes: { id: OperationMode; label: string; desc: string; icon: string }[] = [
    { id: 'recon', label: 'RECON MODE', desc: 'Active scanning and endpoint discovery', icon: '📡' },
    { id: 'stealth', label: 'STEALTH MODE', desc: 'Passive code harvesting & tracing', icon: '👤' },
    { id: 'ai-forensics', label: 'AI FORENSICS', desc: 'Code authorship & model signature scanning', icon: '🤖' },
    { id: 'threat-hunt', label: 'THREAT HUNT', desc: 'Vulnerability mapping & exploit surface audit', icon: '🎯' },
    { id: 'deep-trace', label: 'DEEP TRACE', desc: 'Network log streams & memory inspection', icon: '🔬' },
    { id: 'blackbox', label: 'BLACKBOX MODE', desc: 'Cinematic staged simulation', icon: '📦' },
  ];

  return (
    <div className="bg-cyber-surface/90 border border-cyber-border-red rounded-lg p-2.5 mb-4 shadow-[0_0_12px_rgba(90,30,40,0.15)] select-none">
      <div className="text-[0.62rem] font-bold text-cyber-ash2 tracking-[0.15em] uppercase mb-2 px-1 flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-cyber-red before:rounded-sm">
        Tactical Operation System Mode
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {modes.map((mode) => {
          const active = operationMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setOperationMode(mode.id)}
              className={`p-2.5 rounded border text-left cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                active
                  ? 'bg-cyber-red/10 border-cyber-red shadow-[0_0_10px_var(--red-glow)] text-white'
                  : 'bg-cyber-bg border-cyber-border hover:border-cyber-red/50 text-cyber-ash hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{mode.icon}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse shadow-[0_0_5px_var(--red)]"></span>
                )}
              </div>
              <div>
                <div className={`font-display text-[0.65rem] font-black tracking-wider ${active ? 'text-cyber-red-hi' : 'text-cyber-ash'}`}>
                  {mode.label}
                </div>
                <div className="text-[0.55rem] text-cyber-ash2 mt-0.5 line-clamp-1 group-hover:text-cyber-ash transition-colors duration-150">
                  {mode.desc}
                </div>
              </div>
              {/* Scanline overlay for active button */}
              {active && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(224,40,64,0.06)_50%,transparent_50%)] bg-[length:100%_4px]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OperationModes;
