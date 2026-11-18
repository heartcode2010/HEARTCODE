import React from 'react';
import { Cpu, Layers3, ScanLine } from 'lucide-react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

export const TechStackPanel: React.FC = () => {
  const { scanId, techStack, setTechStack, showToast, setStatus } = useScanStore();
  const [scanning, setScanning] = React.useState(false);
  const [steps, setSteps] = React.useState<{ text: string; done: boolean }[]>([]);

  const SCAN_STEPS = [
    'Reviewing meta patterns…',
    'Checking framework signatures…',
    'Inspecting shared libraries…',
    'Mapping analytics and hosting cues…',
    'Building the stack summary…',
  ];

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleDetect = async () => {
    if (!scanId || scanning) return;
    setScanning(true);
    setSteps([]);
    setStatus('working', 'Inspecting stack…');

    const stepList: { text: string; done: boolean }[] = [];

    for (const step of SCAN_STEPS) {
      await wait(130 + Math.random() * 100);
      stepList.push({ text: step, done: false });
      setSteps([...stepList]);
      await wait(60);
      stepList[stepList.length - 1].done = true;
      setSteps([...stepList]);
    }

    await wait(200);

    try {
      const res = await api.post('/scans/tech-stack', { scanId });
      if (res.data?.success) {
        setTechStack(res.data.techStack);
        setStatus('ok', 'Stack review complete');
        showToast('•', `${res.data.techStack.length} stack signals captured`);
      }
    } catch (err: any) {
      setStatus('fail', 'Stack review failed');
      showToast('•', err.response?.data?.message || 'The stack review could not be completed.');
    } finally {
      setScanning(false);
      setSteps([]);
    }
  };

  const groupedStack = techStack.reduce<Record<string, typeof techStack>>((acc, tech) => {
    if (!acc[tech.cat]) acc[tech.cat] = [];
    acc[tech.cat].push(tech);
    return acc;
  }, {});

  return (
    <div className="flex min-w-[280px] max-w-[340px] flex-col border-l border-white/10 bg-slate-950/70">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="section-title">Stack</div>
            <h3 className="mt-1 text-base font-semibold text-white">A clear view of the build</h3>
            <p className="mt-1 text-sm text-slate-400">Frameworks, libraries, and supporting services that shape the experience.</p>
          </div>
          {scanId && (
            <button onClick={handleDetect} disabled={scanning} className="btn-secondary h-9 px-3 text-xs">
              {scanning ? 'Inspecting…' : techStack.length > 0 ? 'Re-check' : 'Inspect'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {!scanId && !scanning && techStack.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/10 bg-white/4 px-5 py-10 text-center">
            <div className="rounded-full bg-white/5 p-3 text-slate-300"><Layers3 size={20} /></div>
            <div className="text-sm leading-6 text-slate-400">Inspect a target and we’ll map the platform beneath the surface.</div>
          </div>
        )}

        {scanning && steps.length > 0 && (
          <div className="space-y-2 rounded-[24px] border border-white/10 bg-white/5 p-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                <span className={step.done ? 'text-cyan-300' : 'text-slate-500'}>•</span>
                {step.text}
              </div>
            ))}
          </div>
        )}

        {!scanning && techStack.length > 0 && (
          <div className="space-y-3">
            {Object.entries(groupedStack).map(([category, items]) => (
              <div key={category} className="rounded-[24px] border border-white/10 bg-white/5 p-3">
                <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{category}</div>
                <div className="space-y-2">
                  {items.map((tech, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 rounded-full bg-cyan-500/10 p-2 text-cyan-300"><Cpu size={14} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-white">{tech.name}</div>
                          {tech.evidence && <div className="mt-1 text-sm text-slate-400">{tech.evidence.substring(0, 90)}{tech.evidence.length > 90 ? '…' : ''}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-center text-sm text-cyan-200">
              {techStack.length} {techStack.length === 1 ? 'signal' : 'signals'} captured
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackPanel;
