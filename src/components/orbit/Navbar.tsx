import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState, useEffect, useCallback, useRef } from 'react';
import { scrollToPageFlipSection, SECTION_PAGE_MAP } from './PageCurlContainer';
import orbitLogo from '@/assets/orbit-logo.png';

const NAV_SECTIONS = [
  { href: '#hero', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#tech', label: 'Tech Stack' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#project', label: 'Projects' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#leadership', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

// Reverse mapping: page index → section id
const PAGE_TO_SECTION = Object.entries(SECTION_PAGE_MAP).reduce(
  (acc, [key, val]) => { acc[val] = key; return acc; },
  {} as Record<number, string>
);

export function Navbar() {
  const { content } = useContent();
  const { lang, toggleLang } = useLang();
  const t = content[lang] as any;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef<HTMLElement>(null);

  // Listen for page changes from PageFlipContainer
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.pageIndex === 'number') {
        const sectionId = PAGE_TO_SECTION[detail.pageIndex] || 'hero';
        setActiveSection(sectionId);
      }
    };
    window.addEventListener('pageflip:pagechange', handler);
    return () => window.removeEventListener('pageflip:pagechange', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    scrollToPageFlipSection(id);
  };

  const textColor = 'rgba(240,240,240,0.65)';
  const activeColor = '#F0F0F0';

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] navbar-transition"
        style={{
          width: 'min(92vw, 1100px)',
          background: 'rgba(6,6,6,0.82)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          borderRadius: '999px',
          border: '1px solid rgba(212,160,23,0.10)',
          padding: '10px 24px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-2"
          >
            <img
              src={orbitLogo}
              alt="Orbit"
              className="h-9 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="hidden sm:inline" style={{ fontFamily: '"Abril Fatface", serif', color: 'var(--accent-luminous)', fontSize: '1.4rem', letterSpacing: '1px' }}>ORBIT</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.filter(s => s.href !== '#hero').slice(0, 6).map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              // Use translated labels where available
              const label = (() => {
                switch (sectionId) {
                  case 'services': return t?.nav?.services || item.label;
                  case 'tech': return t?.nav?.techStack || item.label;
                  case 'why-us': return t?.nav?.whyUs || item.label;
                  case 'project': return t?.nav?.projects || item.label;
                  case 'leadership': return t?.nav?.leadership || item.label;
                  case 'contact': return t?.nav?.contact || item.label;
                  default: return item.label;
                }
              })();

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="relative px-3 py-1.5 rounded-full text-sm transition-all duration-300 cursor-pointer"
                  style={{
                    color: isActive ? activeColor : textColor,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {label}
                  {/* Active golden underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => toggleLang()}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                color: textColor,
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="hidden sm:inline-flex btn-primary !py-2 !px-5 !text-sm"
            >
              {t?.hero?.cta || 'Book a Call'}
            </a>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-1.5 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: '#F0F0F0' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center gap-6"
            style={{
              background: 'rgba(6,6,6,0.96)',
              backdropFilter: 'blur(30px)',
            }}
          >
            {NAV_SECTIONS.map((item, i) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-2xl font-medium transition-colors cursor-pointer"
                  style={{
                    color: isActive ? 'var(--accent-luminous)' : 'rgba(240,240,240,0.6)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {item.label}
                </motion.a>
              );
            })}
            <motion.a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_SECTIONS.length * 0.05 }}
              className="btn-primary mt-4 cursor-pointer"
            >
              {t?.hero?.cta || 'Book a Call'}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
