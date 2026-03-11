import { useState, useCallback, useRef, useEffect } from 'react';

interface PageCurlContainerProps {
  children: React.ReactNode[];
}

export function PageCurlContainer({ children }: PageCurlContainerProps) {
  const [activePage, setActivePage] = useState(0);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartY = useRef(0);
  const totalPages = children.length;

  const goToPage = useCallback(
    (newTarget: number) => {
      if (targetPage !== null) return; // Currently animating
      if (newTarget < 0 || newTarget >= totalPages || newTarget === activePage) return;
      setTargetPage(newTarget);
      
      // Notify listeners (like Navbar) of the impending page change
      window.dispatchEvent(
        new CustomEvent('pageflip:pagechange', { detail: { pageIndex: newTarget } })
      );
    },
    [activePage, targetPage, totalPages]
  );

  // Animation Loop for gorgeous 2D geometric fold
  useEffect(() => {
    if (targetPage === null) return;
    const container = containerRef.current;
    if (!container) return;

    const isForward = targetPage > activePage;
    let start = performance.now();
    const duration = 1200; // Deep, slow, premium paper fold
    let rAF: number;

    const animate = (now: number) => {
      let t = (now - start) / duration;
      if (t >= 1) {
        setActivePage(targetPage);
        setTargetPage(null);
        return;
      }

      // Smooth custom easing
      const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const W = container.offsetWidth;
      const H = container.offsetHeight;
      const K = p * (W + H);

      let clipPathStr = '';
      const polygonEl = container.querySelector('#curl-polygon');
      const gradient = container.querySelector('#curl-gradient');
      
      if (isForward) {
        // --- FORWARD: Peels from Bottom-Right to Top-Left ---
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
        // --- BACKWARD: Peels from Top-Left to Bottom-Right ---
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
      
      // Hide polygon at extremes to prevent 1px glitch
      if (polygonEl) {
        if (K <= 0 || K >= W + H) polygonEl.setAttribute('opacity', '0');
        else polygonEl.setAttribute('opacity', '1');
      }

      rAF = requestAnimationFrame(animate);
    };

    rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, [targetPage, activePage]);

  // Clean up inline clip-paths AFTER React has unmounted the old page
  useEffect(() => {
    if (targetPage === null && containerRef.current) {
      const remainingPages = containerRef.current.querySelectorAll('.curl-page');
      remainingPages.forEach(p => {
        (p as HTMLElement).style.clipPath = '';
      });
    }
  }, [targetPage]);

  // Event Handlers (Wheel, Touch, Keyboard)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (targetPage !== null) return;

      wheelAccum.current += e.deltaY;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 200);

      if (wheelAccum.current > 80) {
        wheelAccum.current = 0;
        goToPage(activePage + 1);
      } else if (wheelAccum.current < -80) {
        wheelAccum.current = 0;
        goToPage(activePage - 1);
      }
    };

    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (targetPage !== null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 60) {
        if (deltaY > 0) goToPage(activePage + 1);
        else goToPage(activePage - 1);
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [activePage, targetPage, goToPage]);

  // Global key and event navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault(); goToPage(activePage + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault(); goToPage(activePage - 1);
      }
    };
    const navHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.pageIndex === 'number') goToPage(detail.pageIndex);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pageflip:goto', navHandler);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pageflip:goto', navHandler);
    };
  }, [activePage, goToPage]);

  return (
    <div ref={containerRef} className="page-curl-viewport">
      {/* 
        Instead of loading all massive pages simultaneously into heavy 3D transforms,
        we render only the Active and Target pages with simple solid backgrounds.
      */}
      {children.map((child, i) => {
        let isVisible = false;
        let isTopPage = false;
        let zIndex = 0;

        if (targetPage === null) {
          if (i === activePage) { isVisible = true; zIndex = 10; isTopPage = true; }
        } else {
          const isForward = targetPage > activePage;
          if (i === activePage) {
            isVisible = true;
            zIndex = isForward ? 10 : 5;
            isTopPage = isForward;
          }
          if (i === targetPage) {
            isVisible = true;
            zIndex = isForward ? 5 : 10;
            isTopPage = !isForward;
          }
        }

        if (!isVisible) return null;

        return (
          <div
            key={i}
            className={`curl-page ${isTopPage ? 'curl-top-page' : ''}`}
            style={{ zIndex }}
          >
            {child}
          </div>
        );
      })}

      {/* 
        The true paper curl! 
        An absolute SVG overlay that perfectly tracks the 2D clip-path geometry 
        and renders the curved metallic backface shading and drop shadow. 
      */}
      {targetPage !== null && (
        <svg
          className="curl-svg-overlay"
          style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', width: '100%', height: '100%' }}
        >
          <defs>
            <filter id="curl-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="-15" dy="-15" stdDeviation="25" floodColor="rgba(0,0,0,0.6)" />
            </filter>
            {/* The gradient mapping precisely aligns to the fold line center → fold tip */}
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

      {/* Navigation Indicators */}
      <div className="flip-page-dots">
        {children.map((_, i) => (
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

export const SECTION_PAGE_MAP: Record<string, number> = {
  hero: 0, services: 1, process: 2, tech: 3, 'why-us': 4,
  project: 5, reviews: 6, leadership: 7, contact: 8,
};

export function scrollToPageFlipSection(sectionId: string) {
  const pageIndex = SECTION_PAGE_MAP[sectionId];
  if (pageIndex !== undefined) {
    window.dispatchEvent(
      new CustomEvent('pageflip:goto', { detail: { pageIndex } })
    );
  }
}

export default PageCurlContainer;
