import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FolderOpen, MoveRight } from 'lucide-react';

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

// --- Decorative 3D Floating Elements (Golden Aura) ---
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="group/card perspective-2000"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
        >
            <Link to={`/project/${routeId}`} className="block relative h-full">
                <div className="relative overflow-hidden bg-[#FAF8F1] rounded-[2.5rem] border-[0.5px] border-amber-900/10 flex flex-col h-full shadow-[0_20px_60px_-15px_rgba(62,54,36,0.06)] transition-all duration-700 group-hover/card:shadow-[0_45px_90px_-20px_rgba(163,123,16,0.18)]">
                    
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
                        
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
                             <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/25 via-transparent to-white/40" />
                             <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-100/30 to-transparent skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-[2s] ease-in-out" />
                        </div>

                        <div className="absolute bottom-8 left-8 mix-blend-overlay text-[#B69762] text-6xl font-serif italic tracking-tighter opacity-50">
                            { (i+1).toString().padStart(2, '0') }
                        </div>
                    </div>

                    <div className="p-10 flex flex-col flex-grow text-left">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="h-[1px] w-8 bg-[#B69762]/40" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900/40">
                                { cats[0] || 'Selected' }
                             </span>
                        </div>

                        <h3 className="text-4xl font-serif italic font-light text-[#2C2A24] mb-6 leading-none tracking-tight group-hover/card:text-amber-800 transition-colors duration-700">
                            {item.title}
                        </h3>

                        <p className="text-[#6B6350] text-base leading-relaxed mb-8 line-clamp-2 font-light italic">
                            {item.desc?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>

                        {/* Project Tags / Stack */}
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {item.tags.slice(0, 3).map((tag: string) => (
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

                    <div className="absolute inset-0 border-[0.5px] border-amber-900/5 pointer-events-none rounded-[2.5rem]" />
                    <div className="absolute inset-0 border-[0.5px] border-white/40 pointer-events-none rounded-[2.5rem]" />
                </div>
            </Link>
        </motion.div>
    );
}

export function ProjectsSection() {
    const { lang } = useLang();
    const { content } = useContent();
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    const enData = (content.en as any).projects || {};
    const bnData = (content.bn as any).projects || {};
    const enItems: any[] = Array.isArray(enData.items) ? enData.items : [];
    const bnItems: any[] = Array.isArray(bnData.items) ? bnData.items : [];

    const displayItems = enItems.slice(0, 3).map((enItem, i) => {
        const bnItem = bnItems[i];
        const showBn = lang === 'bn' && bnItem && bnItem.title && bnItem.title.trim() !== '';
        return { ...(showBn ? bnItem : enItem), _originalIndex: i, _id: enItem.id || '' };
    });

    return (
        <section id="project" ref={sectionRef} className="relative min-h-[100dvh] bg-[#F3EFE0] text-[#2C2A24] overflow-hidden py-32">
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
            </Helmet>

            {/* Golden Aura Decorative Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <FloatingElement color="#FCD34D" size="600px" top="-10%" left="-10%" delay={0} />
                <FloatingElement color="#B69762" size="400px" top="60%" left="70%" delay={0.5} />
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/noise.png')] mix-blend-multiply" />
            </div>

            <div className="container relative z-10 px-8 mx-auto">
                <header className="max-w-4xl mb-32">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-[1px] bg-[#B69762]/60" />
                        <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#B69762]">Selected Works</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(3.5rem,8vw,8rem)] font-serif italic leading-[0.9] tracking-tighter text-[#2C2A24] mb-12"
                    >
                        Masterpieces <br />
                        <span className="text-amber-800/90 ml-[0.2em] relative">of Digital Craft</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="text-xl text-[#6B6350] max-w-2xl font-light leading-relaxed italic"
                    >
                        Exploring the boundaries between utility and art. Each project is a testament to our commitment to excellence.
                    </motion.p>
                </header>

                {/* Golden Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {displayItems.map((item, i) => (
                        <UltraCard key={item._id || item._originalIndex} item={item} i={i} />
                    ))}
                </div>

                {/* Call to Action to Archive */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="mt-32 flex justify-center"
                >
                    <Link to="/project" className="group relative px-14 py-6 bg-[#FAF8F1] text-[#B69762] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(182,151,98,0.1)] border border-amber-900/10">
                        {/* Metallic Border Glow */}
                        <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-500/20 rounded-full transition-colors duration-500" />
                        <div className="absolute inset-[1px] border border-white/40 rounded-full pointer-events-none" />
                        
                        <span className="relative z-10 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 transition-colors duration-500 group-hover:text-amber-800">
                            Explore Full Archive
                            <MoveRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-700 ease-in-out" />
                        </span>

                        {/* Liquid Gold Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/0 via-amber-50/30 to-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default ProjectsSection;
