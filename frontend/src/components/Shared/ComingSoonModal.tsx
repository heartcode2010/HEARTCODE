import React from 'react';
import { Sparkles, X, Clock, ShieldCheck } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  featureName?: string;
  description?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title = 'Feature Coming Soon',
  featureName = 'This Module',
  description = 'We are currently finalizing this feature for our upcoming release. Thank you for exploring Technova!',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#111114] border border-[#2a2a2e] rounded-3xl p-6 shadow-2xl shadow-purple-500/10 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background ambient glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Icon & Tag */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-400 shadow-inner">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[0.68rem] uppercase tracking-wider">
              <Clock size={11} /> Development In Progress
            </div>
            <h3 className="text-lg font-bold mt-1 text-white tracking-tight">{title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          <span className="font-semibold text-purple-300">{featureName}</span> — {description}
        </p>

        {/* Terminal status box */}
        <div className="bg-[#0c0c0e] border border-[#2a2a2e] rounded-xl p-3 mb-6 font-mono text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-[0.7rem] font-bold uppercase tracking-wider">
            <ShieldCheck size={13} /> Architectural Status: Active Development
          </div>
          <div className="flex items-center justify-between text-[0.65rem] text-slate-500">
            <span>Target Deployment</span>
            <span className="text-slate-300">Upcoming Release</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-purple-600/25 cursor-pointer"
        >
          Got It, Thanks
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
