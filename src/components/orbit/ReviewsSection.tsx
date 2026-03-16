import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Star, Quote, Twitter, Instagram, Facebook, Linkedin, Mail, ArrowUpRight, Github, MessageCircle, Briefcase, Globe, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NextSectionButton } from './NextSectionButton';

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
            @keyframes whatsappThemePulse-Review-Light {
                0%, 100% {
                    color: #22C55E;
                    border-color: rgba(34, 197, 94, 0.4);
                    background-color: rgba(34, 197, 94, 0.05);
                }
                50% {
                    color: #FACC15;
                    border-color: rgba(250, 204, 21, 0.4);
                    background-color: rgba(250, 204, 21, 0.05);
                }
            }
            .whatsapp-review-pulse-light { animation: whatsappThemePulse-Review-Light 4s ease-in-out infinite; }
            .whatsapp-review-pulse-light:hover {
                 animation: NONE !important;
                 background-color: #22C55E !important;
                 border-color: #22C55E !important;
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
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 whatsapp-review-pulse-light`}
                    >
                        <WhatsAppIcon className="w-3 h-3 transition-transform group-hover:scale-110" />
                    </a>
                ) : (
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center whatsapp-review-pulse-light opacity-50`}>
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
                className={`${commonClasses} bg-gray-50 border-gray-100 text-gray-400 hover:text-white hover:border-[#22C55E] hover:bg-[#22C55E]`}
            >
                <Icon size={12} />
            </a>
        );
    }

    return (
        <div className={`${commonClasses} bg-gray-50/50 border-gray-100 text-gray-300`} title={`${type} (No link)`}>
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
        <section id="reviews" className="relative min-h-[100dvh] bg-[#FDFBF7] overflow-hidden py-16 sm:py-24 flex flex-col justify-center">
            {/* High-End Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#22C55E]/[0.03] blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FACC15]/[0.03] blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] mix-blend-overlay" />
            </div>

            <div className="container relative z-10 px-5 sm:px-8 mx-auto">
                {/* Header - Consistent with ProjectsSection */}
                <div className="mb-10 sm:mb-14">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="w-10 h-[2px] bg-[#22C55E]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#22C55E]">
                           {reviewsData?.badge || 'Voices of Trust'}
                        </span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-gray-900"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Masterpieces <br />
                            <span className="text-gray-300 ml-[0.2em] relative inline-block">
                                of Collaboration
                                <motion.div 
                                    className="absolute -bottom-2 left-0 h-[2px] bg-[#22C55E]/30 w-full"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </span>
                        </motion.h2>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-md text-gray-500 text-base leading-relaxed mb-1"
                        >
                            {reviewsData?.subtitle || "Hear from the visionaries we've partnered with to redefine digital excellence."}
                        </motion.p>
                    </div>
                </div>

                {/* Reviews Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {reviews.map((review: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                className="group relative h-full"
                            >
                                <div className="h-full bg-white backdrop-blur-3xl rounded-2xl border border-[#22C55E]/20 p-8 flex flex-col transition-all duration-700 hover:border-[#FACC15]/60 hover:translate-y-[-8px] shadow-sm hover:shadow-xl relative overflow-hidden">
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <Quote size={32} className="text-[#22C55E] opacity-10 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out" />
                                            
                                            {/* Project Badge */}
                                            {review.badgeName && (
                                                <div className="px-2.5 py-1 rounded-full bg-[#22C55E]/5 border border-[#22C55E]/10">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22C55E]">
                                                        {review.badgeName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-[15px] leading-relaxed mb-8 font-light italic whitespace-pre-wrap">
                                            "{review.text || review.review}"
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        {review.avatar ? (
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#22C55E]/20 group-hover:border-[#FACC15]/50 transition-colors duration-500">
                                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#166534] flex items-center justify-center text-white font-bold text-sm">
                                                                {review.name?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-100 group-hover:border-[#FACC15]/50 transition-colors shadow-sm">
                                                            {(() => {
                                                                const firstSocial = review.social ? Object.entries(review.social).find(([_, val]) => {
                                                                    const v = val as any;
                                                                    return typeof v === 'string' ? !!v : v?.enabled !== false;
                                                                }) : null;
                                                                
                                                                if (firstSocial) {
                                                                    const [type] = firstSocial as [string, any];
                                                                    const icons: Record<string, any> = {
                                                                        google: Mail, whatsapp: WhatsAppIcon, instagram: Instagram, 
                                                                        facebook: Facebook, threads: AtSign, twitter: Twitter, 
                                                                        fiverr: Briefcase, upwork: Globe, linkedin: Linkedin, github: Github
                                                                    };
                                                                    const Icon = icons[type.toLowerCase()] || Star;
                                                                    return <Icon size={8} className="text-[#22C55E]" />;
                                                                }
                                                                return <Star size={8} fill="#22C55E" color="#22C55E" />;
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-bold text-gray-900 group-hover:text-[#22C55E] transition-colors duration-500">
                                                            {review.name}
                                                        </div>
                                                        <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                                            {review.role}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Social Links */}
                                                {showSocials && review.social && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {Object.entries(review.social).map(([type, val]: [string, any]) => {
                                                            const url = typeof val === 'string' ? val : val?.url;
                                                            const enabled = typeof val === 'string' ? true : val?.enabled !== false;
                                                            return enabled && <SocialIcon key={type} type={type} url={url} />;
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stars and Project Link */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: review.rating || 5 }, (_, si) => (
                                                        <Star key={si} size={12} fill="#FACC15" color="#FACC15" className="opacity-80" />
                                                    ))}
                                                </div>
                                                {review.projectId && (
                                                    <Link to={`/project/${review.projectId}`} className="flex items-center gap-1.5 group/link">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover/link:text-[#22C55E] transition-colors">Deep Dive</span>
                                                        <ArrowUpRight size={12} className="text-gray-300 group-hover/link:text-[#22C55E] transition-colors" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Interactive Aura */}
                                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#FACC15]/[0.05] opacity-0 group-hover:opacity-100 blur-[60px] rounded-full transition-opacity duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
                
                <NextSectionButton nextRoute="/leadership" variant="light" />
            </div>
        </section>
    );
}

export default ReviewsSection;
