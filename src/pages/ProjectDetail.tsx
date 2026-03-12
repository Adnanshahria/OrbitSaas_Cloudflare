import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, X, ArrowRight, Star } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useContent } from '@/contexts/ContentContext';
import { Navbar } from '@/components/orbit/Navbar';
import { OrbitFooter } from '@/components/orbit/OrbitFooter';
import { Chatbot } from '@/components/orbit/Chatbot';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ensureAbsoluteUrl } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { RichText } from '@/components/ui/RichText';

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

function ImageGallery({ images, title, videoUrl, onLightboxChange }: { images: string[]; title: string; videoUrl?: string; onLightboxChange?: (open: boolean) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Build mixed media array: images + video at position 1 (2nd slide)
    const media: MediaItem[] = (() => {
        const items: MediaItem[] = images.map(url => ({ type: 'image' as const, url }));
        if (videoUrl) {
            const pos = Math.min(1, items.length); // insert at position 1, or end if only 1 image
            items.splice(pos, 0, { type: 'video' as const, url: videoUrl });
        }
        return items;
    })();

    if (media.length === 0) return null;

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + media.length) % media.length);
    };

    const openLightbox = () => { setLightboxOpen(true); onLightboxChange?.(true); };
    const closeLightbox = () => { setLightboxOpen(false); onLightboxChange?.(false); };

    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleDragEnd = (e: any, { offset, velocity }: any) => {
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -10000) {
            paginate(1);
        } else if (swipe > 10000) {
            paginate(-1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    const currentMedia = media[currentIndex];
    const ytId = currentMedia.type === 'video' ? extractYouTubeId(currentMedia.url) : null;

    const renderMediaSlide = (item: MediaItem, isLightbox = false) => {
        if (item.type === 'video') {
            const vid = extractYouTubeId(item.url);
            if (vid) {
                return (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className={isLightbox ? "w-full h-full" : "absolute inset-0 w-full h-full"}
                        loading="lazy"
                    />
                );
            }
            return (
                <video
                    src={item.url}
                    controls
                    playsInline
                    className={isLightbox ? "max-w-full max-h-full object-contain" : "absolute inset-0 w-full h-full object-contain bg-black"}
                />
            );
        }
        return null; // images handled by motion.img
    };

    return (
        <>
            {/* Main Carousel */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8"
            >
                <div className="relative w-full aspect-video bg-muted/10 rounded-2xl overflow-hidden border border-border group">
                    {/* Main Media */}
                    <div className={`absolute inset-0 ${currentMedia.type === 'image' ? 'cursor-pointer' : ''}`} onClick={currentMedia.type === 'image' ? openLightbox : undefined}>
                        {currentMedia.type === 'video' ? (
                            renderMediaSlide(currentMedia)
                        ) : (
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.img
                                    key={currentIndex}
                                    src={currentMedia.url}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={handleDragEnd}
                                    draggable="false"
                                    className="absolute inset-0 w-full h-full object-contain bg-black/5 touch-pan-y no-browser-trigger"
                                    alt={`${title} - slide ${currentIndex + 1}`}
                                />
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Premium Navigation & Dots Indicator */}
                {media.length > 1 && (
                    <div className="flex justify-center items-center gap-2 sm:gap-6 mt-8 relative z-10 px-4">
                        {/* Premium Backward Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        <div className="flex justify-center flex-wrap gap-2 max-w-[60%] sm:max-w-none">
                            {media.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 shrink-0 ${idx === currentIndex
                                        ? 'bg-primary w-5 sm:w-6'
                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground w-2 sm:w-2.5'
                                        }`}
                                    title={item.type === 'video' ? 'Video' : `Image ${idx + 1}`}
                                />
                            ))}
                        </div>

                        {/* Premium Forward Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors shrink-0"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                    className="absolute left-4 md:left-8 z-20 p-4 rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted hidden sm:flex items-center justify-center"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                    className="absolute right-4 md:right-8 z-20 p-4 rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted hidden sm:flex items-center justify-center"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {currentMedia.type === 'video' ? (
                            <div className="w-full max-w-[85vw] aspect-video" onClick={(e) => e.stopPropagation()}>
                                {renderMediaSlide(currentMedia, true)}
                            </div>
                        ) : (
                            <motion.img
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                src={currentMedia.url}
                                alt="Fullscreen view"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={handleDragEnd}
                                draggable="false"
                                className="max-w-full max-h-full md:max-w-[85vw] md:max-h-[85vh] object-contain select-none shadow-2xl touch-pan-y no-browser-trigger"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 group">
                            {/* Premium Golden Gradient Border Wrapper */}
                            <div className="relative p-[1.5px] rounded-full border border-border">
                                <div className="flex items-center gap-4 text-white font-medium bg-[#0A0A0B]/90 px-4 py-2 rounded-full backdrop-blur-xl">
                                    {/* Mobile specific navigation inside indicator row */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                        className="flex sm:hidden p-2 -ml-1 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-full transition-colors shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <span className="text-base min-w-[3.5rem] text-center tracking-wider tabular-nums font-semibold">
                                        {currentIndex + 1} <span className="text-[#FFD700] mx-0.5">/</span> {media.length}
                                    </span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                        className="flex sm:hidden p-2 -mr-1 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-full transition-colors shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
        /^([\w-]{11})$/,  // bare video ID
    ];
    for (const pat of patterns) {
        const m = url.match(pat);
        if (m) return m[1];
    }
    return null;
}


function CollapsibleCards({ blocks }: { blocks: string[] }) {
    // First card expanded, rest collapsed by default
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggle = (i: number) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {blocks.map((block: string, i: number) => {
                // Extract heading from block if present
                const headingMatch = block.match(/^<h3([^>]*)>(.*?)<\/h3>/i);
                const heading = headingMatch ? headingMatch[2].replace(/<[^>]*>/g, '').trim() : '';
                const headingColor = headingMatch ? (headingMatch[1].match(/data-color="([^"]*)"/i)?.[1] || '') : '';
                const bodyHtml = headingMatch ? block.replace(/^<h3[^>]*>.*?<\/h3>/i, '').trim() : block;
                const isExpanded = expanded.has(i);

                // For cards without heading, show a text preview
                const label = heading || `Section ${i + 1}`;
                const preview = !heading ? stripHtml(bodyHtml).slice(0, 60) : '';

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                        className="rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden"
                    >
                        {/* Clickable heading bar - Default flat design */}
                        <button
                            type="button"
                            onClick={() => toggle(i)}
                            className={`w-full flex items-center gap-4 px-6 sm:px-8 py-5 sm:py-6 text-left transition-colors duration-300 relative group/toggle ${isExpanded ? 'bg-muted/50' : 'hover:bg-muted/30'
                                }`}
                        >
                            <div className="relative flex-shrink-0 group-hover/toggle:scale-105 transition-transform duration-300">
                                {/* Main circle */}
                                <div
                                    className="relative flex items-center justify-center w-9 h-9 rounded-full border border-border bg-muted"
                                >
                                    <ChevronDown
                                        className={`w-4 h-4 text-primary transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 min-w-0">
                                <h3
                                    className="text-lg sm:text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover/toggle:text-primary"
                                >
                                    {label}
                                </h3>
                                {!isExpanded && preview && (
                                    <span className="text-sm text-muted-foreground/50 truncate font-medium tracking-wide">{preview}…</span>
                                )}
                            </div>
                        </button>
                        {/* Collapsible body */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="px-5 sm:px-8 pb-5 sm:pb-7 pt-2 text-muted-foreground text-base sm:text-lg leading-relaxed space-y-4"
                                    >
                                        <RichText text={bodyHtml} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const { lang } = useLang();
    const { content } = useContent();
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Data with Fallback Logic
    const enData = (content.en as any).projects || {};
    const bnData = (content.bn as any).projects || {};
    const enItems: any[] = Array.isArray(enData.items) ? enData.items : [];
    const bnItems: any[] = Array.isArray(bnData.items) ? bnData.items : [];

    // Try slug-based lookup first, then fall back to numeric index
    let idx = -1;
    const slugIndex = enItems.findIndex((item: any) => item.id && item.id === id);
    if (slugIndex >= 0) {
        idx = slugIndex;
    } else {
        const numericIdx = parseInt(id || '-1', 10);
        if (!isNaN(numericIdx) && numericIdx >= 0 && numericIdx < enItems.length) {
            idx = numericIdx;
        }
    }

    // Get potential projects
    const projectEn = idx >= 0 ? enItems[idx] : undefined;
    const projectBn = idx >= 0 ? bnItems[idx] : undefined;

    // Determine fallback
    // If we are in BN mode, and BN project exists and has a title, use it. Otherwise use EN.
    const isBn = lang === 'bn';
    const hasBnContent = projectBn && projectBn.title && projectBn.title.trim() !== '';
    const project = (isBn && hasBnContent) ? projectBn : projectEn;

    if (!project || idx < 0) {
        return (
            <div className="min-h-[100dvh] bg-background text-foreground">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-40 px-4">
                    <Helmet>
                        <title>Project Not Found | Orbit SaaS</title>
                        <meta name="robots" content="noindex" />
                    </Helmet>
                    <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
                    <Link to="/#projects" className="text-primary hover:underline flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Projects
                    </Link>
                </div>
                <OrbitFooter />
            </div>
        );
    }

    // Build images array: prefer `images`, fallback to single `image`
    const allImages: string[] =
        project.images && Array.isArray(project.images) && project.images.length > 0
            ? project.images
            : project.image
                ? [project.image]
                : [];

    // SEO Data (Shared)
    // Note: SEO data on the item is shared so it should be available on both EN and BN objects
    const seoTitle = project.seo?.title || `${project.title} | Orbit SaaS Case Study`;
    const plainDesc = stripHtml(project.desc || '');
    const seoDesc = project.seo?.description || (plainDesc.length > 160 ? plainDesc.substring(0, 157) + '...' : plainDesc);
    const seoKeywords = project.seo?.keywords?.join(', ') || project.tags?.join(', ') || 'SaaS, Portfolio, Case Study';
    const ogImage = `https://orbitsaas.cloud/api/og?project=${encodeURIComponent(id || '')}`;
    const currentUrl = `https://orbitsaas.cloud/project/${id}`;



    return (
        <div className="min-h-[100dvh] relative bg-background text-foreground">
            {/* Removed Neon Background Decorations */}
            <Helmet>
                <title data-rh="true">{seoTitle}</title>
                <meta data-rh="true" name="description" content={seoDesc} />
                <meta data-rh="true" name="keywords" content={seoKeywords} />
                <link data-rh="true" rel="canonical" href={currentUrl} />

                {/* OpenGraph / Facebook */}
                <meta data-rh="true" property="og:type" content="article" />
                <meta data-rh="true" property="og:title" content={seoTitle} />
                <meta data-rh="true" property="og:description" content={seoDesc} />
                <meta data-rh="true" property="og:image" content={ogImage} />
                <meta data-rh="true" property="og:url" content={currentUrl} />
                <meta data-rh="true" property="og:site_name" content="ORBIT SaaS" />

                {/* Twitter */}
                <meta data-rh="true" name="twitter:card" content="summary_large_image" />
                <meta data-rh="true" name="twitter:title" content={seoTitle} />
                <meta data-rh="true" name="twitter:description" content={seoDesc} />
                <meta data-rh="true" name="twitter:image" content={ogImage} />
                <meta data-rh="true" name="twitter:image:alt" content={seoTitle} />
            </Helmet>
            {!lightboxOpen && <Navbar />}
            <main className="pt-20 relative z-10">
                {/* Image + Video Gallery */}
                <ImageGallery images={allImages} title={project.title} videoUrl={project.videoPreview} onLightboxChange={setLightboxOpen} />

                {/* Two-Column Layout: Content + Sidebar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row gap-10">
                    {/* Left: Main Content */}
                    <div className="flex-1 min-w-0">



                        {/* Project Title Card — Default flat style */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="rounded-2xl border border-border bg-card px-6 sm:px-10 py-8 sm:py-10 mb-6 relative overflow-hidden"
                        >
                            {/* Title — Centered */}
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-6 relative z-10 text-center">
                                {project.title}
                            </h1>

                            {/* Tags + Categories combined */}
                            <div className="flex flex-wrap justify-center gap-2 relative z-10">
                                {(project.categories || (project.category ? [project.category] : [])).map((cat: string, ci: number) => (
                                    <span
                                        key={`cat-${ci}`}
                                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider border border-primary/20"
                                    >
                                        {cat}
                                    </span>
                                ))}
                                {project.tags && project.tags.map((tag: string, j: number) => (
                                    <span
                                        key={`tag-${j}`}
                                        className="px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-medium border border-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Description — each paragraph section in its own collapsible card */}
                        {(() => {
                            const html = project.desc || '';
                            // Split by <hr> (admin separator), then further by <h3> headings
                            let blocks: string[] = [];
                            const hrParts = html.split(/<hr\s*\/?>/i).filter((b: string) => b.trim());
                            if (hrParts.length > 1) {
                                blocks = hrParts;
                            } else {
                                const h3Parts = html.split(/(?=<h3[^>]*>)/i).filter((b: string) => b.trim());
                                blocks = h3Parts.length > 0 ? h3Parts : [html];
                            }
                            const renderBlocks = blocks.filter((b: string) => b.trim());

                            return <CollapsibleCards blocks={renderBlocks} />;
                        })()}

                        {/* Live Link Button */}
                        {project.link && project.link !== '#' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-10"
                            >
                                <a
                                    href={ensureAbsoluteUrl(project.link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Visit Live Project
                                </a>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Suggested Projects Sidebar */}
                    {(() => {
                        const buildItem = (enItem: any, i: number) => {
                            const bnItem = bnItems[i];
                            const showBn = lang === 'bn' && bnItem && bnItem.title && bnItem.title.trim() !== '';
                            const displayItem = showBn ? bnItem : enItem;
                            return { ...displayItem, _id: enItem.id || '', _originalIndex: i };
                        };

                        let suggested = enItems
                            .map((enItem: any, i: number) => {
                                if (i === idx) return null;
                                return buildItem(enItem, i);
                            })
                            .filter(Boolean)
                            .slice(0, 8);

                        if (suggested.length === 0) return null;

                        return (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="w-full lg:w-[380px] flex-shrink-0"
                            >
                                <div className="lg:sticky lg:top-24">
                                    {/* Project Reviews — same card style as ReviewsSection */}
                                    {(() => {
                                        const reviewsData = (content.en as any).reviews;
                                        const reviewItems: any[] = reviewsData?.items || [];
                                        const projectSlug = projectEn?.id || String(idx);
                                        const projectReviews = reviewItems.filter((r: any) => r.projectId === projectSlug);
                                        if (projectReviews.length === 0) return null;
                                        return (
                                            <div className="mb-2">
                                                <h2 className="font-display text-lg font-bold text-foreground mb-4">Reviews</h2>
                                                <div className="flex flex-col gap-3">
                                                    {projectReviews.map((review: any, ri: number) => (
                                                        <div key={ri} className="rounded-xl bg-card border border-border p-4 flex flex-col transition-all duration-300 hover:bg-muted/50">
                                                            {/* Top row: Stars */}
                                                            <div className="flex gap-0.5 mb-2.5">
                                                                {Array.from({ length: 5 }).map((_, si) => (
                                                                    <Star key={si} className={`w-3.5 h-3.5 ${si < (review.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                                                                ))}
                                                            </div>
                                                            <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-4">
                                                                "{review.text}"
                                                            </p>
                                                            <div className="pt-2.5 border-t border-white/[0.06]">
                                                                <span className="font-bold text-foreground text-xs block">{review.name}</span>
                                                                <span className="text-muted-foreground text-[11px]">{review.role}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <h2 className="font-display text-lg font-bold text-foreground mb-4 mt-8">More Projects</h2>
                                    <div className="flex flex-col gap-3">
                                        {suggested.map((item: any) => {
                                            const routeId = item._id || item._originalIndex;
                                            const coverImage = item.images?.[0] || item.image || '/placeholder.png';
                                            const itemCats: string[] = item.categories || (item.category ? [item.category] : []);

                                            return (
                                                <Link
                                                    key={routeId}
                                                    to={`/project/${routeId}`}
                                                    className="group flex gap-3 rounded-xl overflow-hidden border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:bg-muted p-2"
                                                >
                                                    <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
                                                        <img
                                                            src={coverImage}
                                                            alt={item.title}
                                                            draggable="false"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 no-browser-trigger"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center py-0.5 min-w-0">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 line-clamp-1">
                                                            {itemCats.slice(0, 2).join(' · ')}
                                                        </span>
                                                        <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>
            </main>
            <OrbitFooter />
            <Chatbot />
        </div>
    );
}
