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
            {/* Outer diffuse golden glow */}
            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(80px)', opacity: 0.65, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg4" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#F5C542" stopOpacity="0.40" />
                        <stop offset="30%" stopColor="#D4A017" stopOpacity="0.28" />
                        <stop offset="60%" stopColor="#D4A017" stopOpacity="0.18" />
                        <stop offset="85%" stopColor="#A37B10" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#8B6914" stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_PATH} fill="url(#sg4)" />
            </svg>

            {/* Mid-layer golden beam */}
            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(35px)', opacity: 0.75, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg1" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.50" />
                        <stop offset="10%" stopColor="#FFF8E1" stopOpacity="0.38" />
                        <stop offset="35%" stopColor="#F5C542" stopOpacity="0.22" />
                        <stop offset="65%" stopColor="#D4A017" stopOpacity="0.12" />
                        <stop offset="90%" stopColor="#D4A017" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#A37B10" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg1)" />
            </svg>

            {/* Sharp inner beam */}
            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(14px)', opacity: 0.6, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg2" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                        <stop offset="8%" stopColor="#FFF8E1" stopOpacity="0.50" />
                        <stop offset="30%" stopColor="#F5C542" stopOpacity="0.22" />
                        <stop offset="60%" stopColor="#D4A017" stopOpacity="0.10" />
                        <stop offset="90%" stopColor="#A37B10" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#8B6914" stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg2)" />
            </svg>

            {/* Core bright spike */}
            <svg viewBox="0 0 1200 1200" preserveAspectRatio="none"
                style={{
                    ...SVG_STYLE_BASE,
                    filter: 'blur(5px)', opacity: 0.8, mixBlendMode: 'screen',
                }}
            >
                <defs>
                    <linearGradient id="sg3" x1="0.5" y1="1" x2="0.5" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="5%" stopColor="#ffffff" stopOpacity="0.65" />
                        <stop offset="15%" stopColor="#FFF8E1" stopOpacity="0.30" />
                        <stop offset="40%" stopColor="#F5C542" stopOpacity="0.14" />
                        <stop offset="70%" stopColor="#D4A017" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#A37B10" stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={SPIKE_CORE} fill="url(#sg3)" />
            </svg>

            {/* Base radial glow at beam foot */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-60px',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(212,160,23,0.35) 0%, rgba(245,197,66,0.12) 35%, transparent 70%)',
                filter: 'blur(30px)',
                mixBlendMode: 'screen',
            }} />

            {/* Wide ambient glow */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-120px',
                transform: 'translateX(-50%)',
                width: '700px',
                height: '300px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.18) 0%, rgba(163,123,16,0.06) 45%, transparent 75%)',
                filter: 'blur(45px)',
                mixBlendMode: 'screen',
            }} />
        </div>
    );
}

const HeroBeam = memo(HeroBeamInner);
export default HeroBeam;