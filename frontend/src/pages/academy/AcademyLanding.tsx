import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAcademyStore } from '../../store/academyStore';
import type { AcademySection } from '../../types';
import './AcademyLanding.css';

const TrainingCenter = lazy(() => import('../../components/academy/TrainingCenter'));
const AICyberTutor = lazy(() => import('../../components/academy/AICyberTutor'));
const PhishingLab = lazy(() => import('../../components/academy/PhishingLab'));
const LearningLabs = lazy(() => import('../../components/academy/LearningLabs'));
const ChallengesPlatform = lazy(() => import('../../components/academy/ChallengesPlatform'));
const CertificationCenter = lazy(() => import('../../components/academy/CertificationCenter'));
const OrgDashboard = lazy(() => import('../../components/academy/OrgDashboard'));
const ThreatEducationHub = lazy(() => import('../../components/academy/ThreatEducationHub'));
const ScamDetector = lazy(() => import('../../components/academy/ScamDetector'));
const SafetyScorecard = lazy(() => import('../../components/academy/SafetyScorecard'));
const SMEToolkit = lazy(() => import('../../components/academy/SMEToolkit'));
const IncidentResponse = lazy(() => import('../../components/academy/IncidentResponse'));
const CareerHub = lazy(() => import('../../components/academy/CareerHub'));
const CurriculumGenerator = lazy(() => import('../../components/academy/CurriculumGenerator'));
const KnowledgeCenter = lazy(() => import('../../components/academy/KnowledgeCenter'));
const CampaignBuilder = lazy(() => import('../../components/academy/CampaignBuilder'));
const ThreatFeed = lazy(() => import('../../components/academy/ThreatFeed'));

type ModuleCard = {
  id: AcademySection;
  title: string;
  description: string;
  route: string;
  category: 'learn' | 'practice' | 'protect' | 'professional';
  icon: string;
  time: string;
};

const MODULES: ModuleCard[] = [
  { id: 'training', title: 'Guided learning paths', description: 'Structured lessons for individuals, students, schools and teams.', route: 'training', category: 'learn', icon: '01', time: 'Start here' },
  { id: 'knowledge', title: 'Cybersecurity library', description: 'Practical explainers on accounts, devices, privacy and online fraud.', route: 'knowledge', category: 'learn', icon: '02', time: 'Read & learn' },
  { id: 'tutor', title: 'AI Cyber Tutor', description: 'Ask questions, get explanations and work through concepts with an AI tutor.', route: 'tutor', category: 'learn', icon: '03', time: 'Ask anything' },
  { id: 'threat-hub', title: 'Nigeria threat awareness', description: 'Understand common local scams, impersonation and digital fraud tactics.', route: 'threat-hub', category: 'learn', icon: '04', time: 'Local scenarios' },
  { id: 'phishing-lab', title: 'Phishing practice', description: 'Inspect realistic email and message examples. Find the warning signs.', route: 'phishing-lab', category: 'practice', icon: '05', time: 'Interactive lab' },
  { id: 'labs', title: 'Hands-on security labs', description: 'Practise web security, cookie protection and safe reconnaissance concepts.', route: 'labs', category: 'practice', icon: '06', time: 'Interactive lab' },
  { id: 'challenges', title: 'Knowledge challenges', description: 'Test what you know with quizzes, explanations and score history.', route: 'challenges', category: 'practice', icon: '07', time: 'Test yourself' },
  { id: 'scam-detector', title: 'Message & scam checker', description: 'Review suspicious SMS, WhatsApp messages, emails and job offers.', route: 'scam-detector', category: 'protect', icon: '08', time: 'Check a message' },
  { id: 'safety-scorecard', title: 'Personal safety review', description: 'Assess account, device, backup and browsing habits with an action plan.', route: 'safety-scorecard', category: 'protect', icon: '09', time: 'Self-assessment' },
  { id: 'incident-response', title: 'Incident response guide', description: 'Know what to do if an account is hacked, a device is lost or money is stolen.', route: 'incident-response', category: 'protect', icon: '10', time: 'Step-by-step help' },
  { id: 'threat-feed', title: 'Threat briefings', description: 'Review educational threat patterns and practical defensive advice.', route: 'threat-feed', category: 'protect', icon: '11', time: 'Awareness updates' },
  { id: 'certifications', title: 'Certificates', description: 'Review learning requirements and your completed course certificates.', route: 'certifications', category: 'professional', icon: '12', time: 'Achievements' },
  { id: 'career-hub', title: 'Cybersecurity careers', description: 'Explore roles, required skills, learning routes and portfolio projects.', route: 'career-hub', category: 'professional', icon: '13', time: 'Career planning' },
  { id: 'sme-toolkit', title: 'Small business toolkit', description: 'Build practical security checklists, policies and basic risk reviews.', route: 'sme-toolkit', category: 'professional', icon: '14', time: 'For organisations' },
  { id: 'curriculum', title: 'Classroom planner', description: 'Prepare cybersecurity schemes of work for schools and training groups.', route: 'curriculum', category: 'professional', icon: '15', time: 'For educators' },
  { id: 'campaign-builder', title: 'Awareness content studio', description: 'Create useful cyber-safety messages for staff, students and communities.', route: 'campaign-builder', category: 'professional', icon: '16', time: 'Create materials' },
  { id: 'org-dashboard', title: 'Team learning overview', description: 'A workspace for reviewing training activity and team readiness.', route: 'org-dashboard', category: 'professional', icon: '17', time: 'For teams' },
];

