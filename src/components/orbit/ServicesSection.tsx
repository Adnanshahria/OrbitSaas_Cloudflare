import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import {
  Zap,
  MonitorSmartphone,
  BotMessageSquare,
  Cpu,
  Smartphone,
  Rocket,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { parseRichText } from '@/lib/utils';

// ─── Rich Text Segment Renderer ───
const RichTextRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  const segments = parseRichText(text);

  return (
    <>
      {segments.map((seg, i) => {
        if (!seg.bold && !seg.card && !seg.whiteCard && !seg.color && !seg.greenCard) {
          return <span key={i}>{seg.text}</span>;
        }

        const classes = [
          seg.bold && !seg.color ? 'font-bold' : '',
          seg.bold && seg.color ? 'font-bold' : '',
          seg.card ? 'word-card-gold' : '',
          seg.whiteCard ? 'word-card-white' : '',
          seg.greenCard ? 'word-card-green' : '',
          seg.color === 'green' ? '!text-emerald-500' : '',
          seg.color === 'gold' ? '!text-amber-500' : '',
          seg.color === 'white' ? '!text-slate-900' : '',
        ].filter(Boolean).join(' ');

        return <span key={i} className={classes}>{seg.text}</span>;
      })}
    </>
  );
};

const SERVICE_ICONS = [MonitorSmartphone, BotMessageSquare, Cpu, Smartphone];

