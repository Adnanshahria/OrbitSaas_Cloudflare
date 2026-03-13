import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { ArrowRight, Mail, MapPin, ExternalLink, Globe2 } from 'lucide-react';

const RichText = ({ text }: { text: string }) => (
  <span dangerouslySetInnerHTML={{ __html: text }} />
);

// ── Interactive Background Canvas ──
const ContactBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const numParticles = 40;
    const connectionDistance = 150;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interaction with mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${dist < 100 ? 0.8 : 0.3})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(212, 160, 23, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-40 z-0 mix-blend-screen"
    />
  );
};


// ── WhatsApp Icon Component ──
const WhatsAppIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Contact Card Component ──
const ContactCard = ({ icon: Icon, title, value, href, delay }: { icon: any, title: string, value: string, href?: string, delay: number }) => {
  const CardWrapper = href ? 'a' : 'div';
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <CardWrapper 
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="group relative flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0a]/40 border border-[rgba(255,255,255,0.05)] backdrop-blur-md overflow-hidden transition-all hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(212,160,23,0.3)] hover:-translate-y-1 block"
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(212,160,23,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#1c1a15] to-[#0a0a0a] border border-[#2a2618] text-[var(--accent)] group-hover:text-[var(--accent-luminous)] group-hover:shadow-[0_0_20px_rgba(212,160,23,0.2)] transition-all">
          <Icon size={20} />
          {/* subtle icon ping */}
          <div className="absolute inset-0 rounded-xl border border-[var(--accent)] opacity-0 group-hover:animate-ping-slow pointer-events-none" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">{title}</span>
          <span className="text-base text-white font-medium group-hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2">
            {value}
            {href && <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
          </span>
        </div>
      </CardWrapper>
    </motion.div>
  );
};


export function ContactSection() {
  const { content } = useContent();
  const { lang } = useLang();
  
  const t = (content[lang] as any)?.contact;
  const socials = (content[lang] as any)?.footer?.socials || [];
  const activeSocials = socials.filter((s: any) => s.enabled && s.url);

  const whatsappNumber = t?.whatsapp || '+8801853452264';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <section id="contact" className="section-dark relative min-h-[100dvh] flex items-center py-20 lg:py-32 overflow-hidden bg-[#050505]">
      
      {/* ── Background Effects ── */}
      <ContactBackground />
      
      {/* Radial Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,160,23,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_90%,rgba(212,160,23,0.05)_0%,transparent_40%)] pointer-events-none" />
      
      <div className="section-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <span className="pill-badge pill-badge-accent shadow-[0_0_20px_rgba(212,160,23,0.15)] flex items-center gap-2">
                <Globe2 size={14} className="text-[var(--accent)] animate-spin-slow" />
                {t?.badge || 'Launch your vision'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6"
            >
              <RichText text={t?.title || 'Ready to put your idea into ORBIT?'} />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-lg border-l-2 border-[var(--accent)]/30 pl-5"
            >
              {t?.subtitle || 'Join the elite businesses scaling with our high-performance AI & web ecosystems.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <WhatsAppIcon size={18} className="animate-pulse" />
                {t?.cta || 'Schedule Strategy Call'}
              </a>
              <a
                href={`mailto:contact@orbitsaas.com`}
                className="btn-secondary btn-secondary-dark flex items-center gap-2 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
              >
                <Mail size={16} />
                {t?.secondaryCta || 'Direct Inquiry'}
              </a>
            </motion.div>

            {/* Social Links Matrix */}
            {activeSocials.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-12 w-full max-w-md"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold mb-4 flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[var(--accent)]" />
                  Connect With Us
                  <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[var(--accent)]" />
                </p>
                <div className="flex flex-wrap gap-3">
                  {activeSocials.map((social: any, idx: number) => (
                    <a 
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-white/70 text-sm hover:text-[var(--accent)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 transition-all flex items-center gap-2 group"
                    >
                      <span className="capitalize">{social.platform}</span>
                      <ExternalLink size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-4 mt-8 lg:mt-0 relative">
            {/* Visual anchor point */}
            <div className="absolute -left-6 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent hidden lg:block" />
            
            <ContactCard 
              icon={Mail} 
              title="Email Us" 
              value="contact@orbitsaas.com" 
              href="mailto:contact@orbitsaas.com"
              delay={0.2} 
            />
            {whatsappNumber && (
              <ContactCard 
                icon={WhatsAppIcon} 
                title="WhatsApp / Phone" 
                value={whatsappNumber} 
                href={whatsappLink}
                delay={0.3} 
              />
            )}
            <ContactCard 
              icon={MapPin} 
              title="Global HQ" 
              value="Remote First, Operating Globally" 
              delay={0.4} 
            />
            
            {/* Decorative Tech Element */}
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1, delay: 0.6 }}
               className="mt-6 p-5 rounded-2xl bg-[rgba(212,160,23,0.02)] border border-[rgba(212,160,23,0.1)] flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--accent)] opacity-80">System Status</span>
                <span className="text-xs text-[var(--text-secondary)]">All systems operational. Ready to deploy.</span>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
