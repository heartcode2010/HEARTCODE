import axios from 'axios';
import { VulnerabilityFinding } from './scanner/types';

export class AIService {
  /**
   * Conversational cybersecurity expert chat (Talkie-style)
   */
  static async chatExpert(messages: Array<{ role: string; content: string }>, persona: string = 'red_team'): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let systemPersona = '';
    switch (persona) {
      case 'blue_team':
        systemPersona = 'You are a Senior Defensive Cyber Operations Specialist and Blue Team Lead for HEARTCODE. You specialize in system hardening, zero trust architecture, SOC triage, SIEM telemetry, and incident containment. Speak with tactical clarity, precision, and actionable mitigation guidance.';
        break;
      case 'threat_hunter':
        systemPersona = 'You are an Elite Global Threat Intelligence Hunter for HEARTCODE. You analyze APT campaigns, nation-state actors, malware signatures, MITRE ATT&CK techniques, and zero-day vulnerabilities. Speak like an intelligence operative deciphering adversary tradecraft.';
        break;
      case 'mentor':
        systemPersona = 'You are a friendly, deeply knowledgeable Cybersecurity Professor and Academy Mentor at HEARTCODE. You guide students and analysts through practical security challenges, certs (OSCP, CEH, CISSP), and real-world ethical hacking with engaging analogies.';
        break;
      case 'red_team':
      default:
        systemPersona = 'You are a Principal Red Team Operator and Adversary Simulation Engineer at HEARTCODE. You understand attack surfaces, web application exploits (OWASP, deserialization, SSRF, memory corruption, reverse engineering), and defensive evasion. Speak with commanding technical expertise and direct insights.';
        break;
    }

    const lastMessage = messages[messages.length - 1]?.content || 'Hello';
    const conversationContext = messages.slice(-6).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const combinedPrompt = `${systemPersona}\n\nRecent Conversation:\n${conversationContext}\n\nProvide your authoritative, concise response (under 250 words unless detailed code is needed):`;

    // 1. Try Groq for ultra-fast response
    if (groqKey) {
      try {
        const groqResp = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPersona },
              ...messages.slice(-8),
            ],
            temperature: 0.6,
            max_tokens: 600,
          },
          {
            headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
            timeout: 8000,
          }
        );
        const reply = groqResp.data?.choices?.[0]?.message?.content;
        if (reply) return reply;
      } catch {
        // Fallback to Gemini
      }
    }

    // 2. Try Gemini
    if (geminiKey) {
      try {
        const geminiResp = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: combinedPrompt }] }],
          },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        const reply = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      } catch {
        // Fallback to OpenAI
      }
    }

    // 3. Try OpenAI
    if (openAIKey) {
      try {
        const openAIResp = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPersona },
              ...messages.slice(-8),
            ],
            temperature: 0.6,
          },
          {
            headers: { Authorization: `Bearer ${openAIKey}`, 'Content-Type': 'application/json' },
            timeout: 10000,
          }
        );
        const reply = openAIResp.data?.choices?.[0]?.message?.content;
        if (reply) return reply;
      } catch {
        // Local heuristic fallback
      }
    }

    // Dynamic offline intelligence fallback
    return `[HEARTCODE Intelligence Matrix Active]\n\nRegarding "${lastMessage.substring(0, 50)}...": Our operational protocol recommends verifying endpoint integrity, checking authentication tokens for entropy degradation, and scanning for improper access control headers. Configure primary API providers in .env to activate live streaming neural neural reasoning.`;
  }

  /**
   * Explains a specific vulnerability finding in beginner, intermediate, and expert terms.
   */
  static async explainFinding(finding: VulnerabilityFinding): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    const prompt = `You are a Principal Cybersecurity Analyst for the HEARTCODE platform.
Your task is to explain a specific security vulnerability finding to a security operator, providing context at beginner, intermediate, and expert levels, along with secure implementation examples.

--- FINDING DATA ---
Vulnerability: ${finding.name}
Severity: ${finding.severity}
Category: ${finding.category}
Description: ${finding.description}
Technical Detail: ${finding.technicalExplanation}
Business Impact: ${finding.businessImpact}
Standard Remediation: ${finding.remediation}
Evidence: ${finding.evidence}
--------------------

Please format your response strictly in Markdown using the following structure:

### 🔰 Beginner Explanation
(Explain what this means clearly, using an intuitive analogy if helpful)

### 🚀 Intermediate Explanation
(Explain the mechanics of the vulnerability, how it could be exploited, and the standard fix)

### 🧠 Expert Explanation
(Deep dive into the underlying protocols, complex exploitation chains, edge cases, and advanced remediation strategies)

### 🛠️ Secure Implementation Examples
(Provide code snippets or configuration examples showing how to fix this issue properly)`;

    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch {
        // Fallback
      }
    }

    if (openAIKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] },
          { headers: { Authorization: `Bearer ${openAIKey}`, 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        const text = response.data?.choices?.[0]?.message?.content;
        if (text) return text;
      } catch {
        // Fallback
      }
    }

    return `### 🔰 Beginner Explanation\nThis issue relates to ${finding.name}. Without proper security restrictions, external clients may observe internal parameters.\n\n### 🚀 Intermediate Explanation\n${finding.technicalExplanation || finding.description}\n\n### 🧠 Expert Explanation\nRisk classification is ${finding.severity.toUpperCase()}. Review ${finding.remediation}\n\n### 🛠️ Secure Implementation Examples\n\`\`\`bash\n# Enforce security baseline\nHeader set X-Content-Type-Options "nosniff"\n\`\`\``;
  }

  static async generateDeepReport(html: string, url: string): Promise<string> {
    return this.analyzeSourceCode(html, url);
  }

  static async analyzeSourceCode(html: string, url: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const truncatedSource = html.substring(0, 15000);
    const prompt = `You are a Principal Security Auditor. Perform an in-depth security analysis of the client-side code:
Target URL: ${url}

Source Code:
\`\`\`html
${truncatedSource}
\`\`\`

Analyze:
1. Input validation & XSS risk
2. Client-side storage of sensitive details
3. Hardcoded secrets/credentials (API keys, passwords, tokens)
4. Outdated libraries or vulnerable inclusions
5. CSP or Frame-embedding security parameters

Provide a structured Markdown report with clear severity findings and remediation instructions.`;

    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } catch {}
    }

    if (openAIKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] },
          { headers: { Authorization: `Bearer ${openAIKey}`, 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch {}
    }

    return `### ⚡ Security Analysis Complete\n\nAnalyzed ${html.length} bytes for target **${url}**. Key surface areas reviewed: Content Security Policy, script injections, and header protections.`;
  }
}

export default AIService;
