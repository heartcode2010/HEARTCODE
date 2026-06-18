import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrgMember {
  name: string;
  role: string;
  modulesCompleted: number;
  quizAverage: number;
  lastActive: string;
  status: 'active' | 'warning' | 'safe';
}

const INITIAL_MEMBERS: OrgMember[] = [
  { name: 'CHINEDU OKAFOR', role: 'Finance Analyst', modulesCompleted: 4, quizAverage: 85, lastActive: '2 hours ago', status: 'safe' },
  { name: 'SARAH ALABI', role: 'HR Manager', modulesCompleted: 2, quizAverage: 55, lastActive: '1 day ago', status: 'warning' },
  { name: 'IBRAHIM MUSA', role: 'Systems Engineer', modulesCompleted: 8, quizAverage: 95, lastActive: '30 mins ago', status: 'safe' },
  { name: 'TEMITAPE BALOGUN', role: 'Support Agent', modulesCompleted: 1, quizAverage: 40, lastActive: '3 days ago', status: 'warning' },
  { name: 'NGOZI EZE', role: 'Operations Lead', modulesCompleted: 5, quizAverage: 80, lastActive: '5 hours ago', status: 'safe' }
];

const OrgDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<OrgMember[]>(INITIAL_MEMBERS);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('Organization Training Assessment exported successfully as Heartcode_Org_Audit.csv');
    }, 1200);
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
        <button
          onClick={handleExport}
          className="bg-cyber-surface2 hover:bg-cyber-cyan-dim border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono px-4 py-2 rounded cursor-pointer transition-all"
        >
          {exporting ? 'COMPILING REPORT...' : 'EXPORT ASSESSMENT AUDIT'}
        </button>
      </div>

      <div className="academy-section-header">
        <h2 className="academy-section-title">📊 Organization Training Dashboard</h2>
        <p className="academy-section-desc">Track progress, quiz metrics, vulnerabilities, and awareness levels across your enterprise or school network.</p>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL ACTIVE STAFF', value: '124 / 128', sub: '96% Enrollment' },
          { label: 'TRAINING COMPLETION', value: '74%', sub: '+4% this week' },
          { label: 'QUIZ PERFORMANCE AVG', value: '81%', sub: 'Class threshold passed' },
          { label: 'ALERT CONTEXTS RESOLVED', value: '420', sub: 'XP pool generated' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-cyber-surface border border-cyber-border p-4 rounded font-mono">
            <div className="text-cyber-ash3 text-[0.6rem] font-bold tracking-wider">{kpi.label}</div>
            <div className="text-white text-lg font-bold my-1">{kpi.value}</div>
            <div className="text-cyber-ash2 text-[0.58rem]">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Members Table */}
        <div className="lg:col-span-8 bg-cyber-surface border border-cyber-border rounded overflow-hidden">
          <div className="bg-cyber-bg2 px-4 py-2.5 border-b border-cyber-border font-mono text-[0.66rem] text-cyber-ash flex justify-between">
            <span>MEMBERS TRAINING PARTICIPATION</span>
            <span className="text-cyber-cyan">SYNC STATUS: SECURE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[0.68rem] text-cyber-ash">
              <thead>
                <tr className="border-b border-cyber-border bg-cyber-bg/40 text-cyber-ash2 text-[0.62rem]">
                  <th className="p-3">FULL NAME</th>
                  <th className="p-3">ROLE / DEPT</th>
                  <th className="p-3">MODULES</th>
                  <th className="p-3">QUIZ AVG</th>
                  <th className="p-3">LAST ACTIVE</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40">
                {members.map((member, idx) => (
                  <tr key={idx} className="hover:bg-cyber-bg/25">
                    <td className="p-3 font-bold text-white">{member.name}</td>
                    <td className="p-3 text-cyber-ash2">{member.role}</td>
                    <td className="p-3">{member.modulesCompleted}</td>
                    <td className="p-3">{member.quizAverage}%</td>
                    <td className="p-3 text-cyber-ash2">{member.lastActive}</td>
                    <td className="p-3">
                      {member.status === 'safe' ? (
                        <span className="text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-1.5 py-0.5 rounded text-[0.56rem]">SECURE</span>
                      ) : (
                        <span className="text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-1.5 py-0.5 rounded text-[0.56rem]">LOW FOCUS</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Weak Areas & Admin Suggestions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider border-b border-cyber-border pb-2">🚨 HIGH EXPOSURE AREAS</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-cyber-red font-bold text-[0.64rem]">
                  <span>1. PHISHING LINK IDENTIFICATION</span>
                  <span>42% Risk</span>
                </div>
                <div className="w-full bg-cyber-bg h-2 rounded border border-cyber-border">
                  <div className="bg-cyber-red h-full rounded" style={{ width: '42%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-cyber-amber font-bold text-[0.64rem]">
                  <span>2. DEVICE PROTECTION PASSCODES</span>
                  <span>28% Risk</span>
                </div>
                <div className="w-full bg-cyber-bg h-2 rounded border border-cyber-border">
                  <div className="bg-cyber-amber h-full rounded" style={{ width: '28%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-cyber-green font-bold text-[0.64rem]">
                  <span>3. OWASP SECURE HEADERS</span>
                  <span>15% Risk</span>
                </div>
                <div className="w-full bg-cyber-bg h-2 rounded border border-cyber-border">
                  <div className="bg-cyber-green h-full rounded" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyber-surface border border-cyber-border rounded p-4 space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider border-b border-cyber-border pb-2">💡 ADMIN ADVISORY PLAN</h3>
            
            <ul className="space-y-2 text-xs text-cyber-ash leading-relaxed list-inside font-sans list-disc">
              <li>
                <strong className="text-white">Targeted Campaigns</strong>: Deploy a mock phishing training exercise specifically for the Finance department.
              </li>
              <li>
                <strong className="text-white">Hygiene Auditing</strong>: Instruct HR personnel to complete the Password Security training module.
              </li>
              <li>
                <strong className="text-white">SME Policy updates</strong>: Use the SME Security Toolkit to draft a basic access control policy.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;
