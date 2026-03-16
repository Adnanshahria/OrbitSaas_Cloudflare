import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    className?: string;
}

export function ImageWithSkeleton({ src, alt, className }: ImageWithSkeletonProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Reset state when src changes
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
            {/* Shimmer Skeleton */}
            <AnimatePresence>
                {!isLoaded && !hasError && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-10 shimmer-skeleton"
                    />
                )}
            </AnimatePresence>

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 z-10 bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold">
                    Image failed to load
                </div>
            )}

            {/* The Actual Image */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsLoaded(true); // Stop showing shimmer
                    setHasError(true);
                }}
                className={`w-full h-full transition-opacity duration-700 ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
                style={{ objectFit: 'cover' }}
            />
        </div>
    );
}
