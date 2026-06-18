import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';

export const ShadowAssetPanel = () => {
  const { shadowAssets } = useIntelligenceStore();

  if (shadowAssets.length === 0) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">📁</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-green tracking-[0.2em] uppercase">
          NO SHADOW ASSETS DETECTED
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          No active backup files or source map reference paths leaked in script files.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">📁</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            SHADOW ASSET REGISTRY
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          RECON_ASSET
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar select-text">
        {shadowAssets.map((asset, idx) => (
          <div key={idx} className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-[0.6rem] space-y-1.5 border-l-2 border-cyber-purple">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-[0.65rem]">{asset.type.toUpperCase()} EXPOSED</span>
              <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-bold border border-cyber-border-red bg-cyber-red-dim text-cyber-red uppercase">
                {asset.type}
              </span>
            </div>
            <div className="text-cyber-ash break-all font-mono leading-normal bg-cyber-surface/60 p-2 rounded">
              {asset.url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShadowAssetPanel;
