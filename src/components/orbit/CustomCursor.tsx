import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LIGHT_MODE_SECTIONS = ['services', 'tech', 'project', 'leadership'];

const PATH_TO_SECTION: Record<string, string> = {
  '/': 'hero',
  '/services': 'services',
  '/process': 'process',
  '/techstack': 'tech',
  '/why-us': 'why-us',
  '/proj': 'project',
  '/reviews': 'reviews',
  '/leadership': 'leadership',
  '/contact': 'contact',
};

export default function CustomCursor() {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    
    // Determine theme based on current route
    const activeSection = PATH_TO_SECTION[location.pathname] || 'hero';
    const isLightMode = LIGHT_MODE_SECTIONS.includes(activeSection);
    
    const springConfig = { stiffness: 800, damping: 50, mass: 0.5 }; // Stiffer and more damped to prevent overshoot
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Interaction springs - faster and more damped
    const interactionConfig = { stiffness: 500, damping: 40 };
    const cursorScale = useSpring(isPointer ? 2.5 : 1, interactionConfig);
    const pointerOpacity = isPointer ? 0.6 : 1; 
    const visibilityOpacity = useSpring(isVisible ? 1 : 0, interactionConfig);
    const innerDotScale = useSpring(isPointer ? 0.2 : 1, interactionConfig);

    const cursorOpacity = useTransform(
        visibilityOpacity,
        (vis: number) => vis * pointerOpacity
    );

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, summary');
            setIsPointer(!!isClickable);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);
        
        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [mouseX, mouseY]);

    const cursorColor = isLightMode ? '#059669' : '#B69762'; 

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[10000] hidden lg:flex items-center justify-center transition-colors duration-200"
            style={{ 
                x: springX, 
                y: springY, 
                translateX: '-50%', 
                translateY: '-50%',
                scale: cursorScale,
                opacity: cursorOpacity,
                borderColor: `${cursorColor}66`, 
                mixBlendMode: 'difference',
                boxShadow: `0 0 15px ${cursorColor}33`
            }}
        >
            <motion.div 
                className="w-1.5 h-1.5 rounded-full transition-colors duration-200" 
                style={{ 
                    scale: innerDotScale,
                    backgroundColor: cursorColor,
                    boxShadow: `0 0 8px ${cursorColor}`
                }}
            />
        </motion.div>
    );
}
