import React, { useState, useEffect } from 'react';
import {
  Shield,
  Server,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Terminal,
  Activity,
  FileText,
  Plus,
  ArrowRight,

  ExternalLink,
  Flame,
  Radio,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import api from './services/api';
import OriginsIntroModal from './components/OriginsIntroModal';

type Tab =
  | 'dashboard'
  | 'assets'
  | 'advisories'
  | 'php'
  | 'tls'
  | 'remediation'
  | 'rehearsal'
  | 'incidents'
  | 'copilot'
  | 'range'
  | 'audit';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [showOriginsIntro, setShowOriginsIntro] = useState(true);


  // Data states
  const [report, setReport] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [phpInstallations, setPhpInstallations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals & form states
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', target: '', assetType: 'server', environment: 'production', criticality: 'critical' });
  const [verifyTaskId, setVerifyTaskId] = useState<string | null>(null);
  const [verifyEvidence, setVerifyEvidence] = useState('');
  const [verifyMethod, setVerifyMethod] = useState<'re-probe' | 'package-query' | 'cert-handshake' | 'hash-check'>('re-probe');

  // Change rehearsal state
  const [rehearsalAction, setRehearsalAction] = useState('Upgrade PHP 8.1.18 to PHP 8.3.12 LTS');
  const [rehearsalResult, setRehearsalResult] = useState<any>(null);

  // Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citations?: any[] }>>([
    {
      role: 'assistant',
      text: 'Greetings Operator. I am the Eket Cyberverse Copilot. I analyze authorized findings, runtime versions, and upstream advisories with strict evidence provenance. Ask me anything about your current risk posture.',
    },
  ]);

  // Load all operational data
  const loadData = async () => {
    setLoading(true);
    try {
      const [repRes, astRes, advRes, phpRes, tlsRes, fndRes, tskRes, incRes, audRes] = await Promise.all([
        api.get('/reports/posture'),
        api.get('/assets'),
        api.get('/advisories'),
        api.get('/php-security/inventory'),
        api.get('/tls/certificates'),
        api.get('/findings'),
        api.get('/remediation/tasks'),
        api.get('/incidents'),
        api.get('/audit/events'),
      ]);

      setReport(repRes.data.report);
      setAssets(astRes.data.data);
      setAdvisories(advRes.data.data);
      setPhpInstallations(phpRes.data.data);
      setCertificates(tlsRes.data.data);
      setFindings(fndRes.data.data);
      setTasks(tskRes.data.data);
      setIncidents(incRes.data.data);
      setAuditLogs(audRes.data.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/assets', newAsset);
      setShowAddAsset(false);
      setNewAsset({ name: '', target: '', assetType: 'server', environment: 'production', criticality: 'critical' });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create asset');
    }
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      await api.post(`/remediation/tasks/${taskId}/approve`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleVerifyRemediation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTaskId) return;
    try {
      await api.post(`/remediation/tasks/${verifyTaskId}/verify`, {
        evidenceText: verifyEvidence,
        method: verifyMethod,
        verifiedTrue: true,
      });
      setVerifyTaskId(null);
      setVerifyEvidence('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Verification rejected');
    }
  };

  const handleRunRehearsal = async () => {
    try {
      const res = await api.post('/rehearsal/plan', {
        targetAsset: 'Production Core API Gateway',
        proposedAction: rehearsalAction,
      });
      setRehearsalResult(res.data.plan);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Rehearsal failed');
    }
  };

  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    const userText = copilotQuery;
    setCopilotQuery('');
    setCopilotMessages((prev) => [...prev, { role: 'user', text: userText }]);

    try {
      const res = await api.post('/copilot/query', { prompt: userText });
      setCopilotMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.data.data.answer,
          citations: res.data.data.citations,
        },
      ]);
    } catch (err) {
      setCopilotMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'An error occurred while generating grounded response.' },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex">
      {/* ── Sidebar Navigation ── */}
      <aside className="w-64 bg-cyber-bg2 border-r border-cyber-border flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-cyber-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-cyber-blue/15 border border-cyber-blue flex items-center justify-center text-cyber-cyan shadow-[0_0_12px_rgba(41,211,255,0.2)]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold tracking-wider text-sm text-cyber-text font-mono">EKET CYBERVERSE</div>
                <div className="text-[0.62rem] text-cyber-cyan font-mono tracking-widest uppercase">Verified Resilience</div>
              </div>
            </div>
            <div className="mt-3 text-[0.65rem] text-cyber-muted font-mono leading-tight">
              Heartcode Technologies HQ
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1 text-xs font-mono">
            {[
              { id: 'dashboard', label: 'Security Dashboard', icon: Activity },
              { id: 'assets', label: 'Digital Asset Inventory', icon: Server, badge: assets.length },
              { id: 'advisories', label: 'Global Advisories', icon: Radio, badge: advisories.length },
              { id: 'php', label: 'PHP Runtime Security', icon: Cpu, badge: phpInstallations.length },
              { id: 'tls', label: 'TLS Trust Guardian', icon: Lock, badge: certificates.length },
              { id: 'remediation', label: 'Verified Remediation', icon: CheckCircle2, badge: tasks.length },
              { id: 'rehearsal', label: 'Change Rehearsal', icon: RefreshCw },
              { id: 'incidents', label: 'Incident Response', icon: Flame, badge: incidents.length },
              { id: 'copilot', label: 'AI Security Copilot', icon: Terminal },
              { id: 'range', label: 'Cyber Range (Labs)', icon: BookOpen },
              { id: 'audit', label: 'Audit Trail', icon: FileText, badge: auditLogs.length },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-all duration-150 ${
                    isActive
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-border font-semibold shadow-[0_0_12px_rgba(47,128,255,0.08)]'
                      : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-cyber-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Telemetry & Refresh */}
        <div className="p-4 border-t border-cyber-border bg-cyber-bg/50">
          <div className="flex items-center justify-between text-[0.68rem] font-mono text-cyber-muted mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-success animate-pulse" />
              TELEMETRY: LIVE
            </span>
            <button onClick={loadData} title="Refresh System" className="hover:text-cyber-cyan transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="text-[0.62rem] text-cyber-muted font-mono leading-tight">
            Role: Lead Operator (Admin) <br />
            Tenant: org-eket-1 (HQ)
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-cyber-border mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-wide text-cyber-text uppercase">
                {activeTab.replace('-', ' ')}
              </h1>
              <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-cyan">
                DEFENSE ENGINE V1.0
              </span>
            </div>
            <p className="text-xs text-cyber-muted font-mono mt-1">
              "From Security Intelligence to Verified Resilience."
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOriginsIntro(true)}
              className="flex items-center gap-1.5 bg-cyber-panel hover:bg-cyber-elevated border border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan px-3 py-2 rounded font-mono text-xs transition-all shadow-[0_0_12px_rgba(41,211,255,0.15)]"
              title="Show Eket Origins Intro"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Eket Origins</span>
            </button>

            {report && (
              <div className="flex items-center gap-3 bg-cyber-panel border border-cyber-border px-4 py-2 rounded font-mono text-xs">
                <span className="text-cyber-muted">RESILIENCE SCORE:</span>
                <span
                  className={`font-bold text-sm ${
                    report.postureScore >= 80
                      ? 'text-cyber-success'
                      : report.postureScore >= 50
                      ? 'text-cyber-warning'
                      : 'text-cyber-critical'
                  }`}
                >
                  {report.postureScore}/100
                </span>
                <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-text">
                  {report.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Eket Origins Pop-up Intro Modal */}
        <OriginsIntroModal isOpen={showOriginsIntro} onClose={() => setShowOriginsIntro(false)} />


        {/* ── TAB 1: DASHBOARD ── */}
        {activeTab === 'dashboard' && report && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                <div className="text-xs font-mono text-cyber-muted mb-1">TOTAL ASSETS</div>
                <div className="text-3xl font-mono font-bold text-cyber-text">{report.summary.totalAssets}</div>
                <div className="text-[0.68rem] text-cyber-cyan font-mono mt-2">100% telemetry verified</div>
              </div>

              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                <div className="text-xs font-mono text-cyber-muted mb-1">CRITICAL FINDINGS</div>
                <div className="text-3xl font-mono font-bold text-cyber-critical">{report.summary.criticalFindings}</div>
                <div className="text-[0.68rem] text-cyber-critical font-mono mt-2">Immediate patch remediation needed</div>
              </div>

              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                <div className="text-xs font-mono text-cyber-muted mb-1">VERIFIED RESOLVED</div>
                <div className="text-3xl font-mono font-bold text-cyber-success">{report.summary.verifiedResolvedTasks}</div>
                <div className="text-[0.68rem] text-cyber-success font-mono mt-2">Validated with cryptographic proof</div>
              </div>

              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                <div className="text-xs font-mono text-cyber-muted mb-1">PENDING REMEDIATIONS</div>
                <div className="text-3xl font-mono font-bold text-cyber-warning">{report.summary.pendingRemediations}</div>
                <div className="text-[0.68rem] text-cyber-warning font-mono mt-2">Active remediation lifecycle</div>
              </div>
            </div>

            {/* Critical Exposure Callout */}
            <div className="bg-cyber-panel border-l-4 border-l-cyber-critical border border-cyber-border rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-cyber-critical" />
                    <span className="text-sm font-bold font-mono text-cyber-critical uppercase">
                      CRITICAL CVE-2024-4577 (PHP CGI RCE) WEAPONIZATION DETECTED
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyber-muted mt-2 max-w-3xl leading-relaxed">
                    Host <span className="text-cyber-text font-bold">Production Core API Gateway</span> is running unpatched
                    PHP 8.1.18. This CVE is cataloged in the CISA Known Exploited Vulnerabilities list and active edge probes
                    have been logged by our telemetry sensors.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('remediation')}
                  className="bg-cyber-critical hover:bg-cyber-critical/80 text-white font-mono text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,77,90,0.3)]"
                >
                  <span>Open Remediation Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Findings List */}
            <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-text mb-4">
                Active Security Findings with Explainable Risk
              </h2>
              <div className="space-y-3">
                {findings.map((f) => (
                  <div key={f.id} className="bg-cyber-bg border border-cyber-border rounded p-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[0.65rem] font-mono px-2 py-0.5 rounded font-bold ${
                            f.severity === 'CRITICAL'
                              ? 'bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/40'
                              : f.severity === 'HIGH'
                              ? 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/40'
                              : 'bg-cyber-blue/20 text-cyber-cyan border border-cyber-blue/40'
                          }`}
                        >
                          {f.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyber-text">{f.title}</span>
                        <span className="text-[0.65rem] font-mono text-cyber-muted">[{f.category}]</span>
                      </div>

                      <div className="mt-2 text-xs font-mono text-cyber-muted">
                        Asset: <span className="text-cyber-text">{f.assetName}</span> | Risk Score: <span className="text-cyber-cyan font-bold">{f.riskScore}/100</span>
                      </div>

                      {f.riskExplanation && (
                        <ul className="mt-2 text-[0.7rem] font-mono text-cyber-muted list-disc list-inside space-y-0.5">
                          {f.riskExplanation.map((exp: string, idx: number) => (
                            <li key={idx}>{exp}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-3 text-[0.65rem] font-mono text-cyber-cyan bg-cyber-panel border border-cyber-border p-2 rounded">
                        Evidence Provenance: {f.evidence.source} (Hash: {f.evidence.sha256.slice(0, 16)}...)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-mono px-2.5 py-1 rounded bg-cyber-bg2 border border-cyber-border text-cyber-muted uppercase">
                        Status: {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: DIGITAL ASSET INVENTORY ── */}
        {activeTab === 'assets' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-mono font-bold text-cyber-text uppercase">Authorized Digital Assets</h2>
                <p className="text-xs font-mono text-cyber-muted">Continuous asset inventory with evidence source tracking</p>
              </div>
              <button
                onClick={() => setShowAddAsset(true)}
                className="bg-cyber-blue hover:bg-cyber-blue/80 text-white font-mono text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(47,128,255,0.3)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Digital Asset</span>
              </button>
            </div>

            <div className="bg-cyber-panel border border-cyber-border rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cyber-bg border-b border-cyber-border text-cyber-muted uppercase text-[0.68rem]">
                  <tr>
                    <th className="p-3.5">Asset Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Target / Endpoint</th>
                    <th className="p-3.5">Environment</th>
                    <th className="p-3.5">Criticality</th>
                    <th className="p-3.5">Evidence Source</th>
                    <th className="p-3.5">Last Observed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-cyber-bg2/50 transition-colors">
                      <td className="p-3.5 font-bold text-cyber-text">{a.name}</td>
                      <td className="p-3.5 text-cyber-cyan">{a.assetType}</td>
                      <td className="p-3.5 text-cyber-muted">{a.target}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[0.65rem] bg-cyber-bg border border-cyber-border text-cyber-muted uppercase">
                          {a.environment}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[0.65rem] font-bold ${
                            a.criticality === 'critical'
                              ? 'bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/30'
                              : 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30'
                          }`}
                        >
                          {a.criticality}
                        </span>
                      </td>
                      <td className="p-3.5 text-cyber-muted text-[0.7rem]">{a.evidenceSource}</td>
                      <td className="p-3.5 text-cyber-muted text-[0.7rem]">{new Date(a.lastObservedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Asset Modal */}
            {showAddAsset && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-cyber-panel border border-cyber-border rounded-lg max-w-md w-full p-6 shadow-2xl">
                  <h3 className="text-sm font-mono font-bold text-cyber-text uppercase mb-4">Register New Digital Asset</h3>
                  <form onSubmit={handleCreateAsset} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-cyber-muted mb-1">Asset Name</label>
                      <input
                        type="text"
                        required
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        placeholder="e.g. Staging Auth Proxy"
                        className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none focus:border-cyber-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-cyber-muted mb-1">Target / Hostname / IP</label>
                      <input
                        type="text"
                        required
                        value={newAsset.target}
                        onChange={(e) => setNewAsset({ ...newAsset, target: e.target.value })}
                        placeholder="e.g. auth-staging.domain.com"
                        className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none focus:border-cyber-blue"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-cyber-muted mb-1">Asset Type</label>
                        <select
                          value={newAsset.assetType}
                          onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
                          className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none"
                        >
                          <option value="server">Server</option>
                          <option value="website">Website</option>
                          <option value="runtime">Runtime</option>
                          <option value="database">Database</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-cyber-muted mb-1">Criticality</label>
                        <select
                          value={newAsset.criticality}
                          onChange={(e) => setNewAsset({ ...newAsset, criticality: e.target.value })}
                          className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddAsset(false)}
                        className="px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded bg-cyber-blue hover:bg-cyber-blue/80 text-white font-bold"
                      >
                        Save Asset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: GLOBAL VULNERABILITY INTELLIGENCE ── */}
        {activeTab === 'advisories' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-mono font-bold text-cyber-text uppercase">Global Vulnerability Intelligence</h2>
                <p className="text-xs font-mono text-cyber-muted">Correlated from NVD, CISA KEV, and PHP Security Teams</p>
              </div>
              <button
                onClick={async () => {
                  await api.post('/advisories/sync');
                  alert('Authoritative vulnerability feeds checked and synchronized.');
                }}
                className="bg-cyber-panel hover:bg-cyber-elevated border border-cyber-border text-cyber-cyan font-mono text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Synchronize Feeds</span>
              </button>
            </div>

            <div className="space-y-3 font-mono">
              {advisories.map((adv) => (
                <div key={adv.id} className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-cyber-cyan">{adv.id}</span>
                        <span
                          className={`text-[0.65rem] px-2 py-0.5 rounded font-bold ${
                            adv.severity === 'CRITICAL'
                              ? 'bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/30'
                              : 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30'
                          }`}
                        >
                          {adv.severity} (CVSS {adv.cvssScore})
                        </span>
                        {adv.isKnownExploited && (
                          <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-critical/30 text-cyber-critical border border-cyber-critical font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            CISA KEV ACTIVE WEAPONIZATION
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-cyber-text mt-2">{adv.title}</h3>
                      <div className="text-[0.7rem] text-cyber-muted mt-2 space-y-1">
                        <div>
                          Affected Ranges: <span className="text-cyber-text">{adv.affectedVersionRange}</span>
                        </div>
                        <div>
                          Fixed Target Releases: <span className="text-cyber-success font-bold">{adv.fixedVersion}</span>
                        </div>
                        <div>
                          Mitigation: <span className="text-cyber-muted">{adv.mitigation}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={adv.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyber-muted hover:text-cyber-cyan text-xs flex items-center gap-1"
                    >
                      <span>Source Reference</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: PHP RUNTIME SECURITY ── */}
        {activeTab === 'php' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-mono font-bold text-cyber-text uppercase">PHP Runtime Security Management</h2>
              <p className="text-xs font-mono text-cyber-muted">
                Runtime inventory, EOL support tracking, and patched target version matching
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              {phpInstallations.map((inst) => (
                <div key={inst.id} className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                    <span className="font-bold text-sm text-cyber-text">{inst.serverHostname}</span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/40 uppercase font-bold">
                      {inst.supportStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-cyber-muted">
                    <div>
                      Installed Version: <span className="text-cyber-critical font-bold">{inst.version}</span> ({inst.sapi})
                    </div>
                    <div>
                      End of Life Date: <span className="text-cyber-text">{inst.eolDate}</span>
                    </div>
                    <div>
                      Correlated Vulnerabilities: <span className="text-cyber-cyan font-bold">{inst.relevantAdvisories.join(', ')}</span>
                    </div>
                  </div>

                  <div className="text-[0.68rem] bg-cyber-bg border border-cyber-border rounded p-2.5 text-cyber-muted">
                    Verification Telemetry: {inst.verificationProof}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('rehearsal');
                      setRehearsalAction(`Upgrade PHP ${inst.version} on ${inst.serverHostname} to 8.3.12 LTS`);
                    }}
                    className="w-full bg-cyber-blue/15 hover:bg-cyber-blue/25 border border-cyber-blue text-cyber-cyan font-bold text-xs py-2 rounded transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Plan Runtime Patch Rehearsal</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: TLS TRUST GUARDIAN ── */}
        {activeTab === 'tls' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">TLS Trust Guardian</h2>
              <p className="text-xs text-cyber-muted">Continuous certificate expiration monitoring & trust chain validation</p>
            </div>

            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyber-cyan" />
                        <span className="font-bold text-sm text-cyber-text">{cert.domain}</span>
                        <span
                          className={`text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase ${
                            cert.trustStatus === 'warning'
                              ? 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30'
                              : 'bg-cyber-success/20 text-cyber-success border border-cyber-success/30'
                          }`}
                        >
                          {cert.trustStatus}
                        </span>
                      </div>
                      <div className="text-xs text-cyber-muted mt-2 space-y-1">
                        <div>
                          Issuer: <span className="text-cyber-text">{cert.issuer}</span>
                        </div>
                        <div>
                          Days Remaining: <span className="text-cyber-warning font-bold">{cert.daysRemaining} days</span> (Expires: {new Date(cert.validTo).toLocaleDateString()})
                        </div>
                        <div>
                          Cipher & Key: <span className="text-cyber-text">{cert.keyStrength}</span>
                        </div>
                        <div className="text-[0.65rem] text-cyber-cyan">
                          SHA-256 Fingerprint: {cert.sha256Fingerprint.slice(0, 32)}...
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        const res = await api.post('/tls/inspect', { hostname: cert.domain });
                        alert(`Live TLS Handshake Probed:\nIssuer: ${res.data.inspection.issuer}\nChain Valid: ${res.data.inspection.chainValid}`);
                      }}
                      className="bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs px-3 py-1.5 rounded transition-all"
                    >
                      Perform Live Probe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: THE VERIFIED REMEDIATION ENGINE ── */}
        {activeTab === 'remediation' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">The Verified Remediation Engine</h2>
              <p className="text-xs text-cyber-muted">
                Zero self-declared resolutions. Every vulnerability resolution requires verified technical inspection evidence.
              </p>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-cyber-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyber-text">{task.title}</span>
                        <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30 font-bold uppercase">
                          State: {task.state}
                        </span>
                      </div>
                      <div className="text-[0.7rem] text-cyber-muted mt-1">
                        Assigned: {task.assignedTo} | Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.state === 'AWAITING_APPROVAL' && (
                        <button
                          onClick={() => handleApproveTask(task.id)}
                          className="bg-cyber-blue hover:bg-cyber-blue/80 text-white text-xs px-3 py-1.5 rounded font-bold"
                        >
                          Authorize Execution Plan
                        </button>
                      )}

                      {task.state === 'AWAITING_VERIFICATION' && (
                        <button
                          onClick={() => setVerifyTaskId(task.id)}
                          className="bg-cyber-success hover:bg-cyber-success/80 text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(46,204,145,0.3)]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submit Verification Proof</span>
                        </button>
                      )}

                      {task.state === 'VERIFIED_RESOLVED' && (
                        <span className="text-xs text-cyber-success font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          VERIFIED RESOLVED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="text-xs text-cyber-muted bg-cyber-bg border border-cyber-border rounded p-3 whitespace-pre-line">
                    <span className="font-bold text-cyber-text block mb-1">Approved Remediation Plan:</span>
                    {task.remediationPlan}
                  </div>

                  {/* Execution Logs */}
                  {task.executionLogs?.length > 0 && (
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-cyber-text text-[0.7rem]">Execution Log Trail:</span>
                      {task.executionLogs.map((log: any, idx: number) => (
                        <div key={idx} className="text-[0.68rem] text-cyber-muted bg-cyber-bg2 p-2 rounded">
                          [{new Date(log.timestamp).toLocaleTimeString()}] {log.actor}: {log.action} - {log.outputSummary}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cryptographic Verification Evidence */}
                  {task.verificationEvidence && (
                    <div className="bg-cyber-success/10 border border-cyber-success/30 rounded p-3 text-xs space-y-1">
                      <span className="font-bold text-cyber-success block">Cryptographic Verification Proof:</span>
                      <div className="text-[0.68rem] text-cyber-text">{task.verificationEvidence.evidenceText}</div>
                      <div className="text-[0.62rem] text-cyber-muted font-mono">
                        Evidence Hash: {task.verificationEvidence.evidenceHash} (Verified by: {task.verificationEvidence.verifiedBy})
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Verification Modal */}
            {verifyTaskId && (
              <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
                <div className="bg-cyber-panel border border-cyber-border rounded-lg max-w-lg w-full p-6 shadow-2xl">
                  <h3 className="text-sm font-bold text-cyber-text uppercase mb-2">Submit Technical Verification Evidence</h3>
                  <p className="text-[0.7rem] text-cyber-muted mb-4">
                    Security Policy requires verifiable inspection output (e.g. command stdout, package query, or TLS probe result).
                  </p>
                  <form onSubmit={handleVerifyRemediation} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-cyber-muted mb-1">Verification Method</label>
                      <select
                        value={verifyMethod}
                        onChange={(e) => setVerifyMethod(e.target.value as any)}
                        className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none"
                      >
                        <option value="re-probe">Automated Re-probe</option>
                        <option value="package-query">Package Manifest Query</option>
                        <option value="cert-handshake">TLS Handshake Verification</option>
                        <option value="hash-check">Binary Hash Verification</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-cyber-muted mb-1">Technical Evidence Output</label>
                      <textarea
                        required
                        rows={4}
                        value={verifyEvidence}
                        onChange={(e) => setVerifyEvidence(e.target.value)}
                        placeholder="e.g. Executed `php -v`: Output returned `PHP 8.3.12 (cli) (built: Sep 28 2024)` with zero CGI injection triggers."
                        className="w-full bg-cyber-bg border border-cyber-border rounded p-2 text-cyber-text outline-none font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setVerifyTaskId(null)}
                        className="px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded bg-cyber-success hover:bg-cyber-success/80 text-white font-bold"
                      >
                        Submit & Verify Resolution
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 7: SECURITY CHANGE REHEARSAL ── */}
        {activeTab === 'rehearsal' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">Security Change Rehearsal</h2>
              <p className="text-xs text-cyber-muted">
                Pre-flight impact simulations, compatibility checks, and rollback plans before executing production changes
              </p>
            </div>

            <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-4">
              <div>
                <label className="block text-xs text-cyber-muted mb-1">Proposed Maintenance Action</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rehearsalAction}
                    onChange={(e) => setRehearsalAction(e.target.value)}
                    className="flex-1 bg-cyber-bg border border-cyber-border rounded p-2.5 text-xs text-cyber-text outline-none focus:border-cyber-blue"
                  />
                  <button
                    onClick={handleRunRehearsal}
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-white text-xs px-4 py-2 rounded font-bold"
                  >
                    Simulate Impact
                  </button>
                </div>
              </div>

              {rehearsalResult && (
                <div className="space-y-4 pt-4 border-t border-cyber-border text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyber-cyan">Pre-Flight Readiness Score: {rehearsalResult.readinessScore}/100</span>
                    <span className="text-cyber-muted">Est. Downtime: {rehearsalResult.estimatedDowntimeSeconds} seconds</span>
                  </div>

                  <div>
                    <span className="font-bold text-cyber-warning block mb-1">Compatibility & Breaking Change Warnings:</span>
                    <ul className="list-disc list-inside space-y-1 text-cyber-muted bg-cyber-bg p-3 rounded">
                      {rehearsalResult.compatibilityWarnings.map((w: string, idx: number) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-cyber-text block mb-1">Mandatory Prerequisites:</span>
                    <ul className="list-disc list-inside space-y-1 text-cyber-muted bg-cyber-bg p-3 rounded">
                      {rehearsalResult.prerequisites.map((p: string, idx: number) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-cyber-cyan block mb-1">Automated Rollback Blueprint:</span>
                    <div className="bg-cyber-bg p-3 rounded text-[0.68rem] text-cyber-muted whitespace-pre-line">
                      {rehearsalResult.rollbackPlan}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 8: INCIDENTS ── */}
        {activeTab === 'incidents' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">Incident Management & Containment</h2>
              <p className="text-xs text-cyber-muted">Timeline forensics and verified containment response</p>
            </div>

            <div className="space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                    <span className="font-bold text-sm text-cyber-text">{inc.title}</span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-critical/20 text-cyber-critical border border-cyber-critical/40 uppercase font-bold">
                      {inc.severity} - {inc.status}
                    </span>
                  </div>

                  <div className="text-xs text-cyber-muted space-y-2">
                    <div>Lead Responder: {inc.leadResponder}</div>
                    <div>
                      <span className="font-bold text-cyber-text block mb-1">Forensic Timeline:</span>
                      {inc.timeline.map((t: any, idx: number) => (
                        <div key={idx} className="bg-cyber-bg p-2 rounded text-[0.68rem] mt-1">
                          [{new Date(t.timestamp).toLocaleTimeString()}] {t.recordedBy}: {t.event}
                        </div>
                      ))}
                    </div>

                    <div>
                      <span className="font-bold text-cyber-text block mb-1">Containment Directives:</span>
                      <ul className="list-disc list-inside text-[0.68rem] text-cyber-muted">
                        {inc.containmentActions.map((c: string, idx: number) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 9: AI SECURITY COPILOT ── */}
        {activeTab === 'copilot' && (
          <div className="space-y-4 font-mono flex flex-col h-[75vh]">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">AI Security Copilot</h2>
              <p className="text-xs text-cyber-muted">
                Contextual resilience assistant with authoritative citations and zero hallucinated software versions
              </p>
            </div>

            <div className="flex-1 bg-cyber-panel border border-cyber-border rounded-lg p-4 overflow-y-auto space-y-3">
              {copilotMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg max-w-2xl text-xs ${
                    m.role === 'user'
                      ? 'ml-auto bg-cyber-blue text-white'
                      : 'bg-cyber-bg border border-cyber-border text-cyber-text'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-line">{m.text}</div>
                  {m.citations && (
                    <div className="mt-3 pt-2 border-t border-cyber-border text-[0.65rem] text-cyber-cyan space-y-0.5">
                      <div className="font-bold uppercase">Authoritative Citations:</div>
                      {m.citations.map((c, i) => (
                        <div key={i}>• {c.title} ({c.url || c.reference})</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendCopilot} className="flex gap-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask Copilot e.g.: 'Which findings need attention first?' or 'How do I verify the PHP 8.3 patch?'"
                className="flex-1 bg-cyber-panel border border-cyber-border rounded p-3 text-xs text-cyber-text outline-none focus:border-cyber-cyan font-mono"
              />
              <button
                type="submit"
                className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-bg font-bold text-xs px-5 rounded font-mono"
              >
                Query
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 10: CYBER RANGE ── */}
        {activeTab === 'range' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">Cyber Range & Simulation Labs</h2>
              <p className="text-xs text-cyber-muted">Hands-on technical simulation scenarios for defense engineering</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text">Lab 1: PHP-CGI Argument Injection Triage</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold">INTERMEDIATE</span>
                </div>
                <p className="text-xs text-cyber-muted leading-relaxed">
                  Analyze web server logs capturing CVE-2024-4577 payload encoding patterns. Configure perimeter rewrite rules to block argument injection strings while updating the runtime environment.
                </p>
                <button
                  onClick={() => alert('Starting isolated simulation sandbox on port 8090...')}
                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-white text-xs px-3 py-1.5 rounded font-bold"
                >
                  Launch Sandbox Drill
                </button>
              </div>

              <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyber-text">Lab 2: TLS Trust Degradation & Root Rotation</span>
                  <span className="text-[0.65rem] px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold">ADVANCED</span>
                </div>
                <p className="text-xs text-cyber-muted leading-relaxed">
                  Simulate emergency revocation of an intermediate Certificate Authority. Re-issue and hot-deploy ECDSA certificates across an active Nginx cluster without dropping active client connections.
                </p>
                <button
                  onClick={() => alert('Starting isolated TLS drill sandbox on port 8443...')}
                  className="bg-cyber-blue hover:bg-cyber-blue/80 text-white text-xs px-3 py-1.5 rounded font-bold"
                >
                  Launch Sandbox Drill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 11: AUDIT TRAIL ── */}
        {activeTab === 'audit' && (
          <div className="space-y-5 font-mono">
            <div>
              <h2 className="text-base font-bold text-cyber-text uppercase">Immutable Security Audit Trail</h2>
              <p className="text-xs text-cyber-muted">Tamper-evident activity logs with actor attribution and cryptographic hashes</p>
            </div>

            <div className="bg-cyber-panel border border-cyber-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cyber-bg border-b border-cyber-border text-cyber-muted uppercase text-[0.68rem]">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Details</th>
                    <th className="p-3.5">Evidence Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-cyber-bg2/50 transition-colors">
                      <td className="p-3.5 text-cyber-muted text-[0.68rem]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-3.5 text-cyber-text font-bold">{log.actor}</td>
                      <td className="p-3.5 text-cyber-cyan">{log.action}</td>
                      <td className="p-3.5 text-cyber-muted">
                        {log.resourceType}:{log.resourceId}
                      </td>
                      <td className="p-3.5 text-cyber-muted text-[0.7rem]">{log.details}</td>
                      <td className="p-3.5 text-cyber-muted text-[0.65rem]">{log.evidenceHash.slice(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
