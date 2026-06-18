import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import aiForensicsEngine from '../../services/aiForensicsEngine';

export const AIForensicsPanel = () => {
  const { aiForensics, codeClassifications } = useIntelligenceStore();

  if (!aiForensics) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🕵️‍♂️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING AI CLASSIFICATION
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Trigger model scanners to evaluate code structure weights and boilerplate lines.
        </div>
      </div>
    );
  }

  const { human, ai } = aiForensicsEngine.getContributionBreakdown(aiForensics);
  const likelihood = aiForensicsEngine.getAILikelihood(aiForensics.aiConfidenceScore);

  const getLikelihoodColor = (l: string) => {
    switch (l) {
      case 'CERTAIN': return 'text-cyber-red bg-cyber-red-dim border-cyber-border-red';
      case 'PROBABLE': return 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30';
      case 'SUSPICIOUS': return 'text-[#ffcc00] bg-[#ffcc00]/10 border-[#ffcc00]/30';
      default: return 'text-cyber-green bg-cyber-green/10 border-cyber-green/30';
    }
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🔬</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            GENERATIVE MODEL FORENSICS
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          AI_FORENSICS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* Likelihood Gauge */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between items-center text-center">
            <span className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wider">AI CONFI_SCORE</span>
            
            <div className="relative w-14 h-14 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyber-purple" strokeWidth="2.5" strokeDasharray={`${aiForensics.aiConfidenceScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute font-display text-[0.7rem] font-bold text-white">
                {aiForensics.aiConfidenceScore}%
              </div>
            </div>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between">
            <span className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wider text-center">CONTRIBUTION RATIO</span>
            
            <div className="space-y-1.5 my-2">
              <div className="flex justify-between text-[0.52rem] font-mono">
                <span className="text-cyber-green font-bold">HUMAN</span>
                <span className="text-cyber-red font-bold">AI</span>
              </div>
              <div className="w-full bg-cyber-ash3 h-2 rounded overflow-hidden flex">
                <div className="bg-cyber-green h-full" style={{ width: `${human}%` }}></div>
                <div className="bg-cyber-red h-full" style={{ width: `${ai}%` }}></div>
              </div>
              <div className="flex justify-between text-[0.52rem] font-mono text-cyber-ash">
                <span>{human}%</span>
                <span>{ai}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Likely source */}
        <div className="grid grid-cols-2 gap-2 text-[0.58rem] font-mono">
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-cyber-ash2">LIKELIHOOD GRADE</span>
            <span className={`font-bold py-0.5 px-1 rounded text-center border mt-1 select-none ${getLikelihoodColor(likelihood)}`}>
              {likelihood}
            </span>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-cyber-ash2">PROBABLE BUILD TOOL</span>
            <span className="text-white font-bold mt-1 text-center truncate">
              {aiForensics.probableAISource?.join(', ') || 'N/A'}
            </span>
          </div>
        </div>

        {/* Classifications segment listing */}
        <div className="space-y-2 pt-1 border-t border-cyber-border select-text">
          <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5">
            CODE SYNTAX CLASSIFICATIONS ({codeClassifications.length})
          </div>
          <div className="space-y-1.5 font-mono text-[0.58rem]">
            {codeClassifications.map((item, idx) => (
              <div key={idx} className="bg-cyber-bg border border-cyber-border p-2 rounded flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-cyber-ash2">LINES: {item.startLine} - {item.endLine}</div>
                  <div className="text-white truncate">{item.description}</div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[0.48rem] font-bold border uppercase tracking-wider flex-shrink-0 ${
                  item.type === 'ai-generated' ? 'text-cyber-red border-cyber-red/30 bg-cyber-red/5' : 
                  (item.type === 'sensitive' ? 'text-cyber-amber border-cyber-amber/30 bg-cyber-amber/5' : 'text-cyber-green border-cyber-green/30 bg-cyber-green/5')
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIForensicsPanel;
