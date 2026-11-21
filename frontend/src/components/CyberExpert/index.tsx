import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type Persona = 'red_team' | 'blue_team' | 'threat_hunter' | 'mentor';

const PERSONAS: { id: Persona; name: string; tag: string; icon: string; desc: string; color: string }[] = [
  {
    id: 'red_team',
    name: 'Apex Operator',
    tag: 'OFFENSIVE SECURITY',
    icon: '🔴',
    desc: 'Exploitation chains, payload delivery, web shells, and reverse engineering.',
    color: '#ff3d55',
  },
  {
    id: 'blue_team',
    name: 'Sentinel Lead',
    tag: 'DEFENSIVE ARCHITECTURE',
    icon: '🔵',
    desc: 'System hardening, zero trust network access, SOC operations, SIEM rules.',
    color: '#00f5ff',
  },
  {
    id: 'threat_hunter',
    name: 'Phantom Intelligence',
    tag: 'APT TELEMETRY',
    icon: '🟣',
    desc: 'Nation-state threat actor mapping, zero-day indicators, memory forensics.',
    color: '#a855f7',
  },
  {
    id: 'mentor',
    name: 'Cipher Professor',
    tag: 'CYBER ACADEMY MENTOR',
    icon: '🟢',
    desc: 'Explaining security fundamentals, OSCP/CEH exams, and ethical tradecraft.',
    color: '#2ea86a',
  },
];

export const CyberExpert: React.FC = () => {
  const [persona, setPersona] = useState<Persona>('red_team');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 🛡️ HEARTCODE Neural Tactical Link Established\n\nI am your **Apex Red Team Operator**. I analyze complex attack surfaces, reverse engineer exploit vectors, and design resilient security architectures. \n\nAsk me anything about zero-days, OWASP Top 10, penetration testing, or click the 🎤 **Microphone** to speak directly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Web Speech Recognition for speech-to-text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-Text is not supported on this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisActive || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    // Clean markdown headings/symbols for audio speech
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .substring(0, 450);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (overrideContent?: string) => {
    const textToSend = overrideContent || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai-detection/chat', {
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        persona,
      });

      const reply = res.data?.reply || 'Transmission received. Threat telemetry updated.';
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
    } catch {
      const fallbackMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `**[Tactical Standby]** Server connection temporarily buffered. In offensive cyber operations, ensure endpoint authorization tokens contain sufficient entropy. Check \`.env\` provider configurations to re-establish neural streaming.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const activePersonaObj = PERSONAS.find((p) => p.id === persona) || PERSONAS[0];

  return (
    <div className="cyber-expert flex-1 flex flex-col bg-cyber-bg min-h-0 overflow-hidden">
      {/* Top Controller Bar */}
      <div className="bg-cyber-surface border-b border-cyber-border px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border border-white/10"
            style={{ backgroundColor: `${activePersonaObj.color}20` }}
          >
            {activePersonaObj.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-display font-bold text-base tracking-wide">
                {activePersonaObj.name}
              </h2>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded tracking-widest font-semibold border"
                style={{
                  color: activePersonaObj.color,
                  borderColor: `${activePersonaObj.color}40`,
                  backgroundColor: `${activePersonaObj.color}10`,
                }}
              >
                {activePersonaObj.tag}
              </span>
            </div>
            <p className="text-cyber-ash2 text-xs font-sans mt-0.5">{activePersonaObj.desc}</p>
          </div>
        </div>

        {/* Persona Switchers & Audio Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-cyber-surface2 p-1 rounded-lg border border-cyber-border">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  persona === p.id
                    ? 'bg-cyber-surface3 text-white shadow-sm font-semibold border border-cyber-border-red'
                    : 'text-cyber-ash hover:text-white'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Voice Output Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              setSpeechSynthesisActive(!speechSynthesisActive);
            }}
            title={speechSynthesisActive ? 'Mute AI Voice' : 'Enable AI Voice'}
            className={`p-2 rounded-lg border transition-all cursor-pointer text-xs font-mono flex items-center gap-1.5 ${
              speechSynthesisActive
                ? 'bg-cyber-red-dim border-cyber-border-red text-cyber-red shadow-[0_0_10px_rgba(224,40,64,0.2)]'
                : 'bg-cyber-surface2 border-cyber-border text-cyber-ash2'
            }`}
          >
            <span>{speechSynthesisActive ? '🔊' : '🔇'}</span>
            <span className="hidden md:inline">{speechSynthesisActive ? 'VOICE ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-cyber-ash2">
              <span>{m.role === 'user' ? 'OPERATOR (YOU)' : activePersonaObj.name.toUpperCase()}</span>
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed font-sans shadow-md border ${
                m.role === 'user'
                  ? 'bg-cyber-red/15 border-cyber-red text-white'
                  : 'bg-cyber-surface border-cyber-border text-cyber-ash'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-cyber-ash2">
              <span>{activePersonaObj.name.toUpperCase()}</span>
              <span>•</span>
              <span className="text-cyber-red animate-pulse">TRANSMITTING...</span>
            </div>
            <div className="bg-cyber-surface border border-cyber-border rounded-2xl px-5 py-4 text-sm font-mono text-cyber-ash flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
              <span>Synthesizing neural threat matrix...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-6 py-2 bg-cyber-surface/50 border-t border-cyber-border/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          'Simulate SSRF cloud bypass',
          'Explain Zero-Day memory corruption',
          'Audit high-severity CORS misconfiguration',
          'How to isolate infected ransomware host?',
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-3 py-1 bg-cyber-surface2 hover:bg-cyber-surface3 border border-cyber-border rounded-full text-xs font-mono text-cyber-ash hover:text-white whitespace-nowrap transition-colors cursor-pointer"
          >
            ⚡ {chip}
          </button>
        ))}
      </div>

      {/* Input Control Console */}
      <div className="p-4 bg-cyber-surface border-t border-cyber-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 max-w-5xl mx-auto"
        >
          {/* Speech-to-Text Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer border ${
              isListening
                ? 'bg-cyber-red text-white border-cyber-red-hi shadow-[0_0_20px_rgba(224,40,64,0.6)] animate-pulse'
                : 'bg-cyber-surface2 hover:bg-cyber-surface3 border-cyber-border text-cyber-ash hover:text-white'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak via microphone'}
          >
            {isListening ? '🎙️' : '🎤'}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to voice audio...' : `Message ${activePersonaObj.name}...`}
              disabled={loading}
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-white text-sm font-sans placeholder-cyber-ash3 focus:outline-none focus:border-cyber-red transition-colors"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              input.trim() && !loading
                ? 'bg-cyber-red hover:bg-cyber-red-hi text-white shadow-[0_0_15px_rgba(224,40,64,0.4)]'
                : 'bg-cyber-surface3 text-cyber-ash3 border border-cyber-border cursor-not-allowed'
            }`}
          >
            <span>TRANSMIT</span>
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CyberExpert;

