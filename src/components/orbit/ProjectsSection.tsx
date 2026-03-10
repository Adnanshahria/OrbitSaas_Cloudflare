import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProjectsSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.projects;
  const items = t?.items || [];

  return (
    <section id="project" className="section-dark">
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
              <FolderOpen size={14} />
              Portfolio
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-heading text-white"
          >
            {t?.title || 'Featured Projects'}
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

        {/* Projects grid */}
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((project: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={`/project/${project.id || i}`}
                  className="block bento-card group overflow-hidden"
                >
                  {/* Image */}
                  {project.image && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 -mx-2 -mt-2">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag: string, ti: number) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: 'var(--accent-light)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(212,160,23,0.15)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {project.desc?.substring(0, 100)}...
                  </p>

                  <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
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
            Projects coming soon...
          </motion.div>
        )}

        {/* View All */}
        {items.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/project" className="btn-secondary btn-secondary-dark">
              View All Projects <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;
