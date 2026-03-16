import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useLang } from '@/contexts/LanguageContext';


/* ─── tech logo URLs (served from public/images/) ─── */
const TECH_LOGOS = [
  { src: '/images/react2.webp', label: 'React', isDouble: true },
  { src: '/images/next2.webp', label: 'Next.js', isDouble: true },
  { src: '/images/node2.webp', label: 'Node.js', isDouble: true },
  { src: '/images/express.webp', label: 'Express', isDouble: true },
  { src: '/images/mongo.webp', label: 'MongoDB', isDouble: true },
  { src: '/images/mysql.webp', label: 'MySQL', isDouble: true },
  { src: '/images/typescript.webp', label: 'TypeScript', isDouble: true },
  { src: '/images/tailwind.png', label: 'Tailwind', isDouble: false },
  { src: '/images/prisma.png', label: 'Prisma', isDouble: false },
  { src: '/images/docker.png', label: 'Docker', isDouble: false },
  { src: '/images/redis.png', label: 'Redis', isDouble: false },
  { src: '/images/aws.png', label: 'AWS', isDouble: false },
  { src: '/images/graphql.png', label: 'GraphQL', isDouble: false },
  { src: '/images/firebase.png', label: 'Firebase', isDouble: false },
  { src: '/images/flutter.png', label: 'Flutter', isDouble: false },
  { src: '/images/kubernetes.png', label: 'Kubernetes', isDouble: false },
  { src: '/images/tensorflow.png', label: 'TensorFlow', isDouble: false },
  { src: '/images/pytorch.png', label: 'PyTorch', isDouble: false },
  { src: '/images/n8n.png', label: 'n8n', isDouble: false },
  { src: '/images/openai.png', label: 'OpenAI', isDouble: false },
  { src: '/images/supabase.png', label: 'Supabase', isDouble: false },
  { src: '/images/vercel.png', label: 'Vercel', isDouble: false },
  { src: '/images/cloudflare_new.png', label: 'Cloudflare', isDouble: false },
  { src: '/images/digitalocean.png', label: 'DigitalOcean', isDouble: false },
  { src: '/images/githubactions.png', label: 'GitHub Actions', isDouble: false },
  { src: '/images/android.png', label: 'Android', isDouble: false },
  { src: '/images/ios.png', label: 'iOS', isDouble: false },
  { src: '/images/swift.png', label: 'Swift', isDouble: false },
  { src: '/images/langchain.png', label: 'LangChain', isDouble: false },
  { src: '/images/pinecone.png', label: 'Pinecone', isDouble: false },
  { src: '/images/huggingface.png', label: 'Hugging Face', isDouble: false },
  { src: '/images/kotlin.png', label: 'Kotlin', isDouble: false },
  { src: '/images/java.png', label: 'Java', isDouble: false },
  { src: '/images/postgresql.png', label: 'PostgreSQL', isDouble: false },
  { src: '/images/reactnative.png', label: 'React Native', isDouble: false },
];

/* ─── Ball Interface ─── */
interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  img: HTMLImageElement | null;
  label: string;
  isDouble: boolean;
  opacity: number;
  glowHue: number;
  rotation: number;
  rotationSpeed: number;
}

