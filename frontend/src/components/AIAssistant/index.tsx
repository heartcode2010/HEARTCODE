import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';

// ══════════════════════════════════════════════════════════════════════════════
// AIAssistant — Floating intelligence assistant panel (#27)
// Contextual analysis explanations and investigation guidance
// ══════════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Pre-built analysis summaries based on scan data
function generateContextualSummary(store: ReturnType<typeof useIntelligenceStore.getState>, scanStore: { findings: any[]; techStack: any[]; url: string; overallScore: number | null }): string {
  const parts: string[] = [];

  parts.push(`**Target Analysis: ${scanStore.url || 'Unknown'}**\n`);

  if (scanStore.overallScore !== null) {
    const grade = scanStore.overallScore >= 80 ? 'Excellent' : scanStore.overallScore >= 60 ? 'Good' : scanStore.overallScore >= 40 ? 'Fair' : 'Poor';
    parts.push(`Security Score: **${scanStore.overallScore}/100** (${grade})`);
  }

  if (store.dnaProfile) {
    parts.push(`\n**DNA Profile:**\n- Architecture: ${store.dnaProfile.architectureSignature}\n- Style: ${store.dnaProfile.developmentStyle}\n- Sophistication: ${store.dnaProfile.sophisticationScore}/100\n- AI Contribution: ${store.dnaProfile.aiContributionLevel}%`);
  }

  if (store.reputationScores) {
    parts.push(`\n**Reputation:**\n- Security: ${store.reputationScores.security}/100\n- Privacy: ${store.reputationScores.privacy}/100\n- Trust: ${store.reputationScores.trust}/100`);
  }

  if (scanStore.findings.length > 0) {
    const critical = scanStore.findings.filter((f: any) => f.severity === 'Critical').length;
    const high = scanStore.findings.filter((f: any) => f.severity === 'High').length;
    parts.push(`\n**Findings:** ${scanStore.findings.length} total (${critical} critical, ${high} high)`);
  }

  if (store.secretFindings.length > 0) {
    parts.push(`\n⚠ **${store.secretFindings.length} secret/token leaks detected**`);
  }

  if (store.behavioralProfile) {
    parts.push(`\n**Behavioral Risk:** ${store.behavioralProfile.behavioralRiskLevel} (${store.behavioralProfile.trackers.length} trackers)`);
  }

  if (scanStore.techStack.length > 0) {
    parts.push(`\n**Tech Stack:** ${scanStore.techStack.slice(0, 8).map((t: any) => t.name).join(', ')}${scanStore.techStack.length > 8 ? ` +${scanStore.techStack.length - 8} more` : ''}`);
  }

  return parts.join('\n') || 'No analysis data available yet. Run a scan to begin.';
}

// Pre-built contextual Q&A
const QUICK_QUERIES = [
  { label: 'Summarize findings', query: 'summary' },
  { label: 'Top threats', query: 'threats' },
  { label: 'Privacy assessment', query: 'privacy' },
  { label: 'AI analysis', query: 'ai' },
  { label: 'Recommendations', query: 'recommendations' },
];

