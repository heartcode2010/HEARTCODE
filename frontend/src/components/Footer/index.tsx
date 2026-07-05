import React from 'react';
import useScanStore from '../../store/scanStore';

export const Footer = () => {
  const statusLabel = useScanStore((state) => state.statusLabel);

  const messages = [
    'Authorised white-box pentesting tool — inspect only targets you own or have permission to test.',
    'Vulnerability scanning analyses client-side source only and should be paired with server tools for full coverage.',
    'Use the highlighted view for syntax-coloured HTML.',
    'Paste source when a target blocks direct fetching.',
    'AI analysis helps surface generative patterns after source is loaded.',
    'Export findings as HTML, Markdown, JSON, or CSV reports.',
  ];

  const tickerContent = [...messages, ...messages].map((msg, index) => (
    <React.Fragment key={index}>
      <span className="px-6 text-[0.68rem] text-slate-400">{msg}</span>
      <span className="select-none text-slate-600">·</span>
    </React.Fragment>
  ));

  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-slate-500">
          <span>Status</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-semibold text-slate-200">{statusLabel}</span>
          <span className="text-slate-600">•</span>
          <span>v4.0</span>
        </div>
        <div className="overflow-hidden rounded-full border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap text-[0.72rem] text-slate-400">
            {tickerContent}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[0.72rem] text-slate-500">
          <a href="https://wa.me/2348140473040" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp</a>
          <a href="mailto:aniebietabasienobong@gmail.com" className="transition hover:text-white">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
