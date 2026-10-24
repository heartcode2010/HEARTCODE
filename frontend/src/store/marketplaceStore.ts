import { create } from 'zustand';

export type ProductCategory = 'template' | 'course' | 'notes' | 'report' | 'design' | 'code' | 'guide' | 'ebook' | 'tool' | 'resource';
export type ListingStatus = 'active' | 'pending_review' | 'rejected' | 'sold_out' | 'draft';
export type GigCategory = 'development' | 'design' | 'writing' | 'security' | 'research' | 'tutoring' | 'marketing' | 'other';
export type GigStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type OpportunityType = 'scholarship' | 'internship' | 'hackathon' | 'competition' | 'grant' | 'job' | 'freelance' | 'research';

export interface MarketplaceProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  status: ListingStatus;
  tags: string[];
  createdAt: number;
  fileSize?: string;
}

export interface FreelanceGig {
  id: string;
  posterId: string;
  posterName: string;
  title: string;
  description: string;
  category: GigCategory;
  budget: { min: number; max: number };
  currency: string;
  deadline?: string;
  applicants: number;
  status: GigStatus;
  skills: string[];
  createdAt: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  description: string;
  deadline?: string;
  location: string;
  url?: string;
  isSaved: boolean;
  tags: string[];
  postedAt: number;
}

export interface SkillProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  rating: number;
  projectsCompleted: number;
  totalEarnings: number;
  isVerified: boolean;
  portfolioItems: { title: string; description: string; imageUrl?: string }[];
}

export interface Review {
  id: string;
  productId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  timestamp: number;
}

const MOCK_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod_1', sellerId: 'amb', sellerName: 'Ambassador Heartcode',
    title: 'Cybersecurity Audit Report Template', description: 'Professional PDF template for pentest and vulnerability assessment reports. Includes risk matrices, OWASP mapping, and executive summaries.',
    category: 'template', price: 5000, currency: 'NGN', coverImage: '📄', rating: 4.9, reviewCount: 42, downloadCount: 320, status: 'active',
    tags: ['cybersecurity', 'template', 'report'], createdAt: Date.now() - 604800000, fileSize: '2.4 MB',
  },
  {
    id: 'prod_2', sellerId: 'amb', sellerName: 'Ambassador Heartcode',
    title: 'React + TypeScript Starter Kit', description: 'Production-ready boilerplate with Zustand, TailwindCSS, dark mode, auth flow, and API service layer.',
    category: 'code', price: 8000, currency: 'NGN', coverImage: '💻', rating: 4.8, reviewCount: 28, downloadCount: 185, status: 'active',
    tags: ['react', 'typescript', 'boilerplate'], createdAt: Date.now() - 1209600000, fileSize: '5.1 MB',
  },
  {
    id: 'prod_3', sellerId: 'user2', sellerName: 'Fatima Musa',
    title: 'WAEC/JAMB Mathematics Study Notes', description: 'Comprehensive study notes covering all WAEC and JAMB mathematics topics with solved examples and practice questions.',
    category: 'notes', price: 2000, currency: 'NGN', coverImage: '📚', rating: 4.7, reviewCount: 56, downloadCount: 430, status: 'active',
    tags: ['waec', 'jamb', 'mathematics', 'study'], createdAt: Date.now() - 1814400000, fileSize: '8.2 MB',
  },
];

const MOCK_GIGS: FreelanceGig[] = [
  {
    id: 'gig_1', posterId: 'user1', posterName: 'Chinedu Obi',
    title: 'Build a Portfolio Website', description: 'Need a modern responsive portfolio website with contact form, project gallery, and blog section.',
    category: 'development', budget: { min: 50000, max: 100000 }, currency: 'NGN',
    deadline: '2026-08-15', applicants: 3, status: 'open', skills: ['React', 'TypeScript', 'CSS'], createdAt: Date.now() - 172800000,
  },
  {
    id: 'gig_2', posterId: 'user3', posterName: 'Emeka Nwankwo',
    title: 'Security Assessment for SaaS Platform', description: 'Need a comprehensive security audit including vulnerability scanning, penetration testing, and a detailed report.',
    category: 'security', budget: { min: 150000, max: 300000 }, currency: 'NGN',
    deadline: '2026-07-30', applicants: 1, status: 'open', skills: ['Penetration Testing', 'OWASP', 'Report Writing'], createdAt: Date.now() - 86400000,
  },
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1', title: 'Google Africa Developer Scholarship 2026', organization: 'Google',
    type: 'scholarship', description: 'Full scholarship for Android, Cloud, or Web development tracks. Open to African developers.',
    deadline: '2026-09-30', location: 'Remote / Africa', isSaved: false,
    tags: ['google', 'scholarship', 'developer'], postedAt: Date.now() - 259200000,
  },
  {
    id: 'opp_2', title: 'HNG Internship 11', organization: 'HNG Tech',
    type: 'internship', description: 'Remote internship program for developers across Africa. Work on real projects and get hired.',
    deadline: '2026-08-15', location: 'Remote', isSaved: true,
    tags: ['internship', 'development', 'remote'], postedAt: Date.now() - 432000000,
  },
  {
    id: 'opp_3', title: 'Africa Cyber Defense Hackathon', organization: 'CyberSafe Foundation',
    type: 'hackathon', description: 'Build innovative cybersecurity solutions for African businesses. Cash prizes and mentorship.',
    deadline: '2026-07-20', location: 'Lagos, Nigeria', isSaved: false,
    tags: ['hackathon', 'cybersecurity', 'africa'], postedAt: Date.now() - 604800000,
  },
];

