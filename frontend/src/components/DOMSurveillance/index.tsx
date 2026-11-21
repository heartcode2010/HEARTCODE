import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import domSurveillance from '../../services/domSurveillance';

export const DOMSurveillance = () => {
  const { domSurveillance: domData } = useIntelligenceStore();

  if (!domData) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">👁️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING DOM WATCHDOG
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Analyze the target HTML document tree for hidden nodes and iframe containers.
        </div>
      </div>
    );
  }

  const summary = domSurveillance.getSummary(domData);

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">👁️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            DOM TREE SURVEILLANCE AUDIT
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          DOM_WATCH
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar select-text">
        <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded text-[0.58rem] font-mono text-cyber-ash">
          {summary}
        </div>

        {/* Hidden elements list */}
        {domData.hiddenElements && domData.hiddenElements.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider border-b border-cyber-border pb-1 uppercase">
              HIDDEN DISPLAY LAYOUT NODES
            </h4>
            <div className="space-y-1.5 font-mono text-[0.58rem]">
              {domData.hiddenElements.map((el: string, idx: number) => (
                <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex items-center justify-between gap-3">
                  <span className="text-white truncate font-medium">{el}</span>
                  <span className="text-cyber-purple font-bold text-[0.5rem] uppercase">hidden</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Injected iframes list */}
        {domData.injectedIframes && domData.injectedIframes.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider border-b border-cyber-border pb-1 uppercase">
              EMBEDDED IFRAME CONTAINERS
            </h4>
            <div className="space-y-1.5 font-mono text-[0.58rem]">
              {domData.injectedIframes.map((iframe: string, idx: number) => (
                <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex items-center justify-between gap-3">
                  <span className="text-cyber-amber truncate font-medium">{iframe}</span>
                  <span className="text-cyber-amber font-bold text-[0.5rem] uppercase">iframe</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shadow DOM or script loads */}
        {domData.shadowDomCount > 0 && (
          <div className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-[0.58rem] flex justify-between items-center text-white">
            <span>Shadow DOM Attachments Resolved:</span>
            <span className="text-[#00ffcc] font-bold">{domData.shadowDomCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DOMSurveillance;
