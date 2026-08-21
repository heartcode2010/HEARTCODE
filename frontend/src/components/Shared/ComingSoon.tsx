import React from 'react';
import { Sparkles, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  expectedDate?: string;
  features?: string[];
  backPath?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'WE ARE STILL CODING THIS',
  subtitle = 'SIGNAL OS PROTOCOL EXPANSION',
  tag = 'FEATURE COMING SOON',
  expectedDate = 'Q3 2026',
  features = [
    'Hardware-accelerated neural packet interception',
    'Real-time multi-agent consensus validation',
    'Decentralized identity protocol attestation',
  ],
  backPath = '/',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Cyber Scanlines & Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] pointer-events-none opacity-40" />

      {/* Pulsing Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-[#141416] border border-[#7c3aed]/40 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(124,58,237,0.35)] animate-pulse">
          ⚡❤️
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-[#7c3aed] opacity-20 blur-xl -z-10" />
      </div>

      {/* Glitch & Status Badges */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[#9d5cf0] font-mono text-xs uppercase tracking-[0.2em] mb-4">
        <Sparkles size={13} className="animate-spin" />
        {tag}
      </div>

      {/* Main Glitch Headings */}
      <h1 className="font-display text-2xl sm:text-4xl font-black tracking-[0.14em] text-white uppercase max-w-2xl drop-shadow-[0_0_20px_rgba(224,40,64,0.4)]">
        {title}
      </h1>
      <p className="font-mono text-xs sm:text-sm text-[#9d5cf0] tracking-[0.3em] uppercase mt-2">
        {subtitle}
      </p>

      {/* Terminal Cursor Indicator */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#8a8080] mt-4 tracking-widest bg-[#141416]/80 px-4 py-2 rounded-lg border border-[#2a2a2e]">
        <Terminal size={14} className="text-[#9d5cf0]" />
        <span>[ STATUS: COMPILING INTELLIGENCE ]</span>
        <span className="text-[#9d5cf0] animate-ping font-bold">█</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-6 space-y-2">
        <div className="flex justify-between text-[0.68rem] font-mono text-[#6e6868] uppercase tracking-wider">
          <span>Target Architecture</span>
          <span>87% Synced ({expectedDate})</span>
        </div>
        <div className="w-full h-1.5 bg-[#1c1c1f] rounded-full overflow-hidden p-[1px]">
          <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#ff3d55] rounded-full w-[87%] shadow-[0_0_10px_rgba(124,58,237,0.5)] animate-pulse" />
        </div>
      </div>

      {/* Feature Preview List */}
      {features.length > 0 && (
        <div className="mt-8 max-w-md w-full bg-[#141416]/90 border border-[#2a2a2e] rounded-2xl p-5 text-left backdrop-blur-md">
          <div className="text-[0.68rem] font-mono font-bold text-[#6e6868] uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
            <ShieldAlert size={14} className="text-[#9d5cf0]" />
            What is being built:
          </div>
          <ul className="space-y-2">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#b0a8a8] font-mono">
                <span className="text-[#7c3aed] font-bold">›</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Return Button */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1c1f] hover:bg-[#242428] border border-[#2a2a2e] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:border-[#7c3aed]/50 shadow-lg cursor-pointer"
        >
          <ArrowLeft size={14} />
          Return to Console
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
