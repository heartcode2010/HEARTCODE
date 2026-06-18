import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAcademyStore } from '../../store/academyStore';
import type { AcademySection } from '../../types';

// ── Lazy-loaded Academy Components ──
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

// ── Panel Loader ──
const PanelLoader: React.FC = () => (
  <div className="academy-panel-loader">
    <div className="academy-panel-loader-bar" />
  </div>
);

// ── Module Card Data ──
interface ModuleCard {
  id: AcademySection;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const MODULES: ModuleCard[] = [
  { id: 'training', title: 'Training Center', description: 'Security awareness learning paths for individuals, businesses, and schools', icon: '📚', color: '#00f5ff', route: 'training' },
  { id: 'tutor', title: 'AI Cyber Tutor', description: 'AI-powered cybersecurity tutor with beginner to advanced modes', icon: '🤖', color: '#a855f7', route: 'tutor' },
  { id: 'phishing-lab', title: 'Phishing Lab', description: 'Interactive phishing detection exercises with scoring', icon: '🐟', color: '#f59e0b', route: 'phishing-lab' },
  { id: 'labs', title: 'Learning Labs', description: 'Safe educational labs for web security, privacy, and reconnaissance', icon: '🧪', color: '#10b981', route: 'labs' },
  { id: 'challenges', title: 'Cyber Challenges', description: 'Gamified quizzes, badges, and progression system', icon: '🏆', color: '#f97316', route: 'challenges' },
  { id: 'certifications', title: 'Certifications', description: 'Earn completion certificates in cybersecurity fundamentals', icon: '📜', color: '#eab308', route: 'certifications' },
  { id: 'scam-detector', title: 'Scam Detector', description: 'AI-powered analysis of suspicious messages and offers', icon: '🛡️', color: '#ef4444', route: 'scam-detector' },
  { id: 'safety-scorecard', title: 'Safety Scorecard', description: 'Assess your personal or organizational digital safety', icon: '📊', color: '#06b6d4', route: 'safety-scorecard' },
  { id: 'threat-hub', title: 'Threat Education Hub', description: 'Nigerian cyber threat awareness and prevention education', icon: '🌍', color: '#22c55e', route: 'threat-hub' },
  { id: 'knowledge', title: 'Knowledge Center', description: 'Searchable cybersecurity and fraud prevention knowledge base', icon: '📖', color: '#8b5cf6', route: 'knowledge' },
  { id: 'incident-response', title: 'Incident Response', description: 'Guided workflows for common security incidents', icon: '🚨', color: '#dc2626', route: 'incident-response' },
  { id: 'sme-toolkit', title: 'SME Toolkit', description: 'Security checklists, risk assessments, and policy templates for businesses', icon: '🏢', color: '#3b82f6', route: 'sme-toolkit' },
  { id: 'career-hub', title: 'Career Pathways', description: 'Cybersecurity career roadmaps, skills, and certifications', icon: '🚀', color: '#ec4899', route: 'career-hub' },
  { id: 'curriculum', title: 'Curriculum Generator', description: 'AI-assisted cybersecurity curriculum for schools', icon: '🎒', color: '#14b8a6', route: 'curriculum' },
  { id: 'campaign-builder', title: 'Campaign Builder', description: 'Generate public awareness materials and content', icon: '📢', color: '#f43f5e', route: 'campaign-builder' },
  { id: 'threat-feed', title: 'Threat Feed', description: 'Educational threat intelligence and emerging scam trends', icon: '📡', color: '#6366f1', route: 'threat-feed' },
  { id: 'org-dashboard', title: 'Organization Dashboard', description: 'Track training completion and awareness scores for teams', icon: '📈', color: '#0ea5e9', route: 'org-dashboard' },
];

// ── Landing Hub ──
const AcademyHub: React.FC = () => {
  const navigate = useNavigate();
  const { progress, loadFromLocalStorage } = useAcademyStore();

  useEffect(() => { loadFromLocalStorage(); }, []);

  const xpPercent = ((progress.totalXP % 500) / 500) * 100;

  return (
    <div className="academy-landing">
      {/* Hero Section */}
      <div className="academy-hero">
        <div className="academy-hero-content">
          <h1 className="academy-hero-title">
            <span className="academy-hero-icon">🎓</span>
            CYBER ACADEMY
          </h1>
          <p className="academy-hero-subtitle">
            AI-Powered Cybersecurity Education & Awareness Platform
          </p>
        </div>

        {/* Progress Stats Bar */}
        <div className="academy-stats-bar">
          <div className="academy-stat">
            <span className="academy-stat-value">{progress.level}</span>
            <span className="academy-stat-label">Level</span>
          </div>
          <div className="academy-stat">
            <span className="academy-stat-value">{progress.totalXP}</span>
            <span className="academy-stat-label">XP</span>
          </div>
          <div className="academy-stat">
            <span className="academy-stat-value">{progress.modulesCompleted}/{progress.totalModules}</span>
            <span className="academy-stat-label">Modules</span>
          </div>
          <div className="academy-stat">
            <span className="academy-stat-value">{progress.badgesEarned.length}</span>
            <span className="academy-stat-label">Badges</span>
          </div>
          <div className="academy-stat">
            <span className="academy-stat-value">{progress.certificatesEarned.length}</span>
            <span className="academy-stat-label">Certs</span>
          </div>
          <div className="academy-stat academy-stat-xp-bar">
            <div className="academy-xp-bar">
              <div className="academy-xp-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="academy-stat-label">Next Level</span>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="academy-grid">
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            className="academy-card"
            onClick={() => navigate(`/academy/${mod.route}`)}
            style={{ '--card-accent': mod.color, animationDelay: `${i * 50}ms` } as React.CSSProperties}
          >
            <div className="academy-card-icon">{mod.icon}</div>
            <div className="academy-card-body">
              <h3 className="academy-card-title">{mod.title}</h3>
              <p className="academy-card-desc">{mod.description}</p>
            </div>
            <div className="academy-card-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Academy Page (with internal routing) ──
const AcademyLanding: React.FC = () => {
  return (
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
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default AcademyLanding;
