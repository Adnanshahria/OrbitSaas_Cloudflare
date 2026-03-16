import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FolderOpen } from 'lucide-react';

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

// --- Cinematic Project Card (Light Theme) ---
function CinematicCard({ item, i }: { item: ProjectItem; i: number }) {
    const routeId = item._id || item._originalIndex;
    const coverImage = item.images?.[0] || item.image || '/placeholder.png';
    const cats: string[] = item.categories || (item.category ? [item.category] : []);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.15 });
    const [isHovered, setIsHovered] = useState(false);

    // Hover Cycling Logic
    const hoverImageUrls: string[] = (() => {
        const indices: number[] = (item as any).hoverImages || [];
        if (indices.length > 0) {
            return indices
                .filter((idx: number) => idx < (item.images?.length || 0))
                .map((idx: number) => item.images![idx]);
        }
        return item.images && item.images.length > 1 ? [item.images[1]] : [];
    })();

    const [activeIndex, setActiveIndex] = useState(-1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearCycling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isHovered && hoverImageUrls.length > 0) {
            setIsTransitioning(true);
            const t1 = setTimeout(() => {
                setActiveIndex(0);
                setIsTransitioning(false);
            }, 50);

            intervalRef.current = setInterval(() => {
                setIsTransitioning(true);
                const t2 = setTimeout(() => {
                    setActiveIndex((prev: number) => (prev + 1) % hoverImageUrls.length);
                    setIsTransitioning(false);
                }, 300);
            }, 2000);

            return () => {
                clearCycling();
                clearTimeout(t1);
            };
        } else {
            clearCycling();
            if (!isHovered) {
                setIsTransitioning(true);
                const t3 = setTimeout(() => {
                    setActiveIndex(-1);
                    setIsTransitioning(false);
                }, 150);
                return () => clearTimeout(t3);
            }
        }
    }, [isHovered, hoverImageUrls.length, clearCycling]);

    const currentImage = activeIndex >= 0 && activeIndex < hoverImageUrls.length
        ? hoverImageUrls[activeIndex]
        : coverImage;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link 
                to={`/project/${routeId}`} 
                className="block relative overflow-hidden rounded-2xl bg-white border border-[#22C55E]/30 transition-all duration-700 hover:border-[#FACC15]/60 hover:shadow-[0_10px_40px_rgba(34,197,94,0.06)]"
            >
                {/* Cover Photo — Full 16:9 */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={currentImage}
                        alt={item.title}
                        loading="lazy"
                        draggable="false"
                        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] no-browser-trigger ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100'}`}
                    />

                    {/* Shimmer Light Sweep */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    {/* Featured Badge */}
                    {item.featured && (
                        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-[#22C55E]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                            ✦ Featured
                        </div>
                    )}
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-5 right-5 z-20 w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                        <ArrowUpRight className="w-4 h-4 text-gray-900" />
                    </div>
                </div>

                {/* Content Strip */}
                <div className="p-5 sm:p-6 bg-white">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {cats.slice(0, 2).map((cat, ci) => (
                            <span
                                key={ci}
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#22C55E] border border-[#22C55E]/10 bg-[#22C55E]/5"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight tracking-tight group-hover:text-[#22C55E] transition-colors duration-500 mb-2">
                        {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {item.desc?.replace(/<[^>]*>?/gm, '').substring(0, 120)}
                    </p>
                </div>

                {/* Hover Border Glow (Golden) */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_0_1.5px_#FACC15]" />
            </Link>
        </motion.div>
    );
}

// --- Many More Card ---
function ManyMoreCard({ i }: { i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.12 }}
            className="group relative h-full"
        >
            <div className="h-full min-h-[300px] rounded-2xl bg-white border border-dashed border-[#22C55E]/30 flex flex-col items-center justify-center p-8 text-center transition-all duration-700 hover:bg-[#FDFBF7] hover:border-[#FACC15]/60 hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(34,197,94,0.04)]">
                <div className="w-14 h-14 rounded-full bg-[#22C55E]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <FolderOpen className="w-6 h-6 text-[#22C55E]/40" />
                </div>
                <h3 className="text-sm font-bold text-gray-400 group-hover:text-[#22C55E] transition-colors uppercase tracking-[0.2em]">And Many More</h3>
                <p className="text-[11px] text-gray-400 mt-4 max-w-[180px] leading-relaxed italic">
                    Pushing boundaries with custom solutions tailored to visionaries.
                </p>
                
                {/* Subtle Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_0_1.5px_#FACC15] pointer-events-none" />
            </div>
        </motion.div>
    );
}

export function ProjectsSection() {
    const { lang } = useLang();
    const { content } = useContent();

    const enData = (content.en as any).projects || {};
    const bnData = (content.bn as any).projects || {};
    const enItems: any[] = Array.isArray(enData.items) ? enData.items : [];
    const bnItems: any[] = Array.isArray(bnData.items) ? bnData.items : [];

    const displayItems = enItems.map((enItem, i) => {
        const bnItem = bnItems[i];
        const showBn = lang === 'bn' && bnItem && bnItem.title && bnItem.title.trim() !== '';
        return { ...(showBn ? bnItem : enItem), _originalIndex: i, _id: enItem.id || '' };
    }).sort((a, b) => (a.order ?? a._originalIndex) - (b.order ?? b._originalIndex));

    return (
        <section id="projects" className="py-24 sm:py-32 bg-[#FDFBF7] relative overflow-hidden">
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Helmet>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#22C55E]/[0.03] rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FACC15]/[0.03] rounded-full blur-[140px] translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
                {/* Section Header */}
                <div className="mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-10 h-[2px] bg-[#22C55E]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#22C55E]">
                            Featured Portfolio
                        </span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Our <span className="text-gray-300">Creative</span><br />
                            Universe
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-md text-gray-500 text-lg leading-relaxed mb-2"
                        >
                            Crafting high-performance digital experiences that merge cutting-edge technology with cinematic design.
                        </motion.p>
                    </div>
                </div>

                {/* Projects Grid — All Projects */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {displayItems.map((item, i) => (
                        <CinematicCard key={item._id || item._originalIndex} item={item} i={i} />
                    ))}
                    {/* The "Many More" Card */}
                    <ManyMoreCard i={displayItems.length} />
                </div>

                {/* Explore Archive CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <Link
                        to="/project"
                        className="inline-flex items-center gap-3 group px-8 py-4 rounded-full bg-white border border-[#22C55E]/20 text-[#22C55E] font-bold transition-all duration-500 hover:border-[#FACC15]/60 hover:bg-[#FDFBF7] hover:shadow-[0_10px_30px_rgba(34,197,94,0.06)]"
                    >
                        <span>Explore Full Archive</span>
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
