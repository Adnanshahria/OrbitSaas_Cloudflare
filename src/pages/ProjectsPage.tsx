import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { Navbar } from '@/components/orbit/Navbar';
import { OrbitFooter } from '@/components/orbit/OrbitFooter';
import { Chatbot } from '@/components/orbit/Chatbot';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FolderOpen, Sparkles } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 40,
            damping: 15,
            delay: i * 0.1,
        },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const DEFAULT_CATEGORIES = ['SaaS', 'eCommerce', 'Enterprise', 'Education', 'Portfolio'];

export default function ProjectsPage() {
    const { lang } = useLang();
    const { content } = useContent();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    const [activeCategory, setActiveCategory] = useState('All');

    const enData = (content.en as any).projects || {};
    const bnData = (content.bn as any).projects || {};
    const enItems: any[] = Array.isArray(enData.items) ? enData.items : [];
    const bnItems: any[] = Array.isArray(bnData.items) ? bnData.items : [];

    const displayItems = enItems.map((enItem, i) => {
        const bnItem = bnItems[i];
        const showBn = lang === 'bn' && bnItem && bnItem.title && bnItem.title.trim() !== '';
        const item = showBn ? bnItem : enItem;
        return { ...item, _originalIndex: i, _id: enItem.id || '' };
    });

    const sortedItems = [...displayItems].sort((a, b) => {
        const orderA = a.order ?? a._originalIndex;
        const orderB = b.order ?? b._originalIndex;
        return orderA - orderB;
    });

    const categories = enData.categories || DEFAULT_CATEGORIES;
    const ALL_CATEGORIES = ['All', ...categories];

    // Filter items
    const items = sortedItems.filter(item => {
        if (activeCategory === 'All') return true;
        const cats: string[] = item.categories || (item.category ? [item.category] : []);
        return cats.includes(activeCategory);
    });

    const sectionTitle = lang === 'bn' && bnData.title ? bnData.title : (enData.title || 'All Projects');
    const sectionSubtitle = lang === 'bn' && bnData.subtitle ? bnData.subtitle : 'Explore the full archive of our digital craftsmanship.';

    return (
        <div className="min-h-[100dvh] bg-[#f8f9fa] text-[#0a0a0b] selection:bg-[var(--accent)]/20">
            <Helmet>
                <title data-rh="true">Our Portfolio | ORBIT SaaS</title>
                <meta data-rh="true" name="description" content="Browse all premium digital projects built by ORBIT SaaS." />
            </Helmet>
            
            {/* Dark navbar injected dynamically globally, but we add padding offset manually below */}
            <div className="bg-[#0a0a0b] shadow-xl relative z-50">
              <Navbar />
            </div>
            
            <main className="pt-0 pb-24 relative overflow-hidden bg-white min-h-[100dvh]">
                {/* Immersive Light Background Aesthetics */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent)]/[0.03] rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-[var(--accent)]/[0.02] rounded-full blur-[150px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-multiply pointer-events-none" />

                <section className="px-4 xl:px-8 relative z-10 max-w-[1400px] mx-auto pt-8 sm:pt-12" ref={ref}>
                    
                    {/* Header: Cinematic Light Reveal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-16 sm:mb-20 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] backdrop-blur-md mb-6 shadow-[0_4_20px_rgba(0,0,0,0.02)] hover:bg-black/[0.05] transition-colors">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/70">Our Portfolio</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-[#0a0a0b] mb-6 leading-[1.05] max-w-4xl">
                            {sectionTitle}
                        </h1>

                        <p className="text-lg sm:text-xl text-black/50 max-w-2xl font-light leading-relaxed">
                            {sectionSubtitle}
                        </p>

                        {/* Interactive Premium Category Rail */}
                        <div className="mt-12 w-full max-w-4xl px-2">
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl sm:rounded-full bg-black/[0.02] border border-black/[0.04] backdrop-blur-sm shadow-inner">
                                {ALL_CATEGORIES.map((cat) => {
                                    const isActive = activeCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-500 overflow-hidden ${
                                                isActive
                                                    ? 'text-[#0a0a0b] shadow-[0_4px_15px_rgba(0,0,0,0.05)]'
                                                    : 'text-black/50 hover:text-black hover:bg-black/[0.03]'
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute inset-0 bg-white rounded-full border border-black/[0.05]"
                                                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                                />
                                            )}
                                            <span className="relative z-10">{cat}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Highly Polished Custom Grid (Light Theme to match home page) */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item: any, i: number) => {
                                const routeId = item._id || item._originalIndex;
                                const coverImage = item.images?.[0] || item.image;
                                const cats: string[] = item.categories || (item.category ? [item.category] : []);

                                return (
                                    <motion.div
                                        layout
                                        key={routeId}
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="h-full"
                                    >
                                        <Link
                                            to={`/project/${routeId}`}
                                            className="group relative flex flex-col h-full bg-[#fcfcfc] rounded-[2rem] overflow-hidden border border-black/[0.05] hover:border-[var(--accent)]/30 transition-all duration-500 will-change-transform shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                        >
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                                            
                                            {/* Media Container */}
                                            <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden bg-[#f4f4f5] z-10 border-b border-black/[0.03]">
                                                {coverImage ? (
                                                    <img
                                                        src={coverImage}
                                                        alt={item.title}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[0.25,1,0.5,1] group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/[0.02]">
                                                        <FolderOpen className="w-10 h-10 text-black/10 transition-transform group-hover:scale-110 duration-500" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 border border-black/[0.04] rounded-t-[2rem] pointer-events-none" />
                                            </div>

                                            {/* Content Box */}
                                            <div className="relative z-20 px-6 sm:px-8 py-6 sm:py-8 flex flex-col grow bg-white">
                                                {/* Tags */}
                                                {cats.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <span className="px-2.5 py-1 rounded-full border border-black/[0.06] bg-black/[0.02] text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)]/[0.04]">
                                                            {cats[0]}
                                                        </span>
                                                    </div>
                                                )}

                                                <h3 className="text-xl sm:text-2xl font-display text-[#0a0a0b] mb-3 tracking-tight transition-colors group-hover:text-[var(--accent)]">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-black/50 leading-relaxed mb-6 line-clamp-2 font-medium">
                                                    {item.desc?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                                                </p>

                                                <div className="mt-auto pt-5 border-t border-black/[0.04] flex items-center justify-between">
                                                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-black/40 group-hover:text-black/80 transition-colors duration-300">
                                                        View Case Study
                                                    </span>
                                                    <div className="w-9 h-9 rounded-full bg-black/[0.03] border border-black/[0.05] flex items-center justify-center group-hover:bg-[#0a0a0b] group-hover:border-[#0a0a0b] transition-all duration-500 transform group-hover:rotate-45">
                                                        <ArrowUpRight className="w-4 h-4 text-black/50 group-hover:text-white transition-colors duration-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {items.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-black/[0.05] bg-black/[0.01]"
                        >
                            <FolderOpen className="w-12 h-12 text-black/20 mb-4" />
                            <p className="text-xl text-black/50 font-display">No projects found in this category.</p>
                        </motion.div>
                    )}

                </section>
            </main>
            
            <OrbitFooter />
            <Chatbot />
        </div>
    );
}
