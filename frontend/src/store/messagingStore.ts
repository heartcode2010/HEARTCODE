import { create } from 'zustand';

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'voice' | 'file' | 'location' | 'contact' | 'sticker' | 'gif' | 'system';
export type ConversationType = 'dm' | 'group' | 'channel' | 'community' | 'broadcast';
export type UserStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';
export type MemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  reactions: Reaction[];
  isEdited: boolean;
  isDeleted: boolean;
  isPinned: boolean;
  isForwarded: boolean;
  readBy: string[];
  timestamp: number;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  description?: string;
  members: { userId: string; name: string; avatar?: string; role: MemberRole; status: UserStatus; lastSeen?: number }[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: number;
  inviteLink?: string;
  typingUsers: string[];
}

const NOW = Date.now();
const mockUsers = [
  { userId: 'amb', name: 'Ambassador Heartcode', role: 'owner' as MemberRole, status: 'online' as UserStatus },
  { userId: 'user1', name: 'Chinedu Obi', role: 'member' as MemberRole, status: 'online' as UserStatus },
  { userId: 'user2', name: 'Fatima Musa', role: 'member' as MemberRole, status: 'away' as UserStatus },
  { userId: 'user3', name: 'Emeka Nwankwo', role: 'moderator' as MemberRole, status: 'offline' as UserStatus, lastSeen: NOW - 3600000 },
];

const mockConversations: Conversation[] = [
  {
    id: 'dm-amb', type: 'dm', name: 'Ambassador Heartcode', unreadCount: 2, isPinned: true, isMuted: false, isArchived: false, createdAt: NOW - 86400000, typingUsers: [],
    members: [mockUsers[0], { userId: 'me', name: 'You', role: 'member', status: 'online' }],
    lastMessage: { id: 'm1', conversationId: 'dm-amb', senderId: 'amb', senderName: 'Ambassador Heartcode', type: 'text', content: 'Make sure to run your URL scanner on target ports to audit for API leaks.', reactions: [], isEdited: false, isDeleted: false, isPinned: false, isForwarded: false, readBy: ['amb'], timestamp: NOW - 120000 },
  },
];

interface MessagingStoreState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  drafts: Record<string, string>;
  searchQuery: string;
  filterType: ConversationType | 'all';
  currentUserId: string;

  setActiveConversation: (id: string) => void;
  getActiveConversation: () => Conversation | undefined;
  getFilteredConversations: () => Conversation[];
  setFilter: (type: ConversationType | 'all') => void;
  setSearchQuery: (q: string) => void;
  sendMessage: (conversationId: string, content: string, type?: MessageType, mediaUrl?: string, fileName?: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  reactToMessage: (conversationId: string, messageId: string, emoji: string) => void;
  pinMessage: (conversationId: string, messageId: string) => void;
  replyToMessage: (conversationId: string, messageId: string, content: string) => void;
  getMessages: (conversationId: string) => Message[];
  simulateTyping: (conversationId: string, userId: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const useMessagingStore = create<MessagingStoreState>((set, get) => ({
  conversations: mockConversations,
  activeConversationId: 'dm-amb',
  messages: {
    'dm-amb': [
      { id: 'ma1', conversationId: 'dm-amb', senderId: 'amb', senderName: 'Ambassador Heartcode', type: 'text', content: 'Welcome to Technova OS. I am Ambassador Heartcode.', reactions: [], isEdited: false, isDeleted: false, isPinned: false, isForwarded: false, readBy: ['amb', 'me'], timestamp: NOW - 86400000 },
    ]
  },
  drafts: {},
  searchQuery: '',
  filterType: 'all',
  currentUserId: 'me',

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    get().markAsRead(id);
  },

  getActiveConversation: () => {
    const { conversations, activeConversationId } = get();
    return conversations.find(c => c.id === activeConversationId);
  },

  getFilteredConversations: () => {
    const { conversations, filterType, searchQuery } = get();
    let filtered = filterType === 'all' ? conversations : conversations.filter(c => c.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage?.content.toLowerCase().includes(q));
    }
    return filtered;
  },

  setFilter: (type) => set({ filterType: type }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  sendMessage: (conversationId, content, type = 'text', mediaUrl, fileName) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId, senderId: 'me', senderName: 'You', type, content,
      mediaUrl, fileName, reactions: [], isEdited: false, isDeleted: false,
      isPinned: false, isForwarded: false, readBy: ['me'], timestamp: Date.now(),
    };
    set(s => {
      const msgs = { ...s.messages };
      msgs[conversationId] = [...(msgs[conversationId] || []), msg];
      const convos = s.conversations.map(c => c.id === conversationId ? { ...c, lastMessage: msg } : c);
      return { messages: msgs, conversations: convos };
    });
  },

  editMessage: (conversationId, messageId, newContent) => {},
  deleteMessage: (conversationId, messageId) => set(s => {
    const msgs = { ...s.messages };
    msgs[conversationId] = (msgs[conversationId] || []).map(m => m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m);
    return { messages: msgs };
  }),

  reactToMessage: (conversationId, messageId, emoji) => set(s => {
    const msgs = { ...s.messages };
    msgs[conversationId] = (msgs[conversationId] || []).map(m => {
      if (m.id !== messageId) return m;
      const reactions = [...m.reactions];
      const existing = reactions.find(r => r.emoji === emoji);
      if (existing) {
        if (existing.users.includes('me')) {
          existing.users = existing.users.filter(u => u !== 'me');
        } else {
          existing.users.push('me');
        }
      } else {
        reactions.push({ emoji, users: ['me'] });
      }
      return { ...m, reactions };
    });
    return { messages: msgs };
  }),

  pinMessage: (conversationId, messageId) => set(s => {
    const msgs = { ...s.messages };
    msgs[conversationId] = (msgs[conversationId] || []).map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m);
    return { messages: msgs };
  }),

  replyToMessage: (conversationId, messageId, content) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId, senderId: 'me', senderName: 'You', type: 'text', content,
      replyTo: messageId, reactions: [], isEdited: false, isDeleted: false,
      isPinned: false, isForwarded: false, readBy: ['me'], timestamp: Date.now(),
    };
    set(s => {
      const msgs = { ...s.messages };
      msgs[conversationId] = [...(msgs[conversationId] || []), msg];
      return { messages: msgs };
    });
  },

  getMessages: (conversationId) => get().messages[conversationId] || [],

  simulateTyping: (conversationId, userId) => {
    set(s => ({
      conversations: s.conversations.map(c => c.id === conversationId ? { ...c, typingUsers: [...c.typingUsers, userId] } : c),
    }));
    setTimeout(() => {
      set(s => ({
        conversations: s.conversations.map(c => c.id === conversationId ? { ...c, typingUsers: c.typingUsers.filter(u => u !== userId) } : c),
      }));
    }, 2000);
  },

  markAsRead: (conversationId) => set(s => ({
    conversations: s.conversations.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c),
  })),
}));

export default useMessagingStore;
