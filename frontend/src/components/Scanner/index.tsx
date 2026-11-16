import React, { useState } from 'react';
import { ScanLine, ShieldCheck, Sparkles, Wand2, Layers, Search, X } from 'lucide-react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';
import { runClientSideAnalysis } from '../../services/clientAnalysisEngine';

interface ScannerProps {
  onTriggerScan?: (type: 'vuln' | 'ai' | 'tech') => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onTriggerScan }) => {
  const {
    url,
    setUrl,
    scanId,
    setScanResult,
    setStatus,
    clearScan,
    setPasteOpen,
    showToast,
    setFindings,
    setTechStack,
  } = useScanStore();

  const [inputUrl, setInputUrl] = useState(url);
  const [inspecting, setInspecting] = useState(false);

  // Multi-proxy fetch fallback matching user template
  const fetchWithProxy = async (targetUrl: string): Promise<string> => {
    const proxies = [
      async (u: string) => {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 8000);
        try {
          const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, { signal: ctrl.signal });
          const j = await r.json();
          if (!j.contents) throw new Error('Empty response');
          return j.contents;
        } finally { clearTimeout(tid); }
      },
      async (u: string) => {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 8000);
        try {
          const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(u)}`, { signal: ctrl.signal });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return await r.text();
        } finally { clearTimeout(tid); }
      },
      async (u: string) => {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 8000);
        try {
          const r = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`, { signal: ctrl.signal });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return await r.text();
        } finally { clearTimeout(tid); }
      },
    ];

    let lastErr = null;
    for (const proxy of proxies) {
      try {
        const html = await proxy(targetUrl);
        if (html && html.trim().length > 30) return html;
      } catch (e) {
        lastErr = e;
      }
    }
    throw new Error(lastErr ? (lastErr as any).message : 'All proxies failed — site may block external CORS access.');
  };

  const handleInspect = async (targetUrl = inputUrl) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      showToast('⚠️', 'Please enter a target URL');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setInputUrl(cleanUrl);
    setUrl(cleanUrl);
    setInspecting(true);
    setStatus('working', 'Connecting to target…');
    clearScan();

    let html = '';

    // First try backend API endpoint
    try {
      const res = await api.post('/scans/inspect', { url: cleanUrl });
      if (res.data?.success && res.data.scan) {
        html = res.data.scan.htmlSource || '';
        setScanResult(res.data.scan);
      }
    } catch (backendErr) {
      console.warn('Backend inspect attempt failed, falling back to direct multi-proxy client inspection...', backendErr);
    }

    // If backend didn't return HTML, try multi-proxy fallback directly in browser
    if (!html) {
      try {
        html = await fetchWithProxy(cleanUrl);
        const kb = new Blob([html]).size / 1024;
        const sizeStr = kb >= 100 ? `${Math.round(kb)} KB` : `${kb.toFixed(1)} KB`;
        const linesCount = html.split('\n').length;
        const tags = (html.match(/<[a-zA-Z]/g) || []).length;
        const scripts = (html.match(/<script/gi) || []).length;
        const styles = (html.match(/<style|<link[^>]+stylesheet/gi) || []).length;
        const images = (html.match(/<img/gi) || []).length;

        setScanResult({
          id: `scan-${Date.now()}`,
          url: cleanUrl,
          htmlSource: html,
          size: sizeStr,
          lines: linesCount,
          tagsCount: tags,
          scriptsCount: scripts,
          stylesCount: styles,
          imagesCount: images,
          status: 'completed',
          createdAt: new Date().toISOString(),
        } as any);
      } catch (proxyErr: any) {
        setStatus('fail', 'Failed to fetch source');
        showToast('⚠️', proxyErr.message || 'CORS proxy failed. Use "Paste Source" to inspect manually.');
        setInspecting(false);
        return;
      }
    }

    // Save to history in localStorage
    try {
      const historyKey = 'coded_scan_history';
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const filtered = existing.filter((e: any) => e.url !== cleanUrl);
      filtered.unshift({
        url: cleanUrl,
        time: Date.now(),
        size: `${Math.round(html.length / 1024)} KB`,
        lines: html.split('\n').length,
      });
      localStorage.setItem(historyKey, JSON.stringify(filtered.slice(0, 15)));
    } catch (e) {}

    // Auto-run local client-side analysis so all panels immediately have full deep intelligence
    const clientAnalysis = runClientSideAnalysis(html, cleanUrl);
    setFindings(clientAnalysis.findings as any, clientAnalysis.aiAnalysis as any);
    setTechStack(clientAnalysis.techStack as any);

    setStatus('ok', 'Target Loaded');
    showToast('✓', 'Source code loaded — launch analysis below');
    setInspecting(false);
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
    <section className="search-zone bg-gradient-to-b from-[#141416] to-[#0f0f10] border-b border-[#5a1e28] px-4 py-5 sm:px-6 lg:px-8 flex flex-col gap-3 flex-shrink-0">
      <div className="mx-auto flex max-w-7xl w-full flex-col gap-3">
        <div className="search-label text-[0.68rem] font-semibold text-[#6e6868] uppercase tracking-[0.12em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e02840] shadow-[0_0_6px_#e02840]" />
          Target URL
        </div>

        {/* URL Input Row */}
        <div className="search-row flex gap-2.5 items-stretch w-full">
          <div className="url-wrap flex-1 min-w-0 flex items-center bg-[#0a0a0b] border-[1.5px] border-[#5a1e28] focus-within:border-[#e02840] focus-within:shadow-[0_0_0_3px_rgba(224,40,64,0.13)] rounded-lg overflow-hidden transition-all">
            <div className="url-scheme px-3 font-mono text-[0.75rem] font-medium text-[#e02840] bg-[#e02840]/15 border-r border-[#5a1e28] h-full flex items-center select-none tracking-wider">
              https://
            </div>
            <input
              type="url"
              value={inputUrl.replace(/^https?:\/\//, '')}
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
              autoComplete="off"
              className="url-input flex-1 bg-transparent border-none outline-none px-3 py-3 font-mono text-[0.88rem] text-[#e8e2e2] caret-[#e02840] min-w-0 placeholder:text-[#3e3838]"
            />
            {inputUrl && (
              <button
                onClick={handleClearInput}
                className="url-clear px-3 text-[#3e3838] hover:text-[#b0a8a8] cursor-pointer flex items-center transition-colors"
                aria-label="Clear URL"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => handleInspect()}
            disabled={inspecting}
            className="inspect-btn bg-[#e02840] hover:bg-[#ff3d55] text-white border-none rounded-lg px-6 font-display text-[0.62rem] font-bold tracking-[0.2em] uppercase cursor-pointer min-h-[48px] whitespace-nowrap flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(224,40,64,0.3)] hover:shadow-[0_0_28px_rgba(224,40,64,0.5)] active:scale-[0.97] transition-all disabled:opacity-55 disabled:pointer-events-none"
          >
            <Search size={14} className={inspecting ? 'animate-spin' : ''} />
            {inspecting ? 'Inspecting…' : 'Inspect'}
          </button>
        </div>

        {/* Scan Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full mt-1">
          {/* Purple Vuln Scan */}
          <button
            onClick={() => onTriggerScan?.('vuln')}
            disabled={!isReady}
            className={`w-full rounded-lg px-5 py-3 font-display text-[0.62rem] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 min-h-[44px] transition-all cursor-pointer select-none ${
              isReady
                ? 'bg-[#7c3aed] hover:bg-[#9d5cf0] border border-[#9d5cf0] text-white shadow-[0_0_18px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] active:scale-[0.98] animate-[pulse_2s_infinite]'
                : 'bg-[#1c1c1f] border border-[#3a3535] text-[#3a3535] opacity-50 cursor-not-allowed'
            }`}
          >
            <ShieldCheck size={15} />
            <span>{isReady ? '⚡ Run Vulnerability Scan' : 'Run Vulnerability Scan — Load Source First'}</span>
          </button>

          {/* Green AI Detector */}
          <button
            onClick={() => onTriggerScan?.('ai')}
            disabled={!isReady}
            className={`w-full rounded-lg px-5 py-3 font-display text-[0.62rem] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 min-h-[44px] transition-all cursor-pointer select-none ${
              isReady
                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-[#00c896] text-[#00ffcc] shadow-[0_0_24px_rgba(0,200,150,0.35)] hover:shadow-[0_0_32px_rgba(0,200,150,0.5)] active:scale-[0.98]'
                : 'bg-[#1c1c1f] border border-[#3a3535] text-[#3a3535] opacity-50 cursor-not-allowed'
            }`}
          >
            <Sparkles size={15} />
            <span>{isReady ? '🤖 Detect AI Generation' : 'Detect AI Generation — Load Source First'}</span>
          </button>

          {/* Blue Tech Stack */}
          <button
            onClick={() => onTriggerScan?.('tech')}
            disabled={!isReady}
            className={`w-full rounded-lg px-5 py-3 font-display text-[0.62rem] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 min-h-[44px] transition-all cursor-pointer select-none ${
              isReady
                ? 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-[#22aaff] text-[#22aaff] shadow-[0_0_18px_rgba(34,170,255,0.25)] hover:shadow-[0_0_28px_rgba(34,170,255,0.4)] active:scale-[0.98]'
                : 'bg-[#1c1c1f] border border-[#3a3535] text-[#3a3535] opacity-50 cursor-not-allowed'
            }`}
          >
            <Layers size={15} />
            <span>{isReady ? '🔬 Detect Technology Stack' : 'Detect Tech Stack — Load Source First'}</span>
          </button>
        </div>

        {/* Quick Targets Chips */}
        <div className="quick-row flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="quick-lbl text-[0.68rem] text-[#3e3838] font-mono">Quick targets:</span>
          {['github.com', 'wikipedia.org', 'reddit.com'].map((item) => (
            <button
              key={item}
              onClick={() => handleChipClick(item)}
              className="chip bg-[#1c1c1f] hover:bg-[#e02840]/15 border border-[#2a2a2e] hover:border-[#e02840] rounded-full px-3 py-1 font-mono text-[0.7rem] text-[#6e6868] hover:text-[#e02840] transition-all cursor-pointer"
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => handleChipClick('demo.testfire.net')}
            className="chip chip--vuln bg-[#e02840]/10 hover:bg-[#e02840]/25 border border-[#e02840]/40 rounded-full px-3 py-1 font-mono text-[0.7rem] text-[#ff3d55] transition-all cursor-pointer"
            title="Intentionally vulnerable test site"
          >
            ⚠ demo.testfire.net
          </button>
          <button
            onClick={() => handleChipClick('neverssl.com')}
            className="chip chip--vuln bg-[#e02840]/10 hover:bg-[#e02840]/25 border border-[#e02840]/40 rounded-full px-3 py-1 font-mono text-[0.7rem] text-[#ff3d55] transition-all cursor-pointer"
            title="Unencrypted HTTP test site"
          >
            ⚠ neverssl.com
          </button>
        </div>
      </div>
    </section>
  );
};

export default Scanner;
