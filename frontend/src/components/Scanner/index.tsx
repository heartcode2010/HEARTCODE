import React, { useState } from 'react';
import { ArrowUpRight, ScanLine, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

interface ScannerProps {
  onTriggerScan: (type: 'vuln' | 'ai' | 'tech') => void;
}

export const Scanner = ({ onTriggerScan }: ScannerProps) => {
  const {
    url,
    setUrl,
    scanId,
    setScanResult,
    setStatus,
    clearScan,
    setPasteOpen,
    showToast,
  } = useScanStore();

  const [inputUrl, setInputUrl] = useState(url);
  const [inspecting, setInspecting] = useState(false);

  const handleInspect = async (targetUrl = inputUrl) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      showToast('⚠️', 'Please enter a target URL');
      return;
    }

    setInputUrl(cleanUrl);
    setUrl(cleanUrl);
    setInspecting(true);
    setStatus('working', 'Connecting…');
    clearScan();

    try {
      const res = await api.post('/scans/inspect', { url: cleanUrl });
      if (res.data?.success) {
        setScanResult(res.data.scan);
        setStatus('ok', 'Loaded');
        showToast('✓', 'Source loaded — choose your next analysis');
      }
    } catch (err: any) {
      setStatus('fail', 'Failed');
      showToast('⚠️', err.response?.data?.message || 'CORS block or target link failed.');
    } finally {
      setInspecting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInspect();
  };

  const handleClearInput = () => {
    setInputUrl('');
    setUrl('');
    clearScan();
    setStatus('idle', 'Ready');
  };

  const handleChipClick = (domain: string) => {
    setInputUrl(domain);
    handleInspect(domain);
  };

  const isReady = !!scanId;

  return (
    <section className="border-b border-white/10 bg-slate-950/70 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="surface-card-soft flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="max-w-2xl">
            <div className="section-title mb-2">Target workspace</div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Inspect a domain with clarity and control.</h2>
            <p className="mt-2 text-sm text-slate-400">Load a target, inspect the surface, and move into the right analysis path in seconds.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200">
            <Sparkles size={14} />
            Premium analysis flow
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.8fr_0.9fr]">
          <div className="surface-card p-4 sm:p-5">
            <div className="input-shell">
              <div className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-200">https://</div>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (scanId) {
                    clearScan();
                    setStatus('idle', 'Ready');
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="example.com"
                disabled={inspecting}
                spellCheck="false"
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              {inputUrl && (
                <button onClick={handleClearInput} className="text-slate-400 transition hover:text-white" aria-label="Clear input">
                  ✕
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleInspect()}
                disabled={inspecting}
                className="btn-primary h-12 px-4 text-sm sm:flex-1"
              >
                <ScanLine size={16} />
                {inspecting ? 'Inspecting…' : 'Inspect domain'}
              </button>
              <button
                type="button"
                onClick={() => setPasteOpen(true)}
                className="btn-secondary h-12 px-4 text-sm"
              >
                <Wand2 size={16} /> Paste source
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['github.com', 'wikipedia.org', 'reddit.com'].map((item) => (
                <button key={item} onClick={() => handleChipClick(item)} className="pill transition hover:border-indigo-400/40 hover:text-indigo-200">
                  {item}
                </button>
              ))}
              <button onClick={() => handleChipClick('demo.testfire.net')} className="pill border-rose-400/20 text-rose-300 transition hover:border-rose-400/40 hover:text-rose-200">⚠ demo.testfire.net</button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Find issues', description: 'Review the main weaknesses and remediation paths.', icon: ShieldCheck, active: isReady, tone: 'from-rose-500/20 to-rose-500/5', onClick: () => onTriggerScan('vuln') },
              { title: 'Review patterns', description: 'Surface structural signals and composition cues.', icon: Sparkles, active: isReady, tone: 'from-emerald-500/20 to-emerald-500/5', onClick: () => onTriggerScan('ai') },
              { title: 'Inspect stack', description: 'Reveal the underlying platform and supporting services.', icon: ArrowUpRight, active: isReady, tone: 'from-cyan-500/20 to-cyan-500/5', onClick: () => onTriggerScan('tech') },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  disabled={!item.active}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${item.active ? 'border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/10' : 'cursor-not-allowed border-white/5 bg-white/3 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl bg-gradient-to-br ${item.tone} p-2`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.description}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;
