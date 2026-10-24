import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscriptionStore from '../../store/subscriptionStore';
import { ArrowLeft, Code, Play, Download, CloudLightning, ShieldAlert, FileCode, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const TechLabsHome: React.FC = () => {
  const navigate = useNavigate();
  const { tier, canAccess } = useSubscriptionStore();
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0d0e12;
      color: #00e5ff;
      font-family: sans-serif;
      text-align: center;
      padding-top: 10%;
    }
    .btn {
      background: #8b5cf6;
      border: none;
      color: white;
      padding: 10px 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Hello Technova Sandbox</h1>
  <p>Static Preview Render Node v18</p>
  <button class="btn" onclick="alert('Action loop executed!')">Trigger Interaction</button>
</body>
</html>`);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Sandbox compiler initialized.']);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runPreview = () => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(code);
    doc.close();
    setLogs(prev => [...prev, `[COMPILER] Compilation completed. Rendered preview layout at ${new Date().toLocaleTimeString()}`]);
  };

  useEffect(() => {
    runPreview();
  }, [code]);

  const handleDeploy = () => {
    if (!canAccess('oneClickDeploy')) {
      alert('One-Click Cloud Container Deployment is locked. Upgrade to Pro/Premium to unlock production-grade hosting!');
      return;
    }
    setIsDeploying(true);
    setLogs(prev => [...prev, '[SANDBOX] Spawning Docker container sandbox...', '[SANDBOX] Initializing isolated Node server v18...']);
    setTimeout(() => {
      const mockUrl = `https://app-sandbox-${Math.random().toString(36).substring(3, 9)}.technova.dev`;
      setDeployUrl(mockUrl);
      setLogs(prev => [...prev, `[SYSTEM] Deploy successful. Running at: ${mockUrl}`]);
      setIsDeploying(false);
    }, 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'technova-sandbox-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLogs(prev => [...prev, '[SYSTEM] Static asset downloaded to local environment.']);
  };

  const loadTemplate = (tpl: string) => {
    if (tpl === 'counter') {
      setCode(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0a0a0c; color: white; font-family: sans-serif; text-align: center; padding-top: 5%; }
    .counter { font-size: 4rem; font-weight: bold; color: #8b5cf6; margin: 20px; }
    button { background: #1a1a20; border: 1px solid #2a2a2e; color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Interactive Counter</h2>
  <div class="counter" id="count">0</div>
  <button onclick="document.getElementById('count').innerText = parseInt(document.getElementById('count').innerText) + 1">Increment</button>
</body>
</html>`);
    } else if (tpl === 'calculator') {
      setCode(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0a0a0c; color: white; font-family: sans-serif; text-align: center; padding-top: 5%; }
    input { background: #111; border: 1px solid #2a2a2e; color: #00d4ff; font-size: 1.5rem; padding: 10px; width: 200px; text-align: right; margin-bottom: 10px; }
    .btn-row { margin: 5px; }
    button { background: #1a1a20; border: 1px solid #2a2a2e; color: white; width: 50px; height: 50px; border-radius: 8px; font-size: 1.2rem; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Mini Calculator</h2>
  <input id="display" readonly value="0"><br>
  <div class="btn-row">
    <button onclick="document.getElementById('display').value = ''">C</button>
    <button onclick="document.getElementById('display').value += '/'">/</button>
  </div>
  <div class="btn-row">
    <button onclick="document.getElementById('display').value += '7'">7</button>
    <button onclick="document.getElementById('display').value += '8'">8</button>
    <button onclick="document.getElementById('display').value += '9'">9</button>
  </div>
  <div class="btn-row">
    <button onclick="document.getElementById('display').value += '4'">4</button>
    <button onclick="document.getElementById('display').value += '5'">5</button>
    <button onclick="document.getElementById('display').value += '6'">6</button>
  </div>
  <div class="btn-row">
    <button onclick="document.getElementById('display').value = eval(document.getElementById('display').value)">=</button>
  </div>
</body>
</html>`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans select-none flex flex-col max-w-7xl mx-auto w-full h-[calc(100vh-100px)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-shrink-0">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Hub
            </button>
            <h1 className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <Layers size={22} className="text-[#ec4899]" /> TECHLABS APP STUDIO
            </h1>
            <p className="text-xs text-[#6e6868] mt-1">Deploy sandboxed React & HTML5 static apps with instant real-time live preview canvas rendering.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadTemplate('counter')}
              className="px-3 py-1.5 bg-[#111114] border border-[#2a2a2e] hover:bg-white/5 font-extrabold text-[0.68rem] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white"
            >
              Counter Template
            </button>
            <button
              onClick={() => loadTemplate('calculator')}
              className="px-3 py-1.5 bg-[#111114] border border-[#2a2a2e] hover:bg-white/5 font-extrabold text-[0.68rem] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white"
            >
              Calculator Template
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[#111114] border border-[#2a2a2e] hover:bg-white/5 font-extrabold text-[0.68rem] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white flex items-center gap-1"
            >
              <Download size={12} /> Export HTML
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CloudLightning size={14} /> {isDeploying ? 'Deploying...' : 'One-Click Deploy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col overflow-hidden h-[500px]">
            <div className="bg-[#0c0c0e] border-b border-[#2a2a2e] px-4 py-2.5 flex items-center justify-between text-xs font-mono text-gray-500 flex-shrink-0">
              <span className="flex items-center gap-1.5"><FileCode size={14} className="text-[#ec4899]" /> index.html code playground</span>
              <span>Workspace Vector</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent p-4 text-xs font-mono text-[#a78bfa] outline-none resize-none select-text"
              placeholder="Write raw markup codes here..."
            />
          </div>

          <div className="bg-[#111114] border border-[#2a2a2e] rounded-2xl flex flex-col overflow-hidden h-[500px]">
            <div className="bg-[#0c0c0e] border-b border-[#2a2a2e] px-4 py-2.5 flex items-center justify-between text-xs font-mono text-gray-500 flex-shrink-0">
              <span className="flex items-center gap-1.5"><Play size={14} className="text-[#2ea86a]" /> Live Canvas Render</span>
              {deployUrl && (
                <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-[0.62rem] text-[#00d4ff] hover:underline font-bold truncate max-w-[200px]">
                  {deployUrl}
                </a>
              )}
            </div>
            <iframe
              ref={iframeRef}
              title="Static sandbox preview pane"
              className="flex-1 bg-white border-none w-full"
              sandbox="allow-scripts allow-popups"
            />
          </div>
        </div>

        {/* Sandbox logs console */}
        <div className="bg-[#0c0c0e] border border-[#2a2a2e] p-4 rounded-xl mt-6 flex-shrink-0 max-h-[120px] overflow-y-auto">
          <span className="text-[0.58rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-2">Sandbox Telemetry Console Logs</span>
          <div className="space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className="font-mono text-[0.65rem] text-[#2ea86a] select-text">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TechLabsHome;
