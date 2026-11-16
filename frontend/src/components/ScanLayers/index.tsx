import React, { useState, useCallback } from 'react';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';
import type { ScanLayer } from '../../types';

// ══════════════════════════════════════════════════════════════════════════════
// ScanLayers — Multi-depth scan selector (#20)
// Provides 7 scan layers from surface to deep architecture analysis
// ══════════════════════════════════════════════════════════════════════════════

interface LayerConfig {
  id: ScanLayer;
  label: string;
  icon: string;
  description: string;
  depth: number;
  color: string;
  panels: string[];
}

const SCAN_LAYERS: LayerConfig[] = [
  {
    id: 'surface',
    label: 'SURFACE',
    icon: '◎',
    description: 'Quick surface-level analysis — headers, meta, basic tech detection',
    depth: 1,
    color: '#2ea86a',
    panels: ['dna-profile', 'infrastructure', 'reputation'],
  },
  {
    id: 'deep-recon',
    label: 'DEEP RECON',
    icon: '⬡',
    description: 'Full reconnaissance — endpoint discovery, infrastructure mapping',
    depth: 2,
    color: '#00c8ff',
    panels: ['dna-profile', 'infrastructure', 'endpoints', 'network-console', 'reputation', 'threat-radar'],
  },
  {
    id: 'behavioral',
    label: 'BEHAVIORAL',
    icon: '◈',
    description: 'Tracking, telemetry, fingerprinting, behavioral pattern analysis',
    depth: 3,
    color: '#d4820a',
    panels: ['behavioral', 'dom-surveillance', 'memory-inspector', 'network-console'],
  },
  {
    id: 'ai-forensics',
    label: 'CODE FORENSICS',
    icon: '⟐',
    description: 'Code authenticity analysis, structural pattern classification',
    depth: 4,
    color: '#a855f7',
    panels: ['ai-forensics', 'dna-profile', 'execution-trace'],
  },
  {
    id: 'threat-hunt',
    label: 'THREAT HUNT',
    icon: '⚠',
    description: 'Secret leaks, obfuscation, shadow assets, security headers',
    depth: 5,
    color: '#e02840',
    panels: ['threat-radar', 'secret-leak', 'obfuscation', 'shadow-assets', 'security-intel', 'dom-surveillance'],
  },
  {
    id: 'privacy-audit',
    label: 'PRIVACY AUDIT',
    icon: '⛊',
    description: 'Comprehensive privacy audit — cookies, trackers, data collection',
    depth: 6,
    color: '#f472b6',
    panels: ['behavioral', 'memory-inspector', 'network-console', 'dom-surveillance', 'reputation'],
  },
  {
    id: 'architecture',
    label: 'ARCHITECTURE',
    icon: '⎔',
    description: 'Full architecture mapping — execution traces, DNS, infrastructure graph',
    depth: 7,
    color: '#06b6d4',
    panels: ['dna-profile', 'infrastructure', 'execution-trace', 'endpoints', 'network-console', 'timeline'],
  },
];

export const ScanLayers: React.FC = () => {
  const { scanPhase, setScanPhase, isIntelligenceActive, setIntelligenceActive } = useIntelligenceStore();
  const { htmlSource } = useScanStore();
  const [activeLayer, setActiveLayer] = useState<ScanLayer | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleLayerActivate = useCallback(async (layer: LayerConfig) => {
    if (!htmlSource || isScanning) return;

    setActiveLayer(layer.id);
    setIsScanning(true);
    setScanPhase(layer.id as any);
    setIntelligenceActive(true);

    // Open the panels associated with this scan layer
    const store = useIntelligenceStore.getState();
    layer.panels.forEach(panelId => store.setPanelOpen(panelId, true));

    // Simulate progressive scan
    await new Promise(r => setTimeout(r, 1500));
    setIsScanning(false);
  }, [htmlSource, isScanning, setScanPhase, setIntelligenceActive]);

  if (!htmlSource) return null;

  return (
    <div className="scan-layers-container">
      {/* Header */}
      <div className="scan-layers-header">
        <div className="scan-layers-title">
          <span className="scan-layers-icon">⬢</span>
          <span>SCAN DEPTH LAYERS</span>
        </div>
        <div className="scan-layers-status">
          {isScanning && (
            <span className="scan-layers-active-indicator">
              <span className="scan-pulse-dot" />
              SCANNING
            </span>
          )}
          {activeLayer && !isScanning && (
            <span style={{ color: SCAN_LAYERS.find(l => l.id === activeLayer)?.color, fontSize: '0.65rem', fontFamily: 'var(--mono)' }}>
              ● {activeLayer.toUpperCase()} COMPLETE
            </span>
          )}
        </div>
      </div>

      {/* Layer Bar */}
      <div className="scan-layers-bar">
        {SCAN_LAYERS.map((layer, i) => {
          const isActive = activeLayer === layer.id;
          const isHovered = hoveredLayer === layer.id;

          return (
            <button
              key={layer.id}
              className={`scan-layer-btn ${isActive ? 'active' : ''} ${isScanning && activeLayer === layer.id ? 'scanning' : ''}`}
              style={{
                '--layer-color': layer.color,
                '--layer-depth': layer.depth,
                animationDelay: `${i * 60}ms`,
              } as React.CSSProperties}
              onClick={() => handleLayerActivate(layer)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              disabled={isScanning}
              title={layer.description}
            >
              {/* Depth indicator */}
              <div className="scan-layer-depth">
                {Array.from({ length: layer.depth }, (_, j) => (
                  <span key={j} className="depth-bar" style={{ background: layer.color, opacity: 0.3 + (j / layer.depth) * 0.7 }} />
                ))}
              </div>

              {/* Icon */}
              <span className="scan-layer-icon" style={{ color: layer.color }}>{layer.icon}</span>

              {/* Label */}
              <span className="scan-layer-label">{layer.label}</span>

              {/* Active Glow */}
              {isActive && <div className="scan-layer-glow" style={{ background: `radial-gradient(ellipse, ${layer.color}33, transparent 70%)` }} />}

              {/* Scanning Progress */}
              {isScanning && activeLayer === layer.id && (
                <div className="scan-layer-progress">
                  <div className="scan-layer-progress-bar" style={{ background: layer.color }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tooltip for hovered layer */}
      {hoveredLayer && (
        <div className="scan-layers-tooltip">
          <span style={{ color: SCAN_LAYERS.find(l => l.id === hoveredLayer)?.color }}>
            {SCAN_LAYERS.find(l => l.id === hoveredLayer)?.icon}
          </span>
          {' '}
          {SCAN_LAYERS.find(l => l.id === hoveredLayer)?.description}
        </div>
      )}
    </div>
  );
};

export default ScanLayers;
