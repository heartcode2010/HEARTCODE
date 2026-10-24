import { create } from 'zustand';

export interface Bot {
  id: string;
  name: string;
  username: string;
  description: string;
  avatarUrl: string;
  category: 'moderation' | 'education' | 'ai' | 'productivity' | 'business' | 'utility';
  developer: string;
  rating: number;
  installCount: number;
  isMonetized: boolean;
  priceNGN?: number;
  isInstalled: boolean;
  token?: string;
  commands: { command: string; description: string }[];
}

export interface BotWorkflow {
  id: string;
  name: string;
  trigger: string; // e.g., 'on_member_join', 'keyword', 'scheduled'
  triggerConfig: Record<string, any>;
  actions: { type: string; config: Record<string, any> }[];
  isEnabled: boolean;
}

const mockBots: Bot[] = [
  {
    id: 'bot_tutor',
    name: 'Technova Code Mentor',
    username: '@TechnovaMentorBot',
    description: 'Personal learning companion and coding mentor for cybersecurity and software development. Interactive explanations, quizzes, and custom learning roadmaps.',
    avatarUrl: '💎',
    category: 'education',
    developer: 'Technova Official',
    rating: 4.9,
    installCount: 1540,
    isMonetized: false,
    isInstalled: true,
    commands: [
      { command: '/tutor', description: 'Ask a learning question' },
      { command: '/quiz', description: 'Generate a quick quiz on a topic' },
      { command: '/explain', description: 'Explain a complex term' },
    ],
  },
  {
    id: 'bot_mod',
    name: 'ShieldGuard Moderator',
    username: '@ShieldGuardBot',
    description: 'Auto-moderator for groups and communities. Detects spam, filters toxic language, manages member links, and tracks warnings.',
    avatarUrl: '🛡️',
    category: 'moderation',
    developer: 'Ambassador Heartcode',
    rating: 4.8,
    installCount: 890,
    isMonetized: true,
    priceNGN: 1500,
    isInstalled: false,
    commands: [
      { command: '/warn', description: 'Warn a user' },
      { command: '/mute', description: 'Mute a user' },
      { command: '/rules', description: 'Configure custom channel rules' },
    ],
  },
  {
    id: 'bot_father',
    name: 'BotFather Creator',
    username: '@BotFather',
    description: 'The official utility bot to create, register, configure, and monetize your own custom Technova bots.',
    avatarUrl: '👑',
    category: 'utility',
    developer: 'Technova Official',
    rating: 5.0,
    installCount: 3400,
    isMonetized: false,
    isInstalled: true,
    commands: [
      { command: '/newbot', description: 'Create a new bot instance' },
      { command: '/mybots', description: 'Edit your existing bots' },
      { command: '/token', description: 'Generate/reset bot token' },
    ],
  },
  {
    id: 'bot_scheduler',
    name: 'AutoTask Workflow Scheduler',
    username: '@AutoTaskBot',
    description: 'Schedule automated messages, backups, reports, or reminder chains in direct messages and channels.',
    avatarUrl: '⚙️',
    category: 'productivity',
    developer: 'Technova Official',
    rating: 4.6,
    installCount: 520,
    isMonetized: false,
    isInstalled: false,
    commands: [
      { command: '/schedule', description: 'Create a new automated task trigger' },
      { command: '/tasks', description: 'List current active workflows' },
    ],
  },
];

interface BotStoreState {
  bots: Bot[];
  workflows: BotWorkflow[];
  installBot: (botId: string) => Promise<boolean>;
  uninstallBot: (botId: string) => void;
  createBot: (name: string, description: string, category: string) => string;
  addWorkflow: (workflow: BotWorkflow) => void;
  toggleWorkflow: (id: string) => void;
}

export const useBotStore = create<BotStoreState>((set, get) => ({
  bots: mockBots,
  workflows: [],

  installBot: async (botId) => {
    // If it is monetized, simulate payment
    const bot = get().bots.find(b => b.id === botId);
    if (bot?.isMonetized && !bot.isInstalled) {
      const confirmPay = window.confirm(`This bot costs ₦${bot.priceNGN}. Pay using OPay/Card via Paystack?`);
      if (!confirmPay) return false;
    }
    set(state => ({
      bots: state.bots.map(b => b.id === botId ? { ...b, isInstalled: true, token: `tok_${Math.random().toString(36).substring(7)}` } : b)
    }));
    return true;
  },

  uninstallBot: (botId) => {
    set(state => ({
      bots: state.bots.map(b => b.id === botId ? { ...b, isInstalled: false, token: undefined } : b)
    }));
  },

  createBot: (name, description, category) => {
    const username = `@${name.replace(/\s+/g, '')}Bot`;
    const newBot: Bot = {
      id: `bot_${Date.now()}`,
      name,
      username,
      description,
      avatarUrl: '🤖',
      category: category as any,
      developer: 'You (Technova Developer)',
      rating: 5.0,
      installCount: 0,
      isMonetized: false,
      isInstalled: true,
      token: `tok_${Math.random().toString(36).substring(7)}`,
      commands: [
        { command: '/start', description: 'Initialize the bot conversation' },
        { command: '/help', description: 'Get instruction vectors' },
      ],
    };
    set(state => ({
      bots: [...state.bots, newBot]
    }));
    return newBot.id;
  },

  addWorkflow: (workflow) => {
    set(state => ({
      workflows: [...state.workflows, workflow]
    }));
  },

  toggleWorkflow: (id) => {
    set(state => ({
      workflows: state.workflows.map(w => w.id === id ? { ...w, isEnabled: !w.isEnabled } : w)
    }));
  },
}));
