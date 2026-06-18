import React, { useRef, useState, useEffect } from 'react';
import useScanStore from '../../store/scanStore';

export const PreviewFloat = () => {
  const { previewState, setPreviewState, htmlSource, url } = useScanStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [position, setPosition] = useState<{ left?: number; top?: number; right?: number; bottom?: number }>({
    right: 24,
    bottom: 24,
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Pre-render blob whenever HTML changes
  useEffect(() => {
    if (!htmlSource) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      return;
    }

    try {
      setIsBlocked(false);
      const baseUrl = url ? (url.startsWith('http') ? url : 'https://' + url) : '';
      let src = htmlSource;
      if (baseUrl) {
        try {
          const origin = new URL(baseUrl).origin;
          const baseTag = `<base href="${origin}/">`;
          if (/<head[\s>]/i.test(src)) {
            src = src.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
          } else {
            src = baseTag + src;
          }
        } catch (e) {
          // Invalid URL
        }
      }

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      const blob = new Blob([src], { type: 'text/html' });
      const newUrl = URL.createObjectURL(blob);
      setBlobUrl(newUrl);
    } catch (err) {
      console.error(err);
      setIsBlocked(true);
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [htmlSource, url]);

  // Handle Drag Events
  const handleStart = (clientX: number, clientY: number) => {
    if (previewState === 'maximized' || !floatRef.current) return;
    setDragging(true);
    const rect = floatRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        left: e.clientX - dragOffset.current.x,
        top: e.clientY - dragOffset.current.y,
        right: undefined,
        bottom: undefined,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      setPosition({
        left: e.touches[0].clientX - dragOffset.current.x,
        top: e.touches[0].clientY - dragOffset.current.y,
        right: undefined,
        bottom: undefined,
      });
    };

    const handleEnd = () => {
      setDragging(false);
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragging]);

  if (previewState === 'closed') {
    return (
      <div 
        onClick={() => htmlSource && setPreviewState('open')}
        className={`fixed right-0 bottom-20 bg-cyber-ash3 text-cyber-ash2 rounded-l-lg py-2.5 px-1.5 text-[0.6rem] font-display tracking-widest writing-vertical select-none cursor-not-allowed opacity-45 shadow-[-4px_0_10px_rgba(0,0,0,0.3)] z-[4001] transition-all duration-200 ${htmlSource ? 'bg-cyber-red! text-white! cursor-pointer! opacity-100! shadow-[-4px_0_18px_var(--red-glow)] hover:pr-2.5' : ''}`}
      >
        PREVIEW
      </div>
    );
  }

  const isMin = previewState === 'minimized';
  const isMax = previewState === 'maximized';

  const style: React.CSSProperties = isMax
    ? { width: '100vw', height: '100vh', top: 0, left: 0 }
    : isMin
    ? { display: 'none' }
    : {
        width: '380px',
        height: '280px',
        left: position.left !== undefined ? `${position.left}px` : undefined,
        top: position.top !== undefined ? `${position.top}px` : undefined,
        right: position.right !== undefined ? `${position.right}px` : undefined,
        bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
      };

  return (
    <>
      <div
        ref={floatRef}
        style={style}
        className={`fixed bg-cyber-surface border border-cyber-border-red rounded-xl shadow-[0_8px_48px_rgba(0,0,0,0.7),_0_0_0_1px_rgba(224,40,64,0.1)] flex flex-col z-[4000] overflow-hidden ${dragging ? 'transition-none' : 'transition-[transform,opacity,width,height,bottom,right,border-radius] duration-300'}`}
      >
        {/* Title Bar */}
        <div
          ref={dragRef}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          className="bg-cyber-bg border-b border-cyber-border-red px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 cursor-move select-none"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2.2" className="flex-shrink-0">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="flex-1 font-mono text-[0.62rem] text-cyber-ash2 truncate">
            {url ? url.replace(/^https?:\/\//, '').substring(0, 40) : 'Pasted manual source'}
          </span>
          
          <button
            onClick={() => setPreviewState('minimized')}
            title="Minimize"
            className="w-5.5 h-5.5 rounded border border-transparent hover:border-cyber-border bg-cyber-surface2 hover:bg-cyber-surface3 text-cyber-ash hover:text-white text-[0.8rem] flex items-center justify-center cursor-pointer transition-colors duration-150"
          >
            _
          </button>
          <button
            onClick={() => setPreviewState(isMax ? 'open' : 'maximized')}
            title={isMax ? 'Restore' : 'Maximize'}
            className="w-5.5 h-5.5 rounded border border-transparent hover:border-cyber-border bg-cyber-surface2 hover:bg-cyber-surface3 text-cyber-ash hover:text-white text-[0.72rem] flex items-center justify-center cursor-pointer transition-colors duration-150"
          >
            ⛶
          </button>
          <button
            onClick={() => setPreviewState('closed')}
            title="Close"
            className="w-5.5 h-5.5 rounded border border-transparent hover:border-cyber-border bg-cyber-surface2 hover:bg-cyber-red hover:text-white text-cyber-ash text-[0.7rem] flex items-center justify-center cursor-pointer transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 relative bg-white overflow-hidden">
          {blobUrl && !isBlocked ? (
            <iframe
              ref={iframeRef}
              src={blobUrl}
              sandbox="allow-scripts"
              className="w-full h-full border-none block"
            />
          ) : (
            <div className="absolute inset-0 bg-cyber-bg2 flex flex-col items-center justify-center gap-2 p-5 text-center font-mono">
              <div className="text-2xl">🚫</div>
              <div className="text-xs font-semibold text-cyber-ash2">Could not render preview</div>
              <div className="text-[0.68rem] text-cyber-ash3 leading-relaxed">
                An error occurred writing the source to the preview window or no source is active.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup Tab (when minimized) */}
      {isMin && (
        <div
          onClick={() => setPreviewState('open')}
          className="fixed right-0 bottom-20 bg-cyber-red text-white rounded-l-lg py-2.5 px-1.5 text-[0.6rem] font-display tracking-widest writing-vertical cursor-pointer shadow-[-4px_0_18px_var(--red-glow)] z-[4001] opacity-100 hover:pr-2.5 transition-all duration-200"
        >
          PREVIEW
        </div>
      )}
    </>
  );
};

export default PreviewFloat;
