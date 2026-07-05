import { create } from 'zustand';

export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  model: string;
  icon: string;
  color: string;
  available: boolean;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  { id: 'openai', name: 'OpenAI GPT-4', model: 'gpt-4o', icon: '🤖', color: '#10a37f', available: true },
  { id: 'gemini', name: 'Google Gemini', model: 'gemini-2.0-flash', icon: '💎', color: '#4285f4', available: true },
  { id: 'claude', name: 'Anthropic Claude', model: 'claude-sonnet-4-20250514', icon: '🧠', color: '#cc785c', available: true },
];

export interface AIPersonality {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  systemPrompt: string;
}

export const AI_PERSONALITIES: AIPersonality[] = [
  { id: 'ambassador', name: 'Ambassador Heartcode', role: 'Cyber Security Mastermind', icon: '👑', color: '#e02840', systemPrompt: 'You are Ambassador Heartcode, the visionary creator of Technova OS. You are a cybersecurity mastermind. Speak with authority.' },
];

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: AIProvider;
  personality?: string;
  isLoading?: boolean;
  toolUsed?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  provider: AIProvider;
  personality: string;
  createdAt: number;
  updatedAt: number;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  category: 'study' | 'code' | 'writing' | 'career' | 'productivity';
}

export const AI_TOOLS: AITool[] = [
  { id: 'quiz', name: 'Quiz Generator', description: 'Generate quizzes on any topic', icon: '❓', prompt: 'Generate a quiz with 5 multiple-choice questions about:', category: 'study' },
];

interface AIStoreState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  activeProvider: AIProvider;
  activePersonality: string;
  isGenerating: boolean;
  activeTool: string | null;

  createConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  setProvider: (provider: AIProvider) => void;
  setPersonality: (personality: string) => void;
  sendMessage: (content: string, toolId?: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
  setActiveTool: (toolId: string | null) => void;
}

export const useAIStore = create<AIStoreState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  activeProvider: 'openai',
  activePersonality: 'ambassador',
  isGenerating: false,
  activeTool: null,

  createConversation: (title) => {
    const id = `ai-${Date.now()}`;
    const personality = get().activePersonality;
    const conv: AIConversation = {
      id,
      title: title || 'New Conversation',
      messages: [{
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `Connected to AI Assistant. How can I help you today?`,
        timestamp: Date.now(),
        personality,
      }],
      provider: get().activeProvider,
      personality,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set(s => ({ conversations: [conv, ...s.conversations], activeConversationId: id }));
    return id;
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),
  setProvider: (provider) => set({ activeProvider: provider }),
  setPersonality: (personality) => set({ activePersonality: personality }),

  sendMessage: async (content, toolId) => {
    let convoId = get().activeConversationId;
    if (!convoId) {
      convoId = get().createConversation(content.slice(0, 40));
    }

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      toolUsed: toolId || undefined,
    };

    set(s => ({
      isGenerating: true,
      conversations: s.conversations.map(c => c.id === convoId ? { ...c, messages: [...c.messages, userMsg] } : c)
    }));

    // Simulating response
    setTimeout(() => {
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `Response to: ${content}. Custom models are ready.`,
        timestamp: Date.now(),
        provider: get().activeProvider,
        personality: get().activePersonality,
      };
      set(s => ({
        isGenerating: false,
        conversations: s.conversations.map(c => c.id === convoId ? { ...c, messages: [...c.messages, aiMsg] } : c)
      }));
    }, 1000);
  },

  deleteConversation: (id) => set(s => ({ conversations: s.conversations.filter(c => c.id !== id) })),
  clearConversations: () => set({ conversations: [], activeConversationId: null }),
  setActiveTool: (toolId) => set({ activeTool: toolId }),
}));

export default useAIStore;