/* ─── Particle Interface ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

function createBalls(
  cw: number,
  ch: number,
  images: (HTMLImageElement | null)[],
): Ball[] {
  const balls: Ball[] = [];
  const isMobile = cw < 768;
  const isSmallMobile = cw < 450;

  const techCount = isMobile ? Math.min(30, images.length) : images.length;

  for (let i = 0; i < techCount; i++) {
    const rBase = isSmallMobile ? (22 + Math.random() * 4) : isMobile ? (26 + Math.random() * 5) : (30 + Math.random() * 8);

    // Drop balls directly through the funnel top
    balls.push({
      x: cw * 0.35 + Math.random() * (cw * 0.3),
      y: -rBase - Math.random() * ch * 2.5,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 3,
      r: rBase,
      img: images[i],
      label: TECH_LOGOS[i].label,
      isDouble: !!TECH_LOGOS[i].isDouble,
      opacity: 0,
      glowHue: 35 + Math.random() * 15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
    });
  }

  return balls.sort(() => Math.random() - 0.5);
}

function createParticles(count: number, cw: number, ch: number): Particle[] {
  const pts: Particle[] = [];
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
      hue: 200 + Math.random() * 40, // Subtle blueish background dust
    });
  }
  return pts;
}

/* ─── Physics step ─── */
// Physics Helper: Line Segment Collision
function checkLineCollision(b: Ball, p1x: number, p1y: number, p2x: number, p2y: number, BOUNCE: number) {
  const dx = p2x - p1x;
  const dy = p2y - p1y;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return;

  let t = ((b.x - p1x) * dx + (b.y - p1y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));

  const closestX = p1x + t * dx;
  const closestY = p1y + t * dy;

  const distDx = b.x - closestX;
  const distDy = b.y - closestY;
  const distSq = distDx * distDx + distDy * distDy;

  if (distSq < b.r * b.r) {
    const dist = Math.sqrt(distSq);
    const nx = distDx / dist;
    const ny = distDy / dist;

    // Push out
    const overlap = b.r - dist;
    b.x += nx * overlap;
    b.y += ny * overlap;

    // Reflect velocity
    const dot = b.vx * nx + b.vy * ny;
    if (dot < 0) {
      // Zero bounce for slow collisions to prevent jitter/vibration
      const bounceMult = Math.abs(dot) < 1.0 ? 0 : BOUNCE;
      b.vx -= 2 * dot * nx * bounceMult;
      b.vy -= 2 * dot * ny * bounceMult;
    }
    // High Ground friction
    b.vx *= 0.94;
    b.vy *= 0.94;
    
    // Rotation transfer (slight spin based on slide)
    const tx = -ny;
    const ty = nx;
    const tangentSlip = b.vx * tx + b.vy * ty;
    b.rotationSpeed += tangentSlip * 0.0005;
  }
}

function stepPhysics(
  balls: Ball[],
  particles: Particle[],
  cw: number,
  ch: number,
  mouseX: number,
  mouseY: number,
  mouseActive: boolean,
) {
  const GRAVITY = 0.25;
  const FRICTION = 0.99;
  const BOUNCE = 0.5;
  const MOUSE_RADIUS = 150;
  const MOUSE_FORCE = 4.0;

  const isMobile = cw < 768;
  const bucketW = isMobile ? cw * 0.85 : cw * 0.6;
  const bucketBottom = ch - 60;
  const bucketTop = bucketBottom - (isMobile ? ch * 0.45 : ch * 0.4);
  const bucketLeft = (cw - bucketW) / 2;
  const bucketRight = bucketLeft + bucketW;

  const funnelH = isMobile ? 60 : 100;
  const funnelW = isMobile ? 40 : 80;

  // Balls
  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];

    b.vy += GRAVITY;
    b.vx *= FRICTION;
    b.vy *= FRICTION;
    b.rotation += b.rotationSpeed;

    if (mouseActive) {
      const dx = b.x - mouseX;
      const dy = b.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
        b.rotationSpeed += (dx / dist) * 0.002;
      }
    }

    // Aggressive Dampening near bucket floor/corners
    if (b.y > bucketBottom - b.r * 2) {
      b.vx *= 0.95;
      b.vy *= 0.95;
      b.rotationSpeed *= 0.92;
      
      // Stop completely if very slow
      if (Math.abs(b.vx) < 0.05) b.vx = 0;
      if (Math.abs(b.vy) < 0.05) b.vy = 0;
      if (Math.abs(b.rotationSpeed) < 0.005) b.rotationSpeed = 0;
    }

    b.x += b.vx;
    b.y += b.vy;

    if (b.opacity < 1) b.opacity = Math.min(1, b.opacity + 0.015);

    // Dynamic Bucket Constraints (Line Segments)
    // 1. Funnel Slants
    if (b.y < bucketTop) {
      checkLineCollision(b, bucketLeft - funnelW, bucketTop - funnelH, bucketLeft, bucketTop, BOUNCE);
      checkLineCollision(b, bucketRight + funnelW, bucketTop - funnelH, bucketRight, bucketTop, BOUNCE);
    }

    // 2. Vertical Walls
    if (b.y >= bucketTop - b.r && b.y <= bucketBottom + b.r) {
      checkLineCollision(b, bucketLeft, bucketTop, bucketLeft, bucketBottom - 30, BOUNCE);
      checkLineCollision(b, bucketRight, bucketTop, bucketRight, bucketBottom - 30, BOUNCE);
    }

    // 3. Bottom & Corners
    if (b.y >= bucketBottom - b.r) {
      // Main floor
      checkLineCollision(b, bucketLeft + 30, bucketBottom, bucketRight - 30, bucketBottom, BOUNCE);
      // Curved corners (approximated with small segments for better physics than just hitting a wall)
      checkLineCollision(b, bucketLeft, bucketBottom - 30, bucketLeft + 30, bucketBottom, BOUNCE);
      checkLineCollision(b, bucketRight, bucketBottom - 30, bucketRight - 30, bucketBottom, BOUNCE);
    }

    // Screen edge bounce (only horizontal)
    if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
    if (b.x + b.r > cw) { b.x = cw - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
    // Bottom floor fallback (prevent sinking)
    if (b.y + b.r > ch) { b.y = ch - b.r; b.vy = -Math.abs(b.vy) * BOUNCE; }

    // Multi-ball collision
    for (let j = i + 1; j < balls.length; j++) {
      const o = balls[j];
      const dx = o.x - b.x;
      const dy = o.y - b.y;
      const distSq = dx * dx + dy * dy;
      const minDist = b.r + o.r;
      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        b.x -= nx * overlap;
        b.y -= ny * overlap;
        o.x += nx * overlap;
        o.y += ny * overlap;
        const dvx = b.vx - o.vx;
        const dvy = b.vy - o.vy;
        const dvDotN = dvx * nx + dvy * ny;
        if (dvDotN > 0) {
          // Suppress bounce for slow collisions to stabilize the pile
          const bounceMult = dvDotN < 1.0 ? 0 : BOUNCE;
          b.vx -= dvDotN * nx * bounceMult;
          b.vy -= dvDotN * ny * bounceMult;
          o.vx += dvDotN * nx * bounceMult;
          o.vy += dvDotN * ny * bounceMult;
        }
      }
    }
  }

  // Particles
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = cw;
    if (p.x > cw) p.x = 0;
    if (p.y < 0) p.y = ch;
    if (p.y > ch) p.y = 0;
  }
}