const GROUPS = [
  { id: 'learn', title: 'Learn the fundamentals', intro: 'Build your understanding before moving into practical exercises.' },
  { id: 'practice', title: 'Practise your skills', intro: 'Apply what you have learned in safe, guided activities.' },
  { id: 'protect', title: 'Protect yourself and others', intro: 'Use practical tools and response guides for everyday digital risks.' },
  { id: 'professional', title: 'Build professional capability', intro: 'Resources for educators, organisations and people pursuing cyber careers.' },
] as const;

const PanelLoader: React.FC = () => <div className="academy-loading"><span />Loading Academy workspace…</div>;

const AcademyHub: React.FC = () => {
  const navigate = useNavigate();
  const { progress, loadFromLocalStorage } = useAcademyStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => { loadFromLocalStorage(); }, [loadFromLocalStorage]);

  const filtered = useMemo(() => MODULES.filter((module) => {
    const matchesCategory = activeCategory === 'all' || module.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${module.title} ${module.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [search, activeCategory]);

  const percent = Math.min(100, Math.round((progress.totalXP % 500) / 5));
  const open = (route: string) => navigate(`/academy/${route}`);

  return (
    <div className="academy-home">
      <section className="academy-welcome">
        <div className="academy-welcome-copy">
          <div className="academy-eyebrow"><span /> HEARTCODE LEARNING ENVIRONMENT</div>
          <h1>Cyber skills for <em>real life.</em></h1>
          <p>From suspicious WhatsApp messages to business email fraud, build practical skills through guided lessons, realistic scenarios and hands-on challenges.</p>
          <div className="academy-welcome-actions">
            <button className="academy-primary-action" onClick={() => open('training')}>Start learning <span>→</span></button>
            <button className="academy-secondary-action" onClick={() => open('phishing-lab')}>Try a phishing exercise</button>
          </div>
        </div>
        <aside className="academy-progress-panel">
          <div className="academy-progress-top"><span>YOUR LEARNING</span><span className="academy-level">LEVEL {progress.level}</span></div>
          <div className="academy-xp-number">{progress.totalXP}<small> XP</small></div>
          <div className="academy-progress-track"><span style={{ width: `${percent}%` }} /></div>
          <div className="academy-progress-caption"><span>{progress.totalXP % 500} / 500 XP</span><span>Next level</span></div>
          <div className="academy-progress-divider" />
          <div className="academy-progress-stats">
            <div><strong>{progress.modulesCompleted}</strong><span>Modules completed</span></div>
            <div><strong>{progress.quizzesPassed}</strong><span>Quizzes passed</span></div>
            <div><strong>{progress.badgesEarned.length}</strong><span>Badges earned</span></div>
          </div>
          <p className="academy-progress-note">Your learning progress is saved on this device.</p>
        </aside>
      </section>

      <section className="academy-quick-start">
        <div><span className="academy-section-kicker">A GOOD PLACE TO BEGIN</span><h2>Start with one practical skill</h2></div>
        <div className="academy-quick-grid">
          <button onClick={() => open('training')}><span className="academy-quick-number">01</span><span><strong>Learn a topic</strong><small>Follow short guided lessons</small></span><b>→</b></button>
          <button onClick={() => open('phishing-lab')}><span className="academy-quick-number">02</span><span><strong>Test your awareness</strong><small>Spot a suspicious message</small></span><b>→</b></button>
          <button onClick={() => open('safety-scorecard')}><span className="academy-quick-number">03</span><span><strong>Check your safety</strong><small>Get a personal action list</small></span><b>→</b></button>
        </div>
      </section>

      <section className="academy-reality">
        <div className="academy-reality-heading"><span className="academy-section-kicker">LEARN FOR THE WORLD YOU LIVE IN</span><h2>Not just cyber definitions.<br/><em>Decisions you can use.</em></h2><p>Practise the moments that matter: a suspicious job offer, a fake bank alert, a compromised account or a risky business request.</p></div>
        <div className="academy-reality-grid">
          <article><span>01 / SPOT IT</span><h3>Recognise the trick</h3><p>Read realistic messages and learn how to identify impersonation, pressure tactics and suspicious links.</p><button onClick={() => open('phishing-lab')}>Enter phishing lab <b>↗</b></button></article>
          <article><span>02 / RESPOND</span><h3>Know your next move</h3><p>Follow clear steps when an account is taken over, a phone is lost or money is sent to a fraudster.</p><button onClick={() => open('incident-response')}>Open response guide <b>↗</b></button></article>
          <article><span>03 / BUILD</span><h3>Grow a real skill</h3><p>Move from awareness into safe, guided practice and build a foundation for a cybersecurity career.</p><button onClick={() => open('labs')}>Explore practical labs <b>↗</b></button></article>
        </div>
      </section>
      <section className="academy-outcomes">
        <div><span className="academy-section-kicker">YOUR PROGRESS SHOULD MEAN SOMETHING</span><h2>Learn a skill. Prove you understand it. Put it to work.</h2></div>
        <div className="academy-outcome-list"><p><b>01</b> Short lessons with practical takeaways</p><p><b>02</b> Scenario-based checks with explanations</p><p><b>03</b> Guided practice and a record of completed learning</p></div>
      </section>
      <section className="academy-catalog">
        <div className="academy-catalog-heading">
          <div><span className="academy-section-kicker">THE ACADEMY</span><h2>Explore learning and tools</h2><p>Choose a resource based on what you need to do.</p></div>
          <label className="academy-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search lessons, labs and tools…" aria-label="Search Academy modules" /></label>
        </div>
        <div className="academy-filters" role="tablist" aria-label="Filter Academy modules">
          {[['all','All resources'],['learn','Learn'],['practice','Practise'],['protect','Protection'],['professional','Professional']].map(([id,label]) => (
            <button key={id} role="tab" aria-selected={activeCategory === id} className={activeCategory === id ? 'active' : ''} onClick={() => setActiveCategory(id)}>{label}</button>
          ))}
        </div>
        {GROUPS.map((group) => {
          const items = filtered.filter((module) => module.category === group.id);
          if (!items.length) return null;
          return <div className="academy-module-group" key={group.id}>
            <div className="academy-group-heading"><h3>{group.title}</h3><p>{group.intro}</p></div>
            <div className="academy-resource-grid">
              {items.map((module) => <button className="academy-resource-card" key={module.id} onClick={() => open(module.route)}>
                <span className="academy-resource-index">{module.icon}</span>
                <span className="academy-resource-content"><strong>{module.title}</strong><small>{module.description}</small><em>{module.time}</em></span>
                <span className="academy-resource-arrow">↗</span>
              </button>)}
            </div>
          </div>;
        })}
        {filtered.length === 0 && <div className="academy-empty">No Academy resources match “{search}”. Try another search.</div>}
      </section>
      <div className="academy-footnote">HEARTCODE Cyber Academy · Learn responsibly. Practise safely. Protect what matters.</div>
    </div>
  );
};

const AcademyLanding: React.FC = () => (
  <div className="flex flex-col min-h-screen" style={{ display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main className="academy-main" style={{ flex: '1 1 0%', overflow: 'auto' }}>
      <Suspense fallback={<PanelLoader />}>
        <Routes>
          <Route index element={<AcademyHub />} />
          <Route path="training" element={<TrainingCenter />} />
          <Route path="tutor" element={<AICyberTutor />} />
          <Route path="phishing-lab" element={<PhishingLab />} />
          <Route path="labs" element={<LearningLabs />} />
          <Route path="challenges" element={<ChallengesPlatform />} />
          <Route path="certifications" element={<CertificationCenter />} />
          <Route path="org-dashboard" element={<OrgDashboard />} />
          <Route path="threat-hub" element={<ThreatEducationHub />} />
          <Route path="scam-detector" element={<ScamDetector />} />
          <Route path="safety-scorecard" element={<SafetyScorecard />} />
          <Route path="sme-toolkit" element={<SMEToolkit />} />
          <Route path="incident-response" element={<IncidentResponse />} />
          <Route path="career-hub" element={<CareerHub />} />
          <Route path="curriculum" element={<CurriculumGenerator />} />
          <Route path="knowledge" element={<KnowledgeCenter />} />
          <Route path="campaign-builder" element={<CampaignBuilder />} />
          <Route path="threat-feed" element={<ThreatFeed />} />
          <Route path="*" element={<Navigate to="/academy" replace />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </div>
);

export default AcademyLanding;
