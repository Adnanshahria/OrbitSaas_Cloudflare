import React, { useRef, useEffect, useCallback } from 'react';

interface CircularMarqueeProps {
    children: React.ReactNode;
    /** Pixels per frame at 60 fps — higher = faster */
    speed?: number;
    /** Auto-scroll direction: 'left' scrolls forward, 'right' scrolls backward */
    direction?: 'left' | 'right';
    /** Gap between items in px */
    gap?: number;
}

/**
 * Infinite circular marquee that auto-scrolls and supports touch/drag
 * in both directions. Items are duplicated internally so the scroll
 * wraps seamlessly at the midpoint.
 */
export function CircularMarquee({
    children,
    speed = 0.5,
    direction = 'left',
    gap = 20,
}: CircularMarqueeProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, scrollLeft: 0 });
    const rafId = useRef<number>(0);
    const paused = useRef(false);

    // ── Boundary-wrap: jump scrollLeft so the user never reaches the real edge ──
    const wrapScroll = useCallback(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
            el.scrollLeft -= half;
        } else if (el.scrollLeft <= 0) {
            el.scrollLeft += half;
        }
    }, []);

    // ── Auto-scroll loop ──
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        // Start at the midpoint so backward scrolling is immediately circular
        el.scrollLeft = el.scrollWidth / 4;

        const tick = () => {
            if (!paused.current && !isDragging.current) {
                el.scrollLeft += direction === 'left' ? speed : -speed;
                wrapScroll();
            }
            rafId.current = requestAnimationFrame(tick);
        };

        rafId.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId.current);
    }, [speed, direction, wrapScroll]);

    // ── Pointer handlers for drag/touch ──
    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const el = wrapperRef.current;
        if (!el) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
        el.setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return;
        const el = wrapperRef.current;
        if (!el) return;
        const dx = e.clientX - dragStart.current.x;
        el.scrollLeft = dragStart.current.scrollLeft - dx;
        wrapScroll();
    }, [wrapScroll]);

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = false;
        wrapperRef.current?.releasePointerCapture(e.pointerId);
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="overflow-x-auto relative cursor-grab active:cursor-grabbing scrollbar-hide"
            style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
        >
            <div className="flex w-max" style={{ gap: `${gap}px` }}>
                {/* Original set */}
                {children}
                {/* Duplicate for seamless wrap */}
                {children}
            </div>
        </div>
    );
}
