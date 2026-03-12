import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Star, Quote } from 'lucide-react';

export function ReviewsSection() {
    const { content } = useContent();
    const { lang } = useLang();
    const t = (content[lang] as any)?.reviews;
    const items = t?.items || [];

    return (
        <section id="reviews" className="section-light relative overflow-hidden min-h-[100dvh] flex flex-col justify-center">
            {/* Ambient glow */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.04) 0%, transparent 60%)',
                    filter: 'blur(80px)',
                }}
            />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex justify-center mb-4"
                    >
                        <span className="pill-badge pill-badge-accent">
                            <Star size={14} />
                            Testimonials
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="section-heading text-white"
                    >
                        {t?.title || 'Client Reviews'}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="section-subheading section-subheading-dark mx-auto"
                    >
                        {t?.subtitle || ''}
                    </motion.p>
                </div>

                {/* Reviews grid */}
                {items.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((review: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bento-card group cursor-pointer hover-border-glow"
                            >
                                <Quote size={24} className="mb-4 text-[var(--accent)] opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    "{review.text || review.review}"
                                </p>
                                <div className="flex items-center gap-3">
                                    {review.avatar && (
                                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[rgba(212,160,23,0.20)]">
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    {!review.avatar && (
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-[rgba(212,160,23,0.20)]"
                                            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))' }}
                                        >
                                            {review.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-semibold text-white">
                                            {review.name}
                                        </div>
                                        {review.role && (
                                            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                                {review.role}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Star rating */}
                                {review.rating && (
                                    <div className="flex gap-0.5 mt-3">
                                        {Array.from({ length: review.rating }, (_, si) => (
                                            <Star key={si} size={14} fill="var(--accent)" color="var(--accent)" />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-12"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Reviews coming soon...
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default ReviewsSection;
