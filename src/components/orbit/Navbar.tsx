import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState, useEffect, useCallback, useRef } from 'react';
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

export function Navbar() {
  const { content } = useContent();
  const { lang, toggleLang } = useLang();
  const t = content[lang] as any;

  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef<HTMLElement>(null);

  // Detect current section and whether it's light or dark
  const detectSection = useCallback(() => {
    const lightSections = ['services', 'tech', 'why-us', 'reviews'];
    const sections = NAV_SECTIONS.map(s => s.href.replace('#', ''));
    const navH = 80;

    let current = 'hero';
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navH + 50) current = id;
      }
    }

    setActiveSection(current);
    setIsLightSection(lightSections.includes(current));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      detectSection();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [detectSection]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace('#', '');
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isDark = !isLightSection;
  const navBg = !scrolled
    ? 'transparent'
    : isDark
      ? 'var(--navbar-dark-bg)'
      : 'var(--navbar-light-bg)';
  const navBorder = !scrolled
    ? 'transparent'
    : isDark
      ? 'var(--navbar-border-dark)'
      : 'var(--navbar-border-light)';
  const textColor = isDark ? 'rgba(255,255,255,0.8)' : '#374151';
  const activeColor = isDark ? '#ffffff' : '#111111';

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] navbar-transition"
        style={{
          width: 'min(92vw, 1100px)',
          background: navBg,
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          borderRadius: '999px',
          border: `1px solid ${navBorder}`,
          padding: '10px 24px',
          boxShadow: scrolled ? (isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)') : 'none',
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
            <span className="hidden sm:inline" style={{ fontFamily: '"Abril Fatface", serif', color: '#EAB308', fontSize: '1.4rem', letterSpacing: '1px' }}>ORBIT</span>
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
                  className="px-3 py-1.5 rounded-full text-sm transition-all duration-200"
                  style={{
                    color: isActive ? activeColor : textColor,
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') : 'transparent',
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => toggleLang()}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                color: textColor,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
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
              className="lg:hidden p-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: isDark ? '#fff' : '#111' }}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[998] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {NAV_SECTIONS.map((item, i) => {
              const sectionId = item.href.replace('#', '');
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-2xl font-medium text-white/80 hover:text-white transition-colors"
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
              className="btn-primary mt-4"
            >
              {t?.hero?.cta || 'Book a Call'}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
