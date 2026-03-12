import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, PenTool, Code, CheckCircle2, Truck } from 'lucide-react';

function ProcessCard({ card, icon: Icon, isPeak, node, isDelivery }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const desktopOffset = isDelivery ? 0 : (isPeak ? -170 : 170);

  return (
    <motion.div
      initial={{ 
        opacity: 0, scale: 0.8, x: '-50%', y: '-50%', 
        left: node.x, top: `calc(${node.y} + ${desktopOffset}px)` 
      }}
      animate={{ 
        opacity: 1, scale: 1, 
        left: node.x, top: `calc(${node.y} + ${desktopOffset}px)`,
        x: '-50%', y: '-50%'
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 140, damping: 28 }}
      className="absolute z-30 w-64 perspective-[1000px]"
    >
      {/* Connection Beam (Pulser) - Perfectly Centered on Card Origin */}
      {!isDelivery && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible">
          <svg className="overflow-visible" width="1" height="1">
            <motion.line
              x1="0" y1="0" 
              x2="0" y2={-desktopOffset * 0.9}
              stroke="rgba(0, 255, 128, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.circle
              r="2"
              fill="#00ff80"
              animate={{ cy: [0, -desktopOffset * 0.9], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="6"
              fill="#00ff80"
              filter="blur(4px)"
              animate={{ cy: [0, -desktopOffset * 0.9], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.2 }}
            />
          </svg>
        </div>
      )}

      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group p-[1px] rounded-[1.5rem] bg-gradient-to-br from-[#00ff80]/40 via-white/5 to-transparent hover:from-[#00ff80] transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(0,255,128,0.1)] hover:shadow-[0_0_50px_rgba(0,255,128,0.2)]"
      >
        <div className="relative bg-[#05100a]/90 backdrop-blur-3xl rounded-[1.45rem] p-5 overflow-hidden border border-white/5">
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-[#00ff80]/15 rounded-bl-2xl flex items-center justify-center border-l border-b border-[#00ff80]/30 text-[#00ff80] font-display font-black text-base italic shadow-[0_0_15px_rgba(0,255,128,0.1)]">{card.id}</div>
          <div className="relative z-10 flex flex-col gap-3" style={{ transform: "translateZ(30px)" }}>
            <div className="w-10 h-10 rounded-lg bg-[#00ff80]/15 flex items-center justify-center border border-[#00ff80]/30 text-[#00ff80] transition-all duration-500 shadow-[inset_0_0_10px_rgba(0,255,128,0.1)]"><Icon size={20} /></div>
            <div>
              <h3 className="text-lg font-black text-white mb-1 tracking-tight leading-tight uppercase">{card.title}</h3>
              <p className="text-[12px] font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,128,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProcessSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (content[lang] as any)?.process;
  
  const sortedSteps = useMemo(() => {
    return [...(t?.steps || [])].sort((a: any, b: any) => 
      String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
    );
  }, [t?.steps]);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const mountTime = useRef(Date.now());
  const lastStepTime = useRef(0);

  // Reset state when entering the section
  useEffect(() => {
    setHasMounted(true);
    setStep(0);
    mountTime.current = Date.now();
  }, []);

  // Sync ref with state
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  
  const icons = [Search, PenTool, Code, CheckCircle2, Truck];
  
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Distinct & Even Desktop Node Positions (20% Interval Symmetry)
  const nodes = [
    { x: '10%', y: '44%' },
    { x: '30%', y: '56%' },
    { x: '50%', y: '44%' },
    { x: '70%', y: '56%' },
    { x: '90%', y: '50%' }, // Position for Delivery card perfectly centered on right wing
  ];

  // Handle scroll and touch to advance steps
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const stepsCount = t?.steps?.length || 4;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation(); // Prevent PageCurlTransition from seeing this event
      
      const now = Date.now();
      // Safety: Ignore scroll momentum from previous pages for 800ms after mount
      if (now - mountTime.current < 800) return;

      // Ignore rapid firing and inertia jitter
      if (now - lastStepTime.current < 1000) {
        if (Math.abs(e.deltaY) > 2) e.preventDefault();
        return;
      }

      // Filter out small jitters/accidental small movements
      if (Math.abs(e.deltaY) < 20) return;

      e.preventDefault(); // Stop native scrolling
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const stepsCount = sortedSteps.length;
      if (isScrollingDown) {
        if (stepRef.current < stepsCount) {
          setStep(prev => prev + 1);
          lastStepTime.current = now;
        } else {
          // Navigation happens only after viewing the last step (step 4)
          navigate('/techstack');
        }
      } else if (isScrollingUp) {
        if (stepRef.current > 0) {
          setStep(prev => prev - 1);
          lastStepTime.current = now;
        } else {
          navigate('/services');
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault(); // Disable native scroll on mobile inside this section
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - mountTime.current < 800) return;
      if (now - lastStepTime.current < 1000) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      // Higher threshold for deliberate swipe
      if (Math.abs(deltaY) > 60) {
        if (deltaY > 0) {
          if (stepRef.current < sortedSteps.length) {
            setStep(prev => prev + 1);
            lastStepTime.current = now;
          } else {
            navigate('/techstack');
          }
        } else if (deltaY < 0) {
          if (stepRef.current > 0) {
            setStep(prev => prev - 1);
            lastStepTime.current = now;
          } else {
            navigate('/services');
          }
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, t?.steps?.length]);

  return (
    <section 
      ref={sectionRef}
      id="process" 
      className="section-dark relative overflow-hidden min-h-[100dvh] flex flex-col items-center pt-6 pb-12 lg:pt-4 touch-none"
    >
      <div className="absolute top-0 left-1/4 w-full h-1/2 bg-[#00ff80]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00ff80]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10 w-full flex flex-col items-center px-4 h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6 lg:mb-8 text-center"
        >
          <h2 className="section-heading text-white max-w-5xl tracking-tighter leading-[1] text-[clamp(2rem,5vw,3.5rem)]">
            {t?.title || 'How We Transform Your Vision'}
          </h2>
        </motion.div>

        {/* Desktop Layout (lg+) */}
        <div className="hidden lg:block relative w-full h-[55vh] max-h-[500px] max-w-7xl">
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="pathFade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="10%" stopColor="white" stopOpacity="1" />
                  <stop offset="90%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="pathMask">
                  <rect width="100%" height="100%" fill="url(#pathFade)" />
                </mask>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                d="M0,200 C40,200 50,176 100,176 C200,176 200,224 300,224 C400,224 400,176 500,176 C600,176 600,224 700,224"
                fill="none" stroke="#00ff80" strokeOpacity="0.2" strokeWidth="3" strokeDasharray="6 6"
                mask="url(#pathMask)"
              />
              <motion.path
                d="M0,200 C40,200 50,176 100,176 C200,176 200,224 300,224 C400,224 400,176 500,176 C600,176 600,224 700,224"
                fill="none" stroke="#00ff80" strokeWidth="4" filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: hasMounted ? ([0, 0.145, 0.43, 0.715, 1.0, 1.0][step] || 0) : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                mask="url(#pathMask)"
              />

              {/* Final Premium Arrow Mark (Connecting step 4 to Delivery) */}
              <AnimatePresence>
                {step >= 5 && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.path 
                      d="M700,224 C760,224 760,200 820,200"
                      fill="none" stroke="url(#premiumArrowGradient)" strokeWidth="4" filter="url(#glow)"
                      markerEnd="url(#premiumArrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {nodes.slice(0, 4).map((_, i) => {
                const nodeX = [100, 300, 500, 700][i];
                const nodeY = [176, 224, 176, 224][i];
                return (
                  <motion.circle
                    key={i} cx={nodeX} cy={nodeY} r="6"
                    animate={{ 
                      opacity: step > i ? 1 : 0.4, 
                      scale: step > i ? 1.1 : 0.9,
                      fill: step > i ? "#00ff80" : "transparent"
                    }}
                    stroke="#00ff80" strokeWidth="3" filter={step > i ? "url(#glow)" : "none"}
                  />
                );
              })}
            </svg>
          </div>

          <AnimatePresence mode="popLayout">
            {sortedSteps.map((card: any, cardIdx: number) => {
              // Stable reveal logic: card[i] is permanently bound to nodes[i]
              if (step <= cardIdx) return null;
              const node = nodes[cardIdx];
              const Icon = icons[cardIdx] || icons[0];
              const isPeak = (cardIdx + 1) % 2 !== 0; 
              
              return (
                <ProcessCard 
                  key={card.id} 
                  card={card} 
                  icon={Icon} 
                  isPeak={isPeak} 
                  node={node} 
                  isDelivery={cardIdx === 4}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mobile Sequential Stack (md-) */}
        <div className="lg:hidden relative w-full h-[55vh] flex items-center justify-center pointer-events-none mt-4 overflow-visible">
          <AnimatePresence mode="popLayout" initial={false}>
            {t?.steps?.map((card: any, idx: number) => {
              const currentCardIndex = step - 1; 
              const isCurrent = idx === currentCardIndex;
              const isPrevious = idx === currentCardIndex - 1;
              const isNext = (idx === currentCardIndex + 1) || (step === 0 && idx === 0) || (step === 4 && idx === 0);
              
              const isVisible = isCurrent || isPrevious || isNext;
              if (!isVisible) return null;

              const Icon = icons[idx];
              
              let y = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 20;
              let blur = "0px";

              if (isCurrent) {
                y = 0; scale = 1; opacity = 1; zIndex = 30;
              } else if (isPrevious) {
                y = -100; scale = 0.85; opacity = 0.4; zIndex = 10; blur = "2px";
              } else if (isNext) {
                y = 130; scale = 0.88; opacity = 0.2; zIndex = 5;
              }

              return (
                <motion.div
                  key={`${card.id}-${step}`}
                  initial={{ opacity: 0, scale: 0.8, y: 150 }}
                  animate={{ opacity, scale, y, zIndex }}
                  exit={{ opacity: 0, scale: 0.8, y: -150 }}
                  transition={{ type: "spring", stiffness: 140, damping: 25 }}
                  className="absolute w-72 xs:w-80"
                  style={{ filter: blur !== "0px" ? `blur(${blur})` : "none" }}
                >
                  {/* Outer Glow & Border */}
                  <div className="relative p-[1.5px] rounded-[1.8rem] bg-gradient-to-br from-[var(--accent)]/60 via-[var(--accent)]/20 to-transparent shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)] backdrop-blur-3xl overflow-hidden">
                    {/* Inner Glass Container */}
                    <div className="relative bg-[var(--bg-dark)]/95 rounded-[1.75rem] p-7 text-center flex flex-col items-center border border-white/5">
                      {/* Decorative Corner Glow */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--accent)]/10 blur-3xl rounded-full" />
                      
                      {/* Icon Container - More defined */}
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-[var(--accent)]/20 blur-xl rounded-full opacity-50" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-transparent flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/30 shadow-[inset_0_0_15px_rgba(var(--accent-rgb),0.1)]">
                          <Icon size={28} />
                        </div>
                      </div>

                      <div className="space-y-1 mb-2">
                        <span className="text-[var(--accent)] font-display font-black text-[10px] tracking-[0.3em] uppercase opacity-70 block">
                          Step {card.id}
                        </span>
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none uppercase">
                          {card.title}
                        </h3>
                      </div>

                      <p className="text-xs leading-relaxed opacity-70 px-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {card.desc}
                      </p>

                      {/* Bottom Accent Line */}
                      <div className="mt-6 w-8 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Universal Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute bottom-8 lg:bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        >
          <div className="relative w-[1px] h-10 lg:h-12 overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent)] opacity-20" />
            <motion.div 
              animate={{ y: [0, 48] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/3 bg-[var(--accent)]" 
            />
          </div>
          <span className="text-[var(--accent)] text-[9px] md:text-[10px] tracking-[0.4em] font-black uppercase">
            {step === sortedSteps.length ? "Proceed" : step === 0 ? "Explore" : "Scroll"}
          </span>
        </motion.div>
      </div>
    </section>
  );
}


export default ProcessSection;
