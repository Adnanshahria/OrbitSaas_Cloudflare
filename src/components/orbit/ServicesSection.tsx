import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useRef, type MouseEvent, lazy, Suspense } from 'react';
const EnergyCanvas = lazy(() => import('./EnergyCanvas'));
import {
  Zap,
  MonitorSmartphone,
  BotMessageSquare,
  Cpu,
  Smartphone,
  Rocket,
} from 'lucide-react';

const SERVICE_ICONS = [MonitorSmartphone, BotMessageSquare, Cpu, Smartphone];
const CENTER_ICON = Rocket;
const HUB_SIZE = 250; // px — diameter of the center hub circle

/* ─────────────────────── ServiceCard ─────────────────────── */
function ServiceCard({
  item,
  index,
  hubSide,
}: {
  item: any;
  index: number;
  hubSide: 'br' | 'bl' | 'tr' | 'tl';
}) {
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
  const cardRef = useRef<HTMLDivElement>(null);

  /* 3-D tilt springs */
  const tiltSpring = { damping: 25, stiffness: 220 };
  const rotX = useSpring(0, tiltSpring);
  const rotY = useSpring(0, tiltSpring);

  /* Spotlight springs */
  const spotSpring = { damping: 20, stiffness: 160 };
  const spotX = useSpring(0, spotSpring);
  const spotY = useSpring(0, spotSpring);

  const handleMove = (e: MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const nx = x / r.width - 0.5;   // -0.5 → 0.5
    const ny = y / r.height - 0.5;
    rotX.set(ny * -10);
    rotY.set(nx * 10);
    spotX.set(x);
    spotY.set(y);
  };

  const handleLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, rgba(212,160,23,0.09), transparent 80%)`;
  const borderGlow = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, rgba(212,160,23,0.24), transparent 80%)`;

  /* Corner radii — tight on hub side */
  const O = '1.5rem';
  const I = '0.35rem';
  const radius: Record<string, string> = {
    br: `${O} ${O} ${I} ${O}`,
    bl: `${O} ${O} ${O} ${I}`,
    tr: `${O} ${I} ${O} ${O}`,
    tl: `${I} ${O} ${O} ${O}`,
  };

  /*
    Asymmetric padding so content clears the hub overlap.
    Hub overlaps cards by ~(HUB_SIZE/2 - gap/2) = ~117 px vertically
    and varies horizontally based on card width.
    Wide cards (55%) get more pad, narrow (45%) get less.
  const isCentered = false;

  /* 3-D entrance animation */
  const initialRotation = {
    br: { rotateX: 12, rotateY: -8 },
    bl: { rotateX: 12, rotateY: 8 },
    tr: { rotateX: -12, rotateY: -8 },
    tl: { rotateX: -12, rotateY: 8 },
  };

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30, ...initialRotation[hubSide] }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay: index * 0.12, duration: 0.65, ease: 'easeOut' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative overflow-hidden flex flex-col h-full"
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d' as any,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          borderRadius: radius[hubSide],
          padding: '1.75rem',
          willChange: 'transform',
        }}
      >
        {/* Optional bottom badge / Admin input */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" style={{ transform: 'translateZ(30px)' }}>
          <div className="h-[2px] w-8 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-full opacity-30 group-hover:w-14 transition-all duration-700" />
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/15 group-hover:text-[var(--accent)]/60 transition-colors duration-500">
            {item.badge || 'Premium'}
          </span>
        </div>
        {/* ── Spotlight ── */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlight, borderRadius: 'inherit' }}
        />

        {/* ── Border glow ── */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: borderGlow,
            maskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            WebkitMaskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            maskClip: 'content-box,border-box',
            WebkitMaskClip: 'content-box,border-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'destination-out',
            border: '1px solid transparent',
            borderRadius: 'inherit',
          }}
        />

        {/* ── Full-border green glow (all edges) ── */}
        <div
          className="pointer-events-none absolute -inset-px z-20"
          style={{
            background: 'linear-gradient(180deg, rgba(0,230,118,0.45) 0%, rgba(0,200,83,0.18) 40%, rgba(0,230,118,0.12) 100%)',
            maskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            WebkitMaskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            maskClip: 'content-box,border-box',
            WebkitMaskClip: 'content-box,border-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'destination-out' as any,
            border: '1.5px solid transparent',
            borderRadius: 'inherit',
          }}
        />

        {/* ── Inner edge atmosphere ── */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,230,118,0.06), inset 0 -15px 40px rgba(0,230,118,0.03)',
            borderRadius: 'inherit',
          }}
        />


        {/* ── Depth shine on top edge (3-D feel) ── */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-30 group-hover:opacity-50 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 block h-full text-left" style={{ transform: 'translateZ(20px)' }}>
          {/* ── Hub Wrapping Shape ── */}
          {/* Invisible floated elements with precise contour tracing the 250px central circular hub */}
          {hubSide === 'tl' && <div className="pointer-events-none" style={{ float: 'left', width: '135px', height: '135px', shapeOutside: 'circle(135px at top left)', margin: '-1.75rem 1.25rem 0.5rem -1.75rem' }} />}
          {hubSide === 'tr' && <div className="pointer-events-none" style={{ float: 'right', width: '135px', height: '135px', shapeOutside: 'circle(135px at top right)', margin: '-1.75rem -1.75rem 0.5rem 1.25rem' }} />}
          {hubSide === 'bl' && <div className="pointer-events-none" style={{ float: 'left', width: '135px', height: '280px', shapeOutside: 'circle(135px at bottom left)', margin: '-1.75rem 1.25rem -1.75rem -1.75rem' }} />}
          {hubSide === 'br' && <div className="pointer-events-none" style={{ float: 'right', width: '135px', height: '280px', shapeOutside: 'circle(135px at bottom right)', margin: '-1.75rem -1.75rem -1.75rem 1.25rem' }} />}

          {/* Icon + Title (Inline Block to allow text wrapping around the floats) */}
          <div
            className="mb-3 block"
            style={{
              ...(index === 3 ? { paddingLeft: '3rem' } : {}),
              ...(index === 2 ? { paddingLeft: '1.5rem' } : {})
            }}
          >
            <div className="inline-block relative shrink-0 align-middle mr-3">
              <div className="absolute inset-0 bg-[var(--accent)] blur-[14px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="inline align-middle text-[17px] md:text-[19px] font-bold text-white group-hover:text-[var(--accent)] transition-colors duration-500 leading-tight">
              {item.title}
            </h3>
          </div>

          <p
            className="text-[13px] md:text-[14px] text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-500 mb-8"
            style={{ ...(index === 2 ? { paddingLeft: '1.5rem' } : {}) }}
          >
            {item.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────── CenterHub ─────────────────────── */
function CenterHub({ item }: { item?: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 80, damping: 14 }}
      className="group cursor-pointer relative"
    >
      {/* Outer pulse rings */}
      <div
        className="absolute rounded-full pointer-events-none animate-[pulse_4s_ease-in-out_infinite]"
        style={{ inset: '-14px', border: '1px solid rgba(212,160,23,0.06)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: '-28px', border: '1px solid rgba(212,160,23,0.03)' }}
      />

      {/* Rotating subtle ring */}
      <div
        className="absolute rounded-full pointer-events-none animate-[spin_30s_linear_infinite]"
        style={{
          inset: '-6px',
          border: '1px dashed rgba(212,160,23,0.08)',
        }}
      />

      {/* Circle */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center text-center group-hover:scale-105 transition-all duration-500 group-hover:shadow-[0_0_80px_rgba(212,160,23,0.1)]"
        style={{
          width: `${HUB_SIZE}px`,
          height: `${HUB_SIZE}px`,
          background: 'linear-gradient(150deg, rgba(28,26,18,0.98), rgba(8,6,2,1))',
          border: '1.5px solid rgba(212,160,23,0.18)',
          boxShadow:
            '0 35px 70px -15px rgba(0,0,0,0.9), inset 0 1px 0 rgba(212,160,23,0.08), 0 0 0 8px rgba(0,0,0,0.6), 0 0 60px rgba(212,160,23,0.03)',
        }}
      >
        {/* Inner radial glow */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.06),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Golden top glow from beam */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,230,118,0.20) 0%, rgba(0,230,118,0.06) 25%, transparent 50%)',
          }}
        />
        <div
          className="absolute -inset-[1px] rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,230,118,0.35) 0%, transparent 30%)',
            maskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            WebkitMaskImage: 'linear-gradient(#000,#000),linear-gradient(#000,#000)',
            maskClip: 'content-box,border-box',
            WebkitMaskClip: 'content-box,border-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'destination-out' as any,
            border: '2px solid transparent',
          }}
        />

        <CENTER_ICON
          size={34}
          strokeWidth={1.5}
          className="relative z-10 text-[var(--accent)] mb-2 -mt-8 group-hover:scale-110 transition-transform duration-500"
        />
        <h3 className="relative z-10 text-[13px] font-bold text-white leading-tight px-6">
          {item?.title || 'Full Service Agency'}
        </h3>
        <p className="relative z-10 text-[9px] text-white/30 mt-1.5 px-7 leading-snug">
          {item?.desc || 'Your vision, our craft'}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── Main Section ─────────────────────── */