interface MarketplaceStoreState {
  products: MarketplaceProduct[];
  gigs: FreelanceGig[];
  opportunities: Opportunity[];
  reviews: Review[];
  productFilter: ProductCategory | 'all';
  gigFilter: GigCategory | 'all';
  oppFilter: OpportunityType | 'all';
  searchQuery: string;

  setProductFilter: (filter: ProductCategory | 'all') => void;
  setGigFilter: (filter: GigCategory | 'all') => void;
  setOppFilter: (filter: OpportunityType | 'all') => void;
  setSearchQuery: (q: string) => void;

  getFilteredProducts: () => MarketplaceProduct[];
  getFilteredGigs: () => FreelanceGig[];
  getFilteredOpportunities: () => Opportunity[];

  purchaseProduct: (productId: string) => boolean;
  listProduct: (product: Partial<MarketplaceProduct>) => string;
  postGig: (gig: Partial<FreelanceGig>) => string;
  applyToGig: (gigId: string) => void;
  saveOpportunity: (oppId: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
}

export const useMarketplaceStore = create<MarketplaceStoreState>((set, get) => ({
  products: MOCK_PRODUCTS,
  gigs: MOCK_GIGS,
  opportunities: MOCK_OPPORTUNITIES,
  reviews: [],
  productFilter: 'all',
  gigFilter: 'all',
  oppFilter: 'all',
  searchQuery: '',

  setProductFilter: (filter) => set({ productFilter: filter }),
  setGigFilter: (filter) => set({ gigFilter: filter }),
  setOppFilter: (filter) => set({ oppFilter: filter }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  getFilteredProducts: () => {
    const { products, productFilter, searchQuery } = get();
    let filtered = productFilter === 'all' ? products : products.filter(p => p.category === productFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    return filtered.filter(p => p.status === 'active');
  },

  getFilteredGigs: () => {
    const { gigs, gigFilter, searchQuery } = get();
    let filtered = gigFilter === 'all' ? gigs : gigs.filter(g => g.category === gigFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(g => g.title.toLowerCase().includes(q) || g.skills.some(s => s.toLowerCase().includes(q)));
    }
    return filtered;
  },

  getFilteredOpportunities: () => {
    const { opportunities, oppFilter, searchQuery } = get();
    let filtered = oppFilter === 'all' ? opportunities : opportunities.filter(o => o.type === oppFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => o.title.toLowerCase().includes(q) || o.tags.some(t => t.includes(q)));
    }
    return filtered;
  },

  purchaseProduct: (productId) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return false;
    set(s => ({
      products: s.products.map(p => p.id === productId ? { ...p, downloadCount: p.downloadCount + 1 } : p),
    }));
    return true;
  },

  listProduct: (product) => {
    const id = `prod_${Date.now()}`;
    const newProduct: MarketplaceProduct = {
      id,
      sellerId: 'me',
      sellerName: 'You',
      title: product.title || 'Untitled Product',
      description: product.description || '',
      category: product.category || 'resource',
      price: product.price || 0,
      currency: 'NGN',
      coverImage: product.coverImage || '📦',
      rating: 0,
      reviewCount: 0,
      downloadCount: 0,
      status: 'active',
      tags: product.tags || [],
      createdAt: Date.now(),
    };
    set(s => ({ products: [newProduct, ...s.products] }));
    return id;
  },

  postGig: (gig) => {
    const id = `gig_${Date.now()}`;
    const newGig: FreelanceGig = {
      id,
      posterId: 'me',
      posterName: 'You',
      title: gig.title || 'Untitled Project',
      description: gig.description || '',
      category: gig.category || 'other',
      budget: gig.budget || { min: 0, max: 0 },
      currency: 'NGN',
      applicants: 0,
      status: 'open',
      skills: gig.skills || [],
      createdAt: Date.now(),
    };
    set(s => ({ gigs: [newGig, ...s.gigs] }));
    return id;
  },

  applyToGig: (gigId) => {
    set(s => ({
      gigs: s.gigs.map(g => g.id === gigId ? { ...g, applicants: g.applicants + 1 } : g),
    }));
  },

  saveOpportunity: (oppId) => {
    set(s => ({
      opportunities: s.opportunities.map(o => o.id === oppId ? { ...o, isSaved: !o.isSaved } : o),
    }));
  },

  addReview: (productId, rating, comment) => {
    const review: Review = {
      id: `rev_${Date.now()}`, productId, reviewerId: 'me', reviewerName: 'You',
      rating, comment, timestamp: Date.now(),
    };
    set(s => ({
      reviews: [review, ...s.reviews],
      products: s.products.map(p => {
        if (p.id !== productId) return p;
        const newCount = p.reviewCount + 1;
        const newRating = ((p.rating * p.reviewCount) + rating) / newCount;
        return { ...p, rating: Math.round(newRating * 10) / 10, reviewCount: newCount };
      }),
    }));
  },
}));

export default useMarketplaceStore;
