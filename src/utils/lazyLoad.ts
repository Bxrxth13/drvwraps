/**
 * Lazy load modules conditionally based on device capabilities
 * to reduce JavaScript bundle size on mobile devices
 */

/**
 * Conditionally import a module only on desktop (> 768px)
 * @param importFn Function that returns a dynamic import
 * @returns Promise<any> or null
 */
export const loadDesktopOnly = async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    if (window.innerWidth > 768) {
        try {
            return await importFn();
        } catch (error) {
            console.error('Failed to load desktop module:', error);
            return null;
        }
    }
    return null;
};

/**
 * Conditionally import a module only on mobile (<= 768px)
 * @param importFn Function that returns a dynamic import
 * @returns Promise<any> or null
 */
export const loadMobileOnly = async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    if (window.innerWidth <= 768) {
        try {
            return await importFn();
        } catch (error) {
            console.error('Failed to load mobile module:', error);
            return null;
        }
    }
    return null;
};

/**
 * Load a module only when needed (intersection observer)
 * @param element Element to observe
 * @param importFn Function that returns a dynamic import
 * @param options IntersectionObserver options
 */
export const loadOnVisible = <T>(
    element: Element | null,
    importFn: () => Promise<T>,
    options?: IntersectionObserverInit
): void => {
    if (!element || typeof IntersectionObserver === 'undefined') {
        // Fallback: load immediately if no IntersectionObserver support
        importFn().catch(console.error);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    importFn()
                        .catch(console.error)
                        .finally(() => observer.disconnect());
                }
            });
        },
        {
            rootMargin: '50px',
            ...options,
        }
    );

    observer.observe(element);
};

/**
 * Load a module on user interaction
 * @param element Element to attach event listener
 * @param event Event name (e.g., 'click', 'mouseenter')
 * @param importFn Function that returns a dynamic import
 */
export const loadOnInteraction = <T>(
    element: Element | null,
    event: string,
    importFn: () => Promise<T>
): void => {
    if (!element) return;

    const handler = () => {
        importFn()
            .catch(console.error)
            .finally(() => element.removeEventListener(event, handler));
    };

    element.addEventListener(event, handler, { once: true });
};

/**
 * Load a module after a delay (idle time)
 * @param importFn Function that returns a dynamic import
 * @param delay Delay in milliseconds (default: 2000ms)
 */
export const loadOnIdle = <T>(
    importFn: () => Promise<T>,
    delay: number = 2000
): void => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(
            () => {
                importFn().catch(console.error);
            },
            { timeout: delay }
        );
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            importFn().catch(console.error);
        }, delay);
    }
};

/**
 * Load a module based on network connection quality
 * @param importFn Function that returns a dynamic import
 * @param minEffectiveType Minimum connection type ('slow-2g' | '2g' | '3g' | '4g')
 */
export const loadOnFastConnection = <T>(
    importFn: () => Promise<T>,
    minEffectiveType: '2g' | '3g' | '4g' = '4g'
): void => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) {
        // If connection API not available, load anyway
        importFn().catch(console.error);
        return;
    }

    const speedRank: Record<string, number> = {
        'slow-2g': 0,
        '2g': 1,
        '3g': 2,
        '4g': 3,
    };

    const currentSpeed = speedRank[connection.effectiveType] || 3;
    const minSpeed = speedRank[minEffectiveType] || 3;

    if (currentSpeed >= minSpeed) {
        importFn().catch(console.error);
    }
};
