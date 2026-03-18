import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { ArrowRight, Mail, MapPin, ExternalLink, Globe2, Facebook, Instagram, Linkedin, Send, Twitter, Youtube, Github, MessageCircle } from 'lucide-react';

const RichText = ({ text }: { text: string }) => (
  <span dangerouslySetInnerHTML={{ __html: text }} />
);

// ── Interactive Background Canvas ──
const ContactBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Skip entirely on mobile — hover-only particle network effect
  const [isMobile] = React.useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768)
  );

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const numParticles = 40;
    const connectionDistance = 150;

    // Pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

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
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

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
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

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

// ── Social icons map ──
const socialIconComponents: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  whatsapp: WhatsAppIcon,
};

// ── Contact Card Component ──
const ContactCard = ({ icon: Icon, title, value, href, delay }: { icon: any, title: string, value: string, href?: string, delay: number }) => {
  const CardWrapper = href ? 'a' : 'div';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <CardWrapper 
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="group relative flex items-center gap-3 p-3.5 rounded-xl bg-[#0a0a0a]/40 border border-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.05] hover:border-primary/30 block"
      >
        <div className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#1c1a15] to-[#0a0a0a] border border-[#2a2618] text-primary group-hover:text-primary-foreground group-hover:bg-primary transition-all">
          <Icon size={16} />
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{title}</span>
          <span className="text-sm text-white/90 font-medium group-hover:text-primary transition-colors truncate">
            {value}
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
          
          {/* Center Column: Copy & CTAs */}
          <div className="lg:col-span-8 lg:col-start-3 flex flex-col items-center text-center">
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
              className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-2xl px-4"
            >
              {t?.subtitle || 'Join the elite businesses scaling with our high-performance AI & web ecosystems.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center gap-3 overflow-hidden group shadow-xl shadow-primary/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <WhatsAppIcon size={24} className="animate-pulse" />
                <span>{t?.cta || 'Book a Free Consultation'}</span>
              </motion.a>
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
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6 flex items-center justify-center gap-4">
                  <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/30" />
                  Connect With Us
                  <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/30" />
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {activeSocials.map((social: any, idx: number) => {
                    const IconComponent = socialIconComponents[social.platform];
                    return (
                      <motion.a 
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                        className="w-12 h-12 rounded-full border border-white/5 bg-white/5 text-white/50 flex items-center justify-center transition-all group"
                        title={social.platform}
                      >
                        {IconComponent ? <IconComponent size={20} className="group-hover:text-primary transition-colors" /> : <ExternalLink size={18} />}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Cards: Secondary Contact Info */}
          <div className="lg:col-span-10 lg:col-start-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
            <ContactCard 
              icon={Mail} 
              title="Email Us" 
              value="contact@orbitsaas.com" 
              href="mailto:contact@orbitsaas.com"
              delay={0.4} 
            />
            {whatsappNumber && (
              <ContactCard 
                icon={WhatsAppIcon} 
                title="WhatsApp / Phone" 
                value={whatsappNumber} 
                href={whatsappLink}
                delay={0.5} 
              />
            )}
            <ContactCard 
              icon={MapPin} 
              title="Global HQ" 
              value="Rajshahi, Bangladesh" 
              href="https://www.google.com/maps/search/?api=1&query=24.36545054786298,88.62639818383883"
              delay={0.6} 
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