export function ServicesSection({ embedded }: { embedded?: boolean }) {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.services;
  const all = t?.items || [];

  const cards = all.slice(0, 4);
  const centerItem = all[4] ?? null;

  const ROW_GAP = 16;
  const COL_GAP = 16;

  const Wrapper = embedded ? 'div' : 'section';

  return (
    <Wrapper id="services" className={`${embedded ? '' : 'section-dark'} relative overflow-visible pb-24 md:pb-32 pt-0 md:pt-0 z-10`}>
      {/* BG glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle,rgba(212,160,23,0.04),transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="section-container relative z-10 pt-4 md:pt-8">
        {/* ────── Desktop Layout ────── */}
        <div className="hidden md:block relative max-w-[1240px] mx-auto p-4 md:p-6 rounded-[2rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <div className="relative max-w-[1200px] mx-auto">
            {/* Row 1: 55% | 45% */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '55fr 45fr',
                gap: `${COL_GAP}px`,
              }}
            >
              <div style={{ minHeight: '250px' }}>
                <ServiceCard item={cards[0] || { title: '', desc: '' }} index={0} hubSide="br" />
              </div>
              <div style={{ minHeight: '250px' }}>
                <ServiceCard item={cards[1] || { title: '', desc: '' }} index={1} hubSide="bl" />
              </div>
            </div>

            {/* Row spacer */}
            <div style={{ height: `${ROW_GAP}px` }} />

            {/* Row 2: 48% | 52% */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '48fr 52fr',
                gap: `${COL_GAP}px`,
              }}
            >
              <div style={{ minHeight: '250px' }}>
                <ServiceCard item={cards[2] || { title: '', desc: '' }} index={2} hubSide="tr" />
              </div>
              <div style={{ minHeight: '250px' }}>
                <ServiceCard item={cards[3] || { title: '', desc: '' }} index={3} hubSide="tl" />
              </div>
            </div>

            {/* ── Hub slightly shifted right (+x axis) to align better with the beam ── */}
            <div
              className="absolute z-30"
              style={{
                top: '50%',
                left: '55%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CenterHub item={centerItem} />
            </div>
          </div>
        </div>

        {/* ────── Mobile Layout ────── */}
        <div className="md:hidden flex flex-col gap-4">
          {cards.map((item: any, i: number) => (
            <ServiceCard
              key={i}
              item={item}
              index={i}
              hubSide={(['br', 'bl', 'tr', 'tl'] as const)[i]}
            />
          ))}
          <div className="flex justify-center mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="rounded-full flex flex-col items-center justify-center text-center"
              style={{
                width: '200px',
                height: '200px',
                background:
                  'linear-gradient(150deg,rgba(28,26,18,0.98),rgba(8,6,2,1))',
                border: '1.5px solid rgba(212,160,23,0.18)',
                boxShadow:
                  '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 6px rgba(0,0,0,0.5)',
              }}
            >
              <CENTER_ICON size={26} strokeWidth={1.5} className="text-[var(--accent)] mb-1.5" />
              <h3 className="text-xs font-bold text-white px-4 leading-tight">
                {centerItem?.title || 'Full Service Agency'}
              </h3>
              <p className="text-[9px] text-white/30 mt-1 px-5 leading-tight">
                {centerItem?.desc || 'Your vision, our craft'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ServicesSection;
