import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrainingTrack, LearningModule } from '../../../types';
import { useAcademyStore } from '../../../store/academyStore';

// ── Training Module Data ──
const TRAINING_MODULES: LearningModule[] = [
  // Individuals
  { id: 'ind-password', title: 'Password Security', description: 'Learn to create strong, unique passwords and manage them safely. Covers password managers, 2FA, and common password attacks.', track: 'individuals', icon: '🔐', duration: '20 min', difficulty: 'beginner', topics: [
    { id: 'pw-1', title: 'Why Passwords Matter', content: 'Passwords are the first line of defense for your digital accounts. A weak password is like leaving your front door unlocked.', keyPoints: ['Passwords protect your identity', 'Weak passwords are the #1 cause of account breaches', 'Over 80% of data breaches involve compromised credentials'], examples: ['Password "123456" can be cracked in under 1 second', 'A 12-character mixed password takes centuries to brute-force'], completed: false },
    { id: 'pw-2', title: 'Creating Strong Passwords', content: 'A strong password should be at least 12 characters long and include a mix of uppercase, lowercase, numbers, and symbols.', keyPoints: ['Use 12+ characters minimum', 'Mix uppercase, lowercase, numbers, symbols', 'Use passphrases for memorability', 'Never reuse passwords across accounts'], examples: ['Weak: sunshine2024', 'Strong: Tr@ffic-Lamp$-Glow-42!', 'Passphrase: correct-horse-battery-staple'], completed: false },
    { id: 'pw-3', title: 'Password Managers', content: 'Password managers generate and store unique passwords for every account, so you only need to remember one master password.', keyPoints: ['One master password to remember', 'Auto-generates complex passwords', 'Syncs across devices', 'Popular options: Bitwarden, 1Password, KeePass'], examples: ['Bitwarden (free, open-source)', '1Password (premium, family plans)', 'KeePass (offline, portable)'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'ind-phishing', title: 'Phishing Awareness', description: 'Recognize and avoid phishing attacks in emails, messages, and websites. Learn the red flags that indicate a phishing attempt.', track: 'individuals', icon: '🎣', duration: '25 min', difficulty: 'beginner', topics: [
    { id: 'ph-1', title: 'What is Phishing?', content: 'Phishing is a social engineering attack where attackers impersonate trusted entities to trick you into revealing sensitive information.', keyPoints: ['Attackers pretend to be banks, tech companies, or colleagues', 'Goal: steal login credentials, financial info, or install malware', 'Phishing is the most common cyberattack vector'], examples: ['Fake "Your account is locked" emails', 'SMS from "your bank" with a suspicious link', 'Fake login pages that steal your credentials'], completed: false },
    { id: 'ph-2', title: 'Spotting Red Flags', content: 'Learn to identify common indicators of phishing attempts before clicking any links or providing information.', keyPoints: ['Urgency tactics: "Act now or lose access!"', 'Suspicious sender addresses (extra characters, misspellings)', 'Generic greetings instead of your name', 'Links that don\'t match the claimed organization'], examples: ['support@app1e.com (uses "1" instead of "l")', '"Dear Customer" instead of your actual name', 'Hovering over links reveals different URLs'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'ind-mobile', title: 'Mobile Security', description: 'Protect your smartphone from threats including malicious apps, unsecured Wi-Fi, and physical theft.', track: 'individuals', icon: '📱', duration: '15 min', difficulty: 'beginner', topics: [
    { id: 'mob-1', title: 'App Safety', content: 'Only download apps from official stores and review permissions carefully before installing.', keyPoints: ['Use official app stores only', 'Review app permissions before installing', 'Keep apps updated', 'Uninstall unused apps'], examples: ['A flashlight app requesting contact access is suspicious', 'Fake banking apps in third-party stores'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'ind-account', title: 'Account Protection', description: 'Secure your online accounts with two-factor authentication, recovery options, and security best practices.', track: 'individuals', icon: '🛡️', duration: '20 min', difficulty: 'beginner', topics: [
    { id: 'acc-1', title: 'Two-Factor Authentication', content: 'Add an extra layer of security beyond your password using authentication apps, hardware keys, or SMS verification.', keyPoints: ['Enable 2FA on all important accounts', 'Authenticator apps are more secure than SMS', 'Save backup codes in a secure location', 'Hardware keys offer the strongest protection'], examples: ['Google Authenticator', 'Authy', 'YubiKey hardware keys'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'ind-social', title: 'Social Engineering', description: 'Understand how attackers manipulate human psychology to gain unauthorized access to systems and information.', track: 'individuals', icon: '🎭', duration: '25 min', difficulty: 'intermediate', topics: [
    { id: 'se-1', title: 'How Social Engineering Works', content: 'Social engineering exploits human psychology — trust, fear, urgency, and curiosity — to manipulate people into breaking security procedures.', keyPoints: ['Attackers exploit emotions, not systems', 'Common tactics: pretexting, baiting, quid pro quo', 'Anyone can be a target', 'Verify requests through independent channels'], examples: ['Attacker poses as IT support requesting your password', 'USB drives left in a parking lot containing malware', '"You won a prize!" messages leading to credential theft'], completed: false },
  ], completed: false, progress: 0 },

  // Businesses
  { id: 'biz-bec', title: 'Business Email Compromise', description: 'Protect your organization from BEC attacks that trick employees into transferring funds or sharing sensitive data.', track: 'businesses', icon: '📧', duration: '30 min', difficulty: 'intermediate', topics: [
    { id: 'bec-1', title: 'Understanding BEC', content: 'Business Email Compromise involves attackers impersonating executives or trusted partners to trick employees into making wire transfers or sharing confidential information.', keyPoints: ['BEC caused $2.7 billion in losses in 2022', 'Attackers research organizational hierarchy', 'Common targets: finance, HR, and executive assistants', 'Often involves compromised or spoofed email accounts'], examples: ['CEO fraud: "Please wire $50,000 to this account urgently"', 'Vendor impersonation: fake invoice with changed bank details', 'Payroll diversion: "Please update my direct deposit info"'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'biz-ransomware', title: 'Ransomware Awareness', description: 'Learn how ransomware attacks work, prevention strategies, and incident response procedures.', track: 'businesses', icon: '🔒', duration: '25 min', difficulty: 'intermediate', topics: [
    { id: 'rw-1', title: 'How Ransomware Works', content: 'Ransomware encrypts your files and demands payment for the decryption key. Prevention and backups are your best defense.', keyPoints: ['Ransomware encrypts critical business data', 'Payment does NOT guarantee data recovery', 'Regular offline backups are essential', 'Employee training prevents 90% of infections'], examples: ['WannaCry (2017): affected 200,000+ computers', 'Colonial Pipeline: caused fuel supply disruptions', 'REvil: targeted supply chain vendors'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'biz-insider', title: 'Insider Threats', description: 'Identify and mitigate risks from employees, contractors, and other trusted insiders.', track: 'businesses', icon: '👤', duration: '20 min', difficulty: 'advanced', topics: [
    { id: 'it-1', title: 'Types of Insider Threats', content: 'Insider threats can be malicious (intentional) or negligent (accidental). Both require different mitigation strategies.', keyPoints: ['Malicious insiders: data theft, sabotage', 'Negligent insiders: accidental data exposure', 'Compromised insiders: credentials stolen by external attackers', 'Implement least-privilege access'], examples: ['Disgruntled employee copying customer database before leaving', 'Employee sending sensitive files to personal email', 'Contractor account compromised via phishing'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'biz-data', title: 'Secure Data Handling', description: 'Best practices for classifying, storing, transmitting, and disposing of sensitive business data.', track: 'businesses', icon: '💾', duration: '20 min', difficulty: 'intermediate', topics: [
    { id: 'dh-1', title: 'Data Classification', content: 'Classify data by sensitivity level to apply appropriate security controls and handling procedures.', keyPoints: ['Public, Internal, Confidential, Restricted tiers', 'Label and tag all documents appropriately', 'Encryption for data at rest and in transit', 'Secure deletion when data is no longer needed'], examples: ['Customer PII → Restricted', 'Internal memos → Internal', 'Marketing materials → Public'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'biz-exec', title: 'Executive Cyber Awareness', description: 'Board-level cybersecurity awareness covering risk management, compliance, and strategic security planning.', track: 'businesses', icon: '👔', duration: '30 min', difficulty: 'advanced', topics: [
    { id: 'ex-1', title: 'Cyber Risk at the Board Level', content: 'Cybersecurity is a business risk, not just an IT problem. Board members must understand the financial and reputational impact of cyber incidents.', keyPoints: ['Average cost of a data breach: $4.45 million', 'Board members bear fiduciary responsibility', 'Cyber insurance and risk transfer strategies', 'Regulatory compliance obligations (GDPR, NDPR)'], examples: ['Target breach (2013): CEO and CIO resigned', 'Equifax breach (2017): $700M settlement', 'Nigeria Data Protection Regulation (NDPR) compliance'], completed: false },
  ], completed: false, progress: 0 },

  // Schools
  { id: 'sch-safety', title: 'Internet Safety', description: 'Teaching students to navigate the internet safely, recognizing dangers and practicing safe online behavior.', track: 'schools', icon: '🌐', duration: '20 min', difficulty: 'beginner', topics: [
    { id: 'is-1', title: 'Safe Browsing Habits', content: 'Learn to recognize safe vs. dangerous websites and practice secure browsing habits.', keyPoints: ['Look for HTTPS in the address bar', 'Don\'t click unknown links', 'Be cautious of pop-ups and ads', 'Never share personal information on unfamiliar sites'], examples: ['Check for the lock icon before entering passwords', 'Verify URLs before clicking (hover first)', 'Use ad blockers for safer browsing'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'sch-citizen', title: 'Digital Citizenship', description: 'Being responsible, respectful, and safe when using technology and interacting online.', track: 'schools', icon: '🏛️', duration: '25 min', difficulty: 'beginner', topics: [
    { id: 'dc-1', title: 'Being a Good Digital Citizen', content: 'Digital citizenship means using technology responsibly, treating others with respect online, and understanding your digital footprint.', keyPoints: ['Think before you post', 'Treat others online as you would in person', 'Your digital footprint is permanent', 'Report cyberbullying and harmful content'], examples: ['Respectful commenting on social media', 'Citing sources when sharing information', 'Using privacy settings on social platforms'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'sch-bully', title: 'Cyberbullying Awareness', description: 'Recognize, prevent, and respond to cyberbullying in schools and online communities.', track: 'schools', icon: '🤝', duration: '20 min', difficulty: 'beginner', topics: [
    { id: 'cb-1', title: 'Understanding Cyberbullying', content: 'Cyberbullying is the use of technology to harass, threaten, or humiliate someone. It can happen on social media, messaging apps, gaming platforms, and more.', keyPoints: ['Cyberbullying can happen 24/7', 'Save evidence and report incidents', 'Don\'t respond to or forward harmful messages', 'Talk to a trusted adult if you\'re being bullied'], examples: ['Spreading rumors on social media', 'Creating fake profiles to mock someone', 'Sending threatening messages'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'sch-privacy', title: 'Privacy Protection', description: 'Understanding personal data, privacy rights, and how to protect information online.', track: 'schools', icon: '🔏', duration: '15 min', difficulty: 'beginner', topics: [
    { id: 'pp-1', title: 'Protecting Your Privacy', content: 'Personal information includes your name, address, phone number, photos, and location. Learn to control what you share online.', keyPoints: ['Limit personal information shared online', 'Review privacy settings on all accounts', 'Understand what data apps collect', 'Know your privacy rights'], examples: ['Set social media profiles to private', 'Disable location sharing when not needed', 'Review app permissions regularly'], completed: false },
  ], completed: false, progress: 0 },
  { id: 'sch-ai', title: 'Responsible AI Usage', description: 'Understanding AI tools, their limitations, ethical use, and how to identify AI-generated content.', track: 'schools', icon: '🧠', duration: '25 min', difficulty: 'intermediate', topics: [
    { id: 'ai-1', title: 'AI Literacy', content: 'AI tools are powerful but have limitations. Learn to use them responsibly, verify their outputs, and understand potential biases.', keyPoints: ['AI can generate incorrect or biased information', 'Always verify AI-generated content', 'Understand plagiarism and attribution rules', 'AI tools should assist, not replace critical thinking'], examples: ['Fact-check AI-generated research', 'Cite AI tools when used in assignments', 'Recognize deepfakes and AI-generated images'], completed: false },
  ], completed: false, progress: 0 },
];

const TRACK_CONFIG: Record<TrainingTrack, { label: string; icon: string; color: string; description: string }> = {
  individuals: { label: 'Individuals', icon: '👤', color: '#00f5ff', description: 'Personal cybersecurity awareness and protection' },
  businesses: { label: 'Businesses', icon: '🏢', color: '#a855f7', description: 'Organizational security training and compliance' },
  schools: { label: 'Schools', icon: '🎒', color: '#10b981', description: 'Digital safety education for students and educators' },
};

const TrainingCenter: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<TrainingTrack>('individuals');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const { progress, updateProgress, addXP } = useAcademyStore();
  const navigate = useNavigate();

  const trackModules = TRAINING_MODULES.filter(m => m.track === activeTrack);
  const trackConfig = TRACK_CONFIG[activeTrack];

  const handleCompleteTopic = (moduleId: string, topicId: string) => {
    addXP(25);
    updateProgress({ modulesCompleted: progress.modulesCompleted });
  };

  return (
    <div className="academy-section">
      <button className="academy-back-btn" onClick={() => navigate('/academy')}>← Back to Academy</button>
      <div className="academy-section-header">
        <h2 className="academy-section-title">📚 Security Awareness Training Center</h2>
        <p className="academy-section-desc">Comprehensive cybersecurity training paths for every audience</p>
      </div>

      {/* Track Selector */}
      <div className="academy-track-selector">
        {(Object.keys(TRACK_CONFIG) as TrainingTrack[]).map(track => (
          <button
            key={track}
            className={`academy-track-btn ${activeTrack === track ? 'active' : ''}`}
            onClick={() => { setActiveTrack(track); setExpandedModule(null); }}
            style={{ '--track-color': TRACK_CONFIG[track].color } as React.CSSProperties}
          >
            <span className="academy-track-icon">{TRACK_CONFIG[track].icon}</span>
            <span>{TRACK_CONFIG[track].label}</span>
          </button>
        ))}
      </div>

      <p className="academy-track-description" style={{ color: trackConfig.color }}>
        {trackConfig.icon} {trackConfig.description}
      </p>

      {/* Modules List */}
      <div className="academy-modules-list">
        {trackModules.map(mod => (
          <div key={mod.id} className="academy-module-card" style={{ '--card-accent': trackConfig.color } as React.CSSProperties}>
            <button
              className="academy-module-header"
              onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
            >
              <span className="academy-module-icon">{mod.icon}</span>
              <div className="academy-module-info">
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <div className="academy-module-meta">
                  <span>⏱ {mod.duration}</span>
                  <span className={`academy-difficulty-badge ${mod.difficulty}`}>{mod.difficulty}</span>
                  <span>{mod.topics.length} topic{mod.topics.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <span className="academy-module-chevron">{expandedModule === mod.id ? '▲' : '▼'}</span>
            </button>

            {expandedModule === mod.id && (
              <div className="academy-module-topics">
                {mod.topics.map(topic => (
                  <div key={topic.id} className="academy-topic">
                    <button
                      className="academy-topic-header"
                      onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                    >
                      <span>{topic.completed ? '✅' : '📄'} {topic.title}</span>
                      <span>{expandedTopic === topic.id ? '−' : '+'}</span>
                    </button>

                    {expandedTopic === topic.id && (
                      <div className="academy-topic-content">
                        <p className="academy-topic-text">{topic.content}</p>

                        <div className="academy-topic-section">
                          <h4>🔑 Key Points</h4>
                          <ul>{topic.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}</ul>
                        </div>

                        <div className="academy-topic-section">
                          <h4>💡 Examples</h4>
                          <ul>{topic.examples.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
                        </div>

                        <button
                          className="academy-complete-btn"
                          onClick={() => handleCompleteTopic(mod.id, topic.id)}
                        >
                          ✓ Mark Complete (+25 XP)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingCenter;
