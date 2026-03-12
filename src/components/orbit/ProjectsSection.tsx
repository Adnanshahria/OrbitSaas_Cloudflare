import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { FolderOpen, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProjectsSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.projects;
  const items = t?.items || [];

  return (
    <section id="project" className="section-light relative overflow-visible flex flex-col min-h-[100dvh] pt-20 pb-12 sm:pt-24 sm:pb-16 z-20 bg-white">
      {/* Immersive Light Background Aesthetics */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/[0.04] rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--accent)]/[0.02] rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-multiply pointer-events-none" />

      <div className="section-container relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] backdrop-blur-md mb-6 shadow-[0_4_20px_rgba(0,0,0,0.02)] hover:bg-black/[0.05] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/70">Our Portfolio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display text-[#0a0a0b] mb-5 leading-[1.1] tracking-tight max-w-4xl"
          >
            {t?.title || 'Crafted With Precision'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-lg text-black/50 max-w-2xl font-light"
          >
            {t?.subtitle || 'Explore our featured projects where cutting-edge technology meets pristine aesthetic design.'}
          </motion.p>
        </div>

        {/* Projects Layout Grid */}
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-10">
            {items.map((project: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Link
                  to={`/project/${project.id || i}`}
                  className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-black/[0.04] hover:border-[var(--accent)]/30 transition-all duration-500 will-change-transform shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  {/* Active Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                  
                  {/* Project Image */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#f4f4f5] z-10 w-full shrink-0 border-b border-black/[0.03]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[0.25,1,0.5,1] group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/[0.02]">
                        <FolderOpen className="w-10 h-10 text-black/10 transition-transform group-hover:scale-110 duration-500" />
                      </div>
                    )}
                    
                    {/* Inner Shadow overlay */}
                    <div className="absolute inset-0 border border-black/[0.04] rounded-t-3xl pointer-events-none" />
                  </div>

                  {/* Project Content */}
                  <div className="relative z-20 p-6 sm:p-8 flex flex-col grow bg-white">
                    {/* Tags */}
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag: string, ti: number) => (
                          <span
                            key={ti}
                            className="px-2.5 py-1 rounded-full border border-black/[0.06] bg-black/[0.02] text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-black/60 transition-colors group-hover:border-[var(--accent)]/30 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/[0.02]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-display text-[#0a0a0b] mb-3 tracking-tight transition-colors group-hover:text-[var(--accent)]">
                      {project.title}
                    </h3>

                    <p className="text-sm text-black/50 leading-relaxed mb-6 line-clamp-2 font-medium">
                      {project.desc?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                    </p>

                    {/* Footer Row */}
                    <div className="mt-auto pt-5 border-t border-black/[0.04] flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-black/40 group-hover:text-black/80 transition-colors duration-300">
                        View Case Study
                      </span>
                      
                      <div className="w-9 h-9 rounded-full bg-black/[0.03] border border-black/[0.05] flex items-center justify-center group-hover:bg-[#0a0a0b] group-hover:border-[#0a0a0b] transition-all duration-500 transform group-hover:rotate-45">
                        <ArrowUpRight className="w-4 h-4 text-black/50 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-black/[0.05] bg-black/[0.01]"
          >
            <FolderOpen className="w-12 h-12 text-black/20 mb-4" />
            <p className="text-black/50 font-medium">Extraordinary projects coming soon.</p>
          </motion.div>
        )}

        {/* View All Button - ALWAYS VISIBLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link 
            to="/project" 
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0a0a0b] text-white font-bold text-sm tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]/50"
          >
            <span className="relative z-10 transition-colors group-hover:text-[var(--accent)]">Explore Entire Portfolio</span>
            <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-[var(--accent)] transition-colors duration-300" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
