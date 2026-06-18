import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import type { SafetyScorecard as ScorecardType } from '../../../types';

interface Question {
  id: string;
  category: string;
  text: string;
  options: { label: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q-s-1',
    category: 'Passwords',
    text: 'How do you generate and store your account passwords?',
    options: [
      { label: 'Use a secure Password Manager (e.g. Bitwarden, 1Password)', points: 100 },
      { label: 'Write them down in a personal book / note', points: 60 },
      { label: 'Memorize them (requires using similar patterns across sites)', points: 30 }
    ]
  },
  {
    id: 'q-s-2',
    category: '2FA / Authentication',
    text: 'Is Multi-Factor Authentication (2FA/MFA) active on your primary accounts?',
    options: [
      { label: 'Yes, using Authenticator apps or hardware keys on all vital portals', points: 100 },
      { label: 'Yes, but mostly SMS-based codes', points: 70 },
      { label: 'No, I only use passwords', points: 15 }
    ]
  },
  {
    id: 'q-s-3',
    category: 'Phishing Habits',
    text: 'How do you handle links in unexpected email alerts?',
    options: [
      { label: 'Examine sender domains, hover links, and navigate to portals independently', points: 100 },
      { label: 'Click them if they look legitimate, but inspect the landing page closely', points: 50 },
      { label: 'Click them immediately to review the notification issues', points: 10 }
    ]
  },
  {
    id: 'q-s-4',
    category: 'Backups',
    text: 'How frequently do you back up your critical documents?',
    options: [
      { label: 'Automated daily backups to secure cloud or external drives', points: 100 },
      { label: 'Manual backups every few weeks/months', points: 60 },
      { label: 'Rarely or never', points: 10 }
    ]
  },
  {
    id: 'q-s-5',
    category: 'Device Security',
    text: 'How are your personal smartphone and laptop lock settings configured?',
    options: [
      { label: 'Biometrics + complex PIN, auto-locks within 1 minute', points: 100 },
      { label: 'Simple swipe or pattern, auto-locks after 5+ minutes', points: 50 },
      { label: 'No passwords or patterns required to unlock', points: 5 }
    ]
  }
];

