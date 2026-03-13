import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RichText } from '@/components/ui/RichText';
import { ArrowRight, Cpu, Zap, Activity } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   THUNDERBOLT CANVAS — High-intensity electric arc system
   ═══════════════════════════════════════════════════════════ */

interface Bolt {
  points: { x: number; y: number }[];
  life: number;
  maxLife: number;
  opacity: number;
  width: number;
}

function useThunderboltCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  prefersReducedMotion: boolean | null
) {
  const bolts = useRef<Bolt[]>([]);
  const animRef = useRef<number>(0);

  const createBolt = useCallback((w: number, h: number) => {
    const startX = Math.random() * w;
    const startY = Math.random() * h * 0.4;
    const points = [{ x: startX, y: startY }];
    
    let curX = startX;
    let curY = startY;
    const segments = 8 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < segments; i++) {
      curX += (Math.random() - 0.5) * 120;
      curY += Math.random() * 100 + 40;
      points.push({ x: curX, y: curY });
    }

    bolts.current.push({
      points,
      life: 1,
      maxLife: 0.8 + Math.random() * 1.5,
      opacity: 0.6 + Math.random() * 0.4,
      width: 1 + Math.random() * 2,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background glow
      ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Further reduced spawn rate (0.015 -> 0.008) for very occasional strikes
      if (Math.random() < 0.008) {
        createBolt(canvas.width, canvas.height);
      }

      bolts.current = bolts.current.filter(bolt => {
        // Further reduced decay speed (0.015 -> 0.008) for very slow fade
        bolt.life -= 0.008;
        if (bolt.life <= 0) return false;

        const alpha = (bolt.life / bolt.maxLife) * bolt.opacity;
        
        // Draw glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(99, 102, 241, ${alpha})`;
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.3})`;
        ctx.lineWidth = bolt.width * 4;
        ctx.beginPath();
        ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
        bolt.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        // Draw core
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = bolt.width;
        ctx.beginPath();
        ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
        bolt.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        return true;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    if (!prefersReducedMotion) {
      animRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, createBolt, prefersReducedMotion]);
}

/* ═══════════════════════════════════════════════════════════
   FLASHY CARDS — Premium glassmorphism interactive units
   ═══════════════════════════════════════════════════════════ */

function FlashyCard({ children, icon: Icon, title, delay, className = "" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative group bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl rounded-3xl p-6 overflow-hidden ${className}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Icon size={18} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">{title}</h3>
        </div>
        {children}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
}

function AIWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['DISCOVERY', 'AGENT_INIT', 'EXECUTION', 'OPTIMIZE'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${activeStep === i ? 'bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-white/10'}`} />
          <span className={`text-[10px] font-mono tracking-wider ${activeStep === i ? 'text-indigo-300' : 'text-white/20'}`}>
            {step}
          </span>
          {activeStep === i && (
            <motion.span layoutId="activeTag" className="ml-auto text-[8px] text-indigo-400/50 font-bold uppercase">Active</motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

function ChatBotVisual() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
         <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
         </div>
         <div className="bg-white/5 rounded-2xl rounded-tl-none p-2 text-[10px] text-white/60 leading-tight">
            How can I automate my business workflow?
         </div>
      </div>
      <div className="flex items-start gap-2 self-end flex-row-reverse">
         <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Zap size={10} className="text-cyan-400" />
         </div>
         <div className="bg-indigo-500/20 border border-indigo-500/10 rounded-2xl rounded-tr-none p-2 text-[10px] text-indigo-100 leading-tight">
            I can deploy Multi-Agent systems to...
         </div>
      </div>
    </div>
  );
}

function PerformanceMetric() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
         <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.1em]">Uptime</span>
            <span className="text-2xl font-black text-white">99.9%</span>
         </div>
         <div className="h-8 flex items-end gap-[2px]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-[3px] bg-indigo-500/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
         </div>
      </div>
      <div className="h-[1px] w-full bg-white/5" />
      <div className="flex justify-between text-[10px] font-mono text-indigo-400/60 uppercase">
         <span>Latency: 0.8ms</span>
         <span>Global Edge</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME — Electric Left-Aligned Redesign
   ═══════════════════════════════════════════════════════════ */

export function Home() {
  const { content } = useContent();
  const { lang } = useLang();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = (content[lang] as any)?.hero;
  const stats = (content[lang] as any)?.stats?.items || [];

  const title = t?.title || 'Building the Future with Agentic Intelligence';
  const tagline = t?.tagline || 'Leading the AI Revolution';
  const subtitle = t?.subtitle || 'From concept to scale, we engineer high-performance software and autonomous AI agents.';
  const cta = t?.cta || 'Get Started';
  const learnMore = t?.learnMore || 'Our Services';

  useThunderboltCanvas(canvasRef, prefersReducedMotion);

  return (
    <section className="section-dark relative min-h-screen overflow-hidden flex flex-col justify-center">
      {/* ── Canvas Background ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      {/* ── Grid Layout ── */}
      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                {tagline}
              </span>

              <h1 
                className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block mr-[0.2em]"
                    style={{
                      background: word.toLowerCase() === 'agentic' || word.toLowerCase() === 'intelligence' 
                        ? 'linear-gradient(to right, #818cf8, #38bdf8)' 
                        : 'white',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
              >
                <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-10">
                  <RichText text={subtitle} />
                </p>

                <div className="flex flex-wrap gap-5">
                  <button
                    onClick={() => navigate('/contact')}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-indigo-400 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                  >
                    {cta}
                    <Zap className="fill-current transition-transform group-hover:scale-125" size={18} />
                  </button>
                  <button
                    onClick={() => navigate('/services')}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                  >
                    {learnMore}
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side: Flashy Cards */}
          <div className="lg:col-span-5 xl:col-span-4 hidden lg:block">
            <div className="relative h-[700px] w-full">
              {/* Card 1: Agentic AI - Moved Down and Lefty */}
              <div className="absolute top-[12%] right-[5%] z-10 transition-all duration-500">
                <FlashyCard icon={Activity} title="Agentic AI nodes" delay={1.2} className="w-[280px]">
                  <AIWorkflow />
                </FlashyCard>
              </div>

              {/* Card 2: Conversational AI - Middle Left (overlap area) */}
              <div className="absolute top-[38%] left-[-45%] z-20 transition-all duration-500">
                <FlashyCard icon={Cpu} title="Conversational AI" delay={1.4} className="w-[300px]">
                  <ChatBotVisual />
                  <div className="mt-4 flex justify-between items-center text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                     <span>Custom Trained LLM</span>
                     <span className="opacity-50">Active</span>
                  </div>
                </FlashyCard>
              </div>

              {/* Card 3: Enterprise Solutions - Pushed towards Lefty */}
              <div className="absolute bottom-[5%] right-[20%] z-10 transition-all duration-500">
                <FlashyCard icon={Zap} title="Enterprise Solutions" delay={1.6} className="w-[260px]">
                   <PerformanceMetric />
                </FlashyCard>
              </div>

              {/* Background Glows shifted for new layout */}
              <div className="absolute top-[45%] left-[-50%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[160px] -z-10" />
              <div className="absolute top-[15%] right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Stats row ── */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-between items-center gap-8">
            {stats.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + (i * 0.1) }}
                className="flex items-center gap-4"
              >
                <div className="text-4xl font-black text-white leading-none">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] max-w-[80px] leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
