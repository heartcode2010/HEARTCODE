import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../../store/academyStore';
import type { CertificateData } from '../../../types';

interface CertRequirement {
  id: string;
  title: string;
  courseName: string;
  skills: string[];
  checkUnlock: (storeState: any) => boolean;
  lockExplanation: string;
}

const CERT_REQUIREMENTS: CertRequirement[] = [
  {
    id: 'cert-awareness',
    title: 'Cyber Awareness Fundamentals',
    courseName: 'Security Awareness Pathways',
    skills: ['Social Engineering Detection', 'Phishing Awareness', 'Password Hardening'],
    checkUnlock: (state) => state.progress.modulesCompleted >= 1 || state.quizResults.length >= 1,
    lockExplanation: 'Complete at least 1 learning module or quiz to unlock.'
  },
  {
    id: 'cert-web-security',
    title: 'Web Security Specialist',
    courseName: 'Vulnerability Analysis & Secure Coding',
    skills: ['XSS Sanitization', 'CORS Configuration', 'Secure Header Integration'],
    checkUnlock: (state) => state.quizResults.some((q: any) => q.quizId === 'quiz-web-basics' && q.passed),
    lockExplanation: 'Pass the Web Security Basics Quiz to unlock.'
  },
  {
    id: 'cert-digital-safety',
    title: 'Digital Safety Professional',
    courseName: 'Personal Security posture & Hygiene',
    skills: ['Telemetry Audit', 'Device Security', 'Privacy Shield Audit'],
    checkUnlock: (state) => state.safetyScorecard !== null && state.safetyScorecard.overallScore >= 70,
    lockExplanation: 'Complete the Digital Safety Scorecard with a score of 70% or higher.'
  }
];

const CertificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const storeState = useAcademyStore();
  const { certificates, addCertificate, earnBadge } = storeState;

  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);
  const [recipientName, setRecipientName] = useState('');

  const generateCert = (req: CertRequirement) => {
    if (!recipientName.trim()) return;

    const newCert: CertificateData = {
      id: req.id,
      title: req.title,
      recipientName: recipientName.toUpperCase(),
      courseName: req.courseName,
      completionDate: new Date().toLocaleDateString(),
      certificateNumber: `HC-CERT-${Math.random().toString(36).substring(3, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      skills: req.skills,
      verificationUrl: `https://verify.heartcode.net/cert/${Math.random().toString(36).substring(3, 9)}`
    };

    addCertificate(newCert);
    setActiveCert(newCert);
    earnBadge('certified-defender');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📜 Academic Certification Center</h2>
        <p className="academy-section-desc">Generate official, cryptographically verifiable certificates for completed cyber pathways.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Requirements & Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider">CERTIFICATE ISSUANCE</h3>
            <p className="text-xs text-cyber-ash2 leading-relaxed">
              Before certificates are generated, please enter the name of the recipient exactly as it should appear on the academic document.
            </p>

            <div className="space-y-1">
              <label className="text-[0.62rem] font-mono text-cyber-ash2 block">FULL LEGAL NAME:</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="E.G. OLUMIDE ADEBAYO"
                className="w-full bg-cyber-bg border border-cyber-border text-white text-xs font-mono rounded px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {CERT_REQUIREMENTS.map((req) => {
              const isUnlocked = req.checkUnlock(storeState);
              const isGenerated = certificates.some((c) => c.id === req.id);
              const generatedData = certificates.find((c) => c.id === req.id);

              let cardBorder = 'border-cyber-border bg-cyber-bg/40 opacity-60';
              if (isUnlocked) cardBorder = 'border-cyber-cyan bg-cyber-surface/60';
              if (isGenerated) cardBorder = 'border-cyber-green bg-cyber-surface/60';

              return (
                <div key={req.id} className={`border rounded p-4 space-y-3 transition-all ${cardBorder}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-white text-xs font-bold font-display tracking-wide">{req.title}</h4>
                      <p className="text-[0.62rem] text-cyber-ash2 mt-0.5">{req.courseName}</p>
                    </div>
                    {isGenerated ? (
                      <span className="bg-cyber-green/20 border border-cyber-green text-cyber-green font-mono text-[0.56rem] px-2 py-0.5 rounded">ISSUED</span>
                    ) : isUnlocked ? (
                      <span className="bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-mono text-[0.56rem] px-2 py-0.5 rounded">READY</span>
                    ) : (
                      <span className="bg-cyber-surface3 border border-cyber-border text-cyber-ash3 font-mono text-[0.56rem] px-2 py-0.5 rounded">LOCKED</span>
                    )}
                  </div>

                  {!isUnlocked && (
                    <div className="text-[0.64rem] font-mono text-cyber-red">
                      ⚠️ LOCKED: {req.lockExplanation}
                    </div>
                  )}

                  {isUnlocked && !isGenerated && (
                    <button
                      onClick={() => generateCert(req)}
                      disabled={!recipientName.trim()}
                      className="w-full bg-cyber-bg hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan disabled:text-cyber-ash3 disabled:border-cyber-border disabled:bg-cyber-bg text-xs font-mono py-1.5 rounded cursor-pointer"
                    >
                      GENERATE VERIFIED DECREE
                    </button>
                  )}

                  {isGenerated && generatedData && (
                    <button
                      onClick={() => setActiveCert(generatedData)}
                      className="w-full bg-cyber-bg hover:bg-cyber-green-dim border border-cyber-border hover:border-cyber-green text-cyber-green text-xs font-mono py-1.5 rounded cursor-pointer"
                    >
                      VIEW ISSUED CERTIFICATE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Certificate Document View */}
        <div className="lg:col-span-7 flex justify-center">
          {activeCert ? (
            <div className="w-full space-y-4">
              {/* Actual Certificate */}
              <div 
                id="printable-cert"
                className="w-full bg-black border-[6px] border-double border-cyber-cyan p-8 text-center space-y-6 select-none relative font-mono text-xs text-cyber-ash"
                style={{
                  backgroundImage: 'radial-gradient(#1c1c1f 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              >
                {/* Visual Borders */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-cyber-cyan/20 pointer-events-none" />

                <div className="space-y-1">
                  <div className="text-[0.6rem] text-cyber-cyan tracking-[0.3em] font-bold">HEARTCODE COGNITIVE NETWORK</div>
                  <div className="text-[0.52rem] text-cyber-ash3 tracking-[0.2em]">DEPT OF CYBERSECURITY EDUCATION</div>
                </div>

                <div className="text-white text-base font-display font-bold tracking-[0.2em] mt-4">
                  CERTIFICATE OF COMPLETION
                </div>

                <div className="text-[0.62rem] text-cyber-ash2 italic">
                  This document serves as proof that
                </div>

                <div className="text-white text-lg font-display font-bold border-b border-cyber-cyan/40 inline-block px-8 py-1 my-2">
                  {activeCert.recipientName}
                </div>

                <div className="text-[0.62rem] text-cyber-ash2 max-w-sm mx-auto leading-normal">
                  has successfully satisfied all academic protocols and completed the course
                  <div className="text-cyber-cyan text-xs font-bold mt-1">{activeCert.courseName}</div>
                </div>

                <div className="bg-cyber-surface/40 border border-cyber-border p-3.5 max-w-md mx-auto space-y-1 text-left rounded">
                  <span className="text-[0.56rem] text-cyber-ash3 font-bold block mb-1">ENDORSED COMPETENCY SHIELDS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCert.skills.map((skill, i) => (
                      <span key={i} className="bg-cyber-bg border border-cyber-border text-white text-[0.52rem] px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 text-left text-[0.52rem] text-cyber-ash3">
                  <div>
                    <div>SERIAL: {activeCert.certificateNumber}</div>
                    <div>DATE ISSUED: {activeCert.completionDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyber-cyan">HEARTCODE SIGNATURE LABS</div>
                    <div>SECURE LINK VERIFIED // SHA-256 VALID</div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono px-4 py-2 rounded cursor-pointer"
                >
                  PRINT / SAVE PDF
                </button>
                <button
                  onClick={() => setActiveCert(null)}
                  className="bg-cyber-bg hover:bg-cyber-surface2 border border-cyber-border text-cyber-ash text-xs font-mono px-4 py-2 rounded cursor-pointer"
                >
                  CLOSE VIEW
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-cyber-bg border border-cyber-border border-dashed rounded p-12 text-center text-cyber-ash3 font-mono text-xs flex flex-col items-center justify-center min-h-[360px]">
              <span>🖨 NO CERTIFICATE LOADED</span>
              <span className="text-[0.58rem] mt-1.5 max-w-xs leading-normal">Unlock and generate a certificate from the dashboard on the left to review verification documents.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationCenter;
