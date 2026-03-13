import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { Navbar } from '@/components/orbit/Navbar';
import { OrbitFooter } from '@/components/orbit/OrbitFooter';
import { Chatbot } from '@/components/orbit/Chatbot';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FolderOpen, MoveRight, Sparkles } from 'lucide-react';

// --- Types ---
interface ProjectItem {
    id: string;
    title: string;
    desc: string;
    images?: string[];
    image?: string;
    category?: string;
    categories?: string[];
    featured?: boolean;
    order?: number;
    _originalIndex: number;
    _id: string;
    tags?: string[];
}

// --- Decorative 3D Floating Elements (Warm Amber/Gold) ---
function FloatingElement({ color, size, top, left, delay }: { color: string, size: string, top: string, left: string, delay: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 40, damping: 20 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xVal = (clientX - window.innerWidth / 2) * 0.05;
            const yVal = (clientY - window.innerHeight / 2) * 0.05;
            x.set(xVal);
            y.set(yVal);
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [x, y]);

    return (
        <motion.div
            style={{ 
                x: xSpring, 
                y: ySpring, 
                top, 
                left, 
                width: size, 
                height: size,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, delay }}
            className="absolute rounded-full blur-[60px] pointer-events-none z-0"
        />
    );
}

// --- UltraPremium Golden Card Component ---
function UltraCard({ item, i }: { item: ProjectItem, i: number }) {
    const routeId = item._id || item._originalIndex;
    const coverImage = item.images?.[0] || item.image;
    const cats: string[] = item.categories || (item.category ? [item.category] : []);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
    const imgX = useTransform(xSpring, [-0.5, 0.5], ["-15px", "15px"]);
    const imgY = useTransform(ySpring, [-0.5, 0.5], ["-15px", "15px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="group/card perspective-2000"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
        >
            <Link to={`/project/${routeId}`} className="block relative h-full">
                {/* Surface: Golden Sand / Parchment */}
                <div className="relative overflow-hidden bg-[#FAF8F1] rounded-[2.5rem] border-[0.5px] border-amber-900/10 flex flex-col h-full shadow-[0_20px_60px_-15px_rgba(62,54,36,0.06)] transition-all duration-700 group-hover/card:shadow-[0_45px_90px_-20px_rgba(163,123,16,0.18)]">
                    
                    {/* Media Containment */}
                    <div className="relative aspect-[4/5] overflow-hidden grayscale-[0.5] group-hover/card:grayscale-0 transition-all duration-[1.5s] ease-in-out">
                        <motion.div className="absolute inset-[-20px]" style={{ x: imgX, y: imgY }}>
                            {coverImage ? (
                                <img src={coverImage} alt={item.title} className="w-full h-full object-cover scale-110" />
                            ) : (
                                <div className="w-full h-full bg-amber-50/30 flex items-center justify-center">
                                    <FolderOpen className="w-16 h-16 text-amber-200" />
                                </div>
                            )}
                        </motion.div>
                        
                        {/* Metallic Gold Sweep */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
                             <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/25 via-transparent to-white/40" />
                             <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-100/30 to-transparent skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-[2s] ease-in-out" />
                        </div>

                        {/* Editorial Numbering (Deep Gold) */}
                        <div className="absolute bottom-8 left-8 mix-blend-overlay text-[#B69762] text-6xl font-serif italic tracking-tighter opacity-50">
                            { (i+1).toString().padStart(2, '0') }
                        </div>
                    </div>

                    {/* Highly Refined Content area */}
                    <div className="p-10 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="h-[1px] w-8 bg-[#B69762]/40" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900/40">
                                { cats[0] || 'Selected' }
                             </span>
                        </div>

                        <h3 className="text-4xl lg:text-5xl font-serif italic font-light text-[#2C2A24] mb-6 leading-none tracking-tight group-hover/card:text-amber-800 transition-colors duration-700">
                            {item.title}
                        </h3>

                        <p className="text-[#6B6350] text-base leading-relaxed mb-8 line-clamp-2 font-light italic">
                            {item.desc?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>

                        {/* Project Tags / Stack */}
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {item.tags.slice(0, 4).map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-amber-900/5 border border-amber-900/5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-amber-900/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-8 border-t border-amber-100 flex items-center justify-between">
                             <div className="flex items-center gap-2 group/reveal">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B69762]/60">View Archive</span>
                                <MoveRight className="w-4 h-4 text-amber-800 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-2 transition-all duration-700" />
                             </div>
                             <div className="w-10 h-10 rounded-full border border-amber-100 flex items-center justify-center group-hover/card:bg-[#2C2A24] group-hover/card:border-[#2C2A24] transition-all duration-500">
                                <ArrowUpRight className="w-4 h-4 text-amber-200 group-hover/card:text-white" />
                             </div>
                        </div>
                    </div>

                    {/* Golden Hairline border */}
                    <div className="absolute inset-0 border-[0.5px] border-amber-900/5 pointer-events-none rounded-[2.5rem]" />
                    <div className="absolute inset-0 border-[0.5px] border-white/40 pointer-events-none rounded-[2.5rem]" />
                </div>
            </Link>
        </motion.div>
    );
}

// --- Main Page ---
const DEFAULT_CATEGORIES = ['SaaS', 'eCommerce', 'Enterprise', 'Education', 'Portfolio'];

export default function ProjectsPage() {
    const { lang } = useLang();
    const { content } = useContent();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const [activeCategory, setActiveCategory] = useState('All');

    const enData = (content.en as any).projects || {};
    const bnData = (content.bn as any).projects || {};
    const enItems: any[] = Array.isArray(enData.items) ? enData.items : [];
    const bnItems: any[] = Array.isArray(bnData.items) ? bnData.items : [];

    const displayItems = enItems.map((enItem, i) => {
        const bnItem = bnItems[i];
        const showBn = lang === 'bn' && bnItem && bnItem.title && bnItem.title.trim() !== '';
        return { ...(showBn ? bnItem : enItem), _originalIndex: i, _id: enItem.id || '' };
    });

    const items = [...displayItems]
        .sort((a, b) => (a.order ?? a._originalIndex) - (b.order ?? b._originalIndex))
        .filter(item => activeCategory === 'All' || (item.categories || [item.category]).includes(activeCategory));

    const ALL_CATEGORIES = ['All', ...(enData.categories || DEFAULT_CATEGORIES)];

    return (
        <div ref={containerRef} className="min-h-screen bg-[#F3EFE0] text-[#2C2A24] selection:bg-amber-100/50 overflow-x-hidden">
            <Helmet>
                <title>Portfolio Archive | ORBIT SaaS Golden Luxury</title>
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
            </Helmet>
            <Navbar />
            <main className="relative pt-52 pb-44">
                {/* 3D Decorative Layers (Golden Aura) */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <FloatingElement color="#FCD34D" size="600px" top="-10%" left="-10%" delay={0} />
                    <FloatingElement color="#FDE68A" size="800px" top="50%" left="60%" delay={1} />
                    <FloatingElement color="#B69762" size="400px" top="20%" left="30%" delay={0.5} />
                    
                    <motion.div style={{ y: bgY }} className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/noise.png')] mix-blend-multiply" />
                    
                </div>

                <div className="container px-8 mx-auto relative z-10">
                    <header className="max-w-[1400px] mx-auto mb-40">
                         <div className="flex flex-col items-start">
                             <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2 }} className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-[1px] bg-[#B69762]/60" />
                                <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#B69762]">Complete Portfolio Archive</span>
                             </motion.div>
                             <motion.h1 
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(4.5rem,11.5vw,13.5rem)] font-serif italic leading-[0.82] tracking-tighter text-[#2C2A24] mb-16"
                             >
                                Selected <br />
                                <span className="text-amber-800/90 ml-[0.3em] relative">Masterpieces</span> <br />
                                <span className="not-italic font-sans font-thin tracking-[-0.1em] opacity-10 ml-[-0.05em]">Curated.</span>
                             </motion.h1>
                             
                             <div className="flex flex-wrap gap-x-12 gap-y-6 pt-12 border-t border-amber-900/10 w-full backdrop-blur-sm">
                                {ALL_CATEGORIES.map((cat, idx) => {
                                    const isActive = activeCategory === cat;
                                    return (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className="group relative py-3 px-4 transition-all duration-300">
                                            <span className={`text-[13px] font-black uppercase tracking-[0.45em] transition-all duration-500 ${isActive ? 'text-amber-900 drop-shadow-[0_0_1px_rgba(182,151,98,0.2)]' : 'text-[#6B6350]/60 group-hover:text-amber-700'}`}>
                                                {cat}
                                            </span>
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="liquid-line-gold" 
                                                    className="absolute inset-0 bg-amber-900/5 rounded-xl -z-10" 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                            {isActive && (
                                                <motion.div layoutId="liquid-line-underline" className="absolute bottom-1 left-4 right-4 h-[3px] bg-[#B69762] rounded-full shadow-[0_0_12px_rgba(182,151,98,0.4)]" />
                                            )}
                                        </button>
                                    );
                                })}
                             </div>
                         </div>
                    </header>

                    {/* Massive 3D Golden Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-40 lg:gap-x-20 pb-40">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, i) => (
                                <UltraCard key={item._id || item._originalIndex} item={item} i={i} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Legacy Null State */}
                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-60 text-center opacity-10">
                            <span className="text-9xl font-serif italic tracking-tighter text-[#B69762]">Void</span>
                            <p className="text-sm font-bold uppercase tracking-[0.4em] mt-8 text-[#B69762]">No records detected.</p>
                        </div>
                    )}
                </div>
            </main>
            <OrbitFooter />
            <Chatbot />
        </div>
    );
}
