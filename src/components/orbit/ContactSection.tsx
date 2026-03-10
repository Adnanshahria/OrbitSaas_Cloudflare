import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Phone, ArrowRight, MessageCircle } from 'lucide-react';

export function ContactSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.contact;

  const whatsappLink = t?.whatsapp
    ? `https://wa.me/${t.whatsapp.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <section id="contact" className="section-dark relative overflow-hidden">
      {/* Orange gradient glow at bottom — like GCore's contact section */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.15) 0%, rgba(218,180,50,0.05) 40%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <span className="pill-badge pill-badge-accent">
              <Phone size={14} />
              Get In Touch
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading text-white"
          >
            {t?.title || 'Ready to Build Something Great?'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="section-subheading section-subheading-dark mx-auto mb-10"
          >
            {t?.subtitle || ''}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} />
              {t?.cta || 'Book a Free Consultation'}
            </a>
            <a
              href={`mailto:contact@orbitsaas.com`}
              className="btn-secondary btn-secondary-dark"
            >
              Send Email <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
