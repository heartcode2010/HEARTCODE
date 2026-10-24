import React, { useEffect, useRef, useState } from 'react';

/**
 * Intro splash screen — full-screen glitch animation that auto-dismisses
 * after 2.4s or on click. Mirrors the original #intro-splash exactly.
 */
export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [fading, setFading] = useState(false);
  const timerRef = useRef<any>(null);

  const dismiss = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onDone, 420); // match CSS fade duration
  };

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, 2400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div
      id="intro-splash"
      onClick={dismiss}
      className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-all bg-black isolation-isolate ${fading ? 'fade-out' : ''}`}
      style={fading ? { animation: 'intro-fade 0.4s ease forwards' } : {}}
    >
      {/* Glitch background layer */}
      <div
        id="intro-glitch-layer"
        className="absolute inset-0 z-[1] bg-[#0a0a0b]"
        style={{ animation: 'glitch-bg 2.4s steps(1) forwards' }}
      />

      {/* Secondary offset horizontal bands */}
      <div
        id="intro-glitch-strip"
        className="absolute inset-0 z-[2] pointer-events-none opacity-0 bg-[#0d0002]"
        style={{ animation: 'glitch-strip 2.4s steps(1) forwards' }}
      />

      {/* Scanlines */}
      <div
        id="intro-scanlines"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.05) 3px,rgba(255,255,255,.05) 4px)',
          animation: 'intro-scan 2.4s steps(1) forwards',
        }}
      />

      {/* Logo image — clean above layers */}
      <div className="intro-img-wrap relative z-[10] w-[220px] h-[220px] flex items-center justify-center">
        <img
          id="intro-img"
          src="/media/images/379439.png"
          alt="Eket CyberVerse"
          draggable={false}
          className="w-full h-full object-contain block"
          style={{ animation: 'intro-img-show 2.4s ease forwards' }}
          onError={(e) => {
            // Fallback: show text logo if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
