import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';

type LabTab = 'xss' | 'privacy' | 'recon';

const LearningLabs: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, earnBadge } = useAcademyStore();
  const [activeTab, setActiveTab] = useState<LabTab>('xss');

  // ── XSS Lab State ──
  const [xssInput, setXssInput] = useState('');
  const [comments, setComments] = useState<Array<{ text: string; safe: boolean }>>([
    { text: 'Great security analysis platform!', safe: true },
    { text: 'Love the retro design.', safe: true }
  ]);
  const [sanitize, setSanitize] = useState(false);
  const [xssExploded, setXssExploded] = useState(false);

  // ── Privacy Lab State ──
  const [cookieHttpOnly, setCookieHttpOnly] = useState(false);
  const [cookieSecure, setCookieSecure] = useState(false);
  const [scriptLog, setScriptLog] = useState<string[]>([]);

  // ── Recon Lab State ──
  const [reconMatches, setReconMatches] = useState<Record<string, string>>({
    '22': '',
    '80': '',
    '443': '',
    '3389': ''
  });
  const [reconChecked, setReconChecked] = useState(false);
  const [reconSuccess, setReconSuccess] = useState(false);

  // XSS Action
  const handleAddComment = () => {
    if (!xssInput.trim()) return;

    const containsScript = xssInput.toLowerCase().includes('<script>') || xssInput.toLowerCase().includes('onload=') || xssInput.toLowerCase().includes('onerror=');
    
    if (containsScript && !sanitize) {
      setXssExploded(true);
      setComments((prev) => [...prev, { text: xssInput, safe: false }]);
      addXP(50);
    } else {
      // Escape HTML if sanitize is ON
      const textToAdd = sanitize 
        ? xssInput.replace(/</g, '&lt;').replace(/>/g, '&gt;') 
        : xssInput;
      setComments((prev) => [...prev, { text: textToAdd, safe: true }]);
    }
    setXssInput('');
  };

  // Privacy Action
  const handleTestCookieLeak = () => {
    const logs = [];
    logs.push('[SYSTEM] Running document.cookie scan script...');
    
    if (cookieHttpOnly) {
      logs.push('[SECURE] Token has HttpOnly flag set. JavaScript cannot access it.');
      logs.push('[RESULT] Cookie secure from XSS extraction.');
    } else {
      logs.push('[EXPOSED] Token accessible! document.cookie value: "session_token=JWT_8892_SECRET_KEY"');
      logs.push('[DANGER] An attacker could steal this session cookie via Cross-Site Scripting (XSS).');
    }

    if (cookieSecure) {
      logs.push('[SECURE] Secure flag active. Cookie transmission limited to encrypted HTTPS channels.');
    } else {
      logs.push('[WARNING] Secure flag inactive. Cookie can be transmitted over plain HTTP in cleartext.');
    }

    setScriptLog(logs);
    if (cookieHttpOnly && cookieSecure) {
      addXP(40);
    }
  };

  // Recon Action
  const handleCheckRecon = () => {
    const correct = 
      reconMatches['22'] === 'SSH' &&
      reconMatches['80'] === 'HTTP' &&
      reconMatches['443'] === 'HTTPS' &&
      reconMatches['3389'] === 'RDP';

    setReconChecked(true);
    setReconSuccess(correct);

    if (correct) {
      addXP(60);
      earnBadge('infrastructure-analyst');
    }
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🧪 Cyber Security Learning Labs</h2>
        <p className="academy-section-desc">Interactive sandboxes for hacking, privacy defense, and network reconnaissance concepts.</p>
      </div>

      {/* Lab Tabs */}
      <div className="flex items-center gap-1 border-b border-cyber-border pb-px">
        <button
          onClick={() => setActiveTab('xss')}
          className={`px-4 py-2 font-mono text-xs cursor-pointer border-b-2 transition-all ${activeTab === 'xss' ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-cyber-ash2'}`}
        >
          1. XSS SANDBOX
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 font-mono text-xs cursor-pointer border-b-2 transition-all ${activeTab === 'privacy' ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-cyber-ash2'}`}
        >
          2. COOKIE PRIVACY SHIELD
        </button>
        <button
          onClick={() => setActiveTab('recon')}
          className={`px-4 py-2 font-mono text-xs cursor-pointer border-b-2 transition-all ${activeTab === 'recon' ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-cyber-ash2'}`}
        >
          3. RECON PROTOCOL MAPPER
        </button>
      </div>

      {/* Lab Body */}
      <div className="bg-cyber-surface border border-cyber-border rounded p-5">
        
        {/* XSS Lab */}
        {activeTab === 'xss' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white text-xs tracking-wider">XSS VULNERABILITY SIMULATOR</h3>
                <p className="text-xs text-cyber-ash2 leading-relaxed">
                  Cross-Site Scripting (XSS) occurs when applications inject untrusted input directly into pages without validation.
                  Try entering a malicious script tag like:
                  <br />
                  <code className="text-cyber-cyan bg-cyber-bg px-2 py-0.5 rounded select-all font-mono block mt-1.5 text-[0.66rem]">
                    {"<script>alert('VULNERABLE')</script>"}
                  </code>
                </p>

                {/* Sanitization Switch */}
                <div className="flex items-center justify-between bg-cyber-bg p-3 rounded border border-cyber-border">
                  <span className="text-xs font-mono text-white">SANITIZE USER INPUTS:</span>
                  <button
                    onClick={() => setSanitize(!sanitize)}
                    className={`px-3 py-1 font-mono text-[0.64rem] cursor-pointer rounded border transition-all ${sanitize ? 'bg-cyber-green/20 border-cyber-green text-cyber-green' : 'bg-cyber-red/20 border-cyber-red text-cyber-red'}`}
                  >
                    {sanitize ? 'ACTIVE (SECURE)' : 'INACTIVE (VULNERABLE)'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.64rem] font-mono text-cyber-ash2 block">SUBMIT GUESTBOOK COMMENT:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={xssInput}
                      onChange={(e) => setXssInput(e.target.value)}
                      placeholder="Enter comment or script..."
                      className="flex-1 bg-cyber-bg border border-cyber-border text-white text-xs font-mono rounded px-3 py-2 focus:outline-none"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan px-4 py-2 text-xs font-mono rounded cursor-pointer"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>

                {xssExploded && (
                  <div className="bg-cyber-red-dim border border-cyber-red p-4 rounded space-y-2">
                    <div className="font-mono text-cyber-red font-bold text-xs">⚠️ CLIENT SIDE XSS EXPLOITED!</div>
                    <div className="text-[0.68rem] text-cyber-ash">
                      The application loaded the unescaped script tag, executing arbitrary JS in the visitor's browser space. To remediate, enable the sanitization flag.
                    </div>
                    <button
                      onClick={() => setXssExploded(false)}
                      className="bg-cyber-bg hover:bg-cyber-surface2 text-white border border-cyber-border text-[0.64rem] font-mono px-3 py-1 rounded cursor-pointer"
                    >
                      DISMISS EXPLODE INTERCEPT
                    </button>
                  </div>
                )}
              </div>

              {/* Guestbook Output */}
              <div className="bg-cyber-bg border border-cyber-border rounded overflow-hidden flex flex-col min-h-[260px]">
                <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border font-mono text-[0.66rem] text-cyber-ash flex justify-between">
                  <span>📟 GUESTBOOK_PAGE.HTML</span>
                  <span className="text-cyber-green">ONLINE</span>
                </div>
                <div className="p-4 flex-1 space-y-2 overflow-y-auto">
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded text-xs border ${c.safe ? 'bg-cyber-surface/40 border-cyber-border text-cyber-ash' : 'bg-cyber-red-dim border-cyber-red text-cyber-red-hi font-mono'}`}
                    >
                      {c.safe ? c.text : `[XSS SCRIPT EXECUTED: ${c.text}]`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Lab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-white text-xs tracking-wider">COOKIE SECURITY FLAG SIMULATOR</h3>
                <p className="text-xs text-cyber-ash2 leading-relaxed">
                  Web browser cookies store credentials. If developers omit key security flags, client-side scripts can read them, opening paths to credential theft.
                </p>

                {/* Flags Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-cyber-bg p-3 rounded border border-cyber-border">
                    <div>
                      <div className="text-xs text-white font-mono">HttpOnly FLAG</div>
                      <div className="text-[0.62rem] text-cyber-ash2 mt-0.5">Restricts client JavaScript from accessing cookie values</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookieHttpOnly}
                      onChange={(e) => setCookieHttpOnly(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-cyber-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-cyber-bg p-3 rounded border border-cyber-border">
                    <div>
                      <div className="text-xs text-white font-mono">Secure FLAG</div>
                      <div className="text-[0.62rem] text-cyber-ash2 mt-0.5">Limits cookie transmission to encrypted HTTPS channels</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={cookieSecure}
                      onChange={(e) => setCookieSecure(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-cyber-cyan"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTestCookieLeak}
                  className="w-full bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono py-2.5 rounded cursor-pointer"
                >
                  EXECUTE SCRIPT [TEST FOR COOKIE LEAK]
                </button>
              </div>

              {/* Console Logs */}
              <div className="bg-cyber-bg border border-cyber-border rounded overflow-hidden flex flex-col min-h-[220px]">
                <div className="bg-cyber-bg2 px-4 py-2 border-b border-cyber-border font-mono text-[0.66rem] text-cyber-ash">
                  🛡️ CONSOLE REPORT // PENETRATION_TEST_OUTPUT
                </div>
                <div className="p-4 flex-1 font-mono text-xs space-y-2 overflow-y-auto leading-relaxed">
                  {scriptLog.length === 0 ? (
                    <div className="text-cyber-ash3 italic">Run the scanner test to generate console outputs.</div>
                  ) : (
                    scriptLog.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.startsWith('[EXPOSED]') || log.startsWith('[DANGER]') ? 'text-cyber-red' :
                          log.startsWith('[SECURE]') ? 'text-cyber-green' :
                          log.startsWith('[WARNING]') ? 'text-cyber-amber' :
                          'text-cyber-ash'
                        }
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recon Lab */}
        {activeTab === 'recon' && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">INFRASTRUCTURE RECONNAISSANCE MAPPER</h3>
            <p className="text-xs text-cyber-ash2 leading-relaxed">
              Before scanning files, an intelligence engine maps open networking ports. Link the correct TCP port numbers to their standardized application protocol labels.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
              {[
                { port: '22', label: 'Port 22' },
                { port: '80', label: 'Port 80' },
                { port: '443', label: 'Port 443' },
                { port: '3389', label: 'Port 3389' }
              ].map((item) => (
                <div key={item.port} className="bg-cyber-bg border border-cyber-border p-3.5 rounded flex flex-col gap-2">
                  <div className="font-mono text-xs text-cyber-cyan font-bold">{item.label}</div>
                  <select
                    value={reconMatches[item.port]}
                    onChange={(e) => setReconMatches({ ...reconMatches, [item.port]: e.target.value })}
                    className="bg-cyber-surface border border-cyber-border text-white text-xs rounded p-1.5 focus:outline-none focus:border-cyber-cyan"
                  >
                    <option value="">-- Choose --</option>
                    <option value="HTTP">HTTP (Web)</option>
                    <option value="HTTPS">HTTPS (Secure Web)</option>
                    <option value="SSH">SSH (Secure Shell)</option>
                    <option value="RDP">RDP (Remote Desktop)</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCheckRecon}
                className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan px-6 py-2.5 text-xs font-mono rounded cursor-pointer"
              >
                TEST RESOLUTION PATTERN
              </button>

              {reconChecked && (
                <div className={`font-mono text-xs ${reconSuccess ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  {reconSuccess ? '✓ ALL CONFIGURATIONS STACKED CORRECTLY (+60 XP)' : '❌ CONFIGURATION ERRORS DETECTED. MAP PORTS ACCORDINGLY.'}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningLabs;
