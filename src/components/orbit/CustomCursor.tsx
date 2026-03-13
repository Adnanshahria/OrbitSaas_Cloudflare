import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isPointer, setIsPointer] = useState(false);
    
    const springConfig = { stiffness: 450, damping: 30 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Scale and opacity changes based on interaction
    const cursorScale = useSpring(isPointer ? 2.5 : 1, { stiffness: 300, damping: 20 });
    const cursorOpacity = useSpring(isPointer ? 0.6 : 1, { stiffness: 300, damping: 20 });
    const innerDotScale = useSpring(isPointer ? 0.2 : 1, { stiffness: 300, damping: 20 });

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Check if hovering over interactive elements
            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, [role="button"], input, select, textarea');
            setIsPointer(!!isClickable);
        };

        window.addEventListener('mousemove', moveMouse);
        return () => window.removeEventListener('mousemove', moveMouse);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-amber-600/40 pointer-events-none z-[9999] hidden lg:flex items-center justify-center mix-blend-difference shadow-[0_0_15px_rgba(182,151,98,0.2)]"
            style={{ 
                x: springX, 
                y: springY, 
                translateX: '-50%', 
                translateY: '-50%',
                scale: cursorScale,
                opacity: cursorOpacity
            }}
        >
            <motion.div 
                className="w-1.5 h-1.5 bg-[#B69762] rounded-full shadow-[0_0_8px_rgba(182,151,98,1)]" 
                style={{ scale: innerDotScale }}
            />
        </motion.div>
    );
}
