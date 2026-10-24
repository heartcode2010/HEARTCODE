import React from 'react';
import { AlertCircle, ScanLine, Sparkles } from 'lucide-react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

export const AIDetectionPanel: React.FC = () => {
  const { scanId, aiAnalysis, setFindings, findings, showToast, setStatus } = useScanStore();
  const [scanning, setScanning] = React.useState(false);
  const [steps, setSteps] = React.useState<{ text: string; done: boolean }[]>([]);

  const SCAN_STEPS = [
    'Reviewing structure and naming patterns…',
    'Checking template and component signatures…',
    'Comparing against common surface patterns…',
    'Collating the final signal summary…',
  ];

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleDetect = async () => {
    if (!scanId || scanning) return;
    setScanning(true);
    setSteps([]);
    setStatus('working', 'Reviewing patterns…');

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
        setStatus('ok', 'Pattern review complete');
        showToast('•', `Pattern review finished at ${res.data.aiAnalysis.score}%`);
      }
    } catch (err: any) {
      setStatus('fail', 'Pattern review failed');
      showToast('•', err.response?.data?.message || 'The review could not be completed.');
    } finally {
      setScanning(false);
      setSteps([]);
    }
  };

  const scoreClass = !aiAnalysis ? '' : aiAnalysis.score >= 65 ? 'high' : aiAnalysis.score >= 35 ? 'med' : 'low';
  const scoreLabel = !aiAnalysis ? '' : aiAnalysis.score >= 65 ? 'Strong pattern signals' : aiAnalysis.score >= 35 ? 'Mixed signals' : 'Mostly natural structure';
  const scoreSub = !aiAnalysis ? '' : aiAnalysis.score >= 65 ? 'The page shows a strong collection of patterned, templated cues.' : aiAnalysis.score >= 35 ? 'There are a few visible patterns, though the result is not conclusive.' : 'The structure reads as more intentionally crafted than templated.';

  return (
    <div className="flex min-w-[280px] max-w-[340px] flex-col border-l border-white/10 bg-slate-950/70">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="section-title">Patterns</div>
            <h3 className="mt-1 text-base font-semibold text-white">A calm read on what the page is doing</h3>
            <p className="mt-1 text-sm text-slate-400">A lightweight review of structural and stylistic signals.</p>
          </div>
          {scanId && (
            <button onClick={handleDetect} disabled={scanning} className="btn-secondary h-9 px-3 text-xs">
              {scanning ? 'Reviewing…' : aiAnalysis ? 'Re-check' : 'Review'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {!scanId && !scanning && !aiAnalysis && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/10 bg-white/4 px-5 py-10 text-center">
            <div className="rounded-full bg-white/5 p-3 text-slate-300"><ScanLine size={20} /></div>
            <div className="text-sm leading-6 text-slate-400">Load a target and run a review to see the page’s dominant patterns.</div>
          </div>
        )}

        {scanning && steps.length > 0 && (
          <div className="space-y-2 rounded-[24px] border border-white/10 bg-white/5 p-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                <span className={step.done ? 'text-emerald-300' : 'text-slate-500'}>•</span>
                {step.text}
              </div>
            ))}
          </div>
        )}

        {!scanning && aiAnalysis && (
          <div className="rounded-[24px] border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-4 text-center">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] ${scoreClass === 'high' ? 'border-rose-400/20 bg-rose-500/10' : scoreClass === 'med' ? 'border-amber-400/20 bg-amber-500/10' : 'border-emerald-400/20 bg-emerald-500/10'}`}>
                <span className={`text-2xl font-semibold ${scoreClass === 'high' ? 'text-rose-200' : scoreClass === 'med' ? 'text-amber-200' : 'text-emerald-200'}`}>{aiAnalysis.score}</span>
              </div>
              <div className={`mt-3 text-sm font-semibold ${scoreClass === 'high' ? 'text-rose-200' : scoreClass === 'med' ? 'text-amber-200' : 'text-emerald-200'}`}>{scoreLabel}</div>
              <div className="mt-2 text-sm text-slate-400">{scoreSub}</div>
            </div>

            {aiAnalysis.signals && aiAnalysis.signals.length > 0 && (
              <div className="space-y-2 p-4">
                {aiAnalysis.signals.map((signal, index) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 rounded-full bg-white/5 p-1.5 text-slate-300"><Sparkles size={13} /></div>
                        <div>
                          <div className="font-medium text-white">{signal.label}</div>
                          <div className="mt-1 text-sm text-slate-400">{signal.fired ? 'Observed' : 'Not strongly observed'}</div>
                        </div>
                      </div>
                      <div className={`rounded-full px-2 py-1 text-xs ${signal.fired ? 'bg-rose-500/10 text-rose-200' : 'bg-emerald-500/10 text-emerald-200'}`}>{signal.weight}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiAnalysis.tools && aiAnalysis.tools.length > 0 && (
              <div className="border-t border-white/10 p-4">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Detected tools</div>
                <div className="mt-2 text-sm text-slate-300">{aiAnalysis.tools.join(', ')}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDetectionPanel;
