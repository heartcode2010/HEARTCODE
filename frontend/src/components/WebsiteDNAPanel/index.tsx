import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import websiteDnaEngine from '../../services/websiteDnaEngine';

export const WebsiteDNAPanel = () => {
  const { dnaProfile } = useIntelligenceStore();

  if (!dnaProfile) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-72 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🧬</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING DNA ANALYSIS
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Run the tactical command scanner to reconstruct target architecture signatures.
        </div>
      </div>
    );
  }

  const indicators = websiteDnaEngine.getIndicators(dnaProfile);

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-red/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 select-none">
        <div className="flex items-center gap-2">
          <span className="text-base">🧬</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            WEBSITE DNA SYNTAX PROFILE
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          SEQ_OK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core details */}
        <div className="flex flex-col gap-3">
          <div className="bg-cyber-bg border border-cyber-border p-3 rounded">
            <span className="text-[0.58rem] text-cyber-ash2 uppercase tracking-wide">ARCHITECTURE SIGNATURE</span>
            <div className="font-display text-[0.82rem] font-black text-white mt-1 uppercase tracking-wide">
              {dnaProfile.architectureSignature}
            </div>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-3 rounded">
            <span className="text-[0.58rem] text-cyber-ash2 uppercase tracking-wide">STYLE ENGINE STACK</span>
            <div className="font-display text-[0.82rem] font-black text-[#00ffcc] mt-1 uppercase tracking-wide">
              {dnaProfile.developmentStyle}
            </div>
          </div>
        </div>

        {/* Scoring Gauges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between items-center text-center">
            <span className="text-[0.55rem] text-cyber-ash2 uppercase tracking-wide">SOPHISTICATION</span>
            
            {/* Visual dial */}
            <div className="relative w-16 h-16 my-2.5 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyber-red" strokeWidth="2.5" strokeDasharray={`${dnaProfile.sophisticationScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute font-display text-[0.78rem] font-bold text-white">
                {dnaProfile.sophisticationScore}%
              </div>
            </div>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between items-center text-center">
            <span className="text-[0.55rem] text-cyber-ash2 uppercase tracking-wide">AI GEN RATIO</span>

            <div className="relative w-16 h-16 my-2.5 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyber-purple" strokeWidth="2.5" strokeDasharray={`${dnaProfile.aiContributionLevel}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute font-display text-[0.78rem] font-bold text-white">
                {dnaProfile.aiContributionLevel}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structural attributes grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3.5 border-t border-cyber-border pt-3.5">
        {indicators.map((ind, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-lg bg-cyber-bg border border-cyber-border w-8 h-8 rounded flex items-center justify-center flex-shrink-0 select-none">
              {ind.icon}
            </span>
            <div className="min-w-0">
              <div className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wide truncate">{ind.label}</div>
              <div className="text-[0.68rem] font-mono font-bold text-white truncate">{ind.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteDNAPanel;
