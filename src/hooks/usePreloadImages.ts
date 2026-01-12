import { useEffect, useState } from 'react';

interface PreloadState {
  loaded: boolean;
  error: boolean;
}

/**
 * Hook to preload critical images for instant display
 * Returns loading state for each image
 */
export function usePreloadImages(imageUrls: string[]): Record<string, PreloadState> {
  const [loadedImages, setLoadedImages] = useState<Record<string, PreloadState>>({});

  useEffect(() => {
    // Initialize all images as not loaded
    const initialState: Record<string, PreloadState> = {};
    imageUrls.forEach(url => {
      initialState[url] = { loaded: false, error: false };
    });
    setLoadedImages(initialState);

    // Preload each image
    const imageElements: HTMLImageElement[] = [];
    
    imageUrls.forEach((url) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [url]: { loaded: true, error: false }
        }));
      };

      img.onerror = () => {
        setLoadedImages(prev => ({
          ...prev,
          [url]: { loaded: false, error: true }
        }));
      };

      // Set src after listeners are attached
      img.src = url;
      imageElements.push(img);
    });

    // Cleanup
    return () => {
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [imageUrls.join(',')]);

  return loadedImages;
}

/**
 * Simple hook to preload a single image
 */
export function usePreloadImage(imageUrl: string): PreloadState {
  const result = usePreloadImages([imageUrl]);
  return result[imageUrl] || { loaded: false, error: false };
}

