import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Shield, CheckCircle } from 'lucide-react';

export function WhyUsSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.whyUs;
  const items = t?.items || [];

  if (!items.length) return null;

  const icons = ['🧠', '⚡', '🚀', '🛡️'];

  return (
    <section id="why-us" className="section-light">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <span className="pill-badge pill-badge-light">
              <Shield size={14} />
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading"
            style={{ color: 'var(--text-dark)' }}
          >
            {t?.title || 'Why Choose ORBIT?'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="section-subheading section-subheading-light mx-auto"
          >
            {t?.subtitle || ''}
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-light flex gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: `${item.color}12`,
                }}
              >
                {icons[i] || '✨'}
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-dark-secondary)' }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;