/* ─────────────────────── Interactive Visual Component ─────────────────────── */
const ServiceVisual = ({ title }: { title: string }) => {
  const t = title.toLowerCase();

  const isAI = t.includes('ai') || t.includes('chatbot') || t.includes('intelligence');
  const isWeb = t.includes('web') || t.includes('ecommerce') || t.includes('enterprise');
  const isMobile = t.includes('mobile') || t.includes('app');

  return (
    <div className="w-full h-48 md:h-56 bg-white/40 rounded-2xl border border-[#EBE8E0]/60 overflow-hidden relative group-hover:bg-white/70 transition-colors duration-500 flex items-center justify-center shrink-0">
      
      {isAI && (
        <div className="relative w-full h-full flex items-center justify-center">
           <motion.div
             className="absolute w-32 h-32 rounded-full border border-emerald-500/20"
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           >
              <div className="absolute -top-2 left-1/2 w-4 h-4 bg-emerald-400/30 rounded-full blur-[2px]" />
              <div className="absolute top-1/2 -right-2 w-3 h-3 bg-amber-400/30 rounded-full blur-[1px]" />
           </motion.div>
           <motion.div
             className="absolute w-16 h-16 rounded-full border border-amber-500/20"
             animate={{ rotate: -360 }}
             transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
           >
             <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-emerald-500/40 rounded-full" />
           </motion.div>
           <div className="w-10 h-10 bg-white shadow-sm rounded-xl border border-[#EBE8E0] flex items-center justify-center z-10 relative">
              <Sparkles className="w-4 h-4 text-emerald-500 opacity-80" />
           </div>
        </div>
      )}

      {isMobile && !isAI && (
        <div className="relative w-full h-full flex items-center justify-center">
           <motion.div
             className="w-16 h-28 border border-[#EBE8E0] rounded-xl relative overflow-hidden bg-white/60 backdrop-blur-sm flex flex-col items-center pt-3 shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
             animate={{ y: [0, -8, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
           >
              <motion.div className="w-full h-3 bg-emerald-500/10 mb-2" />
              <motion.div className="w-3/4 h-2 bg-slate-200 mb-1.5 rounded-full" animate={{ width: ['30%', '70%', '30%'] }} transition={{ duration: 3, repeat: Infinity }} />
              <motion.div className="w-1/2 h-2 bg-slate-200 mb-2 rounded-full" animate={{ width: ['70%', '40%', '70%'] }} transition={{ duration: 4, repeat: Infinity }} />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-300 rounded-full" />
           </motion.div>
        </div>
      )}
      
      {isWeb && !isMobile && !isAI && (
        <div className="relative w-full h-full flex items-center justify-center gap-4">
           <motion.div
             className="w-20 h-24 border border-[#EBE8E0] rounded-lg bg-white/70 flex flex-col p-2 gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
             animate={{ y: [0, -5, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
           >
              <div className="w-full h-4 bg-emerald-500/10 rounded-sm" />
              <div className="flex gap-2">
                 <div className="w-1/2 h-8 bg-slate-100 rounded-sm" />
                 <div className="w-1/2 h-8 bg-slate-100 rounded-sm" />
              </div>
           </motion.div>
           <motion.div
             className="w-24 h-16 border border-[#EBE8E0] rounded-lg bg-white/70 flex flex-col p-2 gap-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
             animate={{ y: [0, 5, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
           >
              <div className="w-1/3 h-2 bg-amber-500/20 rounded-sm" />
              <div className="w-full h-6 bg-slate-100 rounded-sm" />
           </motion.div>
        </div>
      )}

      {(!isAI && !isMobile && !isWeb) && (
         <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
               className="w-20 h-20 border border-[#EBE8E0] rounded-2xl rotate-45 flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
               animate={{ rotate: [45, 90, 45] }}
               transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
               <div className="w-10 h-10 border border-emerald-500/30 rounded-full" />
            </motion.div>
         </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#EBE8E0]/20 to-transparent pointer-events-none opacity-50 mix-blend-multiply" />
    </div>
  );
};

/* ─────────────────────── Bento Card Component ─────────────────────── */
function BentoCard({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={`group relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-[#EBE8E0] p-3 md:p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] cursor-default flex flex-col gap-5`}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--nav-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Visual Box */}
      <ServiceVisual title={item.title} />

      {/* Bottom Content Box */}
      <div className="flex flex-col flex-grow px-2 md:px-4 pb-2">
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[var(--nav-accent)] shadow-sm border border-emerald-100/50">
            <Icon size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg md:text-xl leading-tight font-bold text-[#1E293B] group-hover:text-[var(--nav-accent)] transition-colors duration-500" style={{ fontFamily: 'var(--font-display)' }}>
            {item.title}
          </h3>
        </div>

        <div className="relative z-10 flex flex-col flex-grow">
          <p className="text-[13px] md:text-[14px] leading-relaxed text-slate-500 mb-2 flex-grow" style={{ fontFamily: 'var(--font-body)' }}>
            <RichTextRenderer text={item.desc} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── Main Section ─────────────────────── */
export function ServicesSection({ embedded }: { embedded?: boolean }) {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.services;
  const allItems = t?.items || [];

  const Wrapper = embedded ? 'div' : 'section';

  return (
    <Wrapper id="services" className="relative w-full min-h-[100dvh] overflow-hidden bg-[#FDFBF7] pb-20 pt-12 md:pt-16 md:pb-24 z-10 flex flex-col justify-center">
      
      {/* Background Decorators - Luxury Beige organic glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] rounded-full bg-emerald-600/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-amber-600/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] right-[15%] w-[700px] h-[700px] rounded-full bg-orange-600/5 blur-[150px]" />
      </div>

      <div className="section-container relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 w-full">
        
        {/* Section Header: 2-Column layout to utilize horizontal space and save vertical height */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-10 md:mb-12">
          <div className="max-w-2xl text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-[3rem] font-extrabold text-[#1E293B] tracking-tight leading-[1.05]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t?.heading || 'End-to-end digital solutions that scale.'}
            </motion.h2>
          </div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="max-w-md text-left"
          >
            <p className="text-base md:text-[1.05rem] text-slate-500 leading-relaxed md:pb-2" style={{ fontFamily: 'var(--font-body)' }}>
              {t?.sub || 'We combine strategic design with cutting-edge engineering to build products that dominate.'}
            </p>
          </motion.div>
        </div>

        {/* ────── Dynamic Bento Grid Layout ────── */}
        <div className="flex flex-col gap-5 pb-8">
          {Array.from({ length: Math.ceil((allItems.length || 6) / 2) }).map((_, rowIndex) => {
             // Fallback items if array is empty
             const rowItems = allItems.length > 0 ? allItems.slice(rowIndex * 2, rowIndex * 2 + 2) : [
                { title: `Service ${rowIndex * 2 + 1}`, desc: 'Placeholder description.' },
                { title: `Service ${rowIndex * 2 + 2}`, desc: 'Placeholder description.' }
             ];
             if (rowItems.length === 0) return null;
             
             // Alternating ratio logic: 53/47 then 47/53 then 53/47
             const gridClass = rowIndex % 2 === 0 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-[53fr_47fr]" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-[47fr_53fr]";

             return (
               <div key={rowIndex} className={`grid ${gridClass} gap-5`}>
                 {rowItems.map((item: any, colIndex: number) => (
                   <BentoCard key={item.id || item.title || colIndex} item={item} index={rowIndex * 2 + colIndex} />
                 ))}
               </div>
             );
          })}
        </div>
        
      </div>
    </Wrapper>
  );
}

export default ServicesSection;
