import React, { memo } from 'react';

const SPIKE_PATH = `
  M 599 0
  C 599 400, 598 700, 450 1000
  Q 400 1100, 350 1200
  L 850 1200
  Q 800 1100, 750 1000
  C 602 700, 601 400, 601 0
  Z
`;

const SPIKE_CORE = `
  M 599.5 0
  C 599.5 450, 598.5 750, 500 1050
  Q 470 1130, 440 1200
  L 760 1200
  Q 730 1130, 700 1050
  C 601.5 750, 600.5 450, 600.5 0
  Z
`;

const SVG_STYLE_BASE: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
};

function HeroBeamInner() {
    return (
        <div
            aria-hidden="true"
            className="hero-beam-root"
            style={{
                position: 'absolute',
                left: '60%',
                top: '-900px',
                bottom: '-30px',
                transform: 'translateX(-50%)',
                width: '900px',
                overflow: 'visible',
                pointerEvents: 'none',
                zIndex: 2,
            }}
        >
            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(80px)', opacity: 0.7, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg4" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#00e676" stopOpacity="0.35" />
                        <stop offset="30%" stopColor="#00c853" stopOpacity="0.25" />
                        <stop offset="60%" stopColor="#00c853" stopOpacity="0.18" />
                        <stop offset="85%" stopColor="#1b5e20" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#1b5e20" stopOpacity="0.06" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_PATH} fill="url(#sg4)" />
            </svg>

            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(35px)', opacity: 0.8, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg1" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                        <stop offset="10%" stopColor="#b9f6ca" stopOpacity="0.35" />
                        <stop offset="35%" stopColor="#00e676" stopOpacity="0.20" />
                        <stop offset="65%" stopColor="#00c853" stopOpacity="0.12" />
                        <stop offset="90%" stopColor="#00c853" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#00c853" stopOpacity="0.03" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg1)" />
            </svg>

            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(14px)', opacity: 0.65, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg2" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                        <stop offset="8%" stopColor="#e8f5e9" stopOpacity="0.45" />
                        <stop offset="30%" stopColor="#69f0ae" stopOpacity="0.20" />
                        <stop offset="60%" stopColor="#00e676" stopOpacity="0.10" />
                        <stop offset="90%" stopColor="#00c853" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#00c853" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg2)" />
            </svg>

            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(5px)', opacity: 0.85, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg3" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="5%" stopColor="#ffffff" stopOpacity="0.6" />
                        <stop offset="15%" stopColor="#b9f6ca" stopOpacity="0.25" />
                        <stop offset="40%" stopColor="#00e676" stopOpacity="0.12" />
                        <stop offset="70%" stopColor="#00c853" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#00c853" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg3)" />
            </svg>

            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-60px',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(0,230,118,0.30) 0%, rgba(0,200,83,0.10) 35%, transparent 70%)',
                filter: 'blur(30px)',
                mixBlendMode: 'screen',
            }} />

            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-120px',
                transform: 'translateX(-50%)',
                width: '700px',
                height: '300px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(0,230,118,0.14) 0%, rgba(0,200,83,0.05) 45%, transparent 75%)',
                filter: 'blur(45px)',
                mixBlendMode: 'screen',
            }} />
        </div>
    );
}

const HeroBeam = memo(HeroBeamInner);
export default HeroBeam;