import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizedProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  quality?: number;
}

const ImageOptimized: React.FC<ImageOptimizedProps> = ({
  src,
  alt,
  webpSrc,
  fallbackSrc,
  priority = false,
  sizes,
  aspectRatio,
  quality = 85,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // WebP support detection and source selection
  useEffect(() => {
    if (!isInView) return;

    const detectWebPSupport = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    const selectSource = async () => {
      if (webpSrc) {
        const supportsWebP = await detectWebPSupport();
        if (supportsWebP) {
          setCurrentSrc(webpSrc);
          return;
        }
      }
      setCurrentSrc(src);
    };

    selectSource();
  }, [isInView, src, webpSrc]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    onError?.(event);
  };

  const containerStyle = aspectRatio ? {
    aspectRatio: aspectRatio
  } : {};

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return undefined;
    
    const ext = baseSrc.split('.').pop();
    const baseUrl = baseSrc.replace(`.${ext}`, '');
    
    // Generate different sizes for responsive images
    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(width => `${baseUrl}_${width}w.${ext} ${width}w`)
      .join(', ');
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={containerStyle}
    >
      {isInView && (
        <>
          {/* Low quality placeholder for faster perceived loading */}
          {!isLoaded && !hasError && (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse"
              style={{ backdropFilter: 'blur(5px)' }}
            />
          )}
          
          {/* Main image */}
          <img
            src={currentSrc}
            alt={alt}
            srcSet={generateSrcSet(currentSrc)}
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              hasError && 'opacity-50'
            )}
            {...props}
          />
          
          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
              <div className="text-center text-muted-foreground">
                <svg 
                  className="w-8 h-8 mx-auto mb-2 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">Image unavailable</p>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Placeholder when not in view */}
      {!isInView && (
        <div className="w-full h-full bg-muted/20 animate-pulse" />
      )}
    </div>
  );
};

export default ImageOptimized;