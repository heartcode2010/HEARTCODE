import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CareerPath {
  id: string;
  title: string;
  icon: string;
  salary: string;
  description: string;
  skills: string[];
  certifications: string[];
  projects: string[];
}

const PATHS: CareerPath[] = [
  {
    id: 'soc-analyst',
    title: 'SOC Security Analyst',
    icon: '🛡️',
    salary: '₦6,000,000 - ₦12,000,000 / year',
    description: 'First line of defense monitoring network security events, analyzing alerts, and triaging active threat containment.',
    skills: ['Log Analysis (SIEM)', 'Wireshark packet analysis', 'Incident Triage', 'Network Topology mapping'],
    certifications: ['CompTIA Security+', 'Cisco Certified CyberOps Associate', 'GIAC Certified Detection Analyst (GCDA)'],
    projects: [
      'Build a home lab using Security Onion or PfSense to capture malicious logs.',
      'Analyze raw PCAP captures of standard SQL Injection or brute force scans.'
    ]
  },
  {
    id: 'app-sec',
    title: 'Application Security Engineer',
    icon: '💻',
    salary: '₦10,000,000 - ₦22,000,000 / year',
    description: 'Bridges developers and security. Audits source code repositories, enforces secure CI/CD coding standards, and runs penetration scans.',
    skills: ['Secure Coding (XSS, SQLi)', 'SAST/DAST Tooling', 'Code Review audits', 'Threat Modeling'],
    certifications: ['Certified Secure Software Lifecycle Professional (CSSLP)', 'OSWE (Offensive Security Web Exploitation)'],
    projects: [
      'Configure automated security code scanner pipelines in GitHub Actions.',
      'Audit sample open-source repositories for hardcoded API keys or vulnerable packages.'
    ]
  },
  {
    id: 'threat-intel',
    title: 'Threat Intelligence Researcher',
    icon: '📡',
    salary: '₦9,000,000 - ₦18,000,000 / year',
    description: 'Identifies emerging cyberattack campaigns, maps threat group actors, and drafts indicators of compromise (IoC) to proactively block hacks.',
    skills: ['Malware Analysis', 'OSINT research', 'MITRE ATT&CK correlation', 'YARA rule definition'],
    certifications: ['GIAC Cyber Threat Intelligence (GCTI)', 'Certified Threat Intelligence Analyst (CTIA)'],
    projects: [
      'Write a YARA rule designed to identify specific indicators inside a phishing email template.',
      'Deconstruct real-world ransomware attack timelines using OSINT feed trackers.'
    ]
  }
];

const CareerHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(PATHS[0].id);

  const activePath = PATHS.find((p) => p.id === selectedId) || PATHS[0];

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">🚀 Cybersecurity Career Pathway Hub</h2>
        <p className="academy-section-desc">Explore professional cybersecurity domains, required skill sets, certification roadmaps, and project guides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pathway List */}
        <div className="lg:col-span-4 space-y-2">
          {PATHS.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedId(path.id)}
              className={`w-full text-left p-3.5 border rounded cursor-pointer transition-all flex items-center gap-3 ${
                selectedId === path.id
                  ? 'bg-cyber-surface border-cyber-cyan text-white shadow-[0_0_8px_rgba(0,245,255,0.15)]'
                  : 'bg-cyber-bg/40 border-cyber-border text-cyber-ash2 hover:border-cyber-ash2'
              }`}
            >
              <span className="text-xl">{path.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold font-display truncate text-white">{path.title}</div>
                <div className="font-mono text-[0.58rem] text-cyber-cyan mt-0.5">{path.salary.split(' ')[0]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Pathway Details Panel */}
        <div className="lg:col-span-8 bg-cyber-surface border border-cyber-border rounded overflow-hidden">
          <div className="bg-cyber-bg2 px-4 py-2.5 border-b border-cyber-border flex justify-between font-mono text-[0.66rem] text-cyber-ash">
            <span>PROFESSIONAL DOMAIN SHEET // {activePath.title.toUpperCase()}</span>
            <span className="text-cyber-cyan uppercase">PORTFOLIO PROTOCOLS</span>
          </div>

          <div className="p-5 space-y-4 font-sans text-xs">
            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-white text-xs font-bold font-display tracking-wider uppercase">{activePath.title}</h4>
              <p className="text-cyber-ash leading-relaxed">{activePath.description}</p>
            </div>

            {/* Salary */}
            <div className="bg-cyber-bg p-3 border border-cyber-border rounded font-mono text-[0.66rem] text-cyber-cyan flex justify-between">
              <span>ESTIMATED LOCAL SALARY POOL:</span>
              <span className="font-bold">{activePath.salary}</span>
            </div>

            {/* Skills & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skills */}
              <div className="bg-cyber-bg p-3 border border-cyber-border rounded space-y-2">
                <h5 className="text-white font-mono text-[0.62rem] font-bold">🛠️ CORE COMPETENCY SKILLS:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {activePath.skills.map((skill, i) => (
                    <span key={i} className="bg-cyber-surface border border-cyber-border text-cyber-ash text-[0.6rem] px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-cyber-bg p-3 border border-cyber-border rounded space-y-2">
                <h5 className="text-white font-mono text-[0.62rem] font-bold">📜 CERTIFICATION ROADMAP:</h5>
                <ul className="space-y-1 list-inside list-disc text-cyber-ash text-[0.66rem] leading-relaxed">
                  {activePath.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-cyber-bg p-3 border border-cyber-border rounded space-y-2">
              <h5 className="text-white font-mono text-[0.62rem] font-bold">💡 BLUEPRINT PORTFOLIO PROJECTS:</h5>
              <div className="space-y-2">
                {activePath.projects.map((proj, i) => (
                  <div key={i} className="bg-cyber-surface border border-cyber-border p-2.5 rounded border-l-2 border-cyber-cyan text-[0.66rem] text-cyber-ash leading-relaxed">
                    {proj}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerHub;
