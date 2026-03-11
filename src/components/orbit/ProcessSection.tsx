import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

export function ProcessSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.process;

  return (
    <section id="process" className="section-dark relative overflow-hidden">
      <div className="section-container flex flex-col items-center justify-center min-h-[60vh]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-4"
        >
          <span className="pill-badge pill-badge-accent">
            <Sparkles size={14} />
            {t?.subtitle || 'Our Process'}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="section-heading text-white text-center"
        >
          {t?.title || 'How We Work'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-6"
          style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}
        >
          Coming soon — a complete redesign of our process flow.
        </motion.p>
      </div>
    </section>
  );
}

export default ProcessSection;
