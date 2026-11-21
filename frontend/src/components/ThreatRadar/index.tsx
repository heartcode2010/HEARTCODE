import React, { useEffect, useRef } from 'react';
import useIntelligenceStore from '../../store/intelligenceStore';
import threatRadar from '../../services/threatRadar';

export const ThreatRadar = () => {
  const { threatRadar: radarData } = useIntelligenceStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Radar Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !radarData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleOffset = 0;

    const labels = threatRadar.getRadarLabels();
    const values = threatRadar.getRadarValues(radarData);

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(cx, cy) - 25;

      // 1. Draw concentric grid circles
      ctx.strokeStyle = 'rgba(224, 40, 64, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const r = (maxRadius * i) / 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw scale values
        ctx.fillStyle = 'var(--ash2)';
        ctx.font = '7px monospace';
        ctx.fillText(`${i * 25}`, cx + 3, cy - r + 3);
      }

      // 2. Draw axis lines & labels
      labels.forEach((label, idx) => {
        const angle = (idx * 2 * Math.PI) / labels.length - Math.PI / 2;
        const x = cx + maxRadius * Math.cos(angle);
        const y = cy + maxRadius * Math.sin(angle);

        // Draw axis
        ctx.strokeStyle = 'rgba(224, 40, 64, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = 'var(--ash)';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = Math.abs(x - cx) < 10 ? 'center' : (x > cx ? 'left' : 'right');
        ctx.textBaseline = Math.abs(y - cy) < 10 ? 'middle' : (y > cy ? 'top' : 'bottom');
        
        // Push label out slightly
        const labelX = cx + (maxRadius + 12) * Math.cos(angle);
        const labelY = cy + (maxRadius + 12) * Math.sin(angle);
        ctx.fillText(label.toUpperCase(), labelX, labelY);
      });

      // 3. Draw radar sweep beam
      angleOffset += 0.015;
      const sweepGradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(224, 40, 64, 0.02)');
      sweepGradient.addColorStop(1, 'rgba(224, 40, 64, 0.15)');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, angleOffset, angleOffset + 0.35);
      ctx.closePath();
      ctx.fill();

      // Draw active beam line
      ctx.strokeStyle = 'rgba(255, 61, 85, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxRadius * Math.cos(angleOffset), cy + maxRadius * Math.sin(angleOffset));
      ctx.stroke();

      // 4. Draw polygon value shape
      ctx.fillStyle = 'rgba(124, 58, 237, 0.28)'; // transparent purple
      ctx.strokeStyle = 'var(--purple-hi)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      values.forEach((val, idx) => {
        const angle = (idx * 2 * Math.PI) / labels.length - Math.PI / 2;
        const r = (maxRadius * val) / 100;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw values point markers
      ctx.fillStyle = 'var(--purple-hi)';
      values.forEach((val, idx) => {
        const angle = (idx * 2 * Math.PI) / labels.length - Math.PI / 2;
        const r = (maxRadius * val) / 100;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [radarData]);

  if (!radarData) {
    return (
      <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 shadow-[0_0_15px_rgba(224,40,64,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(224,40,64,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
        <div className="text-3xl mb-3 animate-pulse">📡</div>
        <div className="font-display text-[0.7rem] font-bold text-cyber-red tracking-[0.2em] uppercase">
          RADAR STANDBY ACTIVE
        </div>
        <div className="text-[0.58rem] text-cyber-ash2 font-mono mt-1 max-w-xs">
          Run modular scan sweeps to generate multidimensional risk matrix mappings.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-surface border border-cyber-border-red rounded-lg p-4 shadow-[0_0_15px_rgba(224,40,64,0.04)] relative overflow-hidden flex flex-col items-center">
      
      <div className="flex items-center justify-between border-b border-cyber-border pb-2.5 mb-3 w-full select-none">
        <div className="flex items-center gap-2">
          <span className="text-base">📡</span>
          <h3 className="font-display text-[0.72rem] font-black tracking-wider text-white">
            WEBSITE THREAT RISK RADAR
          </h3>
        </div>
        <span className="font-mono text-[0.55rem] text-cyber-red bg-cyber-red-dim border border-cyber-border-red px-1.5 py-0.5 rounded uppercase">
          RADAR_SWEEP
        </span>
      </div>

      <div className="bg-cyber-bg border border-cyber-border rounded p-4 flex items-center justify-center w-full">
        <canvas
          ref={canvasRef}
          width={280}
          height={210}
          className="max-w-full"
        />
      </div>
    </div>
  );
};

export default ThreatRadar;
