import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';

// ══════════════════════════════════════════════════════════════════════════════
// BlackboxMode — Cinematic staged analysis reveal (#28)
// Progressive panel reveals with typing effects and terminal animation
// ══════════════════════════════════════════════════════════════════════════════

interface AnalysisStage {
  id: string;
  label: string;
  icon: string;
  color: string;
  lines: string[];
  panels: string[];
  durationMs: number;
}

const ANALYSIS_STAGES: AnalysisStage[] = [
  {
    id: 'connect',
    label: 'ESTABLISHING CONNECTION',
    icon: '⟐',
    color: '#06b6d4',
    lines: [
      '> Initiating secure probe...',
      '> Resolving target DNS...',
      '> Handshake established ████████ OK',
      '> TLS fingerprint captured',
      '> Connection latency: <50ms',
    ],
    panels: [],
    durationMs: 2000,
  },
  {
    id: 'surface',
    label: 'SURFACE RECONNAISSANCE',
    icon: '◎',
    color: '#2ea86a',
    lines: [
      '> Scanning HTTP headers...',
      '> Extracting meta tags...',
      '> Technology fingerprinting...',
      '> Architecture signature: DETECTED',
      '> DNA Profile computed',
    ],
    panels: ['dna-profile', 'reputation'],
    durationMs: 2500,
  },
  {
    id: 'infra',
    label: 'INFRASTRUCTURE MAPPING',
    icon: '⎔',
    color: '#00c8ff',
    lines: [
      '> Mapping CDN topology...',
      '> Cloud provider detection...',
      '> DNS record enumeration...',
      '> Certificate chain analysis...',
      '> Infrastructure graph: ASSEMBLED',
    ],
    panels: ['infrastructure'],
    durationMs: 2500,
  },
  {
    id: 'deep',
    label: 'DEEP ANALYSIS',
    icon: '⬡',
    color: '#d4820a',
    lines: [
      '> Endpoint discovery scanning...',
      '> Network pattern analysis...',
      '> Memory inspection initiated...',
      '> Behavioral profiling...',
      '> DOM surveillance active',
    ],
    panels: ['endpoints', 'network-console', 'memory-inspector', 'behavioral', 'dom-surveillance'],
    durationMs: 3000,
  },
  {
    id: 'forensics',
    label: 'AI FORENSICS ENGINE',
    icon: '⟐',
    color: '#a855f7',
    lines: [
      '> Loading AI detection models...',
      '> Running classifier on source...',
      '> Human vs AI analysis: IN PROGRESS',
      '> Execution trace mapping...',
      '> AI contribution level: COMPUTED',
    ],
    panels: ['ai-forensics', 'execution-trace'],
    durationMs: 2500,
  },
  {
    id: 'threat',
    label: 'THREAT ASSESSMENT',
    icon: '⚠',
    color: '#e02840',
    lines: [
      '> Secret scanner: ACTIVE',
      '> Obfuscation detection...',
      '> Shadow asset discovery...',
      '> Security intelligence check...',
      '> Threat radar: CALIBRATED',
    ],
    panels: ['threat-radar', 'secret-leak', 'obfuscation', 'shadow-assets', 'security-intel'],
    durationMs: 2500,
  },
  {
    id: 'compile',
    label: 'COMPILING INTELLIGENCE',
    icon: '◈',
    color: '#f472b6',
    lines: [
      '> Aggregating all findings...',
      '> Computing reputation scores...',
      '> Building forensics timeline...',
      '> Mission control: ONLINE',
      '> ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ COMPLETE',
    ],
    panels: ['mission-control', 'timeline'],
    durationMs: 2000,
  },
];

