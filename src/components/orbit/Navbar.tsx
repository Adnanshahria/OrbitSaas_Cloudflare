import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowLeft } from 'lucide-react';
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
  '/project': 'project',
  '/reviews': 'reviews',
  '/leadership': 'leadership',
  '/contact': 'contact',
};

// ── WhatsApp Icon Component ──
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);



export function Navbar() {
  const { content } = useContent();
  const { lang, toggleLang } = useLang();
  const t = content[lang] as any;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();
  const activeSection = PATH_TO_SECTION[location.pathname] || 'hero';
  const isProjectRoot = location.pathname === '/project';
  const isProjectDetail = location.pathname.startsWith('/project/') && location.pathname.length > 9;

  // Handle scroll state for subtle elevation change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with Chatbot state to hide navbar on mobile
  useEffect(() => {
    const handleChatbotState = (e: any) => {
      setIsChatbotOpen(e.detail?.isOpen ?? false);
    };
    window.addEventListener('orbit-chatbot-state-change', handleChatbotState);
    return () => window.removeEventListener('orbit-chatbot-state-change', handleChatbotState);
  }, []);

  // Sections that use Light Mode
  const isLightMode = ['services', 'project', 'leadership'].includes(activeSection);

  // Theme Variables
  const theme = {
    bg: isProjectDetail
      ? scrolled ? 'rgba(10, 10, 12, 0.8)' : 'rgba(10, 10, 12, 0.25)'
      : isLightMode
        ? scrolled ? 'rgba(243, 239, 224, 0.95)' : 'rgba(243, 239, 224, 0.9)'
        : scrolled ? 'rgba(6, 6, 8, 0.8)' : 'rgba(10, 10, 12, 0.25)',
    border: isProjectDetail
      ? scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)'
      : isLightMode
        ? 'rgba(163, 123, 16, 0.12)'
        : scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
    text: isProjectDetail ? '#FFFFFF' : (isLightMode ? '#000000' : '#FFFFFF'),
    textMuted: isProjectDetail ? 'rgba(255, 255, 255, 0.6)' : (isLightMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.6)'),
    accent: '#10B981', // Emerald 500
    glass: isProjectDetail
      ? 'backdrop-blur-[40px]'
      : isLightMode ? 'backdrop-blur-[32px]' : 'backdrop-blur-[40px]',
    violetBorder: 'rgba(167, 139, 250, 0.3)' // Thin violet border
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-out flex justify-center ${isChatbotOpen ? 'md:translate-y-0 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'translate-y-0 opacity-100'
          }`}
      >
        {/* Cinematic Glass Shell */}
        <div
          className={`relative w-full px-5 sm:px-8 py-2 transition-all duration-500 border rounded-b-3xl ${theme.glass} backdrop-saturate-[180%]`}
          style={{
            backgroundColor: theme.bg,
            borderColor: theme.violetBorder,
            boxShadow: isLightMode
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.05)'
              : '0 10px 30px -15px rgba(0,0,0,0.5)'
          }}
        >
          <div className="flex items-center justify-between max-w-[1400px] mx-auto w-full">
            {/* Logo area */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group px-4 py-2 rounded-full transition-all duration-500 hover:bg-white/5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src={orbitLogo}
                  alt="Orbit"
                  className="h-9 sm:h-10 w-auto object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[5deg]"
                />
                {/* Premium Shimmer Effect */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-full">
                  <motion.div
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12"
                  />
                </div>
              </div>
              <span
                className="font-normal tracking-[0.1em] text-xl sm:text-2xl transition-all duration-500 group-hover:tracking-[0.15em] relative"
                style={{ color: theme.text, fontFamily: "'Abril Fatface', serif" }}
              >
                OrbitSaaS
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className="absolute -bottom-1 left-0 h-[1.5px] bg-primary/50 rounded-full"
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isProjectDetail && (
              <div className="hidden lg:flex items-center gap-4 xl:gap-6 transition-all duration-300">
                {NAV_SECTIONS.filter(s => s.path !== '/').map((item) => {
                  const sectionId = PATH_TO_SECTION[item.path];
                  const visibility = t?.nav?.visibility?.[sectionId] !== false;
                  if (!visibility) return null;

                  const isActive = activeSection === sectionId;
                  const label = t?.nav?.[sectionId === 'tech' ? 'techStack' : sectionId === 'project' ? 'projects' : sectionId] || item.label;
                  const customUrl = t?.nav?.urls?.[sectionId];
                  const isExternal = customUrl && (customUrl.startsWith('http') || customUrl.startsWith('mailto:'));
                  const isContact = item.path === '/contact';

                  if (isExternal) {
                    return (
                      <a
                        key={item.path}
                        href={customUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative z-10 ${isContact ? 'px-6 py-2.5 bg-[#059669] rounded-full shadow-[0_4px_15px_rgba(5,150,105,0.3)] hover:scale-105 transition-transform' : 'px-2 py-2'}`}
                      >
                        <motion.span
                          className={`relative z-10 transition-colors duration-500 text-[10px] font-medium tracking-[0.25em] uppercase`}
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            color: isContact ? '#FFFFFF' : theme.textMuted
                          }}
                        >
                          {label}
                        </motion.span>
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={customUrl || item.path}
                      className="relative flex items-center justify-center z-10 px-3 py-2 transition-all duration-300"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-indicator"
                          className="absolute -bottom-1 w-1/2 h-[2px] bg-[#059669] rounded-full"
                          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                        />
                      )}
                      <motion.span 
                        className={`relative z-10 transition-colors duration-500 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap flex overflow-hidden`}
                        style={{ 
                          fontFamily: "'Outfit', sans-serif",
                          color: isActive 
                            ? '#059669' // Emerald for active text
                            : theme.textMuted
                        }}
                      >
                        {sectionId === 'project' && !isActive ? (
                          label.split('').map((char: string, i: number) => (
                            <motion.span
                              key={i}
                              animate={{ 
                                color: ['#EF4444', '#A78BFA', '#EF4444'] 
                              }}
                              transition={{ 
                                duration: 2.5, 
                                repeat: Infinity, 
                                delay: i * 0.1,
                                ease: "easeInOut"
                              }}
                            >
                              {char}
                            </motion.span>
                          ))
                        ) : (
                          label
                        )}
                      </motion.span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Project Root Back Button */}
              {isProjectRoot && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden lg:flex"
                >
                  <Link
                    to="/"
                    className="group relative px-5 py-2 flex items-center gap-3 overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-500 transition-transform duration-500 group-hover:-translate-x-1" />
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-800"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Back to Orbit
                    </span>
                  </Link>
                </motion.div>
              )}

              {/* Project Detail Back Button */}
              {isProjectDetail && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden lg:flex"
                >
                  <Link
                    to="/project"
                    className="group relative px-5 py-2 flex items-center gap-3 overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    <ArrowLeft className="w-3 h-3 text-emerald-500 transition-transform duration-500 group-hover:-translate-x-1" />
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      View All Projects
                    </span>
                    {/* Animated Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </Link>
                </motion.div>
              )}

              {/* Language Switcher - Premium Toggle */}
              <button
                onClick={() => toggleLang()}
                className="hidden sm:flex items-center justify-center min-w-[3.2rem] h-9 sm:h-10 px-3 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 backdrop-blur-md text-[10px] font-black uppercase tracking-widest transition-all duration-500 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                style={{
                  fontFamily: "'Abril Fatface', serif"
                }}
              >
                {lang === 'en' ? 'BN' : 'EN'}
              </button>

              {/* Separated Active Page & Call Action */}
              <div className="flex items-center gap-2">
                {/* Active Page Indicator (Shown only on relevant subpages) */}
                <AnimatePresence mode="wait">
                  {activeSection !== 'hero' && !location.pathname.startsWith('/project/') && (
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex lg:hidden items-center gap-3 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md"
                    >
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span
                        className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                        style={{ color: theme.text, fontFamily: "'Outfit', sans-serif" }}
                      >
                        {t?.nav?.[activeSection === 'tech' ? 'techStack' : activeSection === 'project' ? 'projects' : activeSection] || activeSection}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Standalone Call Icon */}
                <Link
                  to="/contact"
                  className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border backdrop-blur-md transition-all duration-500 hover:text-white"
                >
                  <style>{`
                    @keyframes whatsappThemePulse {
                      0%, 100% {
                        color: #10B981;
                        border-color: rgba(16, 185, 129, 0.4);
                        background-color: rgba(16, 185, 129, 0.1);
                        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                      }
                      50% {
                        color: #d4a017;
                        border-color: rgba(212, 160, 23, 0.4);
                        background-color: rgba(212, 160, 23, 0.1);
                        box-shadow: 0 0 15px rgba(212, 160, 23, 0.2);
                      }
                    }
                    @keyframes whatsappPingTheme {
                      0%, 100% { border-color: rgba(16, 185, 129, 0.6); }
                      50% { border-color: rgba(212, 160, 23, 0.6); }
                    }
                    .whatsapp-theme-anim {
                      animation: whatsappThemePulse 4s ease-in-out infinite;
                    }
                    .group:hover .whatsapp-theme-anim {
                      animation: none !important;
                      color: white !important;
                      background-color: #10B981 !important;
                      border-color: #10B981 !important;
                      box-shadow: 0 0 25px rgba(16,185,129,0.5) !important;
                    }
                    .whatsapp-ping-anim {
                      animation: whatsappPingTheme 4s ease-in-out infinite;
                    }
                  `}</style>

                  {/* Outer pulsating ring */}
                  <div className="absolute inset-0 rounded-full border animate-ping opacity-20 whatsapp-ping-anim" style={{ animationDuration: '3s' }} />

                  {/* Button Background Base (to receive animation) */}
                  <div className="absolute inset-0 rounded-full whatsapp-theme-anim transition-all duration-300" />

                  {/* Subtle inner wiggle on hover */}
                  <WhatsAppIcon className="relative z-10 w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 whatsapp-theme-anim" />
                </Link>
              </div>

              {/* Mobile Burger - Custom Animated Button */}
              <button
                className="lg:hidden relative z-[1001] w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ color: mobileOpen ? '#FFFFFF' : theme.text }}
              >
                <div className="flex flex-col gap-1.5 items-end">
                  <motion.span
                    animate={mobileOpen ? { rotate: 45, y: 7.5, width: 24 } : { rotate: 0, y: 0, width: 24 }}
                    className="h-[2px] bg-current rounded-full"
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0, width: 18 }}
                    className="h-[2px] bg-current rounded-full"
                  />
                  <motion.span
                    animate={mobileOpen ? { rotate: -45, y: -7.5, width: 24 } : { rotate: 0, y: 0, width: 12 }}
                    className="h-[2px] bg-current rounded-full"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overhaul */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(30px at calc(100% - 60px) 40px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 60px) 40px)' }}
            exit={{ opacity: 0, clipPath: 'circle(30px at calc(100% - 60px) 40px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] flex flex-col p-8 sm:p-12 overflow-hidden"
            style={{
              backgroundColor: isLightMode ? 'rgba(255,255,255,0.98)' : 'rgba(6,6,8,0.98)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Background Texture for Mobile Menu */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="mt-20 flex flex-col gap-8 flex-grow">
              {NAV_SECTIONS.map((item, i) => {
                const sectionId = PATH_TO_SECTION[item.path];
                const visibility = t?.nav?.visibility?.[sectionId] !== false;
                if (!visibility) return null;

                const isActive = activeSection === sectionId;
                const customUrl = t?.nav?.urls?.[sectionId];
                const isExternal = customUrl && (customUrl.startsWith('http') || customUrl.startsWith('mailto:'));
                const label = t?.nav?.[sectionId === 'tech' ? 'techStack' : sectionId === 'project' ? 'projects' : sectionId] || item.label;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                  >
                    {isExternal ? (
                      <a
                        href={customUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline gap-4"
                      >
                        <span className="text-xs font-black text-emerald-500/40 tabular-nums">0{i + 1}</span>
                        <span
                          className={`text-4xl sm:text-7xl transition-all duration-300 hover:translate-x-4`}
                          style={{
                            color: theme.text,
                            fontFamily: "'Abril Fatface', serif"
                          }}
                        >
                          {label}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={customUrl || item.path}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-baseline gap-4"
                      >
                        <span className="text-xs font-black text-emerald-500/40 tabular-nums">0{i + 1}</span>
                        <span
                          className={`text-4xl sm:text-7xl transition-all duration-300 ${isActive ? 'text-emerald-500' : 'hover:translate-x-4'}`}
                          style={{
                            color: !isActive ? (isLightMode ? '#1a1a1a' : '#ffffff') : undefined,
                            fontFamily: "'Abril Fatface', serif"
                          }}
                        >
                          {label}
                        </span>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pb-12"
            >
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center p-4 rounded-2xl border border-current text-xs font-black uppercase tracking-widest transition-all"
                style={{ color: isLightMode ? '#1a1a1a' : '#ffffff', borderColor: isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
              >
                Switch to {lang === 'en' ? 'বাংলা' : 'English'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
