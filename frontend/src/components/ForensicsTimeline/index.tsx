import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';

export const ForensicsTimeline = () => {
  const { timelineEvents } = useIntelligenceStore();

  if (timelineEvents.length === 0) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">⏳</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          TIMELINE LOG DECAYED
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Chronological tracing timeline initializes during live scanning sequences.
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'init': return '🔌';
      case 'header': return '📄';
      case 'dom': return '📊';
      case 'infra': return '🖥️';
      case 'secret': return '🔑';
      case 'ai': return '🤖';
      default: return '⚡';
    }
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">⏳</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            OPERATIONAL FORENSICS TIMELINE
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          LOG_TRACE
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto pr-2 pl-4 border-l border-cyber-border-red/40 space-y-4 font-mono text-[0.62rem] relative custom-scrollbar select-text">
        {timelineEvents.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline bullet */}
            <span className="absolute -left-[23px] top-1 bg-cyber-bg border border-cyber-red w-4.5 h-4.5 rounded-full flex items-center justify-center text-[0.45rem] shadow-[0_0_8px_rgba(224,40,64,0.3)] select-none">
              {getEventIcon(event.type)}
            </span>

            <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded hover:border-cyber-red/50 transition-colors duration-150 space-y-1">
              <div className="flex justify-between items-center text-[0.55rem] text-cyber-ash2">
                <span className="text-cyber-purple font-bold">EVENT_{idx + 1}</span>
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-white font-bold text-[0.65rem]">{event.label}</div>
              <div className="text-cyber-ash leading-normal">{event.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForensicsTimeline;
