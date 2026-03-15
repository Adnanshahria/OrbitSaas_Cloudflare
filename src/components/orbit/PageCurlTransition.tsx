import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SECTION_ROUTE_MAP: Record<string, number> = {
  '/': 0,
  '/services': 1,
  '/process': 2,
  '/techstack': 3,
  '/why-us': 4,
  '/proj': 5,
  '/reviews': 6,
  '/leadership': 7,
  '/contact': 8,
};

const INDEX_TO_ROUTE = Object.entries(SECTION_ROUTE_MAP).reduce((acc, [route, idx]) => {
  acc[idx] = route;
  return acc;
}, {} as Record<number, string>);

interface PageCurlTransitionProps {
  children: (index: number) => ReactNode;
}

export function PageCurlTransition({ children }: PageCurlTransitionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentPath = location.pathname;
  const currentIndex = SECTION_ROUTE_MAP[currentPath] ?? 0;
  
  const [activePage, setActivePage] = useState(currentIndex);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  
  // Direct Refs for Smooth Animation
  const polygonRef = useRef<SVGPolygonElement>(null);
  const shadowRef = useRef<SVGPolygonElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const topPageRef = useRef<HTMLDivElement>(null);
  const bottomPageRef = useRef<HTMLDivElement>(null);
  
  const totalPages = Object.keys(SECTION_ROUTE_MAP).length;
  
  // Initialize isMobile synchronously to prevent first-render flicker/re-render
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches;
  });

  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToPage = useCallback(
    (newTarget: number) => {
      if (targetPage !== null) return;
      if (newTarget < 0 || newTarget >= totalPages || newTarget === activePage) return;
      
      const route = INDEX_TO_ROUTE[newTarget];
      if (route) {
        navigate(route);
      }
    },
    [activePage, targetPage, totalPages, navigate]
  );

  // Sync activePage with route changes if not already animating
  useEffect(() => {
    if (currentIndex !== activePage && targetPage === null) {
      setTargetPage(currentIndex);
    }
  }, [currentIndex, activePage, targetPage]);

  // Animation Loop (Standard Page Curl Geometry)
  useEffect(() => {
    if (targetPage === null) return;
    const container = containerRef.current;
    if (!container) return;

    const isForward = targetPage > activePage;
    let start = performance.now();
    const isMob = isMobileRef.current;
    
    // Snappier duration: 600ms for desktop, 380ms for mobile fallback
    const duration = isMob ? 380 : 600; 
    let rAF: number;

    // Cache dimensions ONCE
    const W = container.offsetWidth;
    const H = container.offsetHeight;

    const animate = (now: number) => {
      let t = (now - start) / duration;
      if (t >= 1) {
        // DO NOT clear clipPath here - it causes the old page to snap back 
        // for a frame before being unmounted. The next render (targetPage=null)
        // will handle the cleanup naturally.
        setActivePage(targetPage);
        setTargetPage(null);
        return;
      }

      // Ultra-Smooth Quintic Easing
      const p = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
      
      const polygonEl = polygonRef.current;
      const shadowEl = shadowRef.current;
      const gradientEl = gradientRef.current;
      const topPageEl = topPageRef.current;
      if (isMob) {
        // MOBILE FALLBACK: Simple GPU-accelerated fade + slight slide
        if (topPageEl) {
          topPageEl.style.opacity = (1 - p).toString();
          topPageEl.style.transform = `translate3d(0, ${isForward ? -20 * p : 20 * p}px, 0)`;
          topPageEl.style.setProperty('--p', p.toString());
        }
      } else {
        // DESKTOP CURL: Optimized Polygon & Clip-path
        const K = p * (W + H);
        
        if (isForward) {
          if (K <= 0) {
            if (topPageEl) topPageEl.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
          } else if (K >= W + H) {
            if (topPageEl) topPageEl.style.clipPath = 'none';
          } else {
            const E1 = K <= H ? [W + 2, H - K] : [W + H - K, -2];
            const E2 = K <= W ? [W - K, H + 2] : [-2, W + H - K];
            const frontPts = [[-2, -2]];
            if (K <= H) frontPts.push([W + 2, -2]);
            frontPts.push(E1, E2);
            if (K <= W) frontPts.push([-2, H + 2]);
            
            // OPTIMIZED: CSS Variable Update (Reduces string allocation)
            if (topPageEl) {
              for (let i = 0; i < 6; i++) {
                const pt = i < frontPts.length ? frontPts[i] : frontPts[frontPts.length - 1];
                topPageEl.style.setProperty(`--pt${i}x`, `${pt[0]}px`);
                topPageEl.style.setProperty(`--pt${i}y`, `${pt[1]}px`);
              }
            }
            
            if (polygonEl) {
              const backPts = [E1];
              if (K > H) backPts.push([W + H - K, H - K]); 
              backPts.push([W - K, H - K]);                
              if (K > W) backPts.push([W - K, W + H - K]); 
              backPts.push(E2);
              const ptsStr = backPts.map(pt => `${pt[0]},${pt[1]}`).join(' ');
              polygonEl.setAttribute('points', ptsStr);
              if (shadowEl) shadowEl.setAttribute('points', ptsStr);
            }
            if (gradientEl) {
              gradientEl.setAttribute('x1', `${W - K / 2}`);
              gradientEl.setAttribute('y1', `${H - K / 2}`);
              gradientEl.setAttribute('x2', `${W - K}`);
              gradientEl.setAttribute('y2', `${H - K}`);
            }
          }
        } else {
          if (K <= 0) {
            if (topPageEl) topPageEl.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
          } else if (K >= W + H) {
            if (topPageEl) topPageEl.style.clipPath = 'none';
          } else {
            const E1 = K <= W ? [K, -2] : [W + 2, K - W];
            const E2 = K <= H ? [-2, K] : [K - H, H + 2];
            const frontPts = [E1];
            if (K <= W) frontPts.push([W + 2, -2]);
            frontPts.push([W + 2, H + 2]);
            if (K <= H) frontPts.push([-2, H + 2]);
            frontPts.push(E2);
            
            if (topPageEl) {
              for (let i = 0; i < 6; i++) {
                const pt = i < frontPts.length ? frontPts[i] : frontPts[frontPts.length - 1];
                topPageEl.style.setProperty(`--pt${i}x`, `${pt[0]}px`);
                topPageEl.style.setProperty(`--pt${i}y`, `${pt[1]}px`);
              }
            }
            
            if (polygonEl) {
              const backPts = [E1];
              if (K > W) backPts.push([K, K - W]); 
              backPts.push([K, K]);                
              if (K > H) backPts.push([K - H, K]); 
              backPts.push(E2);
              const ptsStr = backPts.map(pt => `${pt[0]},${pt[1]}`).join(' ');
              polygonEl.setAttribute('points', ptsStr);
              if (shadowEl) shadowEl.setAttribute('points', ptsStr);
            }
            if (gradientEl) {
              gradientEl.setAttribute('x1', `${K / 2}`);
              gradientEl.setAttribute('y1', `${K / 2}`);
              gradientEl.setAttribute('x2', `${K}`);
              gradientEl.setAttribute('y2', `${K}`);
            }
          }
        }
        
        if (topPageEl) {
          topPageEl.style.setProperty('--p', p.toString());
        }

        if (polygonEl) {
          const opacity = (K <= 0 || K >= W + H) ? '0' : '1';
          polygonEl.setAttribute('opacity', opacity);
          if (shadowEl) shadowEl.setAttribute('opacity', opacity);
        }
      }

      rAF = requestAnimationFrame(animate);
    };

    rAF = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rAF);
      // Clean up styles on unmount/re-run using ref
      const el = topPageRef.current;
      if (el) {
        el.style.opacity = '';
        el.style.transform = '';
      }
    };
  }, [targetPage, activePage]);

  // Track when the user last scrolled inside a scrollable area
  const lastInternalScrollTime = useRef(0);
  // Track edge-dwelling: how long user has been stuck at scroll boundary
  const edgeDwellStart = useRef(0);
  const edgeDwellDir = useRef<'up' | 'down' | null>(null);
  // Track cumulative touch delta for momentum-style transition triggering
  const touchCumulativeDelta = useRef(0);
  
  // NEW: Store "ready-to-jump" state for confirming scroll logic
  const jumpReady = useRef<{ direction: 'up' | 'down'; timestamp: number } | null>(null);

  // Reset counters when page changes
  useEffect(() => {
    lastInternalScrollTime.current = 0;
    edgeDwellStart.current = 0;
    edgeDwellDir.current = null;
    touchCumulativeDelta.current = 0;
    jumpReady.current = null; // Reset jump state on page change
  }, [activePage]);

  // Handle Scroll & Touch
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find the active .curl-page element that contains the scrollable content
    const getActiveCurlPage = (): HTMLElement | null => {
      const pages = container.querySelectorAll('.curl-page');
      // The active page has the highest z-index among curl-pages
      let best: HTMLElement | null = null;
      let bestZ = -1;
      pages.forEach(p => {
        const z = parseInt((p as HTMLElement).style.zIndex || '0', 10);
        if (z > bestZ) { bestZ = z; best = p as HTMLElement; }
      });
      return best;
    };

    // Check if the curl-page itself (or a scrollable child) can scroll down
    const canScrollDown = (startEl?: HTMLElement): boolean => {
      const page = startEl || getActiveCurlPage();
      if (!page) return false;
      // Check the curl-page itself first (it has overflow-y: auto)
      if (page.scrollHeight > page.clientHeight + 4 &&
          Math.ceil(page.scrollTop + page.clientHeight) < page.scrollHeight - 4) return true;
      // Also walk up from touch target if provided
      if (startEl) {
        let node: HTMLElement | null = startEl;
        while (node && node !== container) {
          const style = window.getComputedStyle(node);
          const hasOverflow = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
          if (hasOverflow && Math.ceil(node.scrollTop + node.clientHeight) < node.scrollHeight - 4) return true;
          node = node.parentElement;
        }
      }
      return false;
    };

    // Check if the curl-page itself (or a scrollable child) can scroll up  
    const canScrollUp = (startEl?: HTMLElement): boolean => {
      const page = startEl || getActiveCurlPage();
      if (!page) return false;
      if (page.scrollHeight > page.clientHeight + 4 && page.scrollTop > 4) return true;
      if (startEl) {
        let node: HTMLElement | null = startEl;
        while (node && node !== container) {
          const style = window.getComputedStyle(node);
          const hasOverflow = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
          if (hasOverflow && node.scrollTop > 4) return true;
          node = node.parentElement;
        }
      }
      return false;
    };

    // ─── Desktop Wheel ───
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const target = e.target as HTMLElement;

      if (e.deltaY > 0 && canScrollDown(target)) {
        lastInternalScrollTime.current = performance.now();
        return;
      }
      if (e.deltaY < 0 && canScrollUp(target)) {
        lastInternalScrollTime.current = performance.now();
        return;
      }

      e.preventDefault();
      if (targetPage !== null) return;

      const now = performance.now();
      if (now - lastInternalScrollTime.current < 600) {
        wheelAccum.current = 0;
        return;
      }

      wheelAccum.current += e.deltaY;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 350);

      const threshold = 180;
      if (Math.abs(wheelAccum.current) > threshold) {
        const direction = wheelAccum.current > 0 ? 'down' : 'up';
        const nowTime = performance.now();

        // If we were already 'ready' in this direction recently, navigate
        if (jumpReady.current?.direction === direction && (nowTime - jumpReady.current.timestamp < 1500)) {
          wheelAccum.current = 0;
          jumpReady.current = null;
          goToPage(direction === 'down' ? activePage + 1 : activePage - 1);
        } else {
          // First hit at the edge: Set ready state and wait for next scroll
          jumpReady.current = { direction, timestamp: nowTime };
          wheelAccum.current = 0; 
          // Optional: Add a subtle haptic/visual cue here if needed
        }
      }
    };

    // ─── Mobile Touch: Scroll-aware (allows native scroll, transitions at edges) ───
    let touchActiveDelta = 0;
    let touchTarget: HTMLElement | null = null;
    let isAtEdge = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchActiveDelta = 0;
      touchTarget = e.target as HTMLElement;
      isAtEdge = false;
      touchCumulativeDelta.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (targetPage !== null) return;
      
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY.current - currentY;
      const deltaX = touchStartX.current - currentX;

      // Ignore horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) return;

      const swipingUp = deltaY > 0;   // finger moves up = content goes up = wants NEXT page
      const swipingDown = deltaY < 0;  // finger moves down = content goes down = wants PREV page

      // Check if the page can scroll in the swipe direction
      const canScroll = swipingUp ? canScrollDown(touchTarget || undefined) : canScrollUp(touchTarget || undefined);

      if (canScroll) {
        // Page has room to scroll → allow native scroll, track timing
        lastInternalScrollTime.current = performance.now();
        isAtEdge = false;
        touchCumulativeDelta.current = 0;
        edgeDwellStart.current = 0;
        return; // Don't preventDefault → native scroll works
      }

      // We're at the scroll edge. Check cooldown from internal scrolling.
      const now = performance.now();
      if (now - lastInternalScrollTime.current < 400) {
        // Recently was scrolling internally — absorb this gesture to prevent momentum bleed
        if (e.cancelable) e.preventDefault();
        return;
      }

      // At the edge and past cooldown → accumulate for page transition
      if (!isAtEdge) {
        isAtEdge = true;
        edgeDwellStart.current = now;
        edgeDwellDir.current = swipingUp ? 'up' : 'down';
      }

      // Prevent native scroll bounce/overscroll at edges
      if (e.cancelable) e.preventDefault();

      touchCumulativeDelta.current = Math.abs(deltaY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (targetPage !== null) return;

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;

      // Horizontal swipe → ignore
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      const swipingUp = deltaY > 0;
      const swipingDown = deltaY < 0;

      // Only trigger transition if we were at the edge
      if (!isAtEdge) return;

      // Require a meaningful swipe distance (80px) to prevent accidental triggers
      if (Math.abs(deltaY) < 80) return;

      // Cooldown: don't transition if we were recently scrolling internally
      const now = performance.now();
      if (now - lastInternalScrollTime.current < 400) return;

      if (swipingUp) {
        const nowTime = performance.now();
        if (jumpReady.current?.direction === 'down' && (nowTime - jumpReady.current.timestamp < 1500)) {
          jumpReady.current = null;
          goToPage(activePage + 1);
        } else {
          jumpReady.current = { direction: 'down', timestamp: nowTime };
        }
      } else if (swipingDown) {
        const nowTime = performance.now();
        if (jumpReady.current?.direction === 'up' && (nowTime - jumpReady.current.timestamp < 1500)) {
          jumpReady.current = null;
          goToPage(activePage - 1);
        } else {
          jumpReady.current = { direction: 'up', timestamp: nowTime };
        }
      }

      isAtEdge = false;
      touchCumulativeDelta.current = 0;
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [activePage, targetPage, goToPage]);

  return (
    <div 
      ref={containerRef} 
      className="page-curl-viewport" 
      data-animating={targetPage !== null}
      style={{
        backgroundColor: targetPage !== null ? (activePage === 1 || activePage === 5 || activePage === 7 ? '#FAFAFA' : '#000') : undefined
      }}
    >
      {/* 
         We render two indices: the activePage and the targetPage.
         The component 'children' is a render prop that returns the correct section for an index.
      */}
      {[targetPage, activePage].map((i) => {
        if (i === null) return null;
        const isTopPage = i === activePage && targetPage !== null;
        const zIndex = i === activePage ? 10 : 5;
        // Force underlying page to be fully visible immediately
        const opacity = (i === targetPage) ? 1 : undefined;
        
        return (
          <div
            key={i}
            ref={isTopPage ? topPageRef : null}
            className={`curl-page ${isTopPage ? 'curl-top-page var-clip-path' : ''}`}
            style={{ 
              zIndex,
              opacity,
              transform: 'translateZ(0)',
              willChange: 'clip-path'
            }}
          >
            {children(i)}
            {isTopPage && (
              <div 
                className="curl-dark-overlay" 
                style={{ 
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'black',
                  zIndex: 99999,
                  pointerEvents: 'none',
                  opacity: 'var(--p, 0)'
                }} 
              />
            )}
          </div>
        );
      })}

      <svg
        className="curl-svg-overlay"
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 20, 
          pointerEvents: 'none', 
          width: '100%', 
          height: '100%',
          opacity: targetPage !== null ? 1 : 0,
          visibility: targetPage !== null ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <defs>
          <linearGradient id="curl-gradient" ref={gradientRef} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050505" />
            <stop offset="10%" stopColor="#1a1a1a" />
            <stop offset="35%" stopColor="#444444" />
            <stop offset="50%" stopColor="#d1d1d1" />
            <stop offset="65%" stopColor="#555555" />
            <stop offset="85%" stopColor="#111111" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
        {/* Hardware-accelerated shadow polygon instead of feDropShadow */}
        <polygon id="curl-shadow-poly" ref={shadowRef} fill="rgba(0,0,0,0.4)" transform="translate(-10, -10)" />
        <polygon id="curl-polygon" ref={polygonRef} fill="url(#curl-gradient)" />
      </svg>

      {/* Persistent Nav Dots (Optional/Removable) */}
      <div className="flip-page-dots">
        {Object.keys(SECTION_ROUTE_MAP).map((_, i) => (
          <button
            key={i}
            className={`flip-dot ${i === activePage ? 'flip-dot-active' : ''}`}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PageCurlTransition;
