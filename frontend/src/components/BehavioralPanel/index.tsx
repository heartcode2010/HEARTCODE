import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import behavioralAnalyzer from '../../services/behavioralAnalyzer';

export const BehavioralPanel = () => {
  const { behavioralProfile } = useIntelligenceStore();

  if (!behavioralProfile) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🕵️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING RADAR HARVEST
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Probe target scripts to calculate behavior trackers and fingerprint patterns.
        </div>
      </div>
    );
  }

  const riskLevel = behavioralAnalyzer.getRiskLevelBadge(behavioralProfile);
  const trackingDesc = behavioralAnalyzer.getTrackingDensityDescriptor(behavioralProfile.trackingIntensity);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-cyber-red bg-cyber-red-dim border-cyber-border-red';
      case 'HIGH': return 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/30';
      case 'MEDIUM': return 'text-[#ffcc00] bg-[#ffcc00]/10 border-[#ffcc00]/30';
      default: return 'text-cyber-green bg-cyber-green/10 border-cyber-green/30';
    }
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🕵️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            BEHAVIOR & TELEMETRY PROFILE
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          RADAR_AUDIT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between items-center text-center">
            <span className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wider">PRIVACY RISK</span>
            
            <div className="relative w-14 h-14 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyber-red" strokeWidth="2.5" strokeDasharray={`${behavioralProfile.privacyRiskScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute font-display text-[0.7rem] font-bold text-white">
                {behavioralProfile.privacyRiskScore}%
              </div>
            </div>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex flex-col justify-between items-center text-center">
            <span className="text-[0.52rem] text-cyber-ash2 uppercase tracking-wider">TRACKING LEVEL</span>

            <div className="relative w-14 h-14 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-cyber-ash3" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-cyber-purple" strokeWidth="2.5" strokeDasharray={`${behavioralProfile.trackingIntensity}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute font-display text-[0.7rem] font-bold text-white">
                {behavioralProfile.trackingIntensity}%
              </div>
            </div>
          </div>
        </div>

        {/* Descriptors */}
        <div className="grid grid-cols-2 gap-2 text-[0.58rem] font-mono">
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-cyber-ash2">EXPOSURE CLASS</span>
            <span className={`font-bold py-0.5 px-1 rounded text-center border mt-1 select-none ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>

          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-cyber-ash2">TRACKING PROFILE</span>
            <span className="text-[#00ffcc] font-bold mt-1 text-center py-0.5">
              {trackingDesc}
            </span>
          </div>
        </div>

        {/* Trackers list & fingerprinting signals */}
        <div className="space-y-3 pt-1 border-t border-cyber-border">
          <div>
            <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5">
              ACTIVE TELEMETRY HOOKS ({behavioralProfile.trackers.length})
            </div>
            {behavioralProfile.trackers.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {behavioralProfile.trackers.map((t, idx) => (
                  <span key={idx} className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 font-mono text-[0.58rem] text-white">
                    🔗 {t}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-cyber-ash3 text-[0.55rem] font-mono italic">No tracking pixels loaded.</div>
            )}
          </div>

          <div>
            <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5">
              FINGERPRINT PATTERNS IDENTIFIED ({behavioralProfile.fingerprinters.length})
            </div>
            {behavioralProfile.fingerprinters.length > 0 ? (
              <div className="space-y-1 font-mono text-[0.58rem] text-white">
                {behavioralProfile.fingerprinters.map((f, idx) => (
                  <div key={idx} className="bg-cyber-bg border border-cyber-border p-2 rounded flex items-center gap-1.5">
                    <span className="text-cyber-red">⚠</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-cyber-ash3 text-[0.55rem] font-mono italic">No canvas/audio identifier read attempts found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralPanel;
