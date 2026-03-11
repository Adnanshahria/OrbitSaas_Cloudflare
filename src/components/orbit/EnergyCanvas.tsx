/**
 * EnergyCanvas — Sequential Wavefront Pulses
 *
 * Distinct glowing ovals (wave pulses) traveling along rigid straight 
 * linear paths from the 4 outer corners to the center.
 * Rhythmic, synchronized pulsating flow that perfectly matches the requested design.
 */

import { memo, useEffect, useRef } from 'react';

interface WavePulse {
    pathIndex: number;
    t: number;
    speed: number;
}

function EnergyCanvasInner() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    const pulsesRef = useRef<WavePulse[]>([]);
    const frameCountRef = useRef<number>(0);
    const collisionFlashRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        };

        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            ctx.save();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // ─── GEOMETRY ───
            // Shifted the collision point slightly more in the +x axis
            const cx = w * 0.55;
            const cy = h * 0.77; // Intersection between the cards

            // Exact outer corners of the 1200px max-width section container
            // Pulling corners slightly further inward so they don't stick past the cards
            // Evaluated from the TRUE geometrical center, not the offset collision node
            const trueCenter = w * 0.5;
            const maxW = Math.min(w * 0.9, 1200) - 110;
            const leftX = trueCenter - maxW / 2;
            const rightX = trueCenter + maxW / 2;

            // Height locations for the outermost corners of the cards grid
            // Raised bottomY specifically to end perfectly at the bottom card corners
            const topY = h * 0.56;
            const bottomY = h * 0.82;

            const funnelX = w * 0.6; // Beam base offset
            const funnelY = h * 0.15; // Upward target

            const paths = [
                { sx: leftX, sy: topY, ex: cx, ey: cy },      // 0: Top-Left
                { sx: rightX, sy: topY, ex: cx, ey: cy },     // 1: Top-Right
                { sx: leftX, sy: bottomY, ex: cx, ey: cy },   // 2: Bottom-Left
                { sx: rightX, sy: bottomY, ex: cx, ey: cy },  // 3: Bottom-Right
                { sx: cx, sy: cy, ex: funnelX, ey: funnelY }  // 4: Central UP
            ];

            // ─── LOGIC ───
            frameCountRef.current++;
            const frame = frameCountRef.current;

            // Spawn a wave on all 4 incoming paths every 120 frames (much slower rate)
            if (frame % 120 === 0) {
                for (let i = 0; i < 4; i++) {
                    pulsesRef.current.push({ pathIndex: i, t: 0, speed: 0.007 });
                }
            }

            const pulses = pulsesRef.current;

            // ─── UPDATE & DRAW PULSES ───
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.t += p.speed;

                // Remove completed pulses
                if (p.t >= 1) {
                    // When an incoming synchronized group hits (only trigger once per group via index 0)
                    if (p.pathIndex === 0) {
                        pulses.push({ pathIndex: 4, t: 0, speed: 0.009 });
                        collisionFlashRef.current = 1.0;
                    }
                    pulses.splice(i, 1);
                    continue;
                }

                const path = paths[p.pathIndex];
                const isUp = p.pathIndex === 4;

                // Linear travel along the path
                const x = path.sx + (path.ex - path.sx) * p.t;
                const y = path.sy + (path.ey - path.sy) * p.t;

                // Angle points exactly along the line trajectory
                // The upward central beam should always remain perfectly horizontal (tilted straight up in radians)
                const angle = isUp ? -Math.PI / 2 : Math.atan2(path.ey - path.sy, path.ex - path.sx);

                // Fade in/out, capped at 60% opacity max
                let alpha = 0.6;
                if (p.t < 0.15) alpha = (p.t / 0.15) * 0.6;
                if (p.t > 0.85) alpha = ((1 - p.t) / 0.15) * 0.6;

                // Width logic
                let leftWidth;
                let rightWidth;

                if (isUp) {
                    // Upward wave starts wide and tapers. 
                    // To compensate for the 60% funnel offset, we make the RIGHT (+x) side significantly wider initially
                    const baseWidth = 110 - (p.t * 70);
                    leftWidth = baseWidth;
                    // Provide a substantial extra boost to the right so it enters the shifted beam completely
                    rightWidth = baseWidth + (funnelX - cx) * (1 - p.t) * 1.4;
                } else {
                    // Corner waves expand symmetrically
                    const wWidth = 15 + p.t * 50;
                    leftWidth = wWidth;
                    rightWidth = wWidth;
                }
                const thickness = isUp ? 5 : 3;

                // ─── DRAW OVAL WAVEFRONT ───
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.globalAlpha = alpha;

                // Outer soft ambient oval
                ctx.beginPath();
                ctx.ellipse(0, 0, thickness * 2.5, rightWidth * 1.5, 0, 0, Math.PI);
                ctx.ellipse(0, 0, thickness * 2.5, leftWidth * 1.5, 0, Math.PI, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 230, 118, 0.15)`;
                ctx.fill();

                // Main colored core
                ctx.beginPath();
                ctx.ellipse(0, 0, thickness, rightWidth, 0, 0, Math.PI);
                ctx.ellipse(0, 0, thickness, leftWidth, 0, Math.PI, Math.PI * 2);
                ctx.fillStyle = '#00e676';
                ctx.shadowColor = '#00ff8c';
                ctx.shadowBlur = 15;
                ctx.fill();

                // White hot inner crest
                ctx.beginPath();
                ctx.ellipse(0, 0, thickness * 0.4, rightWidth * 0.6, 0, 0, Math.PI);
                ctx.ellipse(0, 0, thickness * 0.4, leftWidth * 0.6, 0, Math.PI, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                ctx.restore();
            }

            // ─── DRAW CENTRAL FLASH ───

            // Big flash on collision
            if (collisionFlashRef.current > 0) {
                const flash = collisionFlashRef.current;
                const radius = 20 + (1 - flash) * 120;
                const gGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                gGlow.addColorStop(0, `rgba(255, 255, 255, ${flash * 0.7})`);
                gGlow.addColorStop(0.2, `rgba(0, 255, 140, ${flash * 0.4})`);
                gGlow.addColorStop(1, 'transparent');

                ctx.fillStyle = gGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();

                collisionFlashRef.current -= 0.05;
            }

            ctx.restore();
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[20]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}

const EnergyCanvas = memo(EnergyCanvasInner);
export default EnergyCanvas;
