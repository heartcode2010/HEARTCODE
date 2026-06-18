import React, { useState } from 'react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. History Modal
export const HistoryModal = ({ isOpen, onClose }: ModalProps) => {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const setScanResult = useScanStore((state) => state.setScanResult);
  const setStatus = useScanStore((state) => state.setStatus);
  const showToast = useScanStore((state) => state.showToast);

  React.useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scans/history');
      if (res.data?.success) {
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await api.delete('/scans/history');
      if (res.data?.success) {
        setHistoryList([]);
        showToast('🗑', 'History cleared');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReload = async (scanId: string) => {
    onClose();
    setStatus('working', 'Connecting…');
    showToast('👁', 'Reloading target source...');
    try {
      const res = await api.get(`/scans/${scanId}/source`);
      if (res.data?.success) {
        setScanResult(res.data.scan);
        setStatus('ok', 'Loaded');
        showToast('✓', 'Target loaded from history');
      }
    } catch (err) {
      setStatus('fail', 'Failed');
      showToast('⚠️', 'Failed to load source code.');
    }
  };

  const getRelativeTime = (timeStr: string) => {
    const diff = Date.now() - new Date(timeStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-[5px] flex items-end justify-center sm:items-center sm:p-5" onClick={onClose}>
      <div 
        className="bg-cyber-surface border border-cyber-border-red rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[84vh] sm:max-h-[78vh] flex flex-col overflow-hidden animate-[sheet-up_0.25s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[sheet-sc_0.2s_ease-out] shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[38px] h-1 bg-cyber-border-red rounded-[2px] mx-auto mt-3 flex-shrink-0 sm:hidden" />
        <div className="px-5 py-4.5 flex items-center justify-between border-b border-cyber-border flex-shrink-0">
          <div>
            <div className="text-sm font-semibold text-white">Scan History</div>
            <div className="text-[0.74rem] text-cyber-ash2 mt-0.5">Last 15 inspected targets — click any to reload</div>
          </div>
          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button 
                onClick={handleClearAll} 
                className="bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red px-3 py-1.5 rounded text-[0.72rem] text-cyber-red font-mono cursor-pointer transition-all duration-150"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={onClose} 
              className="bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red px-3.5 py-1.5 rounded text-[0.78rem] text-cyber-ash flex items-center gap-1.5 font-sans cursor-pointer transition-all duration-150"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 min-h-0">
          {loading ? (
            <div className="text-center text-cyber-ash2 font-mono py-8 animate-pulse text-xs">CONNECTING RECORD BANK...</div>
          ) : historyList.length === 0 ? (
            <div className="text-center text-cyber-ash2 py-8 font-mono text-xs">
              No scan history yet.<br /><span className="text-[0.72rem] text-cyber-ash3">Inspected URLs will appear here.</span>
            </div>
          ) : (
            historyList.map((entry) => (
              <button
                key={entry._id}
                onClick={() => handleReload(entry._id)}
                className="w-full bg-cyber-bg hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red rounded p-3 text-left cursor-pointer flex items-center gap-3 transition-all duration-150"
              >
                <div className="w-8 h-8 rounded bg-cyber-red-dim border border-cyber-border-red flex items-center justify-center flex-shrink-0 text-sm">🔍</div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[0.76rem] text-white truncate">{entry.url.replace(/^https?:\/\//, '')}</div>
                  <div className="text-[0.66rem] text-cyber-ash2 mt-0.5 flex gap-2.5 font-mono">
                    <span>{getRelativeTime(entry.createdAt)}</span>
                    {entry.size && <span>{entry.size}</span>}
                    {entry.lines && <span>{entry.lines} lines</span>}
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2.2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Paste Modal
export const PasteModal = ({ isOpen, onClose }: ModalProps) => {
  const [pasteText, setPasteText] = useState('');
  const setScanResult = useScanStore((state) => state.setScanResult);
  const setStatus = useScanStore((state) => state.setStatus);
  const showToast = useScanStore((state) => state.showToast);

  const handleLoad = async () => {
    const text = pasteText.trim();
    if (!text) {
      showToast('⚠️', 'Paste something first');
      return;
    }

    onClose();
    setPasteText('');
    setStatus('working', 'Connecting…');
    showToast('👁', 'Registering manual upload...');

    try {
      const inspectRes = await api.post('/scans/inspect', { url: 'manual-paste-upload.html', html: text });
      if (inspectRes.data?.success) {
        setScanResult(inspectRes.data.scan);
        setStatus('ok', 'Loaded');
        showToast('✓', 'Source loaded from clipboard');
      }
    } catch (err: any) {
      setStatus('fail', 'Failed');
      showToast('⚠️', err.response?.data?.message || 'Error processing source upload.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-[5px] flex items-end justify-center sm:items-center sm:p-5" onClick={onClose}>
      <div 
        className="bg-cyber-surface border border-cyber-border-red rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[84vh] sm:max-h-[78vh] flex flex-col overflow-hidden animate-[sheet-up_0.25s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[sheet-sc_0.2s_ease-out] shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[38px] h-1 bg-cyber-border-red rounded-[2px] mx-auto mt-3 flex-shrink-0 sm:hidden" />
        <div className="px-5 py-4 flex items-center justify-between border-b border-cyber-border flex-shrink-0">
          <div>
            <div className="text-sm font-semibold text-white">Paste HTML Source</div>
            <div className="text-[0.74rem] text-cyber-ash2 mt-0.5">Manually paste source code when CORS proxies are blocked</div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red px-3.5 py-1.5 rounded text-[0.78rem] text-cyber-ash flex items-center gap-1.5 font-sans cursor-pointer transition-all duration-150"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Close
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-3 min-h-0">
          <div className="text-[0.72rem] text-cyber-ash2 leading-relaxed font-mono">
            In your browser: <strong className="text-cyber-ash">Ctrl+U</strong> (View Source) → Select All → Copy → Paste below.
          </div>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste HTML source here…"
            className="flex-1 min-h-[220px] bg-cyber-bg border border-cyber-border-red focus:border-cyber-red rounded p-3 font-mono text-[0.78rem] text-white outline-none resize-none leading-relaxed"
          />
          <button
            onClick={handleLoad}
            className="bg-cyber-red hover:bg-cyber-red-hi text-white font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase rounded py-3 cursor-pointer transition-all duration-150 active:scale-[0.98]"
          >
            Load Source
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Copy Modal
export const CopyModal = ({ isOpen, onClose }: ModalProps) => {
  const htmlSource = useScanStore((state) => state.htmlSource);
  const activeView = useScanStore((state) => state.activeView);
  const showToast = useScanStore((state) => state.showToast);

  const doCopy = (mode: 'full' | 'visible' | 'text') => {
    let text = '';
    if (mode === 'full') {
      text = htmlSource;
    } else if (mode === 'visible') {
      if (activeView === 'raw') {
        text = htmlSource;
      } else if (activeView === 'highlighted') {
        text = htmlSource; // raw HTML
      } else {
        // text only
        text = htmlSource
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      }
    } else {
      // stripped text only
      text = htmlSource
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    }

    const labels = { full: 'Full source copied', visible: 'View copied', text: 'Text copied' };
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          onClose();
          showToast('✓', labels[mode]);
        })
        .catch(() => {
          fallbackCopy(text);
          onClose();
          showToast('✓', labels[mode]);
        });
    } else {
      fallbackCopy(text);
      onClose();
      showToast('✓', labels[mode]);
    }
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.top = '0';
    ta.style.left = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.error(e);
    }
    document.body.removeChild(ta);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-[5px] flex items-end justify-center sm:items-center sm:p-5" onClick={onClose}>
      <div 
        className="bg-cyber-surface border border-cyber-border-red rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[84vh] sm:max-h-[78vh] flex flex-col overflow-hidden animate-[sheet-up_0.25s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[sheet-sc_0.2s_ease-out] shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[38px] h-1 bg-cyber-border-red rounded-[2px] mx-auto mt-3 flex-shrink-0 sm:hidden" />
        <div className="px-5 py-4 flex items-center justify-between border-b border-cyber-border flex-shrink-0">
          <div>
            <div className="text-sm font-semibold text-white">Copy Source Code</div>
            <div className="text-[0.74rem] text-cyber-ash2 mt-0.5">Choose what to copy to your clipboard</div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red px-3.5 py-1.5 rounded text-[0.78rem] text-cyber-ash flex items-center gap-1.5 font-sans cursor-pointer transition-all duration-150"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Close
          </button>
        </div>

        <div className="p-5 flex-shrink-0">
          <div className="text-[0.66rem] font-semibold uppercase tracking-wider text-cyber-ash3 mb-3">Select an option</div>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => doCopy('full')}
              className="bg-cyber-surface2 hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red rounded p-3 text-center cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(224,40,64,0.15)] flex flex-col items-center gap-2 active:scale-[0.97]"
            >
              <div className="text-2xl">📄</div>
              <div className="text-[0.78rem] font-semibold text-white">Full Source</div>
              <div className="text-[0.66rem] text-cyber-ash2 leading-normal hidden sm:block">Complete raw HTML as received</div>
            </button>
            <button 
              onClick={() => doCopy('visible')}
              className="bg-cyber-surface2 hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red rounded p-3 text-center cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(224,40,64,0.15)] flex flex-col items-center gap-2 active:scale-[0.97]"
            >
              <div className="text-2xl">👁</div>
              <div className="text-[0.78rem] font-semibold text-white">Current View</div>
              <div className="text-[0.66rem] text-cyber-ash2 leading-normal hidden sm:block">What is showing in the viewer</div>
            </button>
            <button 
              onClick={() => doCopy('text')}
              className="bg-cyber-surface2 hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red rounded p-3 text-center cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(224,40,64,0.15)] flex flex-col items-center gap-2 active:scale-[0.97]"
            >
              <div className="text-2xl">🔤</div>
              <div className="text-[0.78rem] font-semibold text-white">Text Only</div>
              <div className="text-[0.66rem] text-cyber-ash2 leading-normal hidden sm:block">Plain text, all tags removed</div>
            </button>
          </div>
        </div>

        <div className="border-t border-cyber-border flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-5 py-2 bg-cyber-surface2 border-b border-cyber-border text-[0.66rem] font-semibold uppercase tracking-wider text-cyber-ash3">
            Preview — first 600 characters
          </div>
          <div className="flex-1 overflow-y-auto p-5 font-mono text-[0.76rem] text-cyber-ash2 leading-relaxed whitespace-pre-wrap break-all select-none">
            {htmlSource ? htmlSource.substring(0, 600) + (htmlSource.length > 600 ? '\n…' : '') : 'No source loaded.'}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. AI Result Modal
export const AiResultModal = ({ isOpen, onClose }: ModalProps) => {
  const scanId = useScanStore((state) => state.scanId);
  const deepReport = useScanStore((state) => state.deepReport);
  const setDeepReport = useScanStore((state) => state.setDeepReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen && scanId && !deepReport) {
      triggerAiAnalysis();
    }
  }, [isOpen, scanId, deepReport]);

  const triggerAiAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const aiDeepRes = await api.post('/api-detection/ai-deep', { scanId });
      if (aiDeepRes.data?.success) {
        setDeepReport(aiDeepRes.data.report || 'No analysis compiled.');
      } else {
        setError('Analysis link returned empty payload.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error executing LLM request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] bg-black/75 backdrop-blur-[5px] flex items-end justify-center sm:items-center sm:p-5" onClick={onClose}>
      <div 
        className="bg-cyber-surface border border-cyber-border-red rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[84vh] sm:max-h-[78vh] flex flex-col overflow-hidden animate-[sheet-up_0.25s_cubic-bezier(0.32,0.72,0,1)] sm:animate-[sheet-sc_0.2s_ease-out] shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[38px] h-1 bg-cyber-border-red rounded-[2px] mx-auto mt-3 flex-shrink-0 sm:hidden" />
        <div className="px-5 py-4 flex items-center justify-between border-b border-cyber-border flex-shrink-0">
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span className="text-cyber-purple">⚡</span> AI Deep Analysis
            </div>
            <div className="text-[0.74rem] text-cyber-ash2 mt-0.5">Claude/Gemini powered client security code audit review</div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red px-3.5 py-1.5 rounded text-[0.78rem] text-cyber-ash flex items-center gap-1.5 font-sans cursor-pointer transition-all duration-150"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Close
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-cyber-bg2 overflow-hidden relative">
          
          {/* Scanline pattern overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(124,58,237,0.03)_2px,rgba(124,58,237,0.03)_4px)] pointer-events-none z-0" />

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 z-10">
              <div className="aisoon-icon text-5xl">❤️⚡</div>
              
              <div className="text-center font-mono">
                <div className="aisoon-text" data-text="COMPILING INTELLIGENCE">COMPILING INTELLIGENCE</div>
                <div className="aisoon-text text-xs text-cyber-purple tracking-[0.4em] mt-1.5" data-text="PLEASE STAND BY">PLEASE STAND BY</div>
              </div>

              <div className="text-xs font-mono text-cyber-ash3 tracking-wider flex items-center gap-1.5">
                <span>[ INJECTING AGENT CONTEXT ]</span>
                <span className="text-cyber-purple animate-pulse">█</span>
              </div>

              <div className="w-full max-w-[280px] flex flex-col gap-1.5">
                <div className="text-[0.58rem] font-mono text-cyber-ash3 tracking-widest text-center uppercase">ANALYSING SINKS</div>
                <div className="w-full h-[3px] bg-cyber-surface3 rounded overflow-hidden">
                  <div className="aisoon-bar-fill w-[87%]" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3 z-10 text-center font-mono">
              <div className="text-3xl">⚠️</div>
              <div className="text-cyber-red text-sm font-semibold">LLM AUDIT EXCEPTION</div>
              <div className="text-xs text-cyber-ash2 max-w-sm leading-relaxed">{error}</div>
              <button 
                onClick={triggerAiAnalysis}
                className="mt-4 px-4 py-2 border border-cyber-border-red hover:border-cyber-red bg-cyber-surface hover:bg-cyber-red-dim text-white text-xs rounded transition-all duration-150"
              >
                RETRY PIPELINE
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 z-10 font-mono text-xs text-cyber-ash leading-relaxed select-text markdown-body">
              {deepReport ? (
                <div className="whitespace-pre-wrap">{deepReport}</div>
              ) : (
                <div className="text-center py-12 text-cyber-ash3">Audit report compiled blank.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export const Modals = () => {
  const { isHistoryOpen, setHistoryOpen, isPasteOpen, setPasteOpen, isCopyOpen, setCopyOpen, isAiOpen, setAiOpen } = useScanStore();
  return (
    <>
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)} />
      <PasteModal isOpen={isPasteOpen} onClose={() => setPasteOpen(false)} />
      <CopyModal isOpen={isCopyOpen} onClose={() => setCopyOpen(false)} />
      <AiResultModal isOpen={isAiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
};

export default Modals;

