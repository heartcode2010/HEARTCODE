import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, ShieldCheck, GraduationCap, Blocks, Palette, Code2,
  BookOpenCheck, TerminalSquare, Wallet, Users, Layers3, Sparkles,
  CircleCheck, Clock3, LockKeyhole,
} from 'lucide-react';

type Verse = {
  number: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  status: 'available' | 'building' | 'planned';
  links?: { label: string; to: string }[];
};

const verses: Verse[] = [
  {
    number: '01', name: 'CyberVerse', tagline: 'Security intelligence & cyber skills',
    description: 'The security flagship: inspect websites with the existing scanner and build practical defensive skills through the Cyber Academy.',
    icon: ShieldCheck, status: 'available',
    links: [{ label: 'Open scanner', to: '/' }, { label: 'Enter Cyber Academy', to: '/academy' }],
  },
  {
    number: '02', name: 'BlockchainVerse', tagline: 'Web3 learning & simulation',
    description: 'A planned learning and simulation environment for blockchain concepts, Solidity and decentralised applications.',
    icon: Blocks, status: 'planned',
  },
  {
    number: '03', name: 'Nexora', tagline: 'AI creator studio',
    description: 'A planned workspace for creative direction, brand systems and responsible creator workflows.',
    icon: Palette, status: 'planned',
  },
  {
    number: '04', name: 'TechVerse', tagline: 'Developer learning & careers',
    description: 'Structured programming paths, project-based learning and skills progression.',
    icon: Code2, status: 'planned',
  },
  {
    number: '05', name: 'EduVerse', tagline: 'Learning & exam preparation',
    description: 'A planned academic companion for CBT practice, revision notes and learning resources.',
    icon: BookOpenCheck, status: 'planned',
  },
  {
    number: '06', name: 'TechLabs', tagline: 'Build, test & experiment',
    description: 'A planned browser-based coding workspace with isolated previews and project export.',
    icon: TerminalSquare, status: 'planned',
  },
];

const sharedServices = [
  { title: 'QuizVerse', description: 'Create, publish and take assessments across the ecosystem.', icon: Layers3 },
  { title: 'AI Credits', description: 'A unified usage and billing system for premium AI tools.', icon: Sparkles },
  { title: 'Wallet & Payments', description: 'Purchases, balances and transaction history.', icon: Wallet },
  { title: 'Affiliate Network', description: 'Referrals, commissions and payout management.', icon: Users },
];

const statusCopy = {
  available: { label: 'Available now', icon: CircleCheck, className: 'status-live' },
  building: { label: 'In development', icon: Clock3, className: 'status-building' },
  planned: { label: 'Planned', icon: LockKeyhole, className: 'status-planned' },
};

export default function TechnovaWorkspace() {
  return (
    <main className="tech-os">
      <div className="tech-os-noise" aria-hidden="true" />
      <header className="tech-os-topbar">
        <Link to="/os" className="tech-os-brand" aria-label="TECHNOVA OS home">
          <span className="tech-os-brand-mark">T</span>
          <span>TECHNOVA<span className="tech-os-brand-muted"> OS</span></span>
        </Link>
        <div className="tech-os-topbar-right">
          <span className="tech-os-system-label"><span /> UNIFIED WORKSPACE</span>
          <Link className="tech-os-profile-link" to="/">CyberVerse <ArrowUpRight size={14} /></Link>
        </div>
      </header>

      <section className="tech-os-hero">
        <div className="tech-os-eyebrow"><span /> ONE ACCOUNT. SIX VERSES. ONE ECOSYSTEM.</div>
        <h1>Your technology<br /><span>operating system.</span></h1>
        <p className="tech-os-hero-copy">
          Learn, build, create and secure from one connected workspace.
          Choose a Verse to enter its environment.
        </p>
        <div className="tech-os-hero-foot">
          <span><ShieldCheck size={15} /> Security-first architecture</span>
          <span><Layers3 size={15} /> Connected platform services</span>
          <span><GraduationCap size={15} /> Learning built in</span>
        </div>
      </section>

      <section className="tech-os-section" aria-labelledby="verses-heading">
        <div className="tech-os-section-head">
          <div><div className="tech-os-kicker">THE MULTI-VERSE</div><h2 id="verses-heading">Choose your workspace</h2></div>
          <p>Each Verse has a clear purpose. More environments will unlock as they are built and tested.</p>
        </div>
        <div className="tech-os-verse-grid">
          {verses.map((verse) => {
            const Icon = verse.icon;
            const state = statusCopy[verse.status];
            const StatusIcon = state.icon;
            return (
              <article className={`tech-os-verse-card ${verse.status === 'available' ? 'is-available' : ''}`} key={verse.number}>
                <div className="tech-os-card-top">
                  <span className="tech-os-card-number">{verse.number} / VERSE</span>
                  <span className={`tech-os-status ${state.className}`}><StatusIcon size={12} />{state.label}</span>
                </div>
                <div className="tech-os-verse-icon"><Icon size={22} strokeWidth={1.7} /></div>
                <h3>{verse.name}</h3>
                <div className="tech-os-tagline">{verse.tagline}</div>
                <p>{verse.description}</p>
                {verse.links ? (
                  <div className="tech-os-card-actions">
                    {verse.links.map((item) => <Link to={item.to} key={item.to}>{item.label}<ArrowUpRight size={14} /></Link>)}
                  </div>
                ) : (
                  <div className="tech-os-coming-note">This workspace will open when its core features are ready.</div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="tech-os-section tech-os-services" aria-labelledby="services-heading">
        <div className="tech-os-section-head">
          <div><div className="tech-os-kicker">SHARED PLATFORM SERVICES</div><h2 id="services-heading">One connected foundation</h2></div>
          <p>These services will work across the Verses instead of creating separate accounts and disconnected balances.</p>
        </div>
        <div className="tech-os-service-grid">
          {sharedServices.map((service) => {
            const Icon = service.icon;
            return <article className="tech-os-service-card" key={service.title}>
              <Icon size={19} />
              <div><h3>{service.title}</h3><p>{service.description}</p></div>
              <span>PLANNED</span>
            </article>;
          })}
        </div>
      </section>

      <footer className="tech-os-footer">
        <div><strong>TECHNOVA OS</strong><span>Built to help people learn, build and grow with technology.</span></div>
        <span>Workspaces marked planned are not yet available.</span>
      </footer>
    </main>
  );
}
