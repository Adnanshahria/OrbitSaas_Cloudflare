import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Shield, Brain, Zap, Rocket, ShieldCheck } from 'lucide-react';

const ICONS = [Brain, Zap, Rocket, ShieldCheck];

export function WhyUsSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.whyUs;
  const items = t?.items || [];

  if (!items.length) return null;

  return (
    <section id="why-us" className="section-light relative overflow-visible min-h-[100dvh] flex flex-col justify-center">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.05) 0%, transparent 60%)',
          filter: 'blur(60px)',
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
            <span className="pill-badge pill-badge-dark">
              <Shield size={14} />
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading text-white"
          >
            {t?.title || 'Why Choose ORBIT?'}
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

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item: any, i: number) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bento-card flex gap-4 group cursor-pointer hover-border-glow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'rgba(212,160,23,0.10)',
                    border: '1px solid rgba(212,160,23,0.15)',
                  }}
                >
                  <Icon size={22} className="text-[var(--accent-luminous)]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;
