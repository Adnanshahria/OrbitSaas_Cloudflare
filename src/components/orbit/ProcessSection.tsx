import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, PenTool, Code, CheckCircle2 } from 'lucide-react';

export function ProcessSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (content[lang] as any)?.process;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);
  const lastStepTime = useRef(0);

  // Sync ref with state
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  
  const icons = [Search, PenTool, Code, CheckCircle2];
  
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Desktop Node Positions
  const nodes = [
    { x: '15%', y: '44%' },
    { x: '38%', y: '56%' },
    { x: '62%', y: '44%' },
    { x: '85%', y: '56%' },
  ];

  // Handle scroll and touch to advance steps
  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const stepsCount = t?.steps?.length || 4;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation(); // Prevent PageCurlTransition from seeing this event
      
      const now = Date.now();
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
      if (now - lastStepTime.current < 1000) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      // Higher threshold for deliberate swipe
      if (Math.abs(deltaY) > 60) {
        if (deltaY > 0) {
          if (stepRef.current < stepsCount) {
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
      <div className="absolute top-0 left-1/4 w-full h-1/2 bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

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
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                d="M0,200 C100,200 100,176 150,176 C250,176 280,224 380,224 C480,224 520,176 620,176 C720,176 750,224 850,224 C950,224 950,200 1000,200"
                stroke="var(--accent)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 6"
              />
              <motion.path
                d="M0,200 C100,200 100,176 150,176 C250,176 280,224 380,224 C480,224 520,176 620,176 C720,176 750,224 850,224 C950,224 950,200 1000,200"
                stroke="var(--accent)" strokeWidth="3" filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 0.15, 0.38, 0.62, 0.85][step] || 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              {nodes.map((node, i) => {
                const nodeX = [150, 380, 620, 850][i];
                const nodeY = [176, 224, 176, 224][i];
                return (
                  <motion.circle
                    key={i} cx={nodeX} cy={nodeY} r="6"
                    animate={{ 
                      opacity: step > i ? 1 : 0.4, 
                      scale: step > i ? 1.1 : 0.9,
                      fill: step > i ? "var(--accent)" : "transparent"
                    }}
                    stroke="var(--accent)" strokeWidth="2" filter={step > i ? "url(#glow)" : "none"}
                  />
                );
              })}
            </svg>
          </div>

          <AnimatePresence mode="popLayout">
            {t?.steps?.map((card: any, cardIdx: number) => {
              const targetNodeIdx = step - 1 - cardIdx;
              if (targetNodeIdx < 0 || targetNodeIdx >= 4) return null;
              const node = nodes[targetNodeIdx];
              const Icon = icons[cardIdx];
              const isPeak = (cardIdx + 1) % 2 !== 0; 
              const desktopOffset = isPeak ? -135 : 135;

              return (
                <motion.div
                  key={card.id} layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%', top: '50%', left: '0%' }}
                  animate={{ 
                    opacity: 1, scale: 1, left: node.x, top: `calc(${node.y} + ${desktopOffset}px)`,
                    x: '-50%', y: '-50%'
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 140, damping: 28 }}
                  className="absolute z-30 w-64"
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-[var(--accent)]/0 via-[var(--accent)]/30 to-[var(--accent)]/0"
                    style={{ height: '80px', [isPeak ? 'bottom' : 'top']: '-40px', opacity: 0.4 }}
                  />
                  <div className="relative group p-[1px] rounded-[1.5rem] bg-gradient-to-br from-[var(--accent)]/30 to-transparent hover:from-[var(--accent)] transition-all duration-500 overflow-hidden shadow-2xl">
                    <div className="relative bg-[var(--bg-dark)]/98 backdrop-blur-3xl rounded-[1.45rem] p-5 overflow-hidden">
                      <div className="absolute -top-1 -right-1 w-10 h-10 bg-[var(--accent)]/10 rounded-bl-2xl flex items-center justify-center border-l border-b border-[var(--accent)]/20 text-[var(--accent)] font-display font-black text-base italic">{card.id}</div>
                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 text-[var(--accent)] transition-all duration-500"><Icon size={20} /></div>
                        <div>
                          <h3 className="text-lg font-black text-white mb-1 tracking-tight leading-tight">{card.title}</h3>
                          <p className="text-[12px] leading-snug font-medium opacity-60" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
            {step === 4 ? "Proceed" : step === 0 ? "Explore" : "Scroll"}
          </span>
        </motion.div>
      </div>
    </section>
  );
}


export default ProcessSection;
