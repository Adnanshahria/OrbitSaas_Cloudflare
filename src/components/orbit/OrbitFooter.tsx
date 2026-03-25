import { motion } from 'framer-motion';
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

export function OrbitFooter() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.footer;
  const links = (content[lang] as any)?.links;
  const services = (content[lang] as any)?.services;
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
        body: JSON.stringify({ email, source: 'footer_newsletter' }),
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
    { label: nav?.services || 'Services', href: '/services' },
    { label: nav?.techStack || 'Tech Stack', href: '/techstack' },
    { label: nav?.whyUs || 'Why Us', href: '/why-us' },
    { label: nav?.projects || 'Projects', href: '/proj' },
    { label: nav?.leadership || 'Team', href: '/leadership' },
    { label: nav?.contact || 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#060608]" style={{ borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}>
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] opacity-10" />
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <div className="section-container relative z-10 !py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <img
                  src={orbitLogo}
                  alt="Orbit"
                  className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
                {t?.brandName || 'Orbit'}
              </span>
            </Link>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {t?.tagline || 'Full-Service Software & AI Agency'}
            </p>

            {/* Social icons — proper SVGs */}
            {activeSocials.length > 0 && (
              <div className="flex gap-2">
                {activeSocials.map((social: any, i: number) => {
                  const IconComponent = socialIconComponents[social.platform];
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:border-[rgba(212,160,23,0.30)] hover:bg-[rgba(212,160,23,0.08)]"
                      style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-secondary)',
                      }}
                      title={social.platform}
                    >
                      {IconComponent ? <IconComponent size={14} /> : <span className="text-xs">{social.platform.charAt(0).toUpperCase()}</span>}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerNavLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-white/50 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important links */}
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">{links?.title || 'Links'}</h4>
            <ul className="space-y-3">
              {(links?.items || []).map((link: any, i: number) => (
                <li key={i}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white/50 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy"
                  className="text-sm font-medium text-white/50 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm font-medium text-white/50 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Stay Updated</h4>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Subscribe to discover the latest updates, news, and features.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-2xl text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50 transition-all pr-14"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-2 bottom-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid rgba(212,160,23,0.08)',
            color: 'var(--text-tertiary)',
          }}
        >
          <address
            itemScope
            itemType="https://schema.org/LocalBusiness"
            className="not-italic text-inherit flex flex-wrap items-center gap-x-2 gap-y-1"
            style={{ fontStyle: 'normal' }}
          >
            <span itemProp="name">ORBIT SaaS</span>
            <span className="hidden md:inline">·</span>
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="addressLocality">Rajshahi</span>,{' '}
              <span itemProp="addressCountry">Bangladesh</span>
            </span>
            <span className="hidden md:inline">·</span>
            <a itemProp="telephone" href="tel:+8801853452264" className="hover:text-[var(--accent-luminous)] transition-colors">+880 1853-452264</a>
            <span className="hidden md:inline">·</span>
            <a itemProp="url" href="https://orbitsaas.cloud" className="hover:text-[var(--accent-luminous)] transition-colors">orbitsaas.cloud</a>
          </address>
          <span>{t?.rights || '© 2025 ORBIT SaaS. All rights reserved.'}</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[var(--accent-luminous)] transition-colors cursor-pointer">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[var(--accent-luminous)] transition-colors cursor-pointer">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default OrbitFooter;
