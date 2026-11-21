import axios from 'axios';

type ProviderResult = { content: string; provider: 'groq' | 'openai' | 'gemini' };

export class AIContentService {
  static async generate(system: string, prompt: string): Promise<ProviderResult> {
    const failures: string[] = [];
    const groqKey = process.env.GROQ_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (groqKey) {
      try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
          temperature: 0.65,
          max_tokens: 1800,
        }, { headers: { Authorization: 'Bearer ' + groqKey }, timeout: 30000 });
        const content = response.data?.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim()) return { content: content.trim(), provider: 'groq' };
        failures.push('Groq returned an empty response.');
      } catch { failures.push('Groq request failed.'); }
    }

    if (openAIKey) {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
          temperature: 0.65,
          max_tokens: 1800,
        }, { headers: { Authorization: 'Bearer ' + openAIKey }, timeout: 30000 });
        const content = response.data?.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim()) return { content: content.trim(), provider: 'openai' };
        failures.push('OpenAI returned an empty response.');
      } catch { failures.push('OpenAI request failed.'); }
    }

    if (geminiKey) {
      try {
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(geminiKey), {
          contents: [{ parts: [{ text: system + '\n\n' + prompt }] }],
          generationConfig: { temperature: 0.65, maxOutputTokens: 1800 },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
        const content = response.data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('');
        if (typeof content === 'string' && content.trim()) return { content: content.trim(), provider: 'gemini' };
        failures.push('Gemini returned an empty response.');
      } catch { failures.push('Gemini request failed.'); }
    }

    if (!groqKey && !openAIKey && !geminiKey) {
      const error: any = new Error('No AI provider is configured. Add GROQ_API_KEY, OPENAI_API_KEY or GEMINI_API_KEY to the backend environment.');
      error.statusCode = 503;
      throw error;
    }
    const error: any = new Error('All configured AI providers failed. Check provider quota, model access and API keys.');
    error.statusCode = 502;
    error.providerFailures = failures;
    throw error;
  }
}
export default AIContentService;
