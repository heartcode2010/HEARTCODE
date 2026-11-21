import React, { useState } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import infrastructureMapper from '../../services/infrastructureMapper';

export const InfrastructurePanel = () => {
  const { infrastructureMap } = useIntelligenceStore();
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  if (!infrastructureMap) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">🖥️</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          AWAITING MAP CORRELATION
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Run scan engines to trace external hosting infrastructure and CDN relays.
        </div>
      </div>
    );
  }

  const { nodes, edges } = infrastructureMapper.getNodesAndEdges(infrastructureMap);

  // Layout calculations for nodes orbiting the center target node
  const width = 500;
  const height = 250;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 95;

  const resolvedNodes = nodes.map((node, index) => {
    if (node.type === 'target') {
      return { ...node, x: cx, y: cy };
    }
    // Distribute orbiting nodes around the circle
    const angle = (index * 2 * Math.PI) / (nodes.length - 1);
    return {
      ...node,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  });

  const resolvedEdges = edges.map(edge => {
    const fromNode = resolvedNodes.find(n => n.id === edge.from) || { x: cx, y: cy };
    const toNode = resolvedNodes.find(n => n.id === edge.to) || { x: cx, y: cy };
    return {
      ...edge,
      x1: fromNode.x,
      y1: fromNode.y,
      x2: toNode.x,
      y2: toNode.y
    };
  });

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden select-none">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🖥️</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            INFRASTRUCTURE CORRELATION MAP
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-[#00ffcc] bg-[#00ffcc]/10 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded uppercase">
          MAP_LINKED
        </span>
      </div>

      <div className="relative bg-cyber-bg border border-cyber-border rounded overflow-hidden">
        {/* SVG Node Graph */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Defs for gradients & glows */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw connecting lines (Edges) */}
          {resolvedEdges.map((edge, idx) => (
            <g key={idx}>
              <line
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="rgba(224, 40, 64, 0.45)"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              {/* Animated node traffic dots */}
              <circle r="3" fill="#00ffcc" className="animate-pulse">
                <animateMotion
                  path={`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Text label */}
              <text
                x={(edge.x1 + edge.x2) / 2}
                y={(edge.y1 + edge.y2) / 2 - 5}
                fill="var(--ash2)"
                fontSize="7"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {edge.label}
              </text>
            </g>
          ))}

          {/* Draw Nodes */}
          {resolvedNodes.map((node, idx) => {
            const isTarget = node.type === 'target';
            const radiusSize = isTarget ? 18 : 14;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radiusSize}
                  fill={isTarget ? 'var(--red-dim)' : 'var(--bg)'}
                  stroke={isHovered ? '#00ffcc' : (isTarget ? 'var(--red)' : 'var(--border)')}
                  strokeWidth="2"
                  filter={isHovered ? 'url(#glow)' : undefined}
                  className="transition-all duration-200"
                />
                <text
                  x={node.x}
                  y={node.y + 3}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {node.icon}
                </text>
                {/* Node name label */}
                <text
                  x={node.x}
                  y={node.y + radiusSize + 10}
                  fill={isHovered ? '#00ffcc' : 'var(--ash)'}
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-bold uppercase tracking-wider"
                >
                  {node.name.length > 15 ? node.name.substring(0, 12) + '...' : node.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover details display */}
        {hoveredNode && (
          <div className="absolute bottom-2 left-2 right-2 bg-cyber-surface/90 border border-cyber-border-red p-2 rounded text-[0.62rem] font-mono text-white flex justify-between items-center backdrop-blur-sm">
            <div>
              <span className="text-cyber-red">[{hoveredNode.type.toUpperCase()}]</span> {hoveredNode.name}
            </div>
            <div className="text-cyber-ash2">
              Provider: {hoveredNode.provider}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructurePanel;
