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

      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const K = p * (W + H);

      let clipPathStr = '';
      const polygonEl = container.querySelector('#curl-polygon');
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
            polygonEl.setAttribute('points', backPts.map(pt => `${pt[0]},${pt[1]}`).join(' '));
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
            polygonEl.setAttribute('points', backPts.map(pt => `${pt[0]},${pt[1]}`).join(' '));
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
        if (K <= 0 || K >= W + H) polygonEl.setAttribute('opacity', '0');
        else polygonEl.setAttribute('opacity', '1');
      }

      rAF = requestAnimationFrame(animate);
    };

    rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, [targetPage, activePage]);

  // ─── MOBILE: Count-based swipe thresholds per page ───
  // How many swipes (in the same direction) are needed before the next page transition fires.
  // e.g. Services (1) = 3 means: swipe 1 scrolls, swipe 2 scrolls, swipe 3 triggers transition.
  const MOBILE_FORWARD_SWIPES: Record<number, number> = {
    0: 1,   // Home — no overflow, transition immediately
    1: 3,   // Services — exactly 3 swipes
    2: 5,   // Process — exactly 5 swipes
    3: 2,   // TechStack
    4: 2,   // Why Us
    5: 2,   // Projects
    6: 2,   // Reviews
    7: 2,   // Leadership
    8: 2,   // Contact
  };
  const MOBILE_BACKWARD_SWIPES = 2; // For going to previous page, always 2

  const mobileSwipeCount = useRef(0);
  const mobileSwipeDir = useRef<'up' | 'down' | null>(null);
  
  // Track when the user last scrolled inside a scrollable area for desktop
  const lastInternalScrollTime = useRef(0);

  // Reset swipe counter and scroll times when page changes
  useEffect(() => {
    mobileSwipeCount.current = 0;
    mobileSwipeDir.current = null;
    lastInternalScrollTime.current = 0;
  }, [activePage]);

  // Handle Scroll Locking & Touch
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if any ancestor (up to container) can scroll down
    const canScrollDown = (el: HTMLElement): boolean => {
      let node: HTMLElement | null = el;
      while (node && node !== container) {
        const style = window.getComputedStyle(node);
        const hasOverflow = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
        if (hasOverflow && Math.ceil(node.scrollTop + node.clientHeight) < node.scrollHeight - 2) return true;
        node = node.parentElement;
      }
      return false;
    };

    // Check if any ancestor (up to container) can scroll up
    const canScrollUp = (el: HTMLElement): boolean => {
      let node: HTMLElement | null = el;
      while (node && node !== container) {
        const style = window.getComputedStyle(node);
        const hasOverflow = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
        if (hasOverflow && node.scrollTop > 2) return true;
        node = node.parentElement;
      }
      return false;
    };

    // ─── Desktop Wheel ───
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const target = e.target as HTMLElement;

      // If there's room to scroll inside the page, allow native scroll
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

      // Cooldown: if the user was just scrolling inside the page content,
      // ignore wheel events for 600ms to prevent momentum bleed
      const now = performance.now();
      if (now - lastInternalScrollTime.current < 600) {
        wheelAccum.current = 0;
        return;
      }

      wheelAccum.current += e.deltaY;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);

      if (wheelAccum.current > 300) {
        wheelAccum.current = 0;
        goToPage(activePage + 1);
      } else if (wheelAccum.current < -300) {
        wheelAccum.current = 0;
        goToPage(activePage - 1);
      }
    };

    // ─── Mobile Touch: Pure count-based (NO scroll detection) ───
    const MOBILE_FORWARD_SWIPES: Record<number, number> = {
      0: 1,   // Home
      1: 3,   // Services — exactly 3 swipes
      2: 5,   // Process — exactly 5 swipes
      3: 2,   // TechStack
      4: 2,   // Why Us
      5: 2,   // Projects
      6: 2,   // Reviews
      7: 2,   // Leadership
      8: 2,   // Contact
    };
    const MOBILE_BACKWARD_SWIPES = 2; // For going to previous page, always 2
    
    // Default required forward swipes if page not found
    const requiredForward = MOBILE_FORWARD_SWIPES[activePage] ?? 2;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      // By completely preventing default on touchmove, we disable native browser scrolling
      // This ensures the browser NEVER swallows our swipe events, making the counter 100% reliable.
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (targetPage !== null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;

      if (Math.abs(deltaX) > Math.abs(deltaY)) return; // Ignore horizontal swipes
      if (Math.abs(deltaY) < 40) return; // Lowered threshold to 40px for easier detection

      const dir: 'up' | 'down' = deltaY > 0 ? 'up' : 'down';

      // Direction changed → reset counter
      if (dir !== mobileSwipeDir.current) {
        mobileSwipeCount.current = 0;
        mobileSwipeDir.current = dir;
      }

      mobileSwipeCount.current++;

      if (dir === 'up') {
        // Swiping up → wants NEXT page
        if (mobileSwipeCount.current >= requiredForward) {
          mobileSwipeCount.current = 0;
          goToPage(activePage + 1);
        }
      } else {
        // Swiping down → wants PREV page
        if (mobileSwipeCount.current >= MOBILE_BACKWARD_SWIPES) {
          mobileSwipeCount.current = 0;
          goToPage(activePage - 1);
        }
      }
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
            style={{ zIndex }}
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
            <filter id="curl-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="-15" dy="-15" stdDeviation="25" floodColor="rgba(0,0,0,0.6)" />
            </filter>
            <linearGradient id="curl-gradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="10%" stopColor="#1a1a1a" />
              <stop offset="35%" stopColor="#666666" />
              <stop offset="55%" stopColor="#f0f0f0" />
              <stop offset="70%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#888888" />
            </linearGradient>
          </defs>
          <polygon id="curl-polygon" fill="url(#curl-gradient)" filter="url(#curl-shadow)" />
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
