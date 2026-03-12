import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { toast } from 'sonner';
import HeroBeam from './HeroBeam';
import { useNavigate } from 'react-router-dom';
import {
  Globe, Bot, Zap, Smartphone, ShoppingCart, Rocket, Code, Database, Shield, Cloud,
  Cpu, Monitor, Wifi, Mail, Camera, Music, Heart, Star, Target, Briefcase,
  Award, BookOpen, Users, BarChart3, Sparkles, Layers, Settings2, Eye, Palette, Brain, Wrench,
  ChevronRight
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Globe, Bot, Zap, Smartphone, ShoppingCart, Rocket, Code, Database, Shield, Cloud,
  Cpu, Monitor, Wifi, Mail, Camera, Music, Heart, Star, Target, Briefcase,
  Award, BookOpen, Users, BarChart3, Sparkles, Layers, Settings2, Eye, Palette, Brain, Wrench
};



/* ─── Floating Feature Card ─── */
function FeatureCard({
  title,
  icon: Icon,
  delay,
  rotate,
  className,
}: {
  title: string;
  icon: any;
  delay: number;
  rotate: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      whileHover={{ scale: 1.02, rotate: rotate === 0 ? 0 : rotate > 0 ? rotate + 1 : rotate - 1 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`absolute cursor-pointer bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-[rgba(212,160,23,0.10)] hover:border-[rgba(212,160,23,0.25)] rounded-2xl p-5 shadow-2xl hover:shadow-[0_20px_50px_-10px_rgba(212,160,23,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-all duration-400 ${className}`}
      style={{ minWidth: '220px' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(212,160,23,0.15)', color: 'var(--accent)' }}
        >
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-white/80">{title}</span>
      </div>
      {/* Fake content lines */}
      <div className="mt-3 space-y-2">
        <div className="h-2 rounded-full bg-white/[0.06] w-full" />
        <div className="h-2 rounded-full bg-white/[0.06] w-3/4" />
        <div className="h-2 rounded-full bg-white/[0.04] w-1/2" />
      </div>
    </motion.div>
  );
}

export function Home() {
  const { content } = useContent();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (content[lang] as any)?.hero;

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = t?.title || 'We Build What Others Dream';
  const subtitle = t?.subtitle || '';
  const cta = t?.cta || 'Book a Demo';
  const learnMore = t?.learnMore || 'Learn more';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'hero_newsletter' }),
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

  const scrollToContact = () => {
    navigate('/contact');
  };

  const scrollToServices = () => {
    navigate('/services');
  };

  return (
    <section
      id="hero"
      className="section-dark relative overflow-visible z-20 noise-overlay"
    >
      {/* ── Hero content wrapper (full viewport height) ── */}
      <div className="relative min-h-[100dvh] flex items-center">
        {/* ── Huly-style Animated Glowing Beam ── */}
        <HeroBeam />

        {/* ── Content ── */}
        <div className="relative z-10 section-container !py-32 lg:!py-40 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side — Text */}
            <div>
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <span className="pill-badge pill-badge-accent">
                  <span className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center text-[8px] text-white font-bold">O</span>
                  Full-Service Software & AI Agency
                </span>
              </motion.div>

              {/* Main heading — large, light weight like Dexter */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-white mb-6 leading-[1.05] tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {title}
              </motion.h1>

              {/* Tagline */}
              {t?.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-lg mb-2 font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {t.tagline}
                </motion.p>
              )}

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-base md:text-lg max-w-lg mb-10"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
              >
                {subtitle}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex flex-wrap items-center gap-5"
              >
                <button onClick={scrollToContact} className="btn-primary hover:shadow-[0_0_20px_var(--accent-light)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-[#0d0d0d]">
                  {cta}
                </button>
                <button
                  onClick={scrollToServices}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white rounded-md px-3 py-2 -ml-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span className="relative">
                    {learnMore}
                    <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-white opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 origin-left transition-all duration-300 ease-out" />
                  </span>
                  <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Right side — Floating feature cards */}
            <div className="relative hidden lg:block h-[500px]">
              <FeatureCard
                title={t?.feature1Title || "Build & run processes with AI"}
                icon={ICON_MAP[t?.feature1Icon] || Bot}
                delay={1.0}
                rotate={-3}
                className="top-4 right-0"
              />
              <FeatureCard
                title={t?.feature2Title || "Tasks optimized for the field"}
                icon={ICON_MAP[t?.feature2Icon] || Smartphone}
                delay={1.3}
                rotate={2}
                className="top-[220px] right-[60px]"
              />
              <FeatureCard
                title={t?.feature3Title || "Track and report on efficiency"}
                icon={ICON_MAP[t?.feature3Icon] || BarChart3}
                delay={1.6}
                rotate={-1}
                className="top-[380px] right-[20px]"
              />
            </div>
          </div>
        </div>
      </div> {/* end hero content wrapper */}
    </section>
  );
}
