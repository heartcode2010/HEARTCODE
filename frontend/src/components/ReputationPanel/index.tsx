import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import reputationScorer from '../../services/reputationScorer';

export const ReputationPanel = () => {
  const { reputationScores } = useIntelligenceStore();

  if (!reputationScores) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">⭐</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING TRUST INDEXING
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Analyze code exposures and tracking parameters to resolve trust coefficients.
        </div>
      </div>
    );
  }

  const scores = [
    { label: 'Security Score', val: reputationScores.security },
    { label: 'Privacy Score', val: reputationScores.privacy },
    { label: 'Exposure Index', val: reputationScores.exposure },
    { label: 'Trust Coefficient', val: reputationScores.trust },
    { label: 'Human Authenticity', val: reputationScores.aiAuthenticity },
  ];

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-base">⭐</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            REPUTATION & SECURITY GRADES
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-[#00ffcc] bg-[#00ffcc]/10 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded uppercase">
          REP_GRADED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
        {scores.map((score, idx) => {
          const grade = reputationScorer.getGrade(score.val);
          const color = reputationScorer.getGradeColor(grade);

          return (
            <div
              key={idx}
              className="bg-cyber-bg border border-cyber-border p-3.5 rounded flex flex-col justify-between items-center text-center relative overflow-hidden"
            >
              <span className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wide font-mono">
                {score.label}
              </span>

              {/* Glowing Grade Circular Gauge */}
              <div className="relative w-16 h-16 my-3 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    strokeWidth="2.5" 
                    strokeDasharray={`${score.val}, 100`} 
                    strokeLinecap="round" 
                    stroke={color} 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div 
                  className="absolute font-display text-base font-black"
                  style={{ color, textShadow: `0 0 8px ${color}55` }}
                >
                  {grade}
                </div>
              </div>

              <span className="font-mono text-[0.62rem] text-white font-bold">
                {score.val}/100
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReputationPanel;
