import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';

export const ExecutionTrace = () => {
  const { executionTrace } = useIntelligenceStore();

  if (!executionTrace) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">⛓️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING EXECUTION TRACE
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Analyze code entry points and runtime script triggers to compile the call chain stack.
        </div>
      </div>
    );
  }

  const { entryPoint, traceSteps } = executionTrace;

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">⛓️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            CLIENT RUNTIME CALL TRACE
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          TRACE_CHAIN
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar select-text">
        {/* Entry point identifier */}
        <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex justify-between items-center font-mono text-[0.6rem]">
          <span className="text-cyber-ash2">ENTRY CONTEXT</span>
          <span className="text-white font-bold">{entryPoint || 'index.html'}</span>
        </div>

        {/* Traced step execution list */}
        <div>
          <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-2 select-none">
            CHRONOLOGICAL EXECUTION PIPELINE
          </div>
          <div className="space-y-3 pl-3.5 border-l border-cyber-border font-mono text-[0.6rem] relative">
            {traceSteps && traceSteps.map((step: any, idx: number) => (
              <div key={idx} className="relative group space-y-1">
                {/* Visual bullet connecting */}
                <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-cyber-bg border border-cyber-purple flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-cyber-purple"></span>
                </span>

                <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded hover:border-cyber-purple/50 transition-colors duration-150">
                  <div className="flex justify-between items-center text-[0.52rem] text-cyber-ash2">
                    <span className="text-cyber-purple font-bold">TRIGGER: {step.trigger}</span>
                    <span>+{step.durationMs}ms</span>
                  </div>
                  <div className="text-white font-bold mt-0.5">{step.handler}()</div>
                  <div className="text-cyber-ash text-[0.56rem] mt-0.5">Target: {step.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionTrace;
