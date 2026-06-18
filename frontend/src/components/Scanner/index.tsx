import React, { useState } from 'react';
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
    showToast 
  } = useScanStore();
  
  const [inputUrl, setInputUrl] = useState(url);
  const [inspecting, setInspecting] = useState(false);

  const handleInspect = async (targetUrl = inputUrl) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      showToast('⚠️', 'Please enter a target URL');
      return;
    }
    
    setInputUrl(cleanUrl);
    setUrl(cleanUrl);
    setInspecting(true);
    setStatus('working', 'Connecting…');
    clearScan(); // clear prior scan outcomes

    try {
      const res = await api.post('/scans/inspect', { url: cleanUrl });
      if (res.data?.success) {
        setScanResult(res.data.scan);
        setStatus('ok', 'Loaded');
        showToast('✓', 'Source loaded — hit the purple button to scan');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('fail', 'Failed');
      showToast('⚠️', err.response?.data?.message || 'CORS block or target link failed.');
    } finally {
      setInspecting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInspect();
    }
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
    <div className="search-zone flex flex-col gap-2.5 bg-gradient-to-b from-cyber-surface to-cyber-bg2 border-b border-cyber-border-red p-4.5 sm:px-8 flex-shrink-0">
      <div className="search-label text-[0.68rem] font-semibold text-cyber-ash2 tracking-[0.12em] uppercase flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1 before:h-1 before:rounded-full before:bg-cyber-red before:shadow-[0_0_6px_var(--red)]">
        Target URL
      </div>
      
      <div className="search-row flex gap-2.5 items-stretch">
        <div className="url-wrap flex-1 min-w-0 flex items-center bg-cyber-bg border border-cyber-border-red rounded-lg overflow-hidden transition-all duration-200 focus-within:border-cyber-red focus-within:shadow-[0_0_0_3px_var(--red-dim)]">
          <div className="url-scheme px-3 font-mono text-[0.75rem] font-medium text-cyber-red bg-cyber-red-dim border-r border-cyber-border-red h-full flex items-center flex-shrink-0 select-none tracking-[0.04em]">
            https://
          </div>
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              // Reset if URL changes
              if (scanId) {
                clearScan();
                setStatus('idle', 'Ready');
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="example.com"
            disabled={inspecting}
            spellCheck="false"
            className="flex-1 bg-transparent border-none outline-none px-3 py-3 font-mono text-sm text-white caret-cyber-red min-w-0 placeholder-cyber-ash3"
          />
          {inputUrl && (
            <button
              onClick={handleClearInput}
              title="Clear"
              className="bg-transparent border-none text-cyber-ash3 hover:text-cyber-ash px-3 cursor-pointer flex items-center transition-colors duration-150 flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        
        <button
          onClick={() => handleInspect()}
          disabled={inspecting}
          className={`inspect-btn bg-cyber-red hover:bg-cyber-red-hi text-white border-none rounded-lg px-6 font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase cursor-pointer min-h-12 whitespace-nowrap flex-shrink-0 transition-all duration-150 active:scale-[0.97] shadow-[0_0_18px_rgba(224,40,64,0.3)] flex items-center justify-center gap-2 ${inspecting ? 'opacity-55 pointer-events-none' : ''}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {inspecting ? 'Fetching…' : 'Inspect'}
        </button>
      </div>

      {/* Action Scan Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
        <button
          disabled={!isReady}
          onClick={() => onTriggerScan('vuln')}
          className={`w-full py-3 px-6 rounded-lg border font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase cursor-not-allowed min-h-11 flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden opacity-45 select-none ${isReady ? 'bg-cyber-purple border-cyber-purple hover:bg-cyber-purple/90 text-white cursor-pointer opacity-100 shadow-[0_0_18px_var(--purple-glow)] hover:shadow-[0_0_32px_var(--purple-glow)] active:scale-[0.97]' : 'bg-cyber-surface2 border-cyber-ash3 text-cyber-ash3'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>{isReady ? '⚡ Run Vulnerability Scan' : 'Run Vulnerability Scan — Load Source First'}</span>
        </button>

        <button
          disabled={!isReady}
          onClick={() => onTriggerScan('ai')}
          className={`w-full py-3 px-6 rounded-lg border font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase cursor-not-allowed min-h-11 flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden opacity-45 select-none ${isReady ? 'border-cyber-green! text-cyber-green! bg-cyber-green/8 hover:bg-cyber-green/18 cursor-pointer opacity-100 shadow-[0_0_22px_rgba(46,168,106,0.25)] active:scale-[0.97]' : 'bg-cyber-surface2 border-cyber-ash3 text-cyber-ash3'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
          <span>{isReady ? '🤖 Detect AI Generation' : 'Detect AI Generation — Load Source First'}</span>
        </button>

        <button
          disabled={!isReady}
          onClick={() => onTriggerScan('tech')}
          className={`w-full py-3 px-6 rounded-lg border font-display text-[0.6rem] font-bold tracking-[0.2em] uppercase cursor-not-allowed min-h-11 flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden opacity-45 select-none ${isReady ? 'border-[#22aaff]! text-[#22aaff]! bg-[#22aaff]/8 hover:bg-[#22aaff]/18 cursor-pointer opacity-100 shadow-[0_0_18px_rgba(34,170,255,0.2)] active:scale-[0.97]' : 'bg-cyber-surface2 border-cyber-ash3 text-cyber-ash3'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="3" width="20" height="4" rx="1" />
            <rect x="2" y="10" width="20" height="4" rx="1" />
            <rect x="2" y="17" width="20" height="4" rx="1" />
          </svg>
          <span>{isReady ? '🔬 Detect Technology Stack' : 'Detect Technology Stack — Load Source First'}</span>
        </button>
      </div>

      <div className="quick-row flex items-center gap-2 flex-wrap mt-1">
        <span className="quick-lbl text-[0.68rem] text-cyber-ash3 flex-shrink-0">Quick targets:</span>
        <button type="button" onClick={() => handleChipClick('github.com')} className="chip bg-cyber-surface2 border border-cyber-border rounded-[100px] px-3 py-1 font-mono text-[0.7rem] text-cyber-ash2 cursor-pointer transition-colors duration-150 hover:border-cyber-red hover:text-cyber-red hover:bg-cyber-red-dim whitespace-nowrap">github.com</button>
        <button type="button" onClick={() => handleChipClick('wikipedia.org')} className="chip bg-cyber-surface2 border border-cyber-border rounded-[100px] px-3 py-1 font-mono text-[0.7rem] text-cyber-ash2 cursor-pointer transition-colors duration-150 hover:border-cyber-red hover:text-cyber-red hover:bg-cyber-red-dim whitespace-nowrap">wikipedia.org</button>
        <button type="button" onClick={() => handleChipClick('reddit.com')} className="chip bg-cyber-surface2 border border-cyber-border rounded-[100px] px-3 py-1 font-mono text-[0.7rem] text-cyber-ash2 cursor-pointer transition-colors duration-150 hover:border-cyber-red hover:text-cyber-red hover:bg-cyber-red-dim whitespace-nowrap">reddit.com</button>
        <button type="button" onClick={() => handleChipClick('demo.testfire.net')} className="chip bg-cyber-surface2 border border-[rgba(224,40,64,0.4)] rounded-[100px] px-3 py-1 font-mono text-[0.7rem] text-cyber-red cursor-pointer transition-colors duration-150 hover:bg-[rgba(224,40,64,0.18)] whitespace-nowrap" title="Intentionally vulnerable">⚠️ demo.testfire.net</button>
        <button type="button" onClick={() => handleChipClick('neverssl.com')} className="chip bg-cyber-surface2 border border-[rgba(224,40,64,0.4)] rounded-[100px] px-3 py-1 font-mono text-[0.7rem] text-cyber-red cursor-pointer transition-colors duration-150 hover:bg-[rgba(224,40,64,0.18)] whitespace-nowrap" title="No SSL — intentional">⚠️ neverssl.com</button>
        
        <div className="flex-1 text-right">
          <button 
            type="button" 
            onClick={() => setPasteOpen(true)}
            className="text-[0.66rem] font-mono text-cyber-purple hover:text-cyber-purple/95 underline bg-transparent border-none cursor-pointer"
          >
            Paste manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
