import { create } from 'zustand';

export type FeedCategory = 'all' | 'tech' | 'cyber' | 'blockchain' | 'education' | 'creative' | 'opportunities';
export type PostType = 'article' | 'video' | 'poll' | 'event' | 'announcement';

export interface FeedPost {
  id: string;
  author: { name: string; verified: boolean; role: string };
  type: PostType;
  category: FeedCategory;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  bookmarked: boolean;
  liked: boolean;
  timestamp: number;
  pollOptions?: { text: string; votes: number; voted: boolean }[];
  eventDate?: string;
  eventLocation?: string;
}

interface FeedStoreState {
  posts: FeedPost[];
  activeCategory: FeedCategory;
  searchQuery: string;

  setCategory: (cat: FeedCategory) => void;
  setSearchQuery: (q: string) => void;
  getFilteredPosts: () => FeedPost[];
  likePost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  sharePost: (postId: string) => void;
  votePoll: (postId: string, optionIdx: number) => void;
  createPost: (post: Partial<FeedPost>) => void;
}

export const useFeedStore = create<FeedStoreState>((set, get) => ({
  posts: [
    {
      id: 'fp1', type: 'announcement', category: 'all',
      author: { name: 'Ambassador Heartcode', verified: true, role: 'Creator' },
      title: '🚀 Technova v2.0 Launch',
      content: 'Technova v2.0 is live! Explore CyberVerse, BlockchainVerse, Nexora Studio, TechVerse, EduVerse and TechLabs.',
      tags: ['launch', 'technova'], likes: 300, comments: 20, shares: 15, bookmarked: false, liked: false, timestamp: Date.now()
    }
  ],
  activeCategory: 'all',
  searchQuery: '',

  setCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  getFilteredPosts: () => {
    const { posts, activeCategory } = get();
    return activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);
  },
  likePost: (id) => set(s => ({
    posts: s.posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
  })),
  bookmarkPost: (id) => set(s => ({
    posts: s.posts.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)
  })),
  sharePost: (id) => set(s => ({
    posts: s.posts.map(p => p.id === id ? { ...p, shares: p.shares + 1 } : p)
  })),
  votePoll: (id, idx) => {},
  createPost: (p) => set(s => ({
    posts: [{
      id: `fp-${Date.now()}`,
      author: { name: 'You', verified: false, role: 'Member' },
      type: 'announcement',
      category: 'tech',
      title: p.title || 'Untitled',
      content: p.content || '',
      tags: p.tags || [],
      likes: 0, comments: 0, shares: 0, bookmarked: false, liked: false, timestamp: Date.now(),
    }, ...s.posts]
  })),
}));

export default useFeedStore;