const SafetyScorecard: React.FC = () => {
  const navigate = useNavigate();
  const { setSafetyScorecard, addXP, earnBadge } = useAcademyStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [scorecardResult, setScorecardResult] = useState<ScorecardType | null>(null);

  const handleSelectOption = (points: number) => {
    const q = QUESTIONS[currentIdx];
    const newAnswers = { ...answers, [q.id]: points };
    setAnswers(newAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Completed all
      // Calculate scores by categories
      const categoriesList = ['Passwords', '2FA / Authentication', 'Phishing Habits', 'Backups', 'Device Security'];
      let total = 0;
      const categoriesResult = categoriesList.map((cat, idx) => {
        const matchingQ = QUESTIONS[idx];
        const score = newAnswers[matchingQ.id] || 0;
        total += score;

        const recs: string[] = [];
        if (score < 50) {
          recs.push(`Audit ${cat} settings immediately.`);
        }

        return {
          name: cat,
          score,
          maxScore: 100,
          recommendations: recs
        };
      });

      const overall = Math.round(total / QUESTIONS.length);

      const improvements: string[] = [];
      if (newAnswers['q-s-1'] < 70) improvements.push('Deploy a password manager to eliminate credential reuse.');
      if (newAnswers['q-s-2'] < 70) improvements.push('Activate app-based authenticator tools on critical emails.');
      if (newAnswers['q-s-3'] < 70) improvements.push('Inspect hyperlink destination URLs before processing sign-ins.');
      if (newAnswers['q-s-4'] < 70) improvements.push('Configure automated cloud or offline storage system backups.');
      if (newAnswers['q-s-5'] < 70) improvements.push('Shorten lockscreen timeouts to 1 minute to prevent physical access.');

      if (improvements.length === 0) {
        improvements.push('Excellent security hygiene posture. Continue maintaining current defense routines.');
      }

      const newScorecard: ScorecardType = {
        overallScore: overall,
        categories: categoriesResult,
        assessedAt: new Date().toLocaleDateString(),
        improvementPlan: improvements
      };

      setSafetyScorecard(newScorecard);
      setScorecardResult(newScorecard);
      setFinished(true);
      addXP(75);

      if (overall >= 80) {
        earnBadge('cyber-investigator');
      }
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setFinished(false);
    setScorecardResult(null);
  };

  // SVG Radar Points Builder
  const buildRadarPoints = (resultData: ScorecardType) => {
    // 5 points radar
    const center = 100;
    const r = 70;
    const points = resultData.categories.map((c, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const factor = c.score / 100;
      const x = center + r * factor * Math.cos(angle);
      const y = center + r * factor * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const buildOuterPoints = () => {
    const center = 100;
    const r = 70;
    const points = Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📊 Digital Safety Scorecard</h2>
        <p className="academy-section-desc">Assess your personal or organizational cybersecurity posture across 5 critical vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Questionnaire Panel */}
        <div className="lg:col-span-7 bg-cyber-surface border border-cyber-border rounded p-5 space-y-4">
          {!finished ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[0.62rem] text-cyber-ash2">
                  <span>VECTOR {currentIdx + 1} OF {QUESTIONS.length} // {QUESTIONS[currentIdx].category.toUpperCase()}</span>
                  <span>{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-cyber-bg h-1.5 rounded border border-cyber-border">
                  <div className="bg-cyber-cyan h-full rounded transition-all duration-300" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>

              {/* Question */}
              <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase leading-relaxed min-h-[2.5rem]">
                {QUESTIONS[currentIdx].text}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {QUESTIONS[currentIdx].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.points)}
                    className="w-full text-left font-sans text-xs border border-cyber-border hover:border-cyber-cyan bg-cyber-bg hover:bg-cyber-cyan-dim rounded p-3.5 transition-all cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : scorecardResult ? (
            /* Results Presentation */
            <div className="space-y-4 font-mono text-xs">
              <h3 className="font-display font-bold text-cyber-cyan text-sm tracking-wider">ASSESSMENT COMPLETE</h3>
              
              <div className="grid grid-cols-2 gap-4 items-center bg-cyber-bg p-4 rounded border border-cyber-border">
                <div>
                  <div className="text-[0.62rem] text-cyber-ash3">OVERALL SAFETY INDEX</div>
                  <div className="text-xl font-bold font-display text-white mt-1">{scorecardResult.overallScore}%</div>
                  <div className="text-[0.58rem] text-cyber-ash2 mt-0.5">GRADE: {scorecardResult.overallScore >= 80 ? 'A (SECURE)' : scorecardResult.overallScore >= 60 ? 'B (PASSABLE)' : 'F (VULNERABLE)'}</div>
                </div>

                {/* mini radar chart SVG */}
                <div className="flex justify-end">
                  <svg width="120" height="120" viewBox="0 0 200 200" className="opacity-80">
                    {/* Background Polygons */}
                    <polygon points={buildOuterPoints()} fill="none" stroke="#2a2a2e" strokeWidth="1.5" />
                    {/* Score Polygon */}
                    <polygon points={buildRadarPoints(scorecardResult)} fill="rgba(0,245,255,0.15)" stroke="#00f5ff" strokeWidth="2" />
                    {/* Center Point */}
                    <circle cx="100" cy="100" r="2" fill="#00f5ff" />
                  </svg>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5">
                <span className="text-white text-[0.64rem] font-bold block mb-1">SCORE DETAILS BY AREA:</span>
                {scorecardResult.categories.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-cyber-border pb-1">
                    <span className="text-cyber-ash2">{c.name}</span>
                    <span className={c.score >= 80 ? 'text-cyber-green' : c.score >= 50 ? 'text-cyber-amber' : 'text-cyber-red'}>
                      {c.score} / 100
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-cyber-bg hover:bg-cyber-surface2 border border-cyber-border text-white text-xs font-mono py-2 rounded cursor-pointer"
              >
                RE-RUN POSTURE ASSESSMENT
              </button>
            </div>
          ) : null}
        </div>

        {/* Right Panel: Advisory Recommendations */}
        <div className="lg:col-span-5 bg-cyber-surface border border-cyber-border rounded p-5 space-y-4 min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-xs tracking-wider border-b border-cyber-border pb-2 mb-3">🛡️ PERSONAL AUDIT ROADMAP</h3>
            {finished && scorecardResult ? (
              <ul className="space-y-2 text-xs text-cyber-ash list-inside list-disc font-sans leading-relaxed">
                {scorecardResult.improvementPlan.map((imp, idx) => (
                  <li key={idx}>
                    <strong className="text-white">{imp.split(':')[0]}</strong>
                    {imp.includes(':') ? imp.split(':')[1] : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-cyber-ash3 italic leading-relaxed">
                Complete the questionnaire parameters on the left to activate custom recommendations and category audits.
              </p>
            )}
          </div>

          <div className="bg-cyber-bg p-3.5 rounded border border-cyber-border font-mono text-[0.62rem] text-cyber-ash2 leading-normal">
            <span className="text-cyber-cyan font-bold block mb-1">DATA DISPOSITION:</span>
            All responses are processed client-side. The score index persists in local cache parameters.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyScorecard;
