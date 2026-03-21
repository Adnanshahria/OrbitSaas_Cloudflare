import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Facebook, Instagram, Linkedin, Send, Twitter, Youtube, Github, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import orbitLogo from '@/assets/orbit-logo.png';

// Social icons map using Lucide components
const socialIconComponents: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  whatsapp: MessageCircle,
};

export function MobileFooter() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.footer;
  const links = (content[lang] as any)?.links;
  const nav = (content[lang] as any)?.nav;

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_newsletter_mobile' }),
      });
      if (res.ok) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error('Failed to subscribe');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSocials = (t?.socials || []).filter((s: any) => s.enabled && s.url);

  const footerNavLinks = [
    { label: nav?.services || 'Services', href: '/#services' },
    { label: nav?.techStack || 'Tech Stack', href: '/#tech' },
    { label: nav?.projects || 'Projects', href: '/#project' },
    { label: nav?.leadership || 'Team', href: '/#leadership' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#060608] pb-8 pt-12" style={{ borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}>
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-emerald-600/5 rounded-full blur-[80px] opacity-10" />
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <div className="px-6 relative z-10 flex flex-col gap-10">
        
        {/* 1. Brand & Tagline */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="relative">
              <img
                src={orbitLogo}
                alt="Orbit"
                className="w-12 h-12 object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
              {t?.brandName || 'Orbit'}
            </span>
          </Link>
          <p className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
            {t?.tagline || 'Full-Service Software & AI Agency'}
          </p>
        </div>

        {/* 2. Newsletter */}
        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl backdrop-blur-md">
          <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">Stay Updated</h4>
          <p className="text-xs text-white/50 mb-4 leading-relaxed">
            Subscribe to discover the latest updates, news, and features.
          </p>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-3.5 rounded-xl text-sm bg-black/40 border border-white/10 text-white outline-none focus:border-primary/50 transition-all pr-12"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 rounded-lg flex items-center justify-center transition-all bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* 3. Navigation & Links Grid */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerNavLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-[13px] font-medium text-white/50 transition-colors hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">{links?.title || 'Links'}</h4>
            <ul className="space-y-3">
              {(links?.items || []).map((link: any, i: number) => (
                <li key={i}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-white/50 transition-colors hover:text-primary">
                    {link.title}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacy" className="text-[13px] font-medium text-white/50 transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[13px] font-medium text-white/50 transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Social Icons */}
        {activeSocials.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {activeSocials.map((social: any, i: number) => {
              const IconComponent = socialIconComponents[social.platform];
              return (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-secondary)',
                  }}
                  title={social.platform}
                >
                  {IconComponent ? <IconComponent size={16} /> : <span className="text-xs">{social.platform.charAt(0).toUpperCase()}</span>}
                </a>
              );
            })}
          </div>
        )}

        {/* 5. Copyright & NAP */}
        <div className="pt-6 mt-2 flex flex-col items-center gap-3 text-[11px] text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-tertiary)' }}>
          <address
            itemScope
            itemType="https://schema.org/LocalBusiness"
            className="not-italic text-inherit flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
            style={{ fontStyle: 'normal' }}
          >
            <span itemProp="name">ORBIT SaaS</span>
            <span>·</span>
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="addressLocality">Rajshahi</span>,{' '}
              <span itemProp="addressCountry">Bangladesh</span>
            </span>
            <span>·</span>
            <a itemProp="telephone" href="tel:+8801853452264" className="hover:text-primary transition-colors">+880 1853-452264</a>
          </address>
          <span>{t?.rights || '© 2025 ORBIT SaaS. All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  );
}

export default MobileFooter;
