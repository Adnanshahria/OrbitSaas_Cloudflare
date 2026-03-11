import { motion } from 'framer-motion';
import { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Cpu } from 'lucide-react';

export function TechStackSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.techStack;
  const categories = t?.categories || [];
  const [activeCategory, setActiveCategory] = useState(0);

  if (!categories.length) return null;

  return (
    <section id="tech" className="section-light relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,160,23,0.04) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <span className="pill-badge pill-badge-dark">
              <Cpu size={14} />
              {t?.subtitle || 'Technologies We Power Your Vision With'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading text-white"
          >
            {t?.title || 'Our Expertise'}
          </motion.h2>
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
              style={{
                background: activeCategory === i
                  ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))'
                  : 'rgba(255,255,255,0.04)',
                color: activeCategory === i ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === i ? 'rgba(212,160,23,0.4)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: activeCategory === i ? '0 4px 20px rgba(212,160,23,0.2)' : 'none',
              }}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Tech items grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {(categories[activeCategory]?.items || []).map((item: string, i: number) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bento-card !p-4 !rounded-xl text-center cursor-pointer hover-border-glow"
              style={{ minWidth: '120px' }}
            >
              <span className="text-sm font-medium text-white/80">
                {item}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TechStackSection;
