import React from 'react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

export const TechStackPanel: React.FC = () => {
  const { scanId, techStack, setTechStack, showToast, setStatus } = useScanStore();
  const [scanning, setScanning] = React.useState(false);
  const [steps, setSteps] = React.useState<{ text: string; done: boolean }[]>([]);

  const SCAN_STEPS = [
    'Parsing HTML meta tags…',
    'Checking generator signatures…',
    'Detecting frontend frameworks…',
    'Scanning CSS libraries…',
    'Fingerprinting JS bundles…',
    'Checking analytics trackers…',
    'Detecting CDN patterns…',
    'Identifying build tools…',
    'Correlating stack signals…',
  ];

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleDetect = async () => {
    if (!scanId || scanning) return;
    setScanning(true);
    setSteps([]);
    setStatus('working', 'Detecting tech…');

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
        setStatus('ok', 'Tech Stack Done');
        showToast('🔬', `Detected ${res.data.techStack.length} technologies`);
      }
    } catch (err: any) {
      setStatus('fail', 'Tech detect failed');
      showToast('⚠️', err.response?.data?.message || 'Tech detection failed');
    } finally {
      setScanning(false);
      setSteps([]);
    }
  };

  // Group by category
  const groupedStack = techStack.reduce<Record<string, typeof techStack>>((acc, tech) => {
    if (!acc[tech.cat]) acc[tech.cat] = [];
    acc[tech.cat].push(tech);
    return acc;
  }, {});

  return (
    <div
      className="aidet-panel w-[300px] min-w-[240px] max-w-[340px] flex flex-col flex-shrink-0 bg-cyber-bg2"
      style={{ borderLeft: '1px solid rgba(34,170,255,0.2)' }}
    >
      {/* Header */}
      <div
        className="aidet-panel-header bg-cyber-surface px-4 py-2.5 flex items-center justify-between flex-shrink-0 gap-2.5"
        style={{ borderBottom: '1px solid rgba(34,170,255,0.22)' }}
      >
        <div className="aidet-title font-display text-[0.6rem] font-bold tracking-[0.2em] text-[#22aaff] uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22aaff] shadow-[0_0_7px_#22aaff] animate-[blink_0.8s_infinite]" />
          Technology Stack
        </div>
        {scanId && (
          <button
            onClick={handleDetect}
            disabled={scanning}
            className={`text-[0.62rem] font-mono px-2.5 py-1 rounded border transition-all duration-200 cursor-pointer
              ${scanning
                ? 'border-[#22aaff] text-[#22aaff] bg-[rgba(34,170,255,0.08)] opacity-70 pointer-events-none'
                : 'border-[rgba(34,170,255,0.4)] text-[#22aaff] hover:bg-[rgba(34,170,255,0.12)] hover:border-[#22aaff]'
              }`}
          >
            {scanning ? 'Scanning…' : techStack.length > 0 ? 'Re-Scan' : 'Detect'}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="aidet-scroll flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">

        {/* Idle */}
        {!scanId && !scanning && techStack.length === 0 && (
          <div className="aidet-idle flex flex-col items-center justify-center gap-3 py-10 text-center flex-1">
            <div className="text-4xl opacity-15" style={{ animation: 'float 5s ease-in-out infinite' }}>🔬</div>
            <div className="text-[0.78rem] text-cyber-ash3 leading-[1.7]">
              Load a target page, then click<br />
              <strong className="text-cyber-ash2">Detect Technology Stack</strong><br />
              to fingerprint what it's built with.
            </div>
          </div>
        )}

        {/* Scanning steps */}
        {scanning && steps.length > 0 && (
          <div className="flex flex-col gap-2 py-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`font-mono text-[0.72rem] leading-[1.8] flex items-center gap-2 ${step.done ? 'text-[#22aaff]' : 'text-cyber-ash2'}`}
                style={{ opacity: 0, animation: 'fi 0.12s forwards' }}
              >
                <span className="text-[0.66rem] text-[#22aaff]">
                  {step.done ? '[✓]' : '[~]'}
                </span>
                {step.text}
              </div>
            ))}
          </div>
        )}

        {/* Results grouped by category */}
        {!scanning && techStack.length > 0 && (
          <div className="flex flex-col gap-3">
            {Object.entries(groupedStack).map(([category, items]) => (
              <div key={category}>
                <div className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[rgba(34,170,255,0.5)] mb-1.5 font-semibold">{category}</div>
                <div className="flex flex-col gap-1.5">
                  {items.map((tech, i) => (
                    <div
                      key={i}
                      className="bg-cyber-surface border border-cyber-border rounded p-2.5 flex items-start gap-2.5"
                    >
                      <span className="text-[1rem] flex-shrink-0 leading-none mt-0.5">{tech.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.78rem] font-semibold text-[#22aaff] leading-tight">{tech.name}</div>
                        {tech.evidence && (
                          <div className="font-mono text-[0.62rem] text-cyber-ash3 mt-0.5 leading-[1.5] break-all">
                            {tech.evidence.substring(0, 80)}{tech.evidence.length > 80 ? '…' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total count */}
            <div className="mt-1 px-3 py-2 bg-[rgba(34,170,255,0.07)] border border-[rgba(34,170,255,0.2)] rounded text-center">
              <span className="font-mono text-[0.66rem] text-[#22aaff]">
                {techStack.length} technolog{techStack.length === 1 ? 'y' : 'ies'} detected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackPanel;
