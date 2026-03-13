import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  Globe, 
  Rocket, 
  Brain, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { RichText } from '@/components/ui/RichText';

const ICONS = [BarChart3, Layers, TrendingUp, Brain];
const BENEFIT_ICONS = [Globe, ShieldCheck, Sparkles];

/* ───────────────── Middle Aura Component (Agent Skill) ──────────────── */
const MiddleAura = ({ color = 'var(--accent)', scale = 1 }: { color?: string; scale?: number }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ transform: `scale(${scale})` }}>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-current"
        style={{ color, width: '60px', height: '60px' }}
        animate={{
          scale: [1, 3],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 1.3,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
);


/* ───────────────── Unique Super-Premium Visuals (0-6) ───────────────── */

// 0. ROI Impact — Dynamic Growth Chart with Floating Profit Nodes
const ROIVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[rgba(255,255,255,0.01)] p-4">
    {/* Background Grid Accent */}
    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    
    <div className="relative w-full h-[120px] sm:h-[130px] flex items-end justify-between gap-1.5 px-4 max-w-[260px]">
      {[35, 60, 45, 85, 65, 95].map((height, i) => (
        <motion.div
          key={i}
          className="relative flex-1 group/bar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: `${height}%`, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Glassmorphic Bar */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-[var(--accent)]/10 via-[var(--accent)]/40 to-[var(--accent)] rounded-t-[3px] sm:rounded-t-lg shadow-[0_0_20px_rgba(212,160,23,0.1)] border-x border-t border-white/20 backdrop-blur-[2px]" />
          
          {/* Inner Luminescence */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/60 rounded-full blur-[0.5px] z-10"
            animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />

          {/* Floating Data Point */}
          {i === 3 || i === 5 ? (
            <motion.div 
              className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-[7px] font-black text-white shadow-xl whitespace-nowrap"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              +{(height/10).toFixed(1)}x
            </motion.div>
          ) : null}
        </motion.div>
      ))}

      {/* Dynamic Connection Curve - Normalized Coordinates */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 260 130" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roi-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent-luminous)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>
          <filter id="roi-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <motion.path
          d="M 25 85 C 50 85, 75 55, 100 75 S 150 20, 180 45 S 230 5, 240 10"
          stroke="url(#roi-gradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#roi-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.8, ease: "easeInOut" }}
        />
        {/* Animated End Node */}
        <motion.circle
          cx="240" cy="10" r="3"
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 0.5 }}
          style={{ filter: 'drop-shadow(0 0 8px var(--accent-luminous))' }}
        />
      </svg>
    </div>
  </div>
);

