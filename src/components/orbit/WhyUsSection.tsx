import React, { useRef, useState } from 'react';
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


/* ───────────────── Unique Super-Premium Visuals (0-6) ───────────────── */

// 0. ROI Impact — Dynamic Growth Chart with Floating Profit Nodes
const ROIVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[rgba(255,255,255,0.01)]">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
    <div className="relative w-[85%] h-3/5 flex items-end justify-between gap-1.5 px-4">
      {[35, 60, 45, 80, 65, 95].map((height, i) => (
        <motion.div
          key={i}
          className="relative flex-1 bg-gradient-to-t from-[var(--accent)]/5 via-[var(--accent)]/30 to-[var(--accent)] rounded-t-lg shadow-[0_0_20px_rgba(212,160,23,0.15)]"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
        >
          <motion.div className="absolute -top-1 left-0 right-0 h-[2px] bg-white rounded-full blur-[2px]" animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
        </motion.div>
      ))}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <motion.path
          d="M 0 85 Q 50 75 100 15"
          stroke="var(--accent-luminous)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_var(--accent-luminous)]"
          animate={{ 
            y: [0, -60, 0], 
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            opacity: [0, 0.9, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
          style={{ left: `${15 + i * 15}%`, bottom: '10%' }}
        />
      ))}
    </div>
  </div>
);

// 1. Scalability — Hexagonal Node Network with Pulsing Data
const ScalabilityVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[#0a0a0a]" style={{ backgroundImage: 'radial-gradient(var(--accent) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', opacity: 0.1 }} />
    <div className="relative w-44 h-44">
      {[...Array(7)].map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = i === 0 ? 0 : 55;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <motion.path
                  d={`M 50% 50% L ${50 + (x/1.1)}% ${50 + (y/1.1)}%`}
                  stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 5"
                  strokeOpacity="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, strokeDashoffset: [-20, 0] }}
                  transition={{ 
                    pathLength: { duration: 1.5, delay: i * 0.1 },
                    strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                  }}
                />
              </svg>
            )}
            <motion.div
              className="absolute w-12 h-12 border border-[var(--accent)]/40 rounded-xl flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-sm shadow-[0_0_20px_rgba(212,160,23,0.1)]"
              style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
              animate={{ 
                scale: [1, 1.08, 1],
                boxShadow: ['0_0_10px_rgba(212,160,23,0.1)', '0_0_30px_rgba(212,160,23,0.3)', '0_0_10px_rgba(212,160,23,0.1)']
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// 2. Growth — Parallax Orbital Rings
const GrowthVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[#8a6500] rounded-full shadow-[0_0_40px_rgba(212,160,23,0.5)] z-20 flex items-center justify-center border border-white/20" animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <Zap size={20} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-[var(--accent)]/20 rounded-[35%] flex items-center justify-center"
          style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.05, 0.3, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
        >
          <motion.div 
            className={`absolute w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]`} 
            style={{ 
              top: i % 2 === 0 ? '-1px' : 'auto', 
              bottom: i % 2 !== 0 ? '-1px' : 'auto' 
            }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      ))}
      {/* Dynamic light particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          style={{ 
            left: `${50 + Math.cos(i*45) * 40}%`, 
            top: `${50 + Math.sin(i*45) * 40}%` 
          }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 0.6, 0],
            x: [0, Math.cos(i*45) * 20],
            y: [0, Math.sin(i*45) * 20]
          }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
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
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <motion.path
          d="M 20 20 L 100 100 M 20 100 L 100 20 M 60 10 L 60 110 M 10 60 L 110 60"
          stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" fill="none" transform="scale(1.4) translate(-15, -15)"
          strokeDasharray="4 4"
        />
        <motion.circle cx="50%" cy="50%" r="55" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.15" fill="none" strokeDasharray="10 5" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      </svg>
      <motion.div className="absolute inset-10 border-2 border-[var(--accent)]/50 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(212,160,23,0.3)] z-10" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
        <Brain size={40} className="text-[var(--accent)] filter drop-shadow-[0_0_15px_var(--accent)]" />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ left: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        {/* Logic pulses */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-full h-[1px] bg-[var(--accent)] opacity-40" style={{ top: `${30 + i * 20}%` }} animate={{ opacity: [0, 1, 0], scaleX: [0, 1.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </motion.div>
    </div>
  </div>
);

// 4. Global Delivery — Atmospheric Orbital Sphere
const GlobalVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center py-4 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.05)_0%,transparent_70%)]">
    <div className="relative w-40 h-40 flex items-center justify-center">
      <motion.div className="absolute w-full h-full rounded-full border border-[var(--accent)]/10" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.2)_0%,transparent_60%)] blur-2xl animate-pulse" />
      <motion.div className="relative z-10 w-24 h-24 bg-[#110f05] border-2 border-[var(--accent)]/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,160,23,0.4)] overflow-hidden" animate={{ rotateY: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
        <Globe size={48} className="text-[var(--accent)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8a6500]/40 to-transparent pointer-events-none" />
        <motion.div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(212,160,23,0.2)_50%,transparent_100%)]" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      </motion.div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-[var(--accent)]/20 rounded-full"
          style={{ width: `${130 + i * 40}px`, height: `${130 + i * 40}px`, opacity: 0.3 }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
        >
          <motion.div className="absolute w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" style={{ top: '-1px', left: '50%' }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      ))}
    </div>
  </div>
);

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
const TalentVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center py-4 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent opacity-20" />
    <div className="relative w-56 h-32">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ 
            opacity: [0.1, 1, 0.1], 
            scale: [0.5, 1.5, 0.5],
            y: [0, -10, 0] 
          }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <motion.path 
          d="M 20 40 L 60 80 L 100 20 L 150 90 L 200 30" 
          stroke="var(--accent)" strokeWidth="2" fill="none" transform="scale(0.8) translate(30, 10)"
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }} 
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="px-8 py-3 bg-[#1d1905]/80 backdrop-blur-md border-2 border-[var(--accent)]/40 rounded-2xl flex items-center gap-3 shadow-[0_0_40px_rgba(212,160,23,0.3)]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={22} className="text-[var(--accent)] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Global Elite</span>
            <span className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-widest opacity-80">0.1% Selection Rate</span>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`group relative bento-card border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl p-6 rounded-[2rem] flex flex-col transition-all duration-500 hover:border-[rgba(212,160,23,0.35)] hover:bg-[rgba(255,255,255,0.04)] ${
        layout === 'horizontal' ? 'min-h-[240px]' : 'min-h-[200px]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />

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
              WHY PARTNER WITH US
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading text-white text-4xl md:text-6xl mb-6 tracking-tighter"
          >
            <span className="text-shimmer-accent">Absolute Digital</span> Dominance
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
              Explore Our Masterpieces
              <ArrowRight size={22} className="ml-3 group-hover:translate-x-3 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="mt-6 text-[11px] text-white/30 uppercase tracking-[0.4em] font-semibold">Witness the benchmark of digital excellence</p>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyUsSection;
