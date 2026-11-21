import React, { useEffect, useState, useRef } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';
import intelligenceService from '../../services/intelligence.service';

interface MissionControlProps {
  onTriggerFullScan?: () => void;
}

export const MissionControl = ({ onTriggerFullScan }: MissionControlProps) => {
  const {
    telemetry,
    scanPhase,
    setScanPhase,
    updateTelemetry,
    clearIntelligence,
    operationMode
  } = useIntelligenceStore();

  const { scanId, showToast } = useScanStore();
  const [logs, setLogs] = useState<string[]>(['[SYS] OS terminal initialized...', '[SYS] Core intelligence channels idle.']);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll threat feed
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Feed log simulator
  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-99), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Log simulation when phases change
  useEffect(() => {
    if (scanPhase === 'surface') {
      addLog('⚡ INITIALIZING SURFACE SIGNAL EXTRACTION...');
      addLog('📡 Probing DNS records and caching server header metadata...');
    } else if (scanPhase === 'deep') {
      addLog('🔍 TRIGGERING DEEP RECONNAISSANCE SCAN...');
      addLog('⛓️ Crawling asset index and compiling external script payloads...');
    } else if (scanPhase === 'behavioral') {
      addLog('🕵️ MONITORING CLIENT-SIDE BEHAVIOR FINGERPRINTS...');
      addLog('🛡️ Scanning canvas toDataURL hooks and audio oscillators...');
    } else if (scanPhase === 'forensics') {
      addLog('🤖 AI FORENSICS CLASSIFIER ONLINE...');
      addLog('🔬 Verifying Claude/GPT boilerplate syntax densities...');
    } else if (scanPhase === 'complete') {
      addLog('✓ MISSION SUCCESS: INTEL HARVEST SECURED.');
    }
  }, [scanPhase]);

  const runIntelScan = async () => {
    if (!scanId) {
      showToast('⚠️', 'Please inspect a website and load source code first');
      return;
    }
    
    setScanPhase('surface');
    updateTelemetry({ activeScans: 1, scanProgress: 10 });
    
    try {
      // Step 1: Surface scan logs
      await new Promise(r => setTimeout(r, 600));
      setScanPhase('deep');
      updateTelemetry({ scanProgress: 35 });
      
      // Step 2: Deep scan logs
      await new Promise(r => setTimeout(r, 800));
      setScanPhase('behavioral');
      updateTelemetry({ scanProgress: 60 });
      
      // Step 3: Behavioral analysis
      await new Promise(r => setTimeout(r, 800));
      setScanPhase('forensics');
      updateTelemetry({ scanProgress: 85 });
      
      // Call backend
      const res = await intelligenceService.runFullScan(scanId);
      if (res.success) {
        // Hydrate store state
        const analysis = res.analysis;
        const state = useIntelligenceStore.getState();
        state.setInfrastructureMap(analysis.infrastructureMap);
        state.setDNAProfile(analysis.dnaProfile);
        state.setNetworkLog(analysis.networkLog);
        state.setMemorySnapshot(analysis.memorySnapshot);
        state.setEndpoints(analysis.endpoints);
        state.setSecretFindings(analysis.secretFindings);
        state.setBehavioralProfile(analysis.behavioralProfile);
        state.setAIForensics(analysis.aiForensics);
        state.setCodeClassifications(analysis.codeClassifications);
        state.setDOMSurveillance(analysis.domSurveillance);
        state.setObfuscation(analysis.obfuscation);
        state.setShadowAssets(analysis.shadowAssets);
        state.setSecurityIntel(analysis.securityIntel);
        state.setExecutionTrace(analysis.executionTrace);
        state.setTimelineEvents(analysis.timelineEvents);
        state.setReputationScores(analysis.reputationScores);
        state.setThreatRadar(analysis.threatRadar);
        state.setDesignSystem(analysis.designSystem);

        // Update telemetry
        updateTelemetry({
          activeScans: 0,
          completedScans: telemetry.completedScans + 1,
          totalFindings: analysis.secretFindings.length + analysis.endpoints.length,
          criticalFindings: analysis.secretFindings.filter((s: any) => s.severity === 'Critical').length,
          scanProgress: 100,
          currentPhase: 'complete'
        });
        
        setScanPhase('complete');
        showToast('📡', 'Cyber Intelligence extraction finalized!');
      }
    } catch (err: any) {
      console.error(err);
      setScanPhase('idle');
      updateTelemetry({ activeScans: 0, scanProgress: 0 });
      showToast('❌', 'Intelligence scan failed.');
      addLog('❌ ERROR: Operational core aborted scan process.');
    }
  };

  const resetIntelScan = () => {
    clearIntelligence();
    setLogs(['[SYS] OS terminal flushed.', '[SYS] Channels cleared and ready.']);
    showToast('✓', 'Intelligence data reset');
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4 shadow-[0_0_15px_rgba(224,40,64,0.05)] relative overflow-hidden">
      
      {/* Telemetry panel */}
      <div className="flex flex-col gap-2">
        <div className="text-[0.62rem] font-bold text-cyber-ash2 tracking-wider uppercase flex justify-between items-center">
          <span>Active Telemetry Matrix</span>
          <span className="text-cyber-red animate-pulse text-[0.55rem]">● ONLINE</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-[0.58rem] text-cyber-ash2">COMPLETED RUNS</span>
            <span className="font-display text-xl font-bold text-[#00ffcc]">{telemetry.completedScans}</span>
          </div>
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-[0.58rem] text-cyber-ash2">TOTAL INTEL FINDINGS</span>
            <span className="font-display text-xl font-bold text-cyber-purple">{telemetry.totalFindings}</span>
          </div>
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-[0.58rem] text-cyber-ash2">CRITICAL EXPOSURES</span>
            <span className="font-display text-xl font-bold text-cyber-red">{telemetry.criticalFindings}</span>
          </div>
          <div className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex flex-col justify-between">
            <span className="text-[0.58rem] text-cyber-ash2">LOADED PLUGINS</span>
            <span className="font-display text-xl font-bold text-cyber-green">{telemetry.modulesLoaded}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5">
          <div className="flex justify-between text-[0.55rem] text-cyber-ash2 mb-1.5 font-mono">
            <span>EXTRACTION RATIO</span>
            <span>{telemetry.scanProgress}%</span>
          </div>
          <div className="w-full bg-cyber-bg border border-cyber-border h-2 rounded overflow-hidden p-0.5">
            <div 
              className="bg-cyber-red h-full rounded transition-all duration-300 shadow-[0_0_8px_var(--red)]"
              style={{ width: `${telemetry.scanProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terminal log panel */}
      <div className="flex flex-col gap-2 bg-cyber-bg border border-cyber-border p-3 rounded h-40 lg:h-auto overflow-hidden">
        <div className="text-[0.62rem] font-bold text-cyber-ash2 tracking-wider uppercase border-b border-cyber-border pb-1.5 mb-1 flex justify-between items-center font-mono">
          <span>THREAT & TELEMETRY STREAM</span>
          <span className="text-cyber-ash3">TTY/0</span>
        </div>
        <div className="flex-1 overflow-y-auto font-mono text-[0.62rem] text-[#00ffcc] leading-relaxed pr-1 space-y-1.5 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className="whitespace-pre-wrap select-text break-all border-l-2 border-transparent hover:border-cyber-red/30 pl-1">
              {log}
            </div>
          ))}
          <div ref={terminalEndRef}></div>
        </div>
      </div>

      {/* Quick Launch Control panel */}
      <div className="flex flex-col justify-between gap-3 p-1">
        <div className="flex flex-col gap-1.5">
          <div className="text-[0.62rem] font-bold text-cyber-ash2 tracking-wider uppercase">
            Operational Cyber Command
          </div>
          <p className="text-[0.58rem] text-cyber-ash">
            Activate the intelligence sub-systems in current <strong>{operationMode.toUpperCase()}</strong> mode. Reconstructs site profiles and structures.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <button
            onClick={runIntelScan}
            disabled={scanPhase !== 'idle' && scanPhase !== 'complete'}
            className={`flex-1 py-3 px-4 rounded font-display text-[0.62rem] font-black tracking-widest uppercase cursor-pointer border text-white transition-all duration-200 ${
              scanPhase !== 'idle' && scanPhase !== 'complete'
                ? 'bg-cyber-surface2 border-cyber-border text-cyber-ash2 pointer-events-none'
                : 'bg-cyber-red border-cyber-red hover:bg-cyber-red-hi shadow-[0_0_12px_rgba(224,40,64,0.35)] active:scale-[0.97]'
            }`}
          >
            {scanPhase === 'idle' || scanPhase === 'complete' ? '📡 Launch Intel Scan' : '⚡ Extracting...'}
          </button>
          
          <button
            onClick={resetIntelScan}
            className="py-3 px-4 rounded font-display text-[0.62rem] font-black tracking-widest uppercase cursor-pointer bg-transparent border border-cyber-border hover:border-cyber-red text-cyber-ash hover:text-white transition-all duration-200 active:scale-[0.97]"
          >
            Reset OS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
