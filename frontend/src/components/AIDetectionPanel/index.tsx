import React from 'react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

export const AIDetectionPanel: React.FC = () => {
  const { scanId, aiAnalysis, setFindings, findings, showToast, setStatus } = useScanStore();
  const [scanning, setScanning] = React.useState(false);
  const [steps, setSteps] = React.useState<{ text: string; done: boolean }[]>([]);

  const SCAN_STEPS = [
    'Scanning generator meta tags…',
    'Checking platform fingerprints…',
    'Analysing CSS architecture…',
    'Inspecting script sources…',
    'Detecting inline style density…',
    'Scanning for AI phrase patterns…',
    'Checking CRUD modal patterns…',
    'Analysing localStorage usage…',
    'Scanning for unfilled placeholders…',
    'Inspecting emoji UI patterns…',
    'Checking structural boilerplate…',
    'Correlating all signals…',
  ];

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleDetect = async () => {
    if (!scanId || scanning) return;
    setScanning(true);
    setSteps([]);
    setStatus('working', 'Detecting AI…');

    const stepList: { text: string; done: boolean }[] = [];

    for (const step of SCAN_STEPS) {
      await wait(140 + Math.random() * 100);
      stepList.push({ text: step, done: false });
      setSteps([...stepList]);
      await wait(60);
      stepList[stepList.length - 1].done = true;
      setSteps([...stepList]);
    }

    await wait(200);

    try {
      const res = await api.post('/scans/ai-detect', { scanId });
      if (res.data?.success) {
        useScanStore.getState().setFindings(findings, res.data.aiAnalysis);
        setStatus('ok', 'AI Detect Done');
        showToast('🤖', `AI detection complete — ${res.data.aiAnalysis.score}% confidence`);
      }
    } catch (err: any) {
      setStatus('fail', 'AI detect failed');
      showToast('⚠️', err.response?.data?.message || 'AI detection failed');
    } finally {
      setScanning(false);
      setSteps([]);
    }
  };

  const scoreClass =
    !aiAnalysis ? '' :
    aiAnalysis.score >= 65 ? 'high' :
    aiAnalysis.score >= 35 ? 'med' : 'low';

  const scoreLabel =
    !aiAnalysis ? '' :
    aiAnalysis.score >= 65 ? 'LIKELY AI-GENERATED' :
    aiAnalysis.score >= 35 ? 'POSSIBLY AI-GENERATED' : 'LIKELY HUMAN-WRITTEN';

  const scoreSub =
    !aiAnalysis ? '' :
    aiAnalysis.score >= 65
      ? 'High confidence signals indicate AI construction.'
      : aiAnalysis.score >= 35
      ? 'Some AI patterns detected — mixed signals.'
      : 'Predominantly human-coded patterns detected.';

  return (
    <div className="aidet-panel w-[300px] min-w-[240px] max-w-[340px] flex flex-col flex-shrink-0 bg-cyber-bg2 border-l border-cyber-border">

      {/* Header */}
      <div className="aidet-panel-header bg-cyber-surface border-b border-[rgba(0,200,150,0.22)] px-4 py-2.5 flex items-center justify-between flex-shrink-0 gap-2.5">
        <div className="aidet-title font-display text-[0.6rem] font-bold tracking-[0.2em] text-[#00c896] uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00c896] shadow-[0_0_7px_#00c896] animate-[blink_0.8s_infinite]" />
          AI Generation Detector
        </div>
        {scanId && (
          <button
            onClick={handleDetect}
            disabled={scanning}
            className={`text-[0.62rem] font-mono px-2.5 py-1 rounded border transition-all duration-200 cursor-pointer
              ${scanning
                ? 'border-[#00c896] text-[#00e8ad] bg-[rgba(0,200,150,0.08)] opacity-70 pointer-events-none'
                : 'border-[rgba(0,200,150,0.4)] text-[#00c896] hover:bg-[rgba(0,200,150,0.12)] hover:border-[#00c896]'
              }`}
          >
            {scanning ? 'Scanning…' : aiAnalysis ? 'Re-Detect' : 'Detect'}
          </button>
        )}
      </div>

      {/* Scroll body */}
      <div className="aidet-scroll flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">

        {/* Idle state */}
        {!scanId && !scanning && !aiAnalysis && (
          <div className="aidet-idle flex flex-col items-center justify-center gap-3 py-10 text-center flex-1">
            <div className="text-4xl opacity-15" style={{ animation: 'float 5s ease-in-out infinite' }}>🤖</div>
            <div className="text-[0.78rem] text-cyber-ash3 leading-[1.7]">
              Load a target page, then click<br />
              <strong className="text-cyber-ash2">Detect AI Generation</strong><br />
              to analyse the source.
            </div>
          </div>
        )}

        {/* Scanning steps */}
        {scanning && steps.length > 0 && (
          <div className="aidet-scanning flex flex-col gap-2 py-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`aidet-step font-mono text-[0.72rem] leading-[1.8] flex items-center gap-2 ${step.done ? 'text-[#00e8ad]' : 'text-cyber-ash2'}`}
                style={{ opacity: 0, animation: 'fi 0.12s forwards' }}
              >
                <span className="text-[0.66rem]" style={{ color: '#00c896' }}>
                  {step.done ? '[✓]' : '[~]'}
                </span>
                {step.text}
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!scanning && aiAnalysis && (
          <div className="aidet-verdict bg-cyber-surface border border-cyber-border rounded-lg overflow-hidden">
            {/* Score ring + label */}
            <div className="aidet-verdict-top px-4 pt-4 pb-3.5 flex flex-col items-center gap-2.5 border-b border-cyber-border">
              <div className={`aidet-score-ring w-[88px] h-[88px] rounded-full flex items-center justify-center flex-col border-[3px] bg-cyber-bg relative
                ${scoreClass === 'high' ? 'border-[#ff4466] shadow-[0_0_20px_rgba(255,68,102,0.28)]' :
                  scoreClass === 'med' ? 'border-[#d4920a] shadow-[0_0_20px_rgba(212,146,10,0.25)]' :
                  'border-[#3ecf6e] shadow-[0_0_20px_rgba(62,207,110,0.22)]'}`}
              >
                <span className={`font-display text-[1.5rem] font-black leading-none
                  ${scoreClass === 'high' ? 'text-[#ff4466]' :
                    scoreClass === 'med' ? 'text-[#d4920a]' : 'text-[#3ecf6e]'}`}
                >
                  {aiAnalysis.score}
                </span>
                <span className="font-mono text-[0.56rem] text-cyber-ash3 mt-0.5">% AI</span>
              </div>

              <div className={`font-display text-[0.72rem] font-bold tracking-[0.14em] text-center uppercase
                ${scoreClass === 'high' ? 'text-[#ff4466]' :
                  scoreClass === 'med' ? 'text-[#d4920a]' : 'text-[#3ecf6e]'}`}
              >
                {scoreLabel}
              </div>
              <div className="text-[0.72rem] text-cyber-ash3 text-center leading-[1.6] px-2">{scoreSub}</div>
            </div>

            {/* Signals */}
            {aiAnalysis.signals && aiAnalysis.signals.length > 0 && (
              <div className="aidet-signals px-4 py-2.5 flex flex-col gap-1.5">
                <div className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-cyber-ash3 mb-0.5 font-semibold">Signals</div>
                {aiAnalysis.signals.map((sig, i) => (
                  <div
                    key={i}
                    className={`aidet-sig flex items-start gap-2 px-2.5 py-2 rounded border text-[0.72rem] leading-[1.5]
                      ${sig.fired
                        ? 'border-[rgba(255,68,102,0.3)] bg-[rgba(255,68,102,0.06)] text-cyber-ash2'
                        : 'border-[rgba(62,207,110,0.2)] bg-[rgba(62,207,110,0.04)] text-cyber-ash3'
                      }`}
                  >
                    <span className="text-[0.85rem] flex-shrink-0 mt-0.5">{sig.icon}</span>
                    <span className="flex-1">{sig.label}</span>
                    <span className={`font-mono text-[0.6rem] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5
                      ${sig.fired
                        ? 'text-[#ff4466] bg-[rgba(255,68,102,0.15)]'
                        : 'text-[#3ecf6e] bg-[rgba(62,207,110,0.1)]'
                      }`}
                    >
                      {sig.fired ? `+${sig.weight}` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Detected tools */}
            {aiAnalysis.tools && aiAnalysis.tools.length > 0 && (
              <div className="mx-4 mb-3 p-2.5 bg-[rgba(0,200,150,0.07)] border border-[rgba(0,200,150,0.2)] rounded">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[rgba(0,200,150,0.5)] mb-1 font-semibold">Detected Tools</div>
                <div className="font-mono text-[0.74rem] text-[#00e8ad] leading-[1.6]">
                  {aiAnalysis.tools.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 text-[0.62rem] text-cyber-ash3 leading-[1.5] bg-cyber-bg border-t border-cyber-border flex-shrink-0">
        <b>ℹ Score is probabilistic.</b> High confidence signals increase likelihood — not a definitive verdict.
      </div>
    </div>
  );
};

export default AIDetectionPanel;
