import React from 'react';
import useScanStore from '../../store/scanStore';

export const Footer = () => {
  const statusLabel = useScanStore((state) => state.statusLabel);

  const messages = [
    'Authorised white-box pentesting tool — only inspect targets you own or have permission to test',
    'Vulnerability scan analyses client-side source only — combine with server tools for full coverage',
    'Use Highlighted view for syntax-coloured HTML — default view',
    'Use Paste to load source when target sites block direct fetching',
    'AI Analyse runs Deep generative security audits using LLMs after source is loaded',
    'Export saves scan findings as printable HTML, Markdown, JSON, or CSV reports',
  ];

  // Repeat the array to ensure seamless infinite animation loop
  const tickerContent = [...messages, ...messages].map((msg, index) => (
    <React.Fragment key={index}>
      <span className="tick-msg font-mono text-[0.58rem] text-cyber-ash3 px-6">
        {msg.includes('white-box') ? (
          <>
            Authorised <b>white-box pentesting</b> tool — only inspect targets you own or have permission to test
          </>
        ) : msg.includes('client-side') ? (
          <>
            Vulnerability scan analyses <b>client-side source only</b> — combine with server tools for full coverage
          </>
        ) : msg.includes('Highlighted') ? (
          <>
            Use <b>Highlighted</b> view for syntax-coloured HTML — default view
          </>
        ) : msg.includes('AI Analyse') ? (
          <>
            <b>AI Analyse</b> runs deep security checks using LLM endpoints
          </>
        ) : msg.includes('Export') ? (
          <>
            <b>Export</b> saves scan findings as a report
          </>
        ) : (
          msg
        )}
      </span>
      <span className="tick-msg text-cyber-ash3 font-mono text-[0.58rem] select-none">·</span>
    </React.Fragment>
  ));

  return (
    <div className="h-7 bg-cyber-surface border-t border-cyber-border-red flex items-center px-4 gap-3.5 flex-shrink-0 overflow-hidden select-none">
      <div className="fi font-mono text-[0.6rem] text-cyber-ash3 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
        Status: <b className="text-cyber-ash2 font-normal">{statusLabel}</b>
      </div>
      <div className="w-px h-3.5 bg-cyber-border flex-shrink-0" />
      <div className="fi font-mono text-[0.6rem] text-cyber-ash3 whitespace-nowrap flex-shrink-0">
        v4.0
      </div>
      <div className="w-px h-3.5 bg-cyber-border flex-shrink-0" />
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="tick-track">
          {tickerContent}
        </div>
      </div>
    </div>
  );
};

export default Footer;
