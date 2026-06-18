import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import { useScanStore } from '../../../store/scanStore';
import { api } from '../../../services/api';
import type { TutorMode, TutorMessage } from '../../../types';

const PREBUILT_CATEGORIES = [
  { id: 'scan-explain', label: 'Explain My Active Scan', description: 'Ask the tutor to explain the vulnerabilities from your last scan.' },
  { id: 'phishing-prev', label: 'Preventing Phishing', description: 'Learn the primary defense mechanisms against advanced social engineering.' },
  { id: 'owasp-top10', label: 'OWASP Top 10 Risks', description: 'Understand the most critical web application security vulnerabilities.' },
  { id: 'cyber-hygiene', label: 'Daily Cyber Hygiene', description: 'Actionable tips for keeping personal devices and credentials secure.' }
];

const AICyberTutor: React.FC = () => {
  const navigate = useNavigate();
  const { url: scanUrl, findings: scanFindings } = useScanStore();
  const {
    tutorMode,
    tutorMessages,
    tutorLoading,
    setTutorMode,
    addTutorMessage,
    setTutorLoading,
    clearTutorMessages,
    addXP
  } = useAcademyStore();

  const [inputMessage, setInputMessage] = useState('');
  const [sessionLogs, setSessionLogs] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, tutorLoading]);

  const addLog = (log: string) => {
    setSessionLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`].slice(-6));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || tutorLoading) return;

    // User message
    const userMsg: TutorMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      mode: tutorMode
    };

    addTutorMessage(userMsg);
    setInputMessage('');
    setTutorLoading(true);
    addLog(`Transmitting query details (mode: ${tutorMode.toUpperCase()})`);

    try {
      const response = await api.post('/academy/tutor', {
        message: text,
        mode: tutorMode,
        scanContext: scanUrl ? { url: scanUrl, findingsCount: scanFindings?.length || 0, findings: scanFindings } : null
      });

      if (response.data?.success && response.data?.data) {
        const tutorMsg: TutorMessage = {
          id: Math.random().toString(36).substring(7),
          role: 'tutor',
          content: response.data.data,
          timestamp: new Date().toISOString(),
          mode: tutorMode
        };
        addTutorMessage(tutorMsg);
        addLog('Tutor response decryption completed');
        addXP(15);
      } else {
        throw new Error(response.data?.message || 'Invalid server response');
      }
    } catch (err) {
      console.error(err);
      addLog('Tutor channel disrupted. Initializing rule-based fallback response.');
      
      // Rule-based fallback if backend offline or error
      let fallbackContent = '';
      const lowerText = text.toLowerCase();
      if (lowerText.includes('scan') || lowerText.includes('vulnerability') || lowerText.includes('explain')) {
        fallbackContent = `### 💡 AI Tutor Context Analysis [Rule-Based Fallback]

Your active scan is targetting **${scanUrl || 'None (No site scanned yet)'}** with **${scanFindings?.length || 0} vulnerabilities** detected.

If you are seeing vulnerabilities like missing headers or outdated stacks, remember:
1. **Remediation**: Always configure your hosting environment to serve secure headers (CSP, HSTS, X-Frame-Options).
2. **Impact**: Unprotected endpoints can expose details to threat actors.
3. **Action**: Implement least-privilege policies in your codebase.`;
      } else if (lowerText.includes('phish')) {
        fallbackContent = `### 🎣 Phishing Analysis [Rule-Based Fallback]

Phishing leverages human manipulation rather than technical exploits:
- **Urgency**: "Your bank account will be locked in 2 hours!"
- **Spoofing**: Domains designed to look real (\`paypal-security.support\`).
- **Advice**: Never click links directly. Navigate to your bank or service directly in a fresh tab.`;
      } else {
        fallbackContent = `### 🤖 AI Cyber Tutor [Rule-Based Fallback]

I am currently running in local offline mode. To activate the full LLM chat experience:
1. Ensure your backend \`.env\` has either \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` set.
2. Verify the backend service is running.

**Your Question**: "${text}"
**Suggested Academy Paths**: Please try the **Phishing Lab** or **Scam Detector** modules!`;
      }

      const tutorMsg: TutorMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'tutor',
        content: fallbackContent,
        timestamp: new Date().toISOString(),
        mode: tutorMode
      };
      addTutorMessage(tutorMsg);
    } finally {
      setTutorLoading(false);
    }
  };

  const handlePrebuiltQuestion = (category: string) => {
    if (category === 'scan-explain') {
      if (!scanUrl) {
        handleSendMessage('Explain the scan findings. (Note: I haven\'t scanned a website yet, how do I start?)');
      } else {
        handleSendMessage(`Explain the scan findings for my active scan on ${scanUrl}. I have ${scanFindings?.length || 0} findings.`);
      }
    } else if (category === 'phishing-prev') {
      handleSendMessage('What is phishing and how can I train my organization to recognize it?');
    } else if (category === 'owasp-top10') {
      handleSendMessage('What are the OWASP Top 10 vulnerabilities and why do they matter?');
    } else if (category === 'cyber-hygiene') {
      handleSendMessage('Give me a checklist of daily cyber hygiene best practices.');
    }
  };

  return (
    <div className="academy-section flex flex-col h-full" style={{ minHeight: 'calc(100vh - 12rem)' }}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setTutorMode('beginner'); addLog('Complexity set to BEGINNER'); }}
            className={`px-3 py-1 font-mono text-[0.66rem] border cursor-pointer rounded ${tutorMode === 'beginner' ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_8px_rgba(0,245,255,0.25)]' : 'border-cyber-border text-cyber-ash3'}`}
          >
            BEGINNER
          </button>
          <button
            onClick={() => { setTutorMode('intermediate'); addLog('Complexity set to INTERMEDIATE'); }}
            className={`px-3 py-1 font-mono text-[0.66rem] border cursor-pointer rounded ${tutorMode === 'intermediate' ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber shadow-[0_0_8px_rgba(212,130,10,0.25)]' : 'border-cyber-border text-cyber-ash3'}`}
          >
            INTERMEDIATE
          </button>
          <button
            onClick={() => { setTutorMode('advanced'); addLog('Complexity set to ADVANCED'); }}
            className={`px-3 py-1 font-mono text-[0.66rem] border cursor-pointer rounded ${tutorMode === 'advanced' ? 'bg-cyber-red/20 border-cyber-red text-cyber-red shadow-[0_0_8px_rgba(224,40,64,0.25)]' : 'border-cyber-border text-cyber-ash3'}`}
          >
            ADVANCED
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 items-stretch min-h-0">
        {/* Sidebar Console Info */}
        <div className="lg:col-span-1 bg-cyber-surface border border-cyber-border rounded p-4 flex flex-col gap-4 font-mono text-[0.7rem] text-cyber-ash2">
          <div className="border-b border-cyber-border pb-2">
            <div className="text-white text-xs font-bold mb-1">🤖 AI CYBER TUTOR</div>
            <div>STATUS: ONLINE</div>
            <div>STREAK: PASSIVE</div>
          </div>

          <div>
            <div className="text-white text-[0.68rem] font-bold mb-1">ACTIVE SCAN CONTEXT:</div>
            {scanUrl ? (
              <div className="bg-cyber-bg p-2 rounded border border-cyber-border text-[0.64rem] overflow-hidden text-ellipsis">
                <span className="text-cyber-green">URL:</span> {scanUrl}
                <br />
                <span className="text-cyber-red">FINDINGS:</span> {scanFindings?.length || 0}
              </div>
            ) : (
              <div className="bg-cyber-bg p-2 rounded border border-cyber-border text-[0.64rem] italic">
                No active website scanned. Explainers will use default templates.
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="text-white text-[0.68rem] font-bold mb-1">SYSTEM ACTIVITY LOG:</div>
            <div className="bg-cyber-bg p-2 rounded border border-cyber-border text-[0.62rem] leading-4 flex flex-col gap-1 min-h-[6rem]">
              {sessionLogs.length === 0 ? (
                <div className="italic">Session initialized. System ready...</div>
              ) : (
                sessionLogs.map((log, index) => <div key={index}>{log}</div>)
              )}
            </div>
          </div>

          <button
            onClick={() => { clearTutorMessages(); addLog('Chat logs cleared.'); }}
            className="w-full bg-cyber-surface2 hover:bg-cyber-red-dim border border-cyber-border hover:border-cyber-red text-[0.66rem] font-mono text-cyber-ash hover:text-cyber-red py-1.5 rounded transition-all cursor-pointer"
          >
            CLEAR SESSION MEMORY
          </button>
        </div>

        {/* Chat Console Panel */}
        <div className="lg:col-span-3 bg-cyber-surface border border-cyber-border rounded flex flex-col min-h-0">
          <div className="border-b border-cyber-border px-4 py-2.5 bg-cyber-bg2 flex items-center justify-between">
            <span className="font-mono text-[0.68rem] text-cyber-ash">TUTOR SECURE LINK // PORT_8830</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
              <span className="font-mono text-[0.6rem] text-cyber-green uppercase">Channel Secure</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm min-h-0">
            {tutorMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="text-4xl">🤖</div>
                <div className="max-w-md space-y-2">
                  <h3 className="font-display font-bold text-cyber-cyan text-sm tracking-wide">INITIAL CONTACT ESTABLISHED</h3>
                  <p className="text-xs text-cyber-ash2">
                    Welcome to the Heartcode AI Cybersecurity Tutor. I am here to help you develop, reinforce, and expand your cyber-defense capabilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl text-left font-mono">
                  {PREBUILT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handlePrebuiltQuestion(cat.id)}
                      className="p-3 bg-cyber-bg hover:bg-cyber-surface2 border border-cyber-border hover:border-cyber-cyan/40 text-left rounded cursor-pointer transition-all group"
                    >
                      <div className="text-cyber-cyan text-xs font-bold group-hover:text-white flex items-center justify-between">
                        <span>{cat.label}</span>
                        <span>→</span>
                      </div>
                      <div className="text-[0.62rem] text-cyber-ash2 mt-1 line-clamp-2">{cat.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              tutorMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded p-3.5 border ${
                      msg.role === 'user'
                        ? 'bg-cyber-surface2 border-cyber-border text-white rounded-tr-none'
                        : 'bg-cyber-bg border-cyber-border text-cyber-ash rounded-tl-none font-mono text-xs leading-relaxed space-y-2'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <div className="prose prose-invert max-w-none break-words leading-relaxed">
                        {/* Simplistic rendering of Markdown */}
                        {msg.content.split('\n').map((line, idx) => {
                          if (line.startsWith('###')) {
                            return <h3 key={idx} className="text-white font-bold text-sm tracking-wide mt-3 mb-1">{line.replace('###', '').trim()}</h3>;
                          }
                          if (line.startsWith('##')) {
                            return <h2 key={idx} className="text-white font-bold text-base tracking-wide mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
                          }
                          if (line.startsWith('-')) {
                            return <div key={idx} className="pl-4 text-cyber-cyan text-xs my-0.5">• {line.substring(1).trim()}</div>;
                          }
                          if (line.startsWith('>')) {
                            return <blockquote key={idx} className="border-l-2 border-cyber-cyan pl-3 py-1 my-2 text-cyber-ash2 bg-cyber-surface/30 italic text-[0.7rem]">{line.substring(1).trim()}</blockquote>;
                          }
                          if (line.match(/^\d+\./)) {
                            return <div key={idx} className="pl-4 text-cyber-cyan text-xs my-0.5">{line}</div>;
                          }
                          return <p key={idx} className="my-1">{line}</p>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {tutorLoading && (
              <div className="flex justify-start">
                <div className="bg-cyber-bg border border-cyber-border text-cyber-cyan font-mono text-xs rounded rounded-tl-none p-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping" />
                  <span>DECRYPTING AI SYNAPSE CORRELATION...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Area */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
            className="border-t border-cyber-border p-3 flex items-center gap-2 bg-cyber-bg2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Query Tutor (e.g. explain XSS or check my active scan)..."
              disabled={tutorLoading}
              className="flex-1 bg-cyber-bg border border-cyber-border text-white text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-cyber-cyan"
            />
            <button
              type="submit"
              disabled={tutorLoading || !inputMessage.trim()}
              className="bg-cyber-surface hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 disabled:border-cyber-border disabled:bg-cyber-surface px-4 py-2 text-xs font-mono rounded transition-all cursor-pointer"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AICyberTutor;