export const BlackboxMode: React.FC = () => {
  const { isBlackboxMode, setBlackboxMode, blackboxStage, setBlackboxStage, setIntelligenceActive } = useIntelligenceStore();
  const { htmlSource } = useScanStore();
  const [visibleLines, setVisibleLines] = useState<{ stageIdx: number; lineIdx: number; text: string; color: string }[]>([]);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const runBlackboxAnalysis = useCallback(async () => {
    if (!htmlSource || isRunning) return;

    abortRef.current = false;
    setIsRunning(true);
    setIsComplete(false);
    setVisibleLines([]);
    setCurrentStageIdx(0);
    setBlackboxStage(0);
    setIntelligenceActive(true);

    for (let si = 0; si < ANALYSIS_STAGES.length; si++) {
      if (abortRef.current) break;
      const stage = ANALYSIS_STAGES[si];
      setCurrentStageIdx(si);
      setBlackboxStage(si);

      // Type each line with delay
      for (let li = 0; li < stage.lines.length; li++) {
        if (abortRef.current) break;
        await new Promise(r => setTimeout(r, stage.durationMs / stage.lines.length));
        setVisibleLines(prev => [...prev, { stageIdx: si, lineIdx: li, text: stage.lines[li], color: stage.color }]);
      }

      // Open associated panels
      const store = useIntelligenceStore.getState();
      stage.panels.forEach(p => store.setPanelOpen(p, true));

      // Brief pause between stages
      await new Promise(r => setTimeout(r, 400));
    }

    if (!abortRef.current) {
      setIsComplete(true);
      setBlackboxStage(ANALYSIS_STAGES.length);
    }
    setIsRunning(false);
  }, [htmlSource, isRunning, setBlackboxStage, setIntelligenceActive]);

  const handleAbort = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
  }, []);

  if (!isBlackboxMode) return null;

  return (
    <div className="blackbox-container">
      {/* Header */}
      <div className="blackbox-header">
        <div className="blackbox-title">
          <span className="blackbox-icon">◆</span>
          <span>BLACKBOX ANALYSIS MODE</span>
          <span className="blackbox-subtitle">Staged Intelligence Extraction</span>
        </div>
        <div className="blackbox-controls">
          {!isRunning && !isComplete && (
            <button className="blackbox-run-btn" onClick={runBlackboxAnalysis} disabled={!htmlSource}>
              <span>▶</span> INITIATE
            </button>
          )}
          {isRunning && (
            <button className="blackbox-abort-btn" onClick={handleAbort}>
              <span>■</span> ABORT
            </button>
          )}
          {isComplete && (
            <button className="blackbox-run-btn" onClick={runBlackboxAnalysis}>
              <span>↻</span> RE-RUN
            </button>
          )}
          <button className="blackbox-close-btn" onClick={() => setBlackboxMode(false)}>✕</button>
        </div>
      </div>

      {/* Stage Progress Bar */}
      <div className="blackbox-progress">
        {ANALYSIS_STAGES.map((stage, i) => {
          const isPast = i < currentStageIdx || isComplete;
          const isCurrent = i === currentStageIdx && isRunning;

          return (
            <div
              key={stage.id}
              className={`blackbox-stage-marker ${isPast ? 'done' : ''} ${isCurrent ? 'active' : ''}`}
              style={{ '--stage-color': stage.color } as React.CSSProperties}
            >
              <span className="blackbox-stage-icon">{stage.icon}</span>
              <span className="blackbox-stage-label">{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal Output */}
      <div className="blackbox-terminal" ref={terminalRef}>
        <div className="blackbox-terminal-header">
          <span className="blackbox-terminal-dot red" />
          <span className="blackbox-terminal-dot yellow" />
          <span className="blackbox-terminal-dot green" />
          <span className="blackbox-terminal-title">HEARTCODE // BLACKBOX TERMINAL</span>
        </div>

        <div className="blackbox-terminal-body">
          {!isRunning && visibleLines.length === 0 && (
            <div className="blackbox-idle">
              <span style={{ color: 'var(--ash2)' }}>{'>'} Awaiting initiation...</span>
              <span className="blackbox-cursor">█</span>
            </div>
          )}

          {visibleLines.map((line, i) => {
            const isStageStart = i === 0 || visibleLines[i - 1]?.stageIdx !== line.stageIdx;

            return (
              <React.Fragment key={i}>
                {isStageStart && (
                  <div className="blackbox-stage-divider" style={{ color: line.color }}>
                    ── {ANALYSIS_STAGES[line.stageIdx]?.icon} {ANALYSIS_STAGES[line.stageIdx]?.label} ──
                  </div>
                )}
                <div
                  className="blackbox-line"
                  style={{ animationDelay: `${i * 20}ms`, color: line.text.includes('COMPLETE') || line.text.includes('OK') || line.text.includes('DETECTED') || line.text.includes('ASSEMBLED') || line.text.includes('COMPUTED') || line.text.includes('CALIBRATED') || line.text.includes('ONLINE') ? line.color : undefined }}
                >
                  {line.text}
                </div>
              </React.Fragment>
            );
          })}

          {isRunning && (
            <div className="blackbox-cursor-line">
              <span className="blackbox-cursor">█</span>
            </div>
          )}

          {isComplete && (
            <div className="blackbox-complete">
              <div className="blackbox-complete-line" style={{ color: '#2ea86a' }}>
                {'>'} ══════════════════════════════════════
              </div>
              <div className="blackbox-complete-line" style={{ color: '#2ea86a' }}>
                {'>'} BLACKBOX ANALYSIS COMPLETE — ALL SYSTEMS ONLINE
              </div>
              <div className="blackbox-complete-line" style={{ color: '#2ea86a' }}>
                {'>'} ══════════════════════════════════════
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackboxMode;
