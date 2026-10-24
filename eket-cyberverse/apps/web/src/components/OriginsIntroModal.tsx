import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, X, ArrowRight } from 'lucide-react';

interface OriginsIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginsIntroModal: React.FC<OriginsIntroModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<'image' | 'fading' | 'cyberverse'>('image');

  useEffect(() => {
    if (!isOpen) {
      setStage('image');
      return;
    }

    // Progression: Shows real-world photo of Eket, then fades into futuristic Eket CyberVerse branding
    const timer1 = setTimeout(() => {
      setStage('fading');
    }, 2800);

    const timer2 = setTimeout(() => {
      setStage('cyberverse');
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-700 font-mono">
      <div className="relative w-full max-w-2xl bg-cyber-bg2 border border-cyber-border rounded-xl overflow-hidden shadow-[0_0_50px_rgba(47,128,255,0.25)] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-cyber-muted hover:text-cyber-text p-1.5 rounded-full bg-cyber-bg/70 border border-cyber-border transition-colors"
          title="Skip to Console"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── STAGE 1: REAL-WORLD EKET PHOTO WITH GROUND TRUTH INTRO ── */}
        <div className="relative h-80 w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src="/eket-origins.jpg"
            alt="Eket City Life & Market"
            className={`w-full h-full object-cover transition-all duration-1000 transform ${
              stage === 'image'
                ? 'scale-100 opacity-90 blur-0'
                : 'scale-105 opacity-15 blur-sm'
            }`}
          />

          {/* Vignette & scanline gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg2 via-transparent to-black/40 pointer-events-none" />

          {/* Overlay Tag */}
          <div
            className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-white/20 text-[0.7rem] text-white tracking-widest transition-opacity duration-700 ${
              stage === 'image' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GROUND TRUTH: EKET, NIGERIA</span>
          </div>

          {/* ── STAGE 2: FADING TRANSITION INTO EKET CYBERVERSE ── */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-1000 ${
              stage === 'cyberverse' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-cyber-cyan mb-4 shadow-[0_0_24px_rgba(41,211,255,0.4)] animate-pulse">
              <Shield className="w-7 h-7" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-text via-cyber-cyan to-cyber-blue drop-shadow-[0_0_20px_rgba(41,211,255,0.3)]">
              EKET CYBERVERSE
            </h1>

            <p className="text-xs text-cyber-cyan uppercase tracking-widest mt-2 font-bold">
              "From Security Intelligence to Verified Resilience."
            </p>

            <p className="text-[0.72rem] text-cyber-muted max-w-md mt-4 leading-relaxed">
              Born from the heartbeat of local digital infrastructure — engineered to deliver uncompromising, evidence-based global exposure defense.
            </p>
          </div>
        </div>

        {/* Modal Footer & Actions */}
        <div className="p-5 bg-cyber-panel border-t border-cyber-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyber-muted text-[0.7rem]">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Rooted in Eket, Protecting the Global Surface</span>
          </div>

          <button
            onClick={onClose}
            className="bg-cyber-blue hover:bg-cyber-blue/80 text-white font-bold px-4 py-2 rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(47,128,255,0.4)]"
          >
            <span>Enter Cyberverse Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OriginsIntroModal;
