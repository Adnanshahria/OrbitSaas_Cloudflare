import { useState, useCallback, useRef, useEffect } from 'react';

interface PageFlipContainerProps {
  children: React.ReactNode[];
}

export function PageFlipContainer({ children }: PageFlipContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartY = useRef(0);
  const totalPages = children.length;

  const goToPage = useCallback(
    (targetPage: number) => {
      if (isAnimating) return;
      if (targetPage < 0 || targetPage >= totalPages) return;
      if (targetPage === currentPage) return;

      setIsAnimating(true);
      setCurrentPage(targetPage);

      // Notify listeners (e.g. Navbar) about the page change
      window.dispatchEvent(
        new CustomEvent('pageflip:pagechange', { detail: { pageIndex: targetPage } })
      );
      setTimeout(() => {
        setIsAnimating(false);
      }, 900);
    },
    [currentPage, isAnimating, totalPages]
  );

  // Wheel event handler — accumulate delta then flip
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;

      wheelAccum.current += e.deltaY;

      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelAccum.current = 0;
      }, 200);

      // Threshold to trigger page flip
      if (wheelAccum.current > 80) {
        wheelAccum.current = 0;
        goToPage(currentPage + 1);
      } else if (wheelAccum.current < -80) {
        wheelAccum.current = 0;
        goToPage(currentPage - 1);
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [currentPage, isAnimating, goToPage]);

  // Touch event handlers for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 60) {
        if (deltaY > 0) goToPage(currentPage + 1);
        else goToPage(currentPage - 1);
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentPage, isAnimating, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPage(currentPage - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPage(totalPages - 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, goToPage, totalPages]);

  // Expose a scroll-to method via a custom event for navbar
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.pageIndex === 'number') {
        goToPage(detail.pageIndex);
      }
    };
    window.addEventListener('pageflip:goto', handler);
    return () => window.removeEventListener('pageflip:goto', handler);
  }, [goToPage]);

  return (
    <div ref={containerRef} className="page-flip-viewport">
      <div className="page-flip-book">
        {children.map((child, i) => {
          // Pages that have been "turned" (past pages) rotate away
          const isFlipped = i < currentPage;
          const isCurrent = i === currentPage;
          const isNext = i === currentPage + 1;

          return (
            <div
              key={i}
              className={`flip-page ${isFlipped ? 'flip-page-flipped' : ''} ${isCurrent ? 'flip-page-current' : ''}`}
              style={{
                zIndex: totalPages - i, // Stack order: first page on top
                pointerEvents: isCurrent ? 'auto' : 'none',
              }}
            >
              <div className="flip-page-front">
                {child}
              </div>
              <div className="flip-page-back" />
            </div>
          );
        })}
      </div>

      {/* Page indicator dots */}
      <div className="flip-page-dots">
        {children.map((_, i) => (
          <button
            key={i}
            className={`flip-dot ${i === currentPage ? 'flip-dot-active' : ''}`}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Map section IDs to page indices for navbar integration
export const SECTION_PAGE_MAP: Record<string, number> = {
  hero: 0,
  services: 1,
  process: 2,
  tech: 3,
  'why-us': 4,
  project: 5,
  reviews: 6,
  leadership: 7,
  contact: 8,
};

export function scrollToPageFlipSection(sectionId: string) {
  const pageIndex = SECTION_PAGE_MAP[sectionId];
  if (pageIndex !== undefined) {
    window.dispatchEvent(
      new CustomEvent('pageflip:goto', { detail: { pageIndex } })
    );
  }
}

export default PageFlipContainer;