/* ─── Draw ─── */
function drawScene(
  ctx: CanvasRenderingContext2D,
  balls: Ball[],
  particles: Particle[],
  cw: number,
  ch: number,
  dpr: number,
) {
  ctx.clearRect(0, 0, cw * dpr, ch * dpr);
  ctx.save();
  ctx.scale(dpr, dpr);

  const isMobile = cw < 768;
  const bucketW = isMobile ? cw * 0.85 : cw * 0.6;
  const bucketBottom = ch - 60;
  const bucketTop = bucketBottom - (isMobile ? ch * 0.45 : ch * 0.4);
  const bucketLeft = (cw - bucketW) / 2;
  const bucketRight = bucketLeft + bucketW;
  const funnelH = isMobile ? 60 : 100;
  const funnelW = isMobile ? 40 : 80;

  // 1. Background Nebula Auras
  ctx.globalCompositeOperation = 'screen';
  const time = Date.now() * 0.0005;
  const auroraCount = 3;
  for (let i = 0; i < auroraCount; i++) {
    const ax = cw * (0.5 + Math.cos(time + i * 2) * 0.3);
    const ay = ch * (0.5 + Math.sin(time * 0.8 + i) * 0.2);
    const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, cw * 0.6);
    grad.addColorStop(0, `hsla(35, 80%, 30%, ${0.05 + i * 0.02})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  }

  // 2. Particles
  ctx.globalCompositeOperation = 'lighter';
  for (const p of particles) {
    ctx.fillStyle = `hsla(${p.hue}, 50%, 80%, ${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. DRAW AGENTIC BUCKET (Behind Balls)
  ctx.globalCompositeOperation = 'source-over';

  // High-Tech Funnel Shape
  ctx.beginPath();
  // Left Funnel
  ctx.moveTo(bucketLeft - funnelW, bucketTop - funnelH);
  ctx.lineTo(bucketLeft, bucketTop);
  // Left Body
  ctx.lineTo(bucketLeft, bucketBottom - 30);
  ctx.quadraticCurveTo(bucketLeft, bucketBottom, bucketLeft + 30, bucketBottom);
  // Bottom
  ctx.lineTo(bucketRight - 30, bucketBottom);
  ctx.quadraticCurveTo(bucketRight, bucketBottom, bucketRight, bucketBottom - 30);
  // Right Body
  ctx.lineTo(bucketRight, bucketTop);
  // Right Funnel
  ctx.lineTo(bucketRight + funnelW, bucketTop - funnelH);

  // Glass Body
  const glassGrad = ctx.createLinearGradient(0, bucketTop - funnelH, 0, bucketBottom);
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.01)');
  glassGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)');
  glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Premium Glass Reflection layer
  ctx.save();
  ctx.beginPath();
  // Reuse the path by duplicating logic or just clip
  ctx.moveTo(bucketLeft - funnelW, bucketTop - funnelH);
  ctx.lineTo(bucketLeft, bucketTop);
  ctx.lineTo(bucketLeft, bucketBottom - 30);
  ctx.quadraticCurveTo(bucketLeft, bucketBottom, bucketLeft + 30, bucketBottom);
  ctx.lineTo(bucketRight - 30, bucketBottom);
  ctx.quadraticCurveTo(bucketRight, bucketBottom, bucketRight, bucketBottom - 30);
  ctx.lineTo(bucketRight, bucketTop);
  ctx.lineTo(bucketRight + funnelW, bucketTop - funnelH);
  ctx.clip();

  const reflectGrad = ctx.createLinearGradient(bucketLeft, bucketTop, bucketRight, bucketBottom);
  reflectGrad.addColorStop(0, 'transparent');
  reflectGrad.addColorStop(0.48, 'transparent');
  reflectGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
  reflectGrad.addColorStop(0.52, 'transparent');
  reflectGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = reflectGrad;
  ctx.fillRect(bucketLeft - funnelW, bucketTop - funnelH, bucketRight - bucketLeft + funnelW * 2, bucketBottom - bucketTop + funnelH);
  ctx.restore();

  // Glowing Agentic Rims (Yellow/Gold)
  const pulse = Math.sin(Date.now() * 0.003) * 0.2 + 0.8;
  const rimColor = `rgba(212, 175, 55, ${0.4 * pulse})`;
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // High-Energy Slants (Matching Screenshot)
  const drawEnergySlant = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 1)';
    ctx.stroke();

    // Double accent line
    ctx.beginPath();
    ctx.moveTo(x1 + (x1 < x2 ? -5 : 5), y1 - 2);
    ctx.lineTo(x2 + (x1 < x2 ? -5 : 5), y2 - 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.stroke();
    ctx.restore();
  };

  drawEnergySlant(bucketLeft - funnelW, bucketTop - funnelH, bucketLeft, bucketTop);
  drawEnergySlant(bucketRight + funnelW, bucketTop - funnelH, bucketRight, bucketTop);

  // Bottom corner glows
  const drawCornerGlow = (x: number, y: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 80);
    g.addColorStop(0, `rgba(212, 175, 55, ${0.1 * pulse})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(x - 80, y - 80, 160, 160);
  };
  drawCornerGlow(bucketLeft, bucketBottom);
  drawCornerGlow(bucketRight, bucketBottom);

  // Balls
  for (const b of balls) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotation);
    ctx.globalAlpha = b.opacity;

    // Ambient Glow (Outer)
    ctx.save();
    ctx.rotate(-b.rotation);
    const outerGlow = ctx.createRadialGradient(0, 0, b.r * 0.8, 0, 0, b.r * 2.2);
    outerGlow.addColorStop(0, `hsla(${b.glowHue}, 70%, 50%, 0.15)`);
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, b.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sphere Body (Deep Glass) - Slightly thinner border appearance
    const bodyGrad = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.3, b.r * 0.1, 0, 0, b.r);
    bodyGrad.addColorStop(0, 'rgba(45, 47, 60, 1)');
    bodyGrad.addColorStop(0.8, 'rgba(15, 16, 22, 1)');
    bodyGrad.addColorStop(1, 'rgba(5, 5, 8, 1)');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, b.r, 0, Math.PI * 2);
    ctx.fill();

    // Internal Refraction / Glow
    const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r);
    innerGlow.addColorStop(0, `hsla(${b.glowHue}, 60%, 45%, 0.25)`);
    innerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = innerGlow;
    ctx.fill();

    // Gold Rim (Crisp & Thin)
    ctx.strokeStyle = `hsla(${b.glowHue}, 70%, 60%, 0.35)`;
    ctx.lineWidth = 0.8; // Reduced from 1.2
    ctx.stroke();

    // Logo Masked - Enhanced Clarity & Single Logo Fix
    if (b.img && b.img.complete && b.img.naturalWidth > 0) {
      ctx.save();
      // Apply a subtle white glow behind the logo to make it pop
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';

      ctx.beginPath();
      ctx.arc(0, 0, b.r * 0.75, 0, Math.PI * 2);
      ctx.clip();

      const imgWidth = b.img.naturalWidth;
      const imgHeight = b.img.naturalHeight;
      const targetSize = b.r * 1.55;

      if (b.isDouble) {
        // CROP: Source images have 2 logos side-by-side. 
        // We take only the left half (0 to width/2).
        ctx.drawImage(
          b.img,
          0, 0, imgWidth / 2, imgHeight, // Source: left half only
          -targetSize / 2, -targetSize / 2, targetSize, targetSize // Destination
        );
      } else {
        // FULL: Single logo images
        ctx.drawImage(
          b.img,
          -targetSize / 2, -targetSize / 2, targetSize, targetSize
        );
      }
      ctx.restore();
    }

    // Specular Highlights (Multiple)
    // 1. Primary Highlight
    const spec1 = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.4, 0, -b.r * 0.3, -b.r * 0.4, b.r * 0.6);
    spec1.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    spec1.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spec1;
    ctx.fill();

    // 2. Bottom "Refracted" Light
    const spec2 = ctx.createRadialGradient(b.r * 0.4, b.r * 0.4, 0, b.r * 0.4, b.r * 0.4, b.r * 0.5);
    spec2.addColorStop(0, `hsla(${b.glowHue}, 50%, 60%, 0.15)`);
    spec2.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = spec2;
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

export function TechStackSection() {
  const { content } = useContent();
  const { lang } = useLang();
  const t = (content[lang] as any)?.techStack;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  // Pre-load images
  useEffect(() => {
    let loaded = 0;
    const imgs: (HTMLImageElement | null)[] = TECH_LOGOS.map(() => null);
    TECH_LOGOS.forEach((logo, i) => {
      const img = new Image();
      img.src = logo.src;
      img.onload = () => {
        imgs[i] = img;
        loaded++;
        if (loaded === TECH_LOGOS.length) {
          imagesRef.current = imgs;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === TECH_LOGOS.length) {
          imagesRef.current = imgs;
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const cw = rect.width;
    const ch = rect.height;

    ballsRef.current = createBalls(cw, ch, imagesRef.current);
    particlesRef.current = createParticles(cw < 600 ? 80 : 150, cw, ch);

    return { cw, ch, dpr };
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const dims = initCanvas();
    if (!dims) return;
    let { cw, ch, dpr } = dims;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const d = initCanvas();
      if (d) { cw = d.cw; ch = d.ch; dpr = d.dpr; }
    };
    window.addEventListener('resize', handleResize);

    const tick = () => {
      stepPhysics(
        ballsRef.current,
        particlesRef.current,
        cw,
        ch,
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.active,
      );
      drawScene(ctx, ballsRef.current, particlesRef.current, cw, ch, dpr);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [imagesLoaded, initCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateMouse = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = x - rect.left;
      mouseRef.current.y = y - rect.top;
      mouseRef.current.active = true;
    };
    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onMouseLeave = () => { mouseRef.current.active = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { mouseRef.current.active = false; };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [imagesLoaded]);

  return (
    <section
      id="tech"
      className="section-dark relative overflow-hidden h-[100dvh] w-full"
      style={{ background: '#060606' }}
    >
      {/* Background radial gradient for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #060606 100%)',
          opacity: 0.7
        }}
      />

      {/* Top Overlay to protect Header Legibility */}
      <div
        className="absolute inset-x-0 top-0 h-[50dvh] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #060606 0%, rgba(6,6,6,0.8) 50%, rgba(6,6,6,0.4) 80%, transparent 100%)'
        }}
      />

      {/* Canvas - Full Screen Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        style={{ touchAction: 'none' }}
      />

      {/* Header Overlay */}
      <div className="relative z-20 pointer-events-none h-full flex flex-col items-center w-full">
        <div className="section-container !pt-20 sm:!pt-28 w-full">
          <div className="text-center">


            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-7xl font-black text-white tracking-tighter"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              {t?.title || 'Our Expertise'}
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechStackSection;