// 1. Scalability — Neural Fractal Hub (Agent Skills Premium)
const ScalabilityVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const timeStart = Date.now();

    const nodes: any[] = [];
    const maxLevels = 3;
    const branches = 4;

    // Build Fractal Structure
    const buildFractal = (x: number, y: number, level: number, angle: number) => {
      if (level > maxLevels) return;
      
      const id = nodes.length;
      nodes.push({ x, y, level, parentId: id === 0 ? -1 : nodes.length - 1 });
      
      const dist = 50 / (level + 1);
      for (let i = 0; i < branches; i++) {
        const a = angle + (i - branches / 2) * (Math.PI / 2 / (level + 1));
        const nx = x + Math.cos(a) * dist;
        const ny = y + Math.sin(a) * dist;
        buildFractal(nx, ny, level + 1, a);
      }
    };

    buildFractal(100, 100, 0, 0);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = (Date.now() - timeStart) / 1000;
      const pulse = Math.sin(time * 2) * 0.5 + 0.5;

      // ── Background Shimmer ──
      ctx.fillStyle = 'rgba(212, 160, 23, 0.02)';
      ctx.fillRect(0, 0, 200, 200);

      // ── Connections ──
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        if (i === 0) return;
        const parent = nodes[node.parentId] || nodes[0];
        
        // Dynamic path distortion
        const phase = (time + i * 0.1) % 2;
        const pOpacity = Math.max(0, 1 - Math.abs(phase - 1) * 2);

        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(212, 160, 23, ${0.1 + pOpacity * 0.3})`;
        ctx.stroke();

        if (pOpacity > 0.1) {
          ctx.beginPath();
          const px = parent.x + (node.x - parent.x) * phase;
          const py = parent.y + (node.y - parent.y) * phase;
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pOpacity})`;
          ctx.fill();
        }
      });

      // ── Nodes ──
      nodes.forEach((n, i) => {
        const floatX = Math.sin(time + i) * 2;
        const floatY = Math.cos(time + i * 0.8) * 2;
        const nx = n.x + floatX;
        const ny = n.y + floatY;

        const size = (4 - n.level) * 1.5;
        
        // Node Glow
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, size * 4);
        grad.addColorStop(0, `rgba(212, 160, 23, ${0.2 * (1 / (n.level + 1))})`);
        grad.addColorStop(1, 'rgba(212, 160, 23, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(nx, ny, size, 0, Math.PI * 2);
        ctx.fillStyle = n.level === 0 ? 'var(--accent)' : `rgba(212, 160, 23, ${0.6 - n.level * 0.1})`;
        ctx.fill();

        if (n.level === 0) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(nx, ny, size + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[rgba(255,255,255,0.01)] group/fractal">
      <MiddleAura opacity-30 />
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="w-full h-full opacity-90 transition-transform duration-700 group-hover/fractal:scale-110"
      />
      {/* HUD Overlay */}
      <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none rounded-xl" />
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 opacity-20">
        <div className="w-8 h-[1px] bg-white" />
        <div className="w-4 h-[1px] bg-white" />
      </div>
      <div className="absolute bottom-2 left-2 flex flex-col gap-1 opacity-20">
        <div className="w-4 h-[1px] bg-white" />
        <div className="w-8 h-[1px] bg-white" />
      </div>
    </div>
  );
};

// 2. Growth — Parallax Orbital Rings
const GrowthVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[rgba(255,255,255,0.01)]">
    <div className="relative w-52 h-52 flex items-center justify-center">
      {/* Central Core with Internal Pulse */}
      <motion.div className="w-14 h-14 relative z-20 flex items-center justify-center group" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <MiddleAura scale={1.2} />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-[#8a6500] to-[#5a4200] rounded-full shadow-[0_0_50px_rgba(212,160,23,0.4)] border border-white/20" />
        <Zap size={22} className="text-white relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
        
        {/* Core Pulse Ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-[var(--accent)]"
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Orbiting Stardust Rings */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-[var(--accent)]/10 rounded-full"
          style={{ width: `${90 + i * 45}px`, height: `${90 + i * 45}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
        >
          {/* Planetarium Nodes */}
          <motion.div 
            className="absolute w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" 
            style={{ 
              top: '-1px', 
              left: '50%',
              backgroundImage: 'radial-gradient(circle at 30% 30%, white, transparent)'
            }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
          />
        </motion.div>
      ))}

      {/* Floating Stardust Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{ 
            left: `${50 + Math.cos(i*30) * (40 + Math.random() * 40)}%`, 
            top: `${50 + Math.sin(i*30) * (40 + Math.random() * 40)}%` 
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, Math.cos(i*30) * 30],
            y: [0, Math.sin(i*30) * 30]
          }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

// 3. AI-First — Neural Mesh with Logic Pulses
const AIVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[#0a0a0a]" style={{ backgroundImage: 'linear-gradient(rgba(212,160,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.05) 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
    <div className="relative w-44 h-44">
      <motion.div className="absolute inset-10 border-2 border-[var(--accent)]/50 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(212,160,23,0.3)] z-10" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
        <MiddleAura scale={1.5} />
        <Brain size={40} className="text-[var(--accent)] filter drop-shadow-[0_0_15px_var(--accent)]" />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ left: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
      </motion.div>
    </div>
  </div>
);

// 4. Global Delivery — Atmospheric Orbital Sphere
const MAP_DATA = [
  "       . . . .   . . . . . .",
  "   . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . .",
  " . . . . . . . . . . . . . . . .",
  "   . . . . . . . . . . . . . .",
  "     . . . . . . . . . . . . ",
  "       . . . . . . . . . .",
  "         . . . . . . . .",
  "           . . . . . .",
  "             . . . .",
  "               . .",
].map(s => s.split('')); 

// More realistic continent shapes (Simulated high-res matrix)
const WORLD_MAP = [
  "000011110000000011111100110000",
  "000111111000001111111111111000",
  "011111111100111111111111111110",
  "011111111111111111111111111110",
  "001111111111111111111111111000",
  "000111111001111111111111111000",
  "000011110000111111111111100000",
  "000011100000111111111110000000",
  "000001100000011111111000000000",
  "000001000000001111100000000000",
  "000000000000000111000000000000",
];

const GlobalVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const rows = WORLD_MAP.length;
    const cols = WORLD_MAP[0].length;
    const spacing = 4;
    const dotSize = 1.2;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 60;

      // ── 1. Sphere Base Shading ──
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.2,
        centerX, centerY, radius
      );
      sphereGrad.addColorStop(0, 'rgba(212, 160, 23, 0.2)');
      sphereGrad.addColorStop(1, '#080808');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // ── 2. Rotating Dot Map ──
      rotation += 0.005;
      const mapWidth = cols * spacing;
      const offsetX = (rotation * 50) % mapWidth;

      ctx.save();
      // Clipping to sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      for (let side = -1; side <= 1; side++) {
        const xStart = centerX - radius/2 + (side * mapWidth) + offsetX;
        
        WORLD_MAP.forEach((row, rIdx) => {
          row.split('').forEach((char, cIdx) => {
            if (char === '0') return;

            const x = xStart + cIdx * spacing - (mapWidth / 2);
            const y = centerY - (rows * spacing / 2) + rIdx * spacing;

            const dx = x - centerX;
            const dy = y - centerY;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < radius * radius) {
              const opacity = Math.pow(1 - distSq / (radius * radius), 0.5);
              ctx.beginPath();
              ctx.arc(x, y, dotSize * opacity, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(212, 160, 23, ${0.4 * opacity})`;
              ctx.fill();
              
              if (opacity > 0.7) {
                ctx.save();
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(212, 160, 23, 0.5)';
                ctx.fill();
                ctx.restore();
              }
            }
          });
        });
      }
      ctx.restore();

      // ── 3. Connection Arcs ──
      const time = Date.now() / 1000;
      const arcs = [
        { start: { x: centerX - 30, y: centerY }, end: { x: centerX + 30, y: centerY - 20 }, phase: 0 },
        { start: { x: centerX - 20, y: centerY + 20 }, end: { x: centerX + 20, y: centerY + 25 }, phase: 2 },
        { start: { x: centerX - 10, y: centerY - 30 }, end: { x: centerX + 5, y: centerY + 30 }, phase: 4 },
      ];

      arcs.forEach((arc) => {
        const progress = (time + arc.phase) % 4 / 4;
        const cpX = (arc.start.x + arc.end.x) / 2;
        const cpY = Math.min(arc.start.y, arc.end.y) - 30;
        
        ctx.beginPath();
        ctx.moveTo(arc.start.x, arc.start.y);
        ctx.quadraticCurveTo(cpX, cpY, arc.end.x, arc.end.y);
        
        const arcGrad = ctx.createLinearGradient(arc.start.x, arc.start.y, arc.end.x, arc.end.y);
        arcGrad.addColorStop(0, 'rgba(212,160,23,0)');
        arcGrad.addColorStop(progress, 'rgba(212,160,23,0.4)');
        arcGrad.addColorStop(Math.min(progress + 0.1, 1), 'rgba(212,160,23,0)');
        
        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Data particle
        const t = progress;
        const px = (1 - t) * (1 - t) * arc.start.x + 2 * (1 - t) * t * cpX + t * t * arc.end.x;
        const py = (1 - t) * (1 - t) * arc.start.y + 2 * (1 - t) * t * cpY + t * t * arc.end.y;
        
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 160, 23, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── 4. Fresnel Glow ──
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const fresnel = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
      fresnel.addColorStop(0, 'rgba(212,160,23,0)');
      fresnel.addColorStop(1, 'rgba(212,160,23,0.3)');
      ctx.fillStyle = fresnel;
      ctx.fill();

      // Border shine
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center py-8 overflow-hidden bg-[rgba(255,255,255,0.01)]">
    <div className="relative w-52 h-52 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.1)_0%,transparent_70%)] opacity-50 blur-3xl p-10" />
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={200}
          className="relative z-20 drop-shadow-[0_0_50px_rgba(212,160,23,0.3)]"
        />
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>
    </div>
  );
};

