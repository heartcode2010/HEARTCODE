import React, { useEffect, useRef, useMemo } from 'react';
import useScanStore from '../../store/scanStore';
import api from '../../services/api';

// ── Syntax highlight (mirrors original JS)
function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlight(html: string): string {
  let e = escHtml(html);
  e = e.replace(/(&lt;!--[\s\S]*?--&gt;)/g,                    '<span class="t-comment">$1</span>');
  e = e.replace(/(&lt;!DOCTYPE[^&]*?&gt;)/gi,                   '<span class="t-doctype">$1</span>');
  e = e.replace(/(&lt;script[\s\S]*?&lt;\/script&gt;)/gi,       '<span class="t-script">$1</span>');
  e = e.replace(/(&lt;style[\s\S]*?&lt;\/style&gt;)/gi,         '<span class="t-style">$1</span>');
  e = e.replace(/( [\w:-]+=)(&quot;[^&]*?&quot;)/g,             '<span class="t-attr">$1</span><span class="t-val">$2</span>');
  e = e.replace(/(&lt;\/?)([\w-]+)/g,                           '$1<span class="t-tag">$2</span>');
  return e;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

export const SourcePanel: React.FC = () => {
  const {
    htmlSource, activeView, scanId, url, timestamp,
    size, lines, tagsCount, scriptsCount, stylesCount, imagesCount,
    setView, setCopyOpen, setPasteOpen, showToast,
    setPreviewState, previewState,
  } = useScanStore();

  const codeScrollRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Scroll sync — gutter follows code scroll
  const handleScroll = () => {
    if (gutterRef.current && codeScrollRef.current) {
      gutterRef.current.scrollTop = codeScrollRef.current.scrollTop;
    }
  };

  // Compute display content
  const { displayText, lineCount } = useMemo(() => {
    if (!htmlSource) return { displayText: '', lineCount: 0 };
    if (activeView === 'stripped') {
      const stripped = stripHtml(htmlSource);
      return { displayText: stripped, lineCount: stripped.split('\n').length };
    }
    return { displayText: htmlSource, lineCount: htmlSource.split('\n').length };
  }, [htmlSource, activeView]);

  const cappedLineCount = Math.min(lineCount, 6000);

  // Download source
  const handleSave = () => {
    if (!htmlSource) return;
    const blob = new Blob([htmlSource], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (url.replace(/^https?:\/\//, '').split('/')[0] || 'source') + '.html';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('💾', 'Source downloaded');
  };

  const handleClear = () => {
    useScanStore.getState().clearScan();
    useScanStore.getState().setStatus('idle', 'Ready');
    showToast('🗑', 'Cleared');
  };

  const togglePreview = () => {
    if (previewState === 'closed' || previewState === 'minimized') {
      setPreviewState('open');
    } else {
      setPreviewState('closed');
    }
  };

  const isIdle = !htmlSource;

  return (
    <div className="source-panel flex-1 min-w-0 flex flex-col border-r border-cyber-border-red">
      {/* Controls Bar */}
      <div className="controls-bar bg-cyber-surface border-b border-cyber-border px-4 py-2 flex items-center gap-2 flex-shrink-0 flex-wrap">
        {/* View toggle */}
        <div className="view-toggle flex bg-cyber-bg border border-cyber-border rounded-lg overflow-hidden flex-shrink-0">
          {(['raw', 'highlighted', 'stripped'] as const).map((view, i) => (
            <button
              key={view}
              type="button"
              onClick={() => setView(view)}
              className={`border-r border-cyber-border last:border-r-0 px-4 py-1.5 text-[0.76rem] font-medium flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap cursor-pointer
                ${activeView === view ? 'bg-cyber-red text-white font-semibold' : 'bg-transparent text-cyber-ash2 hover:bg-cyber-surface2 hover:text-white'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 inline-block" />
              <span>{view === 'raw' ? 'Raw HTML' : view === 'highlighted' ? 'Highlighted' : 'Text Only'}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Preview button — shown when source loaded */}
        {scanId && (
          <button
            type="button"
            onClick={togglePreview}
            title="Toggle visual preview"
            className="act-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red rounded text-[0.76rem] text-cyber-ash2 hover:text-white font-sans cursor-pointer transition-all duration-150 active:scale-[0.97]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="hidden sm:inline act-lbl">{previewState !== 'closed' ? 'Hide Preview' : 'Preview'}</span>
          </button>
        )}

        {/* Paste */}
        <button
          type="button"
          onClick={() => setPasteOpen(true)}
          title="Paste HTML source manually"
          className="act-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red rounded text-[0.76rem] text-cyber-ash2 hover:text-white font-sans cursor-pointer transition-all duration-150 active:scale-[0.97]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span className="hidden sm:inline act-lbl">Paste</span>
        </button>

        {/* Copy (red) */}
        <button
          type="button"
          onClick={() => setCopyOpen(true)}
          title="Copy source"
          className="act-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-red-dim hover:bg-cyber-red hover:text-white border border-cyber-border-red rounded text-[0.76rem] text-cyber-red font-sans cursor-pointer transition-all duration-150 active:scale-[0.97] shadow-[0_0_14px_var(--red-glow)] hover:shadow-[0_0_14px_var(--red-glow)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span className="hidden sm:inline act-lbl">Copy</span>
        </button>

        {/* Save */}
        {htmlSource && (
          <button
            type="button"
            onClick={handleSave}
            title="Download source file"
            className="act-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red rounded text-[0.76rem] text-cyber-ash2 hover:text-white font-sans cursor-pointer transition-all duration-150 active:scale-[0.97]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline act-lbl">Save</span>
          </button>
        )}

        {/* Clear */}
        {htmlSource && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear source"
            className="act-btn flex items-center gap-1.5 px-3 py-1.5 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border hover:border-cyber-border-red rounded text-[0.76rem] text-cyber-ash2 hover:text-white font-sans cursor-pointer transition-all duration-150 active:scale-[0.97]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            <span className="hidden sm:inline act-lbl">Clear</span>
          </button>
        )}
      </div>

      {/* Stats Strip */}
      <div className="stats-strip flex bg-cyber-bg2 border-b border-cyber-border overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'thin' }}>
        {[
          { key: 'Size',    val: size || '—' },
          { key: 'Lines',   val: lines != null ? lines.toLocaleString() : '—' },
          { key: 'Tags',    val: tagsCount != null ? tagsCount.toLocaleString() : '—' },
          { key: 'Scripts', val: scriptsCount != null ? scriptsCount.toString() : '—' },
          { key: 'Styles',  val: stylesCount != null ? stylesCount.toString() : '—' },
          { key: 'Images',  val: imagesCount != null ? imagesCount.toString() : '—' },
        ].map(({ key, val }) => (
          <div key={key} className="sc flex-1 min-w-[80px] px-4 py-2 border-r border-cyber-border last:border-r-0 flex flex-col gap-0.5">
            <div className="sc-key text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-cyber-ash3 flex items-center gap-1">{key}</div>
            <div className={`sc-val font-mono text-[0.88rem] font-medium transition-colors duration-300 ${val === '—' ? 'text-cyber-ash3' : 'text-cyber-ash'}`}>{val}</div>
          </div>
        ))}
      </div>

      {/* Panel Titlebar */}
      <div className="panel-titlebar bg-cyber-surface2 border-b border-cyber-border px-4 py-2 flex items-center gap-2.5 flex-shrink-0">
        <div className="wdots flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#c04050]" />
          <div className="w-2 h-2 rounded-full bg-[#c09020]" />
          <div className="w-2 h-2 rounded-full bg-[#28a050]" />
        </div>
        <div className={`flex-1 min-w-0 bg-cyber-bg border border-cyber-border rounded-[100px] px-3 py-1 font-mono text-[0.7rem] overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 ${htmlSource ? 'text-cyber-ash2' : 'text-cyber-ash3'}`}>
          {htmlSource ? url : 'Enter a target URL above and click Inspect'}
        </div>
        {timestamp && (
          <div className="panel-time font-mono text-[0.66rem] text-cyber-ash3 flex-shrink-0 whitespace-nowrap">{timestamp}</div>
        )}
      </div>

      {/* Code View */}
      <div className="code-view flex flex-1 overflow-hidden relative">
        {/* Line Gutter */}
        <div
          ref={gutterRef}
          className="line-gutter w-11 bg-cyber-surface border-r border-cyber-border overflow-hidden py-4 pr-2.5 pl-0 flex flex-col items-end flex-shrink-0 select-none"
          style={{ overflowY: 'hidden' }}
        >
          {htmlSource && Array.from({ length: cappedLineCount }, (_, i) => (
            <div key={i + 1} className="ln font-mono text-[0.7rem] leading-[1.65] text-cyber-ash3 min-h-[1.15rem] whitespace-nowrap">{i + 1}</div>
          ))}
        </div>

        {/* Code Scroll */}
        <div
          ref={codeScrollRef}
          onScroll={handleScroll}
          className="code-scroll flex-1 overflow-auto px-5 py-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isIdle ? (
            <div className="idle-state flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="idle-gfx w-16 h-16 rounded-2xl bg-cyber-surface2 border border-cyber-border-red flex items-center justify-center text-3xl" style={{ animation: 'float 5s ease-in-out infinite' }}>⌨</div>
              <div className="idle-heading font-display text-[0.95rem] font-bold text-cyber-ash2 tracking-[0.16em]">No Target Loaded</div>
              <div className="idle-body text-[0.84rem] text-cyber-ash3 leading-[1.7] max-w-sm">
                Enter a URL above and click <strong className="text-cyber-ash2 font-semibold">Inspect</strong> to view source code, then scan for vulnerabilities.
              </div>
            </div>
          ) : (
            <pre
              className="font-mono text-[0.84rem] leading-[1.65] text-[#c4b8b8] whitespace-pre-wrap break-all"
              style={{ tabSize: 2 }}
              {...(activeView === 'highlighted'
                ? { dangerouslySetInnerHTML: { __html: highlight(htmlSource) } }
                : { children: displayText }
              )}
            />
          )}
        </div>

        {/* Scan bar overlay (animated) */}
        {useScanStore.getState().status === 'working' && (
          <div className="scan-bar on absolute inset-0 pointer-events-none overflow-hidden z-[4]" />
        )}
      </div>
    </div>
  );
};

export default SourcePanel;
