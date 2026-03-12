import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';

export function LeadershipSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.leadership;
  const members = t?.members || [];

  return (
    <section id="leadership" className="section-dark min-h-[100dvh] flex flex-col justify-center">
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
            <span className="pill-badge pill-badge-dark">
              <Users size={14} />
              Team
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading text-white"
          >
            {t?.title || 'Meet Our Team'}
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

        {/* Members grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bento-card text-center group cursor-pointer hover-border-glow"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-[rgba(212,160,23,0.20)] group-hover:ring-[rgba(212,160,23,0.40)] transition-all duration-300">
                  {member.image || member.avatar ? (
                    <img
                      src={member.image || member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))' }}
                    >
                      {member.name?.charAt(0) || 'M'}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{member.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {member.role || member.position}
                </p>

                {/* Social links */}
                {member.socials && (
                  <div className="flex justify-center gap-2 mt-3">
                    {Object.entries(member.socials).map(([platform, url]: any) =>
                      url ? (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded-full transition-colors"
                          style={{
                            color: 'var(--text-tertiary)',
                            border: '1px solid var(--card-border)',
                          }}
                        >
                          {platform}
                        </a>
                      ) : null
                    )}
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
            Team info coming soon...
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default LeadershipSection;
