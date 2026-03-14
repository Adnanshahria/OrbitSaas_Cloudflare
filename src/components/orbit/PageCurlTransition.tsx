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
  
  const totalPages = Object.keys(SECTION_ROUTE_MAP).length;

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
    const duration = 1200; 
    let rAF: number;

    const animate = (now: number) => {
      let t = (now - start) / duration;
      if (t >= 1) {
        setActivePage(targetPage);
        setTargetPage(null);
        return;
      }

      // Smooth easing
      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const K = p * (W + H);

      let clipPathStr = '';
      const polygonEl = container.querySelector('#curl-polygon');
      const shadowEl = container.querySelector('#curl-shadow-poly');
      const gradient = container.querySelector('#curl-gradient');
      
      if (isForward) {
        if (K <= 0) {
          clipPathStr = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        } else if (K >= W + H) {
          clipPathStr = `polygon(0px 0px, 0px 0px, 0px 0px)`;
        } else {
          const E1 = K <= H ? [W, H - K] : [W + H - K, 0];
          const E2 = K <= W ? [W - K, H] : [0, W + H - K];
          const frontPts = [[0, 0]];
          if (K <= H) frontPts.push([W, 0]);
          frontPts.push(E1, E2);
          if (K <= W) frontPts.push([0, H]);
          clipPathStr = `polygon(${frontPts.map(pt => `${pt[0]}px ${pt[1]}px`).join(', ')})`;
          
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
          if (gradient) {
            gradient.setAttribute('x1', `${W - K / 2}`);
            gradient.setAttribute('y1', `${H - K / 2}`);
            gradient.setAttribute('x2', `${W - K}`);
            gradient.setAttribute('y2', `${H - K}`);
          }
        }
      } else {
        if (K <= 0) {
          clipPathStr = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        } else if (K >= W + H) {
          clipPathStr = `polygon(0px 0px, 0px 0px, 0px 0px)`;
        } else {
          const E1 = K <= W ? [K, 0] : [W, K - W];
          const E2 = K <= H ? [0, K] : [K - H, H];
          const frontPts = [E1];
          if (K <= W) frontPts.push([W, 0]);
          frontPts.push([W, H]);
          if (K <= H) frontPts.push([0, H]);
          frontPts.push(E2);
          clipPathStr = `polygon(${frontPts.map(pt => `${pt[0]}px ${pt[1]}px`).join(', ')})`;
          
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
          if (gradient) {
            gradient.setAttribute('x1', `${K / 2}`);
            gradient.setAttribute('y1', `${K / 2}`);
            gradient.setAttribute('x2', `${K}`);
            gradient.setAttribute('y2', `${K}`);
          }
        }
      }

      const topPageEl = container.querySelector('.curl-top-page') as HTMLElement;
      if (topPageEl) topPageEl.style.clipPath = clipPathStr;
      
      if (polygonEl) {
        const opacity = (K <= 0 || K >= W + H) ? '0' : '1';
        polygonEl.setAttribute('opacity', opacity);
        if (shadowEl) shadowEl.setAttribute('opacity', opacity);
      }

      rAF = requestAnimationFrame(animate);
    };

    rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, [targetPage, activePage]);

  // Track when the user last scrolled inside a scrollable area
  const lastInternalScrollTime = useRef(0);
  // Track edge-dwelling: how long user has been stuck at scroll boundary
  const edgeDwellStart = useRef(0);
  const edgeDwellDir = useRef<'up' | 'down' | null>(null);
  // Track cumulative touch delta for momentum-style transition triggering
  const touchCumulativeDelta = useRef(0);

  // Reset counters when page changes
  useEffect(() => {
    lastInternalScrollTime.current = 0;
    edgeDwellStart.current = 0;
    edgeDwellDir.current = null;
    touchCumulativeDelta.current = 0;
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

      if (wheelAccum.current > 180) {
        wheelAccum.current = 0;
        goToPage(activePage + 1);
      } else if (wheelAccum.current < -180) {
        wheelAccum.current = 0;
        goToPage(activePage - 1);
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
        goToPage(activePage + 1);
      } else if (swipingDown) {
        goToPage(activePage - 1);
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
    <div ref={containerRef} className="page-curl-viewport">
      {/* 
         We render two indices: the activePage and the targetPage.
         The component 'children' is a render prop that returns the correct section for an index.
      */}
      {[targetPage, activePage].map((i) => {
        if (i === null) return null;
        const isTopPage = i === activePage && targetPage !== null;
        const zIndex = i === activePage ? 10 : 5;
        
        return (
          <div
            key={i}
            className={`curl-page ${isTopPage ? 'curl-top-page' : ''}`}
            style={{ 
              zIndex,
              transform: 'translateZ(0)',
              willChange: 'clip-path'
            }}
          >
            {children(i)}
          </div>
        );
      })}

      {targetPage !== null && (
        <svg
          className="curl-svg-overlay"
          style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="curl-gradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="15%" stopColor="#222222" />
              <stop offset="40%" stopColor="#666666" />
              <stop offset="55%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#eeeeee" />
              <stop offset="100%" stopColor="#aaaaaa" />
            </linearGradient>
          </defs>
          {/* Hardware-accelerated shadow polygon instead of feDropShadow */}
          <polygon id="curl-shadow-poly" fill="rgba(0,0,0,0.4)" transform="translate(-10, -10)" />
          <polygon id="curl-polygon" fill="url(#curl-gradient)" />
        </svg>
      )}

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
