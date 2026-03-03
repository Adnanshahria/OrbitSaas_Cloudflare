import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function truncate(str: string, max: number): string {
    if (!str || str.length <= max) return str || '';
    return str.substring(0, max).replace(/\s+\S*$/, '') + '...';
}

interface ProjectCardProps {
    item: any;
    routeId: string | number;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function ProjectCard({ item, routeId, isHovered, onMouseEnter, onMouseLeave }: ProjectCardProps) {
    const plainDesc = stripHtml(item.desc || '');
    const shortDesc = truncate(plainDesc, 100);
    const coverImage = item.images?.[0] || item.image || '/placeholder.png';
    const hoverImage = item.images?.[1] || null;
    const categories: string[] = item.categories || (item.category ? [item.category] : ['Portfolio']);

    return (
        <div
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col h-full bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] transition-all duration-500 hover:border-neon-amber/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.08),0_0_60px_rgba(245,158,11,0.04)]"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Media Area */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                <Link to={`/project/${routeId}`} className="block w-full h-full">
                    {/* Video Preview (on hover, desktop only) */}
                    {item.videoPreview && isHovered && typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches ? (
                        <video src={item.videoPreview} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-10" />
                    ) : null}

                    {/* Default Cover Image */}
                    <img
                        src={coverImage}
                        alt={item.title}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:brightness-110'}`}
                    />

                    {/* Hover Image (next image) — crossfade in */}
                    {hoverImage && (
                        <img
                            src={hoverImage}
                            alt={`${item.title} preview`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:brightness-110"
                        />
                    )}
                </Link>

                {/* Shimmer light sweep on hover */}
                <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>

                {/* Subtle amber tint on hover */}
                <div className="absolute inset-0 bg-neon-amber/0 group-hover:bg-neon-amber/[0.06] transition-colors duration-500 pointer-events-none z-10" />

                {/* Bottom gradient fade into content */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

                {/* Featured Badge */}
                {item.featured && (
                    <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/90 to-amber-400/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.4)] border border-yellow-400/30">
                        ✦ Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5 sm:p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <Link to={`/project/${routeId}`}>
                        <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-neon-amber transition-colors duration-300 leading-tight">
                            {item.title}
                        </h3>
                    </Link>
                </div>

                <p className="text-muted-foreground/80 text-[11px] sm:text-xs leading-relaxed mb-3 line-clamp-2 flex-grow">
                    {shortDesc}
                </p>

                {/* Footer: Category Tags & Premium Arrow */}
                <div className="pt-3 border-t border-white/[0.06] flex items-end justify-between gap-3 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat: string, j: number) => (
                            <span
                                key={j}
                                className="px-2 py-[3px] rounded-md text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/50 bg-white/[0.04] border border-white/[0.06]"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    {/* Premium Arrow Button */}
                    <Link
                        to={`/project/${routeId}`}
                        className="premium-arrow-btn shrink-0 relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 group/arrow"
                    >
                        {/* Outer ring */}
                        <span className="absolute inset-0 rounded-full border border-white/15 group-hover/arrow:border-neon-amber/50 transition-colors duration-300" />
                        {/* Glow background on hover */}
                        <span className="absolute inset-[2px] rounded-full bg-transparent group-hover/arrow:bg-neon-amber/15 transition-all duration-300" />
                        {/* Animated glow ring */}
                        <span className="absolute inset-[-3px] rounded-full border border-transparent group-hover/arrow:border-neon-amber/20 group-hover/arrow:shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-500 scale-100 group-hover/arrow:scale-110 opacity-0 group-hover/arrow:opacity-100" />
                        {/* Icon */}
                        <ArrowUpRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover/arrow:text-neon-amber transition-all duration-300 group-hover/arrow:-translate-y-[1px] group-hover/arrow:translate-x-[1px]" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export { stripHtml, truncate };
