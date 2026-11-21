import React from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';

export const SecurityIntelPanel = () => {
  const { securityIntel } = useIntelligenceStore();

  if (!securityIntel) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🔒</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING SECURITY INTEL
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Analyze network headers and SSL parameters to resolve security compliance scores.
        </div>
      </div>
    );
  }

  const { securityHeaders, owaspMapping, tlsVersion } = securityIntel;

  const getHeaderStatusColor = (present: boolean) => {
    return present ? 'text-cyber-green' : 'text-cyber-red';
  };

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col h-96 select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            SECURITY INTELLIGENCE & SSL
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          SEC_AUDIT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar select-text">
        {/* Connection TLS level */}
        <div className="bg-cyber-bg border border-cyber-border p-3 rounded flex justify-between items-center">
          <span className="text-[0.58rem] font-mono text-cyber-ash2">ENCRYPTION HANDSHAKE</span>
          <span className="font-display text-[0.75rem] font-black text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 rounded uppercase tracking-wider">
            {tlsVersion || 'HTTPS ACTIVE'}
          </span>
        </div>

        {/* Security headers status */}
        <div>
          <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5 select-none">
            HTTP SECURITY HEADER COVERAGE
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[0.6rem]">
            {[
              { name: 'Content-Security-Policy (CSP)', present: securityHeaders?.csp },
              { name: 'Strict-Transport-Security (HSTS)', present: securityHeaders?.hsts },
              { name: 'X-Frame-Options (Clickjacking)', present: securityHeaders?.xframe },
              { name: 'X-Content-Type-Options', present: securityHeaders?.xcontent }
            ].map((header, idx) => (
              <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex justify-between items-center">
                <span className="text-white truncate pr-2" title={header.name}>{header.name}</span>
                <span className={`font-bold flex-shrink-0 ${getHeaderStatusColor(header.present)}`}>
                  {header.present ? '✓ ACTIVE' : '✗ MISSING'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OWASP Mapping */}
        <div>
          <div className="font-display text-[0.58rem] font-black text-cyber-ash2 tracking-wider uppercase mb-1.5 select-none">
            OWASP TOP 10 THREAT EXPOSURES
          </div>
          {owaspMapping && owaspMapping.length > 0 ? (
            <div className="space-y-1.5 font-mono text-[0.6rem]">
              {owaspMapping.map((map: string, idx: number) => (
                <div key={idx} className="bg-cyber-bg border border-cyber-border p-2.5 rounded flex items-center gap-2 border-l-2 border-cyber-red">
                  <span className="text-cyber-red font-bold">⚠</span>
                  <span className="text-white">{map}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cyber-bg border border-cyber-border p-3 rounded font-mono text-[0.58rem] text-cyber-green text-center select-none">
              ✓ No critical compliance exposures identified.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityIntelPanel;
