import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';
import { Search, PenTool, Code2, ShieldCheck, Rocket, Instagram, Youtube } from 'lucide-react';

const Visual01 = () => {
    const { content } = useContent();
    const { lang } = useLang();

    // Safely get tags or provide defaults
    const safeContent: any = content;
    const processData = safeContent?.[lang]?.process || {};
    const tags = processData.tags || [
        { id: '1', text: 'B2B SaaS', color: '#273FB7', position: 'top-right' },
        { id: '2', text: 'AI Automation', color: '#6366f1', position: 'center-right' },
        { id: '3', text: 'E-Commerce', color: '#8b5cf6', position: 'bottom-right' }
    ];

    const getPositionClasses = (pos: string) => {
        switch (pos) {
            case 'top-left': return 'top-1/4 left-[5%]';
            case 'top-right': return 'top-1/4 right-[5%] md:right-[10%]';
            case 'center-left': return 'top-1/2 -mt-4 left-[0%]';
            case 'center-right': return 'top-1/2 -mt-4 right-[-5%]';
            case 'bottom-left': return 'bottom-1/4 left-[5%]';
            case 'bottom-right': return 'bottom-1/4 right-[5%]';
            default: return 'top-1/4 right-[10%]';
        }
    };

    return (
        <div className="relative w-full max-w-sm mx-auto aspect-[16/9] flex items-center justify-center opacity-90 scale-90 md:scale-100">
            {/* Base Background Glow for the whole step matching MZMedia 01 */}
            <div className="absolute w-[120%] h-[120%] bg-[#273FB7]/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

            {tags.map((tag: any, i: number) => (
                <motion.div
                    key={tag.id}
                    animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
                    transition={{ duration: 4 + (i * 0.5), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    className={`absolute ${getPositionClasses(tag.position)} px-6 py-3 rounded-full border shadow-2xl text-[15px] font-semibold text-white z-${20 + i} backdrop-blur-xl`}
                    style={{
                        backgroundColor: `${tag.color}cc`, // Vibrant background with slight transparency for glassmorphism
                        borderColor: `${tag.color}`,
                        boxShadow: `0 15px 40px rgba(0,0,0,0.6), 0 0 35px ${tag.color}90, inset 0 0 15px ${tag.color}60`
                    }}
                >
                    {tag.text}
                </motion.div>
            ))}
        </div>
    );
};

const Visual02 = () => (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] flex items-center justify-center opacity-90 scale-90 md:scale-100">
        <div className="absolute w-[80%] h-[80%] bg-purple-500/20 blur-[90px] rounded-full animate-pulse" />
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-[#090909]/90 backdrop-blur shadow-2xl flex flex-col overflow-hidden">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 p-6 relative flex flex-col gap-4">
                <div className="w-3/4 h-8 bg-white/10 rounded-md" />
                <div className="w-full h-24 bg-white/5 rounded-md" />
                <div className="w-1/2 h-8 bg-[#273FB7]/20 rounded-md border border-[#273FB7]/30" />
                {/* Fake cursor element */}
                <motion.div animate={{ x: [0, 50, 20, 0], y: [0, 20, 50, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/3 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" className="drop-shadow-lg"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
                </motion.div>
            </div>
        </div>
    </div>
);

const Visual03 = () => (
    <div className="relative w-[90%] md:w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto aspect-[4/3] md:aspect-square flex flex-col items-center justify-center opacity-90 scale-90 md:scale-100 mt-10 md:mt-0">
        {/* Intense Background Glow */}
        <div className="absolute w-[90%] h-[90%] bg-[#273FB7]/30 blur-[90px] rounded-full mix-blend-screen pointer-events-none top-[-5%]" />
        <div className="absolute w-[60%] h-[60%] bg-purple-500/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none top-[15%]" />

        {/* Floating Tech Bubbles (matching Pr/Ae composition) */}
        <div className="absolute top-[12%] right-[22%] z-20">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-36 h-36 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(39,63,183,0.3)] flex items-center justify-center">
                <span className="text-6xl font-bold text-[#61DAFB] tracking-tighter">Re</span>
            </motion.div>
        </div>
        <div className="absolute top-[42%] right-[8%] z-30">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(56,189,248,0.2)] flex items-center justify-center">
                <span className="text-3xl font-bold text-[#3178C6] tracking-tighter">Ts</span>
            </motion.div>
        </div>

        {/* Vertical Toolbar (matching the left toolbar in MZMedia) */}
        <div className="absolute left-[10%] top-[8%] w-14 pb-12 pt-6 rounded-full bg-[#050505] border border-white/10 shadow-2xl z-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-6 h-6 rounded-[6px] border-[2px] border-white/40 flex items-center justify-center">
                <div className="w-2 h-2 bg-white/40 rounded-[2px]" />
            </div>
            <div className="w-6 h-6 rounded-full border-[2px] border-white/40 flex items-center justify-center">
                <div className="w-1 h-3 bg-white/40 rounded-full rotate-45" />
            </div>
            <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-white/40 to-white/10" />
            <div className="w-6 h-6 rounded-full bg-[#273FB7]/80 shadow-[0_0_10px_rgba(39,63,183,0.8)]" />
        </div>

        {/* Faux Code Editor Window (matching the bottom UI panel) */}
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-[2%] left-[2.5%] xl:left-[-5%] w-[95%] xl:w-[110%] h-56 rounded-[24px] bg-[#090909]/80 backdrop-blur-xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] z-40 flex flex-col overflow-hidden"
        >
            {/* Header / Tabs */}
            <div className="h-10 bg-white/[0.03] border-b border-white/5 flex items-center px-5 gap-3">
                <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                </div>
                <div className="px-4 py-1.5 bg-white/[0.06] rounded-t-lg border-t border-x border-white/[0.06] text-[11px] text-white/70 font-mono flex items-center gap-2">
                    <span className="text-blue-400">⚛</span> App.tsx
                </div>
                <div className="px-4 py-1.5 text-[11px] text-white/30 font-mono flex items-center gap-2">
                    <span className="text-blue-400/50">TS</span> utils.ts
                </div>
            </div>

            {/* Code Lines area */}
            <div className="flex-1 p-6 flex flex-col gap-3.5 relative bg-[#050505]/50">
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">1</span>
                    <div className="h-2 w-16 bg-[#C678DD]/80 rounded-full" />
                    <div className="h-2 w-24 bg-[#E5C07B]/80 rounded-full" />
                    <div className="h-2 w-12 bg-[#C678DD]/80 rounded-full" />
                    <div className="h-2 w-28 bg-[#98C379]/80 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">2</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">3</span>
                    <div className="h-2 w-20 bg-[#61AFEF]/80 rounded-full" />
                    <div className="h-2 w-32 bg-[#E5C07B]/80 rounded-full" />
                    <div className="h-2 w-8 bg-[#56B6C2]/80 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">4</span>
                    <div className="ml-8 h-2 w-12 bg-[#C678DD]/80 rounded-full" />
                    <div className="h-2 w-56 bg-[#98C379]/80 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">5</span>
                    <div className="ml-16 h-2 w-40 bg-[#E06C75]/80 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/20 text-xs font-mono w-4 text-right">6</span>
                    <div className="ml-8 h-2 w-16 bg-[#ABB2BF]/80 rounded-full" />
                </div>

                {/* Floating animated cursor */}
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="absolute left-[9.5rem] top-[6.3rem] w-[2px] h-[14px] bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            </div>
        </motion.div>
    </div>
);

const Visual04 = () => (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] flex flex-col items-center justify-center opacity-90 scale-90 md:scale-100">
        <div className="absolute w-2/3 h-2/3 bg-emerald-500/10 blur-[80px] rounded-full" />
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-[#090909]/90 backdrop-blur shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="h-24 flex-1 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-400">100%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Uptime</span>
                </div>
                <div className="h-24 flex-1 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-400">0.8s</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Load Time</span>
                </div>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex items-end">
                <div className="w-full h-2/3 bg-gradient-to-t from-emerald-500/20 to-transparent border-t border-emerald-500/50 relative">
                    <div className="absolute top-0 left-0 right-0 h-[1px] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
            </div>
        </div>
    </div>
);

const Visual05 = () => (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center opacity-90 scale-90 md:scale-100 mt-10 md:mt-0">
        {/* Background glow matching MZMedia */}
        <div className="absolute w-[120%] h-[120%] bg-[#4F46E5]/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute w-[80%] h-[80%] bg-[#7C3AED]/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-blue-500 rotate-45" />
            <div className="absolute top-[40%] left-[20%] w-4 h-[3px] bg-purple-500 -rotate-12" />
            <div className="absolute bottom-[30%] left-[15%] w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <div className="absolute top-[15%] right-[20%] w-2 h-2 bg-indigo-500 rotate-12" />
            <div className="absolute bottom-[40%] right-[10%] w-4 h-[3px] bg-blue-400 rotate-45" />
            <div className="absolute bottom-[20%] right-[25%] w-2.5 h-2.5 rounded-full bg-purple-400" />
            {/* Subtle crosshair grid accents in background */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 border-t border-l border-white/20" />
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 border-b border-r border-white/20" />
        </div>

        {/* Orbiting social circles */}
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[5%] left-[8%] w-[88px] h-[88px] rounded-full border border-white/20 bg-[#090909]/60 backdrop-blur-md shadow-[0_0_30px_rgba(79,70,229,0.2)] flex items-center justify-center z-10">
            <Instagram className="w-8 h-8 text-white/70" strokeWidth={1.5} />
        </motion.div>

        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] right-[-5%] w-[104px] h-[104px] rounded-full border border-white/20 bg-[#090909]/60 backdrop-blur-md shadow-[0_0_30px_rgba(79,70,229,0.2)] flex items-center justify-center z-10">
            <Youtube className="w-10 h-10 text-white/70" strokeWidth={1.5} />
        </motion.div>

        {/* TikTok custom icon equivalent */}
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[5%] left-[15%] w-[80px] h-[80px] rounded-full border border-white/20 bg-[#090909]/60 backdrop-blur-md shadow-[0_0_30px_rgba(79,70,229,0.2)] flex items-center justify-center z-30">
            <svg className="w-8 h-8 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
        </motion.div>

        {/* Main Center Circle - glowing ring effect */}
        <div className="relative w-[320px] h-[320px] rounded-full bg-[#050505] flex flex-col items-center justify-center z-20 shadow-[0_0_120px_rgba(79,70,229,0.5),inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/20 border-t-white/40 border-l-white/40 ring-1 ring-[#4F46E5]/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

            <div className="mb-4">
                <svg className="w-8 h-8 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4" ry="4" /><path d="M7 15l4-4 3 3 5-5" /></svg>
            </div>

            <div className="flex items-baseline gap-1">
                <span className="text-8xl md:text-[110px] font-light text-white tracking-tighter leading-none">10</span>
                <span className="text-6xl md:text-[80px] font-light text-white leading-none">x</span>
            </div>
            <span className="text-sm md:text-base text-white/70 mt-4 font-medium tracking-wide">Growth Started</span>
        </div>
    </div>
);

const steps = [
    {
        num: '01',
        badge: 'DISCOVERY',
        title: 'Understanding Your Vision',
        description: 'We dive deep into your business goals, target audience, and competitive landscape — mapping every requirement before writing a single line of code.',
        visual: <Visual01 />
    },
    {
        num: '02',
        badge: 'DESIGN',
        title: 'Architecture & Prototyping',
        description: 'From information architecture to pixel-perfect UI/UX prototypes — we craft the blueprint that ensures your product is intuitive, scalable, and conversion-focused.',
        visual: <Visual02 />
    },
    {
        num: '03',
        badge: 'DEVELOPMENT',
        title: 'Building The Solution',
        description: 'Full-stack development with cutting-edge frameworks, AI integration, and automation pipelines. Every feature is built for performance and reliability.',
        visual: <Visual03 />
    },
    {
        num: '04',
        badge: 'TESTING',
        title: 'QA & Optimization',
        description: 'Rigorous multi-device testing, performance benchmarking, security auditing, and accessibility checks — nothing ships until it\'s bulletproof.',
        visual: <Visual04 />
    },
    {
        num: '05',
        badge: 'LAUNCH',
        title: 'Go Live & Grow',
        description: 'Seamless deployment, analytics setup, and ongoing support. We don\'t disappear after launch — we help you iterate, improve, and scale.',
        visual: <Visual05 />
    },
];

export function ProcessSection() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="process"
            ref={ref}
            className="py-24 sm:py-40 px-3 sm:px-6 lg:px-8 relative scroll-mt-12 overflow-x-hidden"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center text-center mb-20 sm:mb-40"
                >
                    <h2 className="text-3xl sm:text-5xl lg:text-[56px] leading-tight font-semibold text-muted-foreground/50 mb-1">
                        Our Strategy To Build
                    </h2>
                    <p className="text-3xl sm:text-5xl lg:text-[56px] leading-tight font-semibold text-white">
                        Your Next Big Thing
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line - centered strictly on desktop, left on mobile */}
                    <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent md:-translate-x-px" />

                    {steps.map((step, i) => {
                        const isEven = i % 2 === 0;

                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`relative flex flex-col md:flex-row items-center gap-16 md:gap-0 mt-32 md:mt-0 mb-32 md:mb-56 last:mb-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                    } ${i === 0 ? 'mt-0' : ''}`}
                            >
                                {/* Horizontal Crosshair Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent hidden md:block z-0 pointer-events-none" />

                                {/* Center Line Number Circle */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20 top-0 md:top-1/2 md:-translate-y-1/2">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-full bg-[#0a0a0a] border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
                                        <span className="text-white/80 font-medium text-lg lg:text-xl">{step.num}</span>
                                    </div>
                                </div>

                                {/* Content Panel */}
                                <div className={`ml-20 md:ml-0 md:w-1/2 flex flex-col ${isEven ? 'md:pr-16 lg:pr-24 md:items-end md:text-right' : 'md:pl-16 lg:pl-24 md:items-start md:text-left'} w-full`}>
                                    <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#273FB7] text-white shadow-[0_0_20px_rgba(39,63,183,0.4)] mb-6">
                                        {step.badge}
                                    </span>
                                    <h3 className="text-2xl sm:text-4xl lg:text-[42px] leading-[1.15] font-semibold text-white mb-6">
                                        {step.title}
                                    </h3>
                                    <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-[480px]">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Visual Panel (Opposite Side) */}
                                <div className={`hidden md:flex md:w-1/2 items-center justify-center ${isEven ? 'md:pl-12 lg:pl-20' : 'md:pr-12 lg:pr-20'} w-full`}>
                                    {step.visual}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
