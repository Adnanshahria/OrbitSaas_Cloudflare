import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Star, Quote, Twitter, Instagram, Facebook, Linkedin, Mail, ArrowUpRight, Github, MessageCircle, Briefcase, Globe, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── WhatsApp Icon Component (Synced with Navbar) ──
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const SocialIcon = ({ type, url }: { type: string, url?: string }) => {
    const icons: Record<string, any> = {
        google: Mail,
        whatsapp: WhatsAppIcon,
        instagram: Instagram,
        facebook: Facebook,
        threads: AtSign,
        twitter: Twitter,
        fiverr: Briefcase,
        upwork: Globe,
        linkedin: Linkedin,
        github: Github
    };
    const Icon = icons[type.toLowerCase()] || Mail;
    if (type.toLowerCase() === 'whatsapp') {
        const pulseStyles = `
            @keyframes whatsappThemePulse-Review {
                0%, 100% {
                    color: #10B981;
                    border-color: rgba(16, 185, 129, 0.4);
                    background-color: rgba(16, 185, 129, 0.1);
                }
                50% {
                    color: #d4a017;
                    border-color: rgba(212, 160, 23, 0.4);
                    background-color: rgba(212, 160, 23, 0.1);
                }
            }
            .whatsapp-review-pulse { animation: whatsappThemePulse-Review 4s ease-in-out infinite; }
            .whatsapp-review-pulse:hover {
                 animation: NONE !important;
                 background-color: #10B981 !important;
                 border-color: #10B981 !important;
                 color: white !important;
            }
        `;
        
        return (
            <>
                <style>{pulseStyles}</style>
                {url ? (
                    <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 whatsapp-review-pulse`}
                    >
                        <WhatsAppIcon className="w-3 h-3 transition-transform group-hover:scale-110" />
                    </a>
                ) : (
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center whatsapp-review-pulse opacity-50`}>
                        <WhatsAppIcon className="w-3 h-3" />
                    </div>
                )}
            </>
        );
    }

    const commonClasses = "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300";
    
    if (url) {
        return (
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${commonClasses} bg-white/5 border-white/10 text-white/40 hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10`}
            >
                <Icon size={12} />
            </a>
        );
    }

    return (
        <div className={`${commonClasses} bg-white/[0.02] border-white/5 text-white/20`} title={`${type} (No link)`}>
            <Icon size={10} />
        </div>
    );
};

export function ReviewsSection() {
    const { content } = useContent();
    const { lang } = useLang();
    const reviewsData = (content[lang] as any)?.reviews || {};
    const reviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData.items || []);
    const showSocials = reviewsData.showSocials !== false;

    return (
        <section id="reviews" className="relative min-h-[100dvh] bg-[#0A0A0A] overflow-hidden py-32 flex flex-col justify-center">
            {/* High-End Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent-deep)] opacity-[0.03] blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="container relative z-10 px-8 mx-auto">
                {/* Header */}
                <div className="max-w-4xl mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="w-12 h-[1px] bg-[var(--accent)]/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)]">
                           {reviewsData?.badge || 'Voices of Trust'}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(3.5rem,8vw,8rem)] font-serif italic leading-[0.9] tracking-tighter text-white mb-10"
                    >
                        Masterpieces <br />
                        <span className="text-[var(--accent)] ml-[0.2em] relative inline-block">
                            of Collaboration
                            <motion.div 
                                className="absolute -bottom-2 left-0 h-[2px] bg-[var(--accent)]/30 w-full"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        </span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-white/50 max-w-2xl font-light leading-relaxed italic"
                    >
                        {reviewsData?.subtitle || "Hear from the visionaries we've partnered with to redefine digital excellence."}
                    </motion.p>
                </div>

                {/* Reviews Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                className="group relative"
                            >
                                <div className="h-full bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 p-10 flex flex-col transition-all duration-700 hover:bg-white/[0.05] hover:border-[var(--accent)]/30 hover:translate-y-[-8px] shadow-2xl relative overflow-hidden">
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-8">
                                            <Quote size={40} className="text-[var(--accent)] opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                                            
                                            {/* Project Badge */}
                                            {review.badgeName && (
                                                <div className="px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                                                        {review.badgeName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-lg text-white/80 leading-relaxed mb-10 font-light whitespace-pre-wrap">
                                            "{review.text || review.review}"
                                        </p>

                                        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        {review.avatar ? (
                                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)]/20 group-hover:border-[var(--accent)]/50 transition-colors duration-500">
                                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-deep)] flex items-center justify-center text-white font-bold text-lg border-2 border-white/10">
                                                                {review.name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-white/10 group-hover:border-[var(--accent)]/50 transition-colors shadow-lg">
                                                            {(() => {
                                                                const firstSocial = review.social ? Object.entries(review.social).find(([_, val]) => {
                                                                    const v = val as any;
                                                                    return typeof v === 'string' ? !!v : v?.enabled !== false;
                                                                }) : null;
                                                                
                                                                if (firstSocial) {
                                                                    const [type, val] = firstSocial as [string, any];
                                                                    const icons: Record<string, any> = {
                                                                        google: Mail, whatsapp: WhatsAppIcon, instagram: Instagram, 
                                                                        facebook: Facebook, threads: AtSign, twitter: Twitter, 
                                                                        fiverr: Briefcase, upwork: Globe, linkedin: Linkedin, github: Github
                                                                    };
                                                                    const Icon = icons[type.toLowerCase()] || Star;
                                                                    return <Icon size={10} className="text-[var(--accent)]" />;
                                                                }
                                                                return <Star size={10} fill="var(--accent)" color="var(--accent)" />;
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-white group-hover:text-[var(--accent)] transition-colors duration-500">
                                                            {review.name}
                                                        </div>
                                                        <div className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                                                            {review.role}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Social Links */}
                                                {showSocials && review.social && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(review.social).map(([type, val]: [string, any]) => {
                                                            const url = typeof val === 'string' ? val : val?.url;
                                                            const enabled = typeof val === 'string' ? true : val?.enabled !== false;
                                                            return enabled && <SocialIcon key={type} type={type} url={url} />;
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stars and Project Link */}
                                            <div className="flex items-center justify-between pointer-events-none">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: review.rating || 5 }, (_, si) => (
                                                        <Star key={si} size={14} fill="var(--accent)" color="var(--accent)" className="drop-shadow-[0_0_8px_var(--accent)]" />
                                                    ))}
                                                </div>
                                                {review.projectId && (
                                                    <Link to={`/project/${review.projectId}`} className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0 cursor-pointer pointer-events-auto">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Deep Dive</span>
                                                        <ArrowUpRight size={14} className="text-[var(--accent)]" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Interactive Aura */}
                                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--accent)] opacity-0 group-hover:opacity-[0.05] blur-[60px] rounded-full transition-opacity duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {reviews.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 border-t border-white/5 mt-20"
                    >
                        <span className="text-6xl font-serif italic text-white/10 tracking-tighter">Echoes Pending</span>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mt-8">Establishing transmission...</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default ReviewsSection;
