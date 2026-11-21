import axios from 'axios';

export interface ScanContext {
  url: string;
  findingsCount: number;
  findings: Array<{ name: string; severity?: string; evidence?: string }>;
}

export class AcademyService {
  /**
   * Generates AI Cyber Tutor responses.
   */
  static async getTutorResponse(message: string, mode: 'beginner' | 'intermediate' | 'advanced', scanContext?: ScanContext | null, history: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let contextString = '';
    if (scanContext) {
      contextString = `The user has scanned the website "${scanContext.url}" finding ${scanContext.findingsCount} issues. Use this context if relevant to their prompt. Here are some key findings: ${scanContext.findings.slice(0, 3).map(f => `${f.name} (Severity: ${f.severity || 'Medium'})`).join(', ')}.`;
    }

    const prompt = `You are an expert AI Cyber Security Tutor for the HEARTCODE platform.
Your task is to teach the user and answer their questions about cybersecurity, web hacking, privacy protection, and online safety.

User target proficiency level: ${mode.toUpperCase()} (Respond appropriately for this skill level).
${contextString}

User message: "${message}"

Please provide a highly structured, educational response formatted in Markdown. Start directly with explanations and bullet points. Use code snippets or remediation checklists if relevant.`;

    const recentHistory = history.slice(-8).filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string').map(item => ({ role: item.role, content: item.content.slice(0, 4000) }));

    // Try Groq's OpenAI-compatible chat API first.
    if (groqKey) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: `You are HEARTCODE's expert cybersecurity tutor. Teach at the ${mode} level. ${contextString}` },
              ...recentHistory,
              { role: 'user', content: message }
            ],
            temperature: 0.4,
            max_tokens: 900
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` }, timeout: 20000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {
        console.error('[AcademyService] Groq tutor call failed:', (err as Error).message);
      }
    }

    // Try Gemini
    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { contents: [...recentHistory.map(item => ({ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text: item.content }] })), { role: 'user', parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } catch (err) {
        console.error('[AcademyService] Gemini tutor call failed:', (err as Error).message);
      }
    }

    // Try OpenAI
    if (openAIKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: 'You are HEARTCODE\'s expert cybersecurity tutor. Teach at the ' + mode + ' level. ' + contextString }, ...recentHistory, { role: 'user', content: message }],
            temperature: 0.3
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAIKey}` }, timeout: 15000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {
        console.error('[AcademyService] OpenAI tutor call failed:', (err as Error).message);
      }
    }

    if (!groqKey && !geminiKey && !openAIKey) {
      throw new Error('AI_PROVIDER_NOT_CONFIGURED: Add GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY to the Netlify site environment and redeploy.');
    }
    throw new Error('AI_PROVIDER_UNAVAILABLE: Configured AI providers did not return a response. Check the provider key, quota, and service status.');
  }

  /**
   * Analyzes text messages, links, or emails to detect social engineering.
   */
  static async analyzeScam(content: string): Promise<any> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const prompt = `You are a forensic cybersecurity analysis bot.
Examine the following pasted text (could be an email, SMS message, WhatsApp alert, or job pitch) for social engineering cues, advance-fee scams, phishing links, or identity theft attempts.

--- CONTENT ---
"${content}"
---------------

You must analyze this and return your evaluation ONLY as a valid JSON object matching the following TypeScript structure:
{
  "inputType": "email" | "sms" | "whatsapp" | "social-media" | "website" | "job-offer",
  "confidenceScore": number, // 0-100 score representing likelihood of scam
  "isLikelyScam": boolean,
  "scamCategory": "phishing" | "investment" | "romance" | "impersonation" | "crypto" | "fake-job" | "fake-giveaway" | "advance-fee" | "identity-theft" | "bec" | "safe",
  "redFlags": Array<{ "indicator": string, "severity": "high" | "medium" | "low", "explanation": string }>,
  "safetyRecommendations": string[],
  "explanation": string // Detailed educational analysis explaining the verdict
}

Do not include any Markdown blocks (\`\`\`json) or conversational texts in your response. Return strictly the raw JSON string.`;

    // Try Groq structured JSON response first.
    if (groqKey) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 1200,
            response_format: { type: 'json_object' }
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` }, timeout: 20000 }
        );
        const textResult = response.data?.choices?.[0]?.message?.content || '';
        const parsed = JSON.parse(textResult);
        return parsed;
      } catch (err) {
        console.error('[AcademyService] Groq scam analyzer failed:', (err as Error).message);
      }
    }

    // Try Gemini
    if (geminiKey) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );
        let textResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Cleanup markdown wrappers if present
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResult);
        return parsed;
      } catch (err) {
        console.error('[AcademyService] Gemini scam analyzer failed:', (err as Error).message);
      }
    }

    // Try OpenAI
    if (openAIKey) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAIKey}` }, timeout: 15000 }
        );
        let textResult = response.data?.choices?.[0]?.message?.content || '';
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResult);
        return parsed;
      } catch (err) {
        console.error('[AcademyService] OpenAI scam analyzer failed:', (err as Error).message);
      }
    }

    throw new Error('No LLM keys or calls succeeded');
  }

  /**
   * Generates custom curriculum outlines.
   */
  static async generateCurriculum(level: string, topic: string, duration: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const prompt = `You are an expert curriculum designer in cybersecurity.
Design a highly structured, week-by-week curriculum scheme of work.

Parameters:
Demographic / Grade level: ${level}
Topic Focus: ${topic}
Duration: ${duration}

Output a professional syllabus layout with week-by-week Objectives, Lesson Plans, Classroom Activities, and Quiz/Assessment ideas. Format strictly in clear plain text or basic Markdown.`;

    if (groqKey) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          { model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.35, max_tokens: 1800 },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` }, timeout: 20000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {
        console.error('[AcademyService] Groq curriculum generation failed:', (err as Error).message);
      }
    }

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
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAIKey}` }, timeout: 15000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {}
    }

    throw new Error('No LLM keys or calls succeeded');
  }

  /**
   * Generates public safety awareness campaigns.
   */
  static async generateCampaign(topic: string, style: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const prompt = `You are a public safety copywriter specializing in digital safety.
Generate copy or layout suggestions for an awareness campaign.

Topic: ${topic}
Deliverable Format / Style: ${style}

Ensure the content is highly engaging, highlights red flags, and offers actionable precautions. Format in clean, readable plain text.`;

    if (groqKey) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          { model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.5, max_tokens: 1200 },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` }, timeout: 20000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {
        console.error('[AcademyService] Groq campaign generation failed:', (err as Error).message);
      }
    }

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
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4
          },
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAIKey}` }, timeout: 15000 }
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (err) {}
    }

    throw new Error('No LLM keys or calls succeeded');
  }
}
export default AcademyService;
