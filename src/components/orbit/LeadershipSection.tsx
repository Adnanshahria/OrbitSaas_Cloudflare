import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Users, Linkedin, Twitter, Mail } from 'lucide-react';

export function LeadershipSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.leadership;
  const members = t?.members || [];

  return (
    <section id="leadership" className="relative overflow-hidden min-h-[100dvh] flex flex-col justify-center bg-[#FAFAFA]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Radial Gradient */}
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-amber-100/30 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-emerald-100/20 rounded-full blur-[100px] translate-y-1/2" />
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] noise-overlay pointer-events-none" />
        
        {/* Subtle Line Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A017" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-amber-200 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 shadow-sm flex items-center gap-2">
              <Users size={12} className="text-amber-600" />
              {t?.pill || 'Our Leadership'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-normal tracking-tight text-[#1A1A1A] mb-6 mb-16"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            {t?.title || 'Meet Our Team'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-600/90 leading-relaxed font-medium"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {t?.subtitle || 'Bringing together decades of expertise in Cloudflare architectures, SaaS scalability, and high-conversion design.'}
          </motion.p>
        </div>

        {/* Members grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-amber-900/5 transition-all duration-500 hover:bg-white/60 hover:shadow-2xl hover:shadow-amber-900/5 hover:-translate-y-2"
              >
                {/* Rising Aura Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
                </div>

                {/* Avatar Container */}
                <div className="relative w-32 h-32 mb-8 z-10">
                  {/* Rotating Border */}
                  <div className="absolute -inset-2 rounded-full border border-dashed border-amber-500/0 group-hover:border-amber-500/40 group-hover:rotate-[30deg] transition-all duration-1000" />
                  
                  <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-xl transition-transform duration-500 group-hover:scale-105">
                    {member.image || member.avatar ? (
                      <img
                        src={member.image || member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-3xl"
                        style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
                      >
                        {member.name?.charAt(0) || 'M'}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl text-[#1A1A1A] mb-2 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  {member.name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700 font-bold mb-6">
                  {member.role || member.position}
                </p>

                {/* Social links - Premium Style */}
                <div className="flex justify-center gap-4 mt-auto">
                  {member.socials?.linkedin?.enabled && (
                    <a href={member.socials.linkedin.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                      <Linkedin size={16} />
                    </a>
                  )}
                  {member.socials?.twitter?.enabled && (
                    <a href={member.socials.twitter.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                      <Twitter size={16} />
                    </a>
                  )}
                  {member.socials?.email?.enabled && (
                    <a href={`mailto:${member.socials.email.url}`} className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                      <Mail size={16} />
                    </a>
                  )}
                  {!member.socials && (
                    <>
                      <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                        <Linkedin size={16} />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                        <Twitter size={16} />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300">
                        <Mail size={16} />
                      </a>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
             <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Architecting the future of SaaS...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default LeadershipSection;