function generateAnswer(query: string, store: ReturnType<typeof useIntelligenceStore.getState>, scanStore: { findings: any[]; techStack: any[]; url: string; overallScore: number | null; aiAnalysis: any }): string {
  switch (query) {
    case 'summary':
      return generateContextualSummary(store, scanStore);

    case 'threats': {
      if (scanStore.findings.length === 0) return 'No threats detected yet. Run a vulnerability scan first.';
      const criticals = scanStore.findings.filter((f: any) => f.severity === 'Critical');
      const highs = scanStore.findings.filter((f: any) => f.severity === 'High');
      let msg = `**Threat Overview:**\n\n`;
      if (criticals.length > 0) {
        msg += `🔴 **Critical (${criticals.length}):**\n${criticals.slice(0, 5).map((f: any) => `- ${f.title}`).join('\n')}\n\n`;
      }
      if (highs.length > 0) {
        msg += `🟠 **High (${highs.length}):**\n${highs.slice(0, 5).map((f: any) => `- ${f.title}`).join('\n')}\n\n`;
      }
      if (store.secretFindings.length > 0) {
        msg += `⚠ **Secret Leaks:** ${store.secretFindings.length} exposed tokens/keys detected\n`;
      }
      return msg;
    }

    case 'privacy': {
      if (!store.behavioralProfile) return 'No behavioral data yet. Run a behavioral analysis scan.';
      const b = store.behavioralProfile;
      return `**Privacy Assessment:**\n\n- Risk Level: **${b.behavioralRiskLevel}**\n- Privacy Risk Score: ${b.privacyRiskScore}/100\n- Tracking Intensity: ${b.trackingIntensity}/100\n- Trackers Found: ${b.trackers.length}\n- Fingerprinters: ${b.fingerprinters.length}\n\n${b.trackers.length > 0 ? `**Detected Trackers:**\n${b.trackers.map(t => `- ${t}`).join('\n')}` : 'No third-party trackers detected.'}`;
    }

    case 'ai': {
      if (!store.aiForensics && !scanStore.aiAnalysis) return 'No AI analysis data yet. Run an AI forensics scan.';
      let msg = '**AI Analysis:**\n\n';
      if (store.aiForensics) {
        msg += `- AI Confidence: ${store.aiForensics.aiConfidenceScore}%\n- Probable Sources: ${store.aiForensics.probableAISource.join(', ') || 'None'}\n- Human vs AI: ${(store.aiForensics.humanVsAiRatio * 100).toFixed(1)}% human\n- AI Regions: ${store.aiForensics.aiRegions.length}\n`;
      }
      if (scanStore.aiAnalysis) {
        msg += `\n**Detection Results:**\n- Overall Score: ${scanStore.aiAnalysis.overallScore}%\n- Verdict: ${scanStore.aiAnalysis.verdict}\n`;
      }
      return msg;
    }

    case 'recommendations': {
      const recs: string[] = [];
      if (scanStore.findings.some((f: any) => f.severity === 'Critical')) {
        recs.push('🔴 Address all critical vulnerabilities immediately');
      }
      if (store.secretFindings.length > 0) {
        recs.push('⚠ Rotate all exposed API keys and tokens');
      }
      if (store.behavioralProfile && store.behavioralProfile.privacyRiskScore > 70) {
        recs.push('🟡 Review and minimize third-party trackers');
      }
      if (store.securityIntel) {
        recs.push('🔒 Review and strengthen security headers (HSTS, CSP)');
      }
      if (store.obfuscation) {
        recs.push('🔍 Audit obfuscated scripts for potential threats');
      }
      if (recs.length === 0) {
        recs.push('✅ No critical issues found. Continue monitoring.');
      }
      return `**Recommendations:**\n\n${recs.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    }

    default:
      return `I can help you understand the scan results. Try asking about:\n- **Threats** — top vulnerability findings\n- **Privacy** — tracking and behavioral analysis\n- **AI** — AI detection results\n- **Recommendations** — prioritized action items`;
  }
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanStore = useScanStore();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'system',
        content: 'HEARTCODE Intelligence Assistant initialized. Ask me about scan results, threats, privacy, or request recommendations.',
        timestamp: Date.now(),
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSubmit = useCallback(async (queryOverride?: string) => {
    const query = queryOverride || input.trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 500 + Math.random() * 800));

    // Generate response
    const store = useIntelligenceStore.getState();
    const normalizedQuery = query.toLowerCase();
    let matchedQuery = 'default';

    if (normalizedQuery.includes('summar') || normalizedQuery.includes('overview') || normalizedQuery.includes('report')) matchedQuery = 'summary';
    else if (normalizedQuery.includes('threat') || normalizedQuery.includes('vuln') || normalizedQuery.includes('finding') || normalizedQuery.includes('danger')) matchedQuery = 'threats';
    else if (normalizedQuery.includes('privacy') || normalizedQuery.includes('track') || normalizedQuery.includes('cookie') || normalizedQuery.includes('behavior')) matchedQuery = 'privacy';
    else if (normalizedQuery.includes('ai') || normalizedQuery.includes('artificial') || normalizedQuery.includes('generated') || normalizedQuery.includes('machine')) matchedQuery = 'ai';
    else if (normalizedQuery.includes('recommend') || normalizedQuery.includes('action') || normalizedQuery.includes('fix') || normalizedQuery.includes('improve')) matchedQuery = 'recommendations';

    const answer = generateAnswer(matchedQuery, store, {
      findings: scanStore.findings,
      techStack: scanStore.techStack,
      url: scanStore.url,
      overallScore: scanStore.overallScore,
      aiAnalysis: scanStore.aiAnalysis,
    });

    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: answer,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  }, [input, scanStore]);

  return (
    <>
      {/* FAB Button */}
      <button
        className={`ai-assistant-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Intelligence Assistant"
      >
        <span className="ai-assistant-fab-icon">{isOpen ? '✕' : '◈'}</span>
        {!isOpen && <span className="ai-assistant-fab-pulse" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="ai-assistant-panel">
          {/* Header */}
          <div className="ai-assistant-header">
            <div className="ai-assistant-header-left">
              <span className="ai-assistant-header-icon">◈</span>
              <span className="ai-assistant-header-title">INTEL ASSISTANT</span>
            </div>
            <button className="ai-assistant-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Quick Actions */}
          <div className="ai-assistant-quick">
            {QUICK_QUERIES.map(q => (
              <button
                key={q.query}
                className="ai-assistant-quick-btn"
                onClick={() => handleSubmit(q.label)}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="ai-assistant-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-assistant-msg ${msg.role}`}>
                <div className="ai-assistant-msg-bubble">
                  {msg.content.split('\n').map((line, i) => {
                    // Basic markdown-like rendering
                    let rendered = line
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`(.+?)`/g, '<code>$1</code>');
                    return <div key={i} dangerouslySetInnerHTML={{ __html: rendered || '&nbsp;' }} />;
                  })}
                </div>
                <span className="ai-assistant-msg-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="ai-assistant-msg assistant">
                <div className="ai-assistant-msg-bubble typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-assistant-input-area">
            <input
              ref={inputRef}
              type="text"
              className="ai-assistant-input"
              placeholder="Ask about scan results..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              className="ai-assistant-send"
              onClick={() => handleSubmit()}
              disabled={!input.trim()}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