// 5. Enterprise Security — Advanced Layered Shield Check
const SecurityVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center py-4 overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 10px)' }} />
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
        <motion.circle cx="50" cy="50" r="45" stroke="var(--accent)" strokeWidth="0.5" fill="none" strokeDasharray="1 4" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      </svg>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-[var(--accent)]/30"
          style={{ 
            width: `${65 + i * 25}px`, 
            height: `${65 + i * 25}px`, 
            borderRadius: i % 2 === 0 ? '30%' : '15%',
          }}
          animate={{ 
            rotate: i % 2 === 0 ? 45 : -45, 
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
      <motion.div className="relative z-10 w-20 h-20 bg-[#0a0a0a]/90 border-2 border-[var(--accent)] rounded-2xl flex items-center justify-center shadow-[0_0_60px_rgba(212,160,23,0.5)] backdrop-blur-md" animate={{ rotateY: [0, 15, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
        <ShieldCheck size={40} className="text-[var(--accent)]" />
        <motion.div className="absolute inset-x-0 h-[2px] bg-[var(--accent-luminous)] blur-sm" animate={{ top: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      </motion.div>
    </div>
  </div>
);

// 6. Elite Talent — Celestial Talent Constellation
const TalentVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bokeh = Array.from({ length: 15 }, () => ({
      x: Math.random() * 300,
      y: Math.random() * 200,
      size: 1 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.3
    }));

    const nodes = [
      { x: 30, y: 100 }, { x: 90, y: 130 }, { x: 150, y: 80 }, { x: 210, y: 130 }, { x: 250, y: 90 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;

      // ── 1. Neural Constellation ──
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(212, 160, 23, 0.3)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(time * 2 + i) * 1.5;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 4 + pulse);
        grad.addColorStop(0, 'rgba(212, 160, 23, 0.4)');
        grad.addColorStop(1, 'rgba(212, 160, 23, 0)');
        ctx.fillStyle = grad;
        ctx.arc(n.x, n.y, 4 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--accent)';
        ctx.fill();
      });

      // ── 2. Ambient Bokeh ──
      bokeh.forEach(b => {
        b.y -= b.speed;
        if (b.y < -10) b.y = canvas.height + 10;
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center py-6 overflow-hidden bg-[rgba(255,255,255,0.01)]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent opacity-30" />
      
      <div className="relative w-64 h-40">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={200} 
          className="absolute inset-0 w-full h-full opacity-60"
        />

        {/* Floating Status Tags (React) */}
        {[
          { x: '10%', y: '20%', label: 'Top 1%', color: 'bg-emerald-500' },
          { x: '80%', y: '70%', label: 'Elite AI', color: 'bg-orange-500' },
        ].map((tag, i) => (
          <motion.div
            key={i}
            className={`absolute px-2 py-0.5 rounded-full ${tag.color}/10 border border-${tag.color}/30 text-[7px] font-black text-white uppercase tracking-tighter z-10`}
            style={{ left: tag.x, top: tag.y }}
            animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
          >
            {tag.label}
          </motion.div>
        ))}

        {/* Central Hero Tag */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="px-6 py-4 bg-[#110f05]/90 backdrop-blur-xl border-2 border-[var(--accent)]/40 rounded-3xl flex items-center gap-4 shadow-[0_20px_50px_rgba(212,160,23,0.3)] z-20 group"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <Sparkles size={24} className="text-[var(--accent)]" />
              <motion.div 
                className="absolute inset-0 text-[var(--accent)]"
                animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={24} />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-white uppercase tracking-[0.25em]">Global Talent</span>
              <div className="flex items-center gap-1.5">
                <div className="h-[2px] w-8 bg-gradient-to-r from-[var(--accent)] to-transparent" />
                <span className="text-[8px] text-[var(--accent)] font-bold uppercase tracking-widest">Verified Elite</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ALL_VISUALS = [ROIVisual, ScalabilityVisual, GrowthVisual, AIVisual, GlobalVisual, SecurityVisual, TalentVisual];
const MAIN_VISUALS = [ROIVisual, ScalabilityVisual, GrowthVisual, AIVisual];
const BENEFIT_VISUALS = [GlobalVisual, SecurityVisual, TalentVisual];

/* ─────────────────────── 3D Tilt Card Component ─────────────────────── */
function TiltCard({ 
  item, 
  index, 
  layout = 'horizontal', // 'horizontal', 'vertical-top', 'vertical-bottom'
  icon: PassedIcon
}: { 
  item: any; 
  index: number; 
  layout?: 'horizontal' | 'vertical-top' | 'vertical-bottom';
  icon?: any;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  const Icon = PassedIcon || ICONS[index % ICONS.length] || BarChart3;
  const Visual = ALL_VISUALS[index];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        // Custom shine logic to match Services section
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const shineX = e.clientX - rect.left;
        const shineY = e.clientY - rect.top;
        const shine = card.querySelector('.card-shine-overlay') as HTMLElement;
        if (shine) {
          shine.style.background = `radial-gradient(circle at ${shineX}px ${shineY}px, rgba(212,160,23,0.15) 0%, transparent 60%)`;
        }
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        const card = cardRef.current;
        if (card) {
          const shine = card.querySelector('.card-shine-overlay') as HTMLElement;
          if (shine) shine.style.background = 'transparent';
        }
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`group relative bento-card border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 rounded-[2rem] flex flex-col transition-all duration-500 hover:border-[rgba(212,160,23,0.35)] hover:bg-[rgba(255,255,255,0.04)] overflow-hidden ${
        layout === 'horizontal' ? 'min-h-[240px]' : 'min-h-[200px]'
      }`}
    >
      {/* Shine overlay — follows cursor (Services style) */}
      <div className="card-shine-overlay absolute inset-0 pointer-events-none z-20 rounded-[2rem]" style={{ transition: 'background 0.1s ease-out' }} />

      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

      {/* Bottom border accent glow (Services style) */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-30" />

      <div className="relative z-10 flex flex-col h-full gap-6" style={{ transform: 'translateZ(30px)' }}>
        
        {/* Upside Visual (for 3rd Row) */}
        {layout === 'vertical-top' && Visual && (
          <div className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden mb-2" style={{ transform: 'translateZ(40px)' }}>
            <Visual />
          </div>
        )}

        <div className={`flex ${layout === 'horizontal' ? 'flex-col lg:flex-row' : 'flex-col'} gap-6 flex-1`}>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,160,23,0.12)] flex items-center justify-center text-[var(--accent)] shadow-inner">
                <Icon size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--accent-luminous)] transition-colors">
                {item.title}
              </h3>
            </div>

            <p className="text-[14px] md:text-[15px] leading-relaxed text-[var(--text-secondary)]">
              <RichText text={item.desc || item.description} />
            </p>

            {item.benefit && layout !== 'vertical-top' && (
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider">
                  <TrendingUp size={14} />
                  <span>Impact Metrics</span>
                </div>
                <p className="text-xs text-white/50 mt-1">{item.benefit}</p>
              </div>
            )}
          </div>

          {/* Rightside Visual (for 2nd & 4th Cards) */}
          {layout === 'horizontal' && Visual && (
            <div 
              className="w-full lg:w-[160px] xl:w-[200px] aspect-video lg:aspect-square bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shrink-0 self-center"
              style={{ transform: 'translateZ(50px)' }}
            >
              <Visual />
            </div>
          )}
        </div>

        {/* Downside Visual (for 1st & 3rd Cards) */}
        {layout === 'vertical-bottom' && Visual && (
          <div className="w-full min-h-[120px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden mt-2" style={{ transform: 'translateZ(50px)' }}>
            <Visual />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────── Final Section ─────────────────────── */
export function WhyUsSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.whyUs;
  const items = t?.items || [];
  const benefits = t?.benefits || [];

  if (!items.length) return null;

  return (
    <section id="why-us" className="section-dark relative overflow-hidden min-h-[100dvh] flex flex-col justify-center py-12 noise-overlay">
      {/* ── Background Glow ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-[var(--accent)] opacity-[0.03] blur-[150px]" />
        <div className="absolute bottom-[0%] left-[5%] w-[600px] h-[600px] bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="section-container relative z-10 w-full">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="pill-badge pill-badge-accent uppercase tracking-[0.2em] text-[10px] px-6 py-2">
              {t?.badge}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading text-white text-4xl md:text-6xl mb-6 tracking-tighter"
          >
            <span className="text-shimmer-accent">{t?.heading}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-subheading section-subheading-dark text-lg md:text-2xl mx-auto opacity-70"
          >
            {t?.subtitle}
          </motion.p>
        </div>

        {/* ────── 2-2-3 Grid Structure ────── */}
        <div className="flex flex-col gap-6 max-w-[1240px] mx-auto">
          
          {/* Row 1 & 2: Main Items (2x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item: any, i: number) => (
              <TiltCard key={`item-${i}`} item={item} index={i} layout="horizontal" />
            ))}
          </div>

          {/* Row 3: Benefits (1x3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit: any, i: number) => {
              // Benefits indices are 4, 5, 6
              const absoluteIndex = 4 + i;
              const layout = i === 1 ? 'vertical-top' : 'vertical-bottom';
              return (
                <TiltCard 
                  key={`benefit-${i}`} 
                  item={benefit} 
                  index={absoluteIndex} 
                  layout={layout} 
                  icon={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} 
                />
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 flex flex-col items-center"
        >
          <button 
            onClick={() => window.location.href = '/proj'}
            className="group btn-primary px-16 py-5 text-xl golden-glow-lg rounded-2xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {t?.cta}
              <ArrowRight size={22} className="ml-3 group-hover:translate-x-3 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="mt-6 text-[11px] text-white/30 uppercase tracking-[0.4em] font-semibold">{t?.ctaSub}</p>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyUsSection;
