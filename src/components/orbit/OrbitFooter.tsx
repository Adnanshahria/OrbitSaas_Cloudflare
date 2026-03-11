import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Facebook, Instagram, Linkedin, Send, Twitter, Youtube, Github, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    { label: nav?.services || 'Services', href: '/#services' },
    { label: nav?.techStack || 'Tech Stack', href: '/#tech' },
    { label: nav?.whyUs || 'Why Us', href: '/#why-us' },
    { label: nav?.projects || 'Projects', href: '/#project' },
    { label: nav?.leadership || 'Team', href: '/#leadership' },
    { label: nav?.contact || 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="section-dark" style={{ borderTop: '1px solid rgba(212,160,23,0.08)' }}>
      <div className="section-container !py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))' }}
              >
                O
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{t?.brandName || 'ORBIT SaaS'}</span>
            </div>
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
            <h4 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Navigation</h4>
            <ul className="space-y-2">
              {footerNavLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--accent-luminous)] cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>{links?.title || 'Links'}</h4>
            <ul className="space-y-2">
              {(links?.items || []).map((link: any, i: number) => (
                <li key={i}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors hover:text-[var(--accent-luminous)] cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy"
                  className="text-sm transition-colors hover:text-[var(--accent-luminous)] cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm transition-colors hover:text-[var(--accent-luminous)] cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Stay Updated</h4>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Subscribe to discover the latest updates, news, and features.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-all focus:ring-2 focus:ring-[rgba(212,160,23,0.30)] focus:border-[rgba(212,160,23,0.25)]"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                }}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(212,160,23,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                  color: '#fff',
                }}
              >
                <ArrowRight size={16} />
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
