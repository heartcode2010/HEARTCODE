import axios from 'axios';
import { VulnerabilityFinding } from './scanner/types';

export class AIService {
  /**
   * Explains a specific vulnerability finding in beginner, intermediate, and expert terms.
   * Resolves automatically to the configured AI provider in .env.
   */
  static async explainFinding(finding: VulnerabilityFinding): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    const prompt = `You are an expert cybersecurity Copilot for the HEARTCODE platform.
Your task is to explain a specific security vulnerability finding to a user, providing context at beginner, intermediate, and expert levels, along with secure implementation examples.

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
(Explain what this means as if to a non-technical manager or junior developer, using an analogy if helpful)

### 🚀 Intermediate Explanation
(Explain the mechanics of the vulnerability, how it could be exploited, and the standard fix)

### 🧠 Expert Explanation
(Deep dive into the underlying protocols, complex exploitation chains, edge cases, and advanced remediation strategies)

### 🛠️ Secure Implementation Examples
(Provide code snippets or configuration examples showing how to fix this issue properly)

Do not include any introductory or concluding conversational text. Start directly with the first heading.`;

    // 1. Try Gemini
    if (geminiKey) {
      try {
        console.log('[AIService] Running Gemini 1.5 Flash finding explanation...');
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );

        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } catch (err) {
        console.error('[AIService] Gemini call failed:', (err as Error).message);
      }
    }

    // 2. Try OpenAI
    if (openAIKey) {
      try {
        console.log('[AIService] Running OpenAI GPT-4o-mini finding explanation...');
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.2,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAIKey}`,
            },
            timeout: 15000,
          }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {
        console.error('[AIService] OpenAI call failed:', (err as Error).message);
      }
    }

    // 3. Fallback mock if no API key is configured
    console.log('[AIService] No LLM keys configured, returning mock explanation...');
    return `### ⚡ AI Security Analysis Offline

To unlock detailed AI Copilot explanations, please configure your API keys (\`GEMINI_API_KEY\` or \`OPENAI_API_KEY\`) in the backend \`.env\` file.

---

### 🔰 Beginner Explanation
This vulnerability means there is a gap in how the website protects its data or visitors. Think of it like a house with a locked front door, but a window left wide open.

### 🚀 Intermediate Explanation
Based on the finding **${finding.name}**, the system lacks the recommended security controls. Attackers can exploit this misconfiguration to bypass intended restrictions, potentially reading or modifying data depending on the exact context.

### 🧠 Expert Explanation
The technical evidence (\`${finding.evidence?.substring(0, 50)}...\`) confirms the absence of enforcing policies. This permits downgrade attacks, injection vectors, or session state manipulation depending on the subsystem affected. Remediation requires patching the specific configuration layer identified.

### 🛠️ Secure Implementation Examples
Please refer to the standard remediation guidance: 
> *${finding.remediation}*`;
  }

  static async generateDeepReport(html: string, url: string): Promise<string> {
    return this.analyzeSourceCode(html, url);
  }

  /**
   * Original method for full page deep analysis (Kept for compatibility)
   */
  static async analyzeSourceCode(html: string, url: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    const truncatedSource = html.substring(0, 15000);
    const prompt = `You are an expert cybersecurity auditor. Perform a deep security vulnerability analysis of the client-side HTML/JavaScript/CSS source code of the following target website:
Target URL: ${url}

Source Code (Truncated if too long):
\`\`\`html
${truncatedSource}
\`\`\`

Analyze the code for:
1. Input validation & XSS risk
2. Client-side storage of sensitive details
3. Hardcoded secrets/credentials (API keys, passwords, tokens)
4. Outdated libraries or vulnerable inclusions
5. CSP or Frame-embedding security parameters

Provide a structured analysis in Markdown format with clear subheadings, and highlight any high-risk vulnerabilities you identify. Keep your response concise, professional, and clear.`;

    // Try Gemini
    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } catch (err) {}
    }

    // Try OpenAI
    if (openAIKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.2 },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAIKey}` }, timeout: 15000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {}
    }

    return `### ⚡ AI Security Analysis Offline\n\nPlease configure API keys to unlock deep analysis.`;
  }
}
export default AIService;
