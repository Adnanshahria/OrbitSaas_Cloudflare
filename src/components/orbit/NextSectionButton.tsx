import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

interface NextSectionButtonProps {
    nextRoute: string;
    label?: string;
    variant?: 'dark' | 'light' | 'golden';
    className?: string;
}

export const NextSectionButton: React.FC<NextSectionButtonProps> = ({ 
    nextRoute, 
    label = "Next Section",
    variant = 'light',
    className = 'mt-16 mb-8'
}) => {
    const navigate = useNavigate();
    
    // Choose colors based on the section's overall theme
    let bgColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FAF8F1';
    let borderColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(62, 54, 36, 0.1)';
    let iconColor = variant === 'dark' ? '#fff' : '#3E3624';

    if (variant === 'golden') {
        bgColor = 'rgba(212, 160, 23, 0.05)';
        borderColor = 'rgba(212, 160, 23, 0.2)';
        iconColor = '#FFD700'; // Golden color
    }

    return (
        <div className={`flex flex-col items-center gap-6 group/nav ${className}`}>
            <button
                onClick={() => navigate(nextRoute)}
                className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl overflow-hidden"
                style={{ 
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`
                }}
                aria-label={label}
            >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <motion.div
                    animate={{ 
                        y: [0, 5, 0],
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="relative z-10"
                >
                    <ArrowDown size={24} style={{ color: iconColor }} />
                </motion.div>

                {/* Shimmer Link */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] group-hover/nav:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out" />
            </button>
        </div>
    );
};
