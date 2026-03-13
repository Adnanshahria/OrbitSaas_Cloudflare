import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import orbitLogo from '@/assets/orbit-logo.png';

const NAV_SECTIONS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/process', label: 'Process' },
  { path: '/techstack', label: 'Tech Stack' },
  { path: '/why-us', label: 'Why Us' },
  { path: '/proj', label: 'Projects' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/leadership', label: 'Team' },
  { path: '/contact', label: 'Contact' },
];

const PATH_TO_SECTION: Record<string, string> = {
  '/': 'hero',
  '/services': 'services',
  '/process': 'process',
  '/techstack': 'tech',
  '/why-us': 'why-us',
  '/proj': 'project',
  '/reviews': 'reviews',
  '/leadership': 'leadership',
  '/contact': 'contact',
};

export function Navbar() {
  const { content } = useContent();
  const { lang, toggleLang } = useLang();
  const t = content[lang] as any;

  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const activeSection = PATH_TO_SECTION[location.pathname] || 'hero';
  const navRef = useRef<HTMLElement>(null);

  // Determine if the current section uses Light Mode based on App.tsx structure
  const isLightMode = ['services', 'tech', 'project', 'leadership'].includes(activeSection);

  const textColor = isLightMode ? 'var(--nav-text-light-muted)' : 'var(--nav-text-dark-muted)';
  const activeColor = isLightMode ? 'var(--nav-text-light)' : 'var(--nav-text-dark)';

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] navbar-transition"
        style={{
          width: 'min(92vw, 1100px)',
          background: isLightMode ? 'var(--navbar-light-bg)' : 'var(--navbar-dark-bg)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          borderRadius: '999px',
          border: `1px solid ${isLightMode ? 'var(--navbar-border-light)' : 'var(--navbar-border-dark)'}`,
          padding: '10px 24px',
          boxShadow: isLightMode ? '0 4px 30px rgba(0,0,0,0.06)' : '0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2"
          >
            <img
              src={orbitLogo}
              alt="Orbit"
              className="h-9 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-display)', color: isLightMode ? 'var(--nav-text-light)' : 'var(--nav-text-dark)', fontSize: '1.4rem', letterSpacing: '1px', fontWeight: 700 }}>ORBIT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.filter(s => s.path !== '/').slice(0, 6).map((item) => {
              const sectionId = PATH_TO_SECTION[item.path];
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
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-3 py-1.5 rounded-full text-sm transition-all duration-300 cursor-pointer"
                  style={{
                    color: isActive ? activeColor : textColor,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {label}
                  {/* Active accent underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: 'var(--nav-accent)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
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
                border: `1px solid ${isLightMode ? 'rgba(30,41,59,0.15)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>

            {/* CTA */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 !py-2 !px-5 !text-sm"
              style={{
                background: 'var(--nav-accent)',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.25)',
              }}
            >
              {t?.hero?.cta || 'Book a Call'}
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-1.5 cursor-pointer transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: isLightMode ? 'var(--nav-text-light)' : 'var(--nav-text-dark)' }}
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
              background: isLightMode ? 'rgba(248,250,252,0.96)' : 'rgba(15,23,42,0.96)',
              backdropFilter: 'blur(30px)',
            }}
          >
            {NAV_SECTIONS.map((item, i) => {
              const sectionId = PATH_TO_SECTION[item.path];
              const isActive = activeSection === sectionId;
              return (
                <motion.div key={item.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-medium transition-colors cursor-pointer"
                    style={{
                      color: isActive ? 'var(--nav-accent)' : textColor,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: NAV_SECTIONS.length * 0.05 }}>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 cursor-pointer rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 px-8 py-3 flex items-center justify-center"
                style={{
                  background: 'var(--nav-accent)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.25)'
                }}
              >
                {t?.hero?.cta || 'Book a Call'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
