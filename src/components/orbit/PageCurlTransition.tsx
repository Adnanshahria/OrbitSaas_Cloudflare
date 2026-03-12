import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SECTION_ROUTE_MAP: Record<string, number> = {
  '/': 0,
  '/services': 1,
  '/process': 2,
  '/techstack': 3,
  '/why-us': 4,
  '/projects': 5,
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

  // Handle Scroll Locking (from previous implementation)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isScrollableTop = (el: HTMLElement): boolean => {
      if (el === container || el === document.body || el === document.documentElement) return false;
      const style = window.getComputedStyle(el);
      const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
      if (isScrollable && el.scrollTop > 1) return true;
      return el.parentElement ? isScrollableTop(el.parentElement) : false;
    };

    const isScrollableBottom = (el: HTMLElement): boolean => {
      if (el === container || el === document.body || el === document.documentElement) return false;
      const style = window.getComputedStyle(el);
      const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
      if (isScrollable && Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight - 1) return true;
      return el.parentElement ? isScrollableBottom(el.parentElement) : false;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const target = e.target as HTMLElement;

      if (activePage !== 0) {
        if (e.deltaY > 0 && isScrollableBottom(target)) return;
        if (e.deltaY < 0 && isScrollableTop(target)) return;
      }

      e.preventDefault();
      if (targetPage !== null) return;

      wheelAccum.current += e.deltaY;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);

      if (wheelAccum.current > 100) {
        wheelAccum.current = 0;
        goToPage(activePage + 1);
      } else if (wheelAccum.current < -100) {
        wheelAccum.current = 0;
        goToPage(activePage - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const deltaX = touchStartX.current - e.touches[0].clientX;
      const target = e.target as HTMLElement;

      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      if (activePage !== 0) {
        if (deltaY > 0 && isScrollableBottom(target)) return;
        if (deltaY < 0 && isScrollableTop(target)) return;
      }

      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (targetPage !== null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      const target = e.target as HTMLElement;

      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      if (Math.abs(deltaY) > 80) {
        if (deltaY > 0) {
          if (activePage === 0 || !isScrollableBottom(target)) goToPage(activePage + 1);
        } else {
          if (activePage === 0 || !isScrollableTop(target)) goToPage(activePage - 1);
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
