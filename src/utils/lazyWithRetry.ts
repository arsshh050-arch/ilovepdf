import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Enhanced lazy loader that retries dynamic import on network failures
 * or stale Vite bundle cache errors. Automatically handles deployment chunk changes.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  interval = 500
): LazyExoticComponent<T> {
  return lazy(async () => {
    let attempts = 0;
    while (attempts < retries) {
      try {
        return await factory();
      } catch (error: any) {
        attempts++;
        const errorMessage = error?.message || String(error || '');
        const isChunkError =
          error?.name === 'ChunkLoadError' ||
          errorMessage.includes('Failed to fetch dynamically imported module') ||
          errorMessage.includes('Importing a module script failed') ||
          errorMessage.includes('error loading dynamically imported module');

        if (isChunkError && typeof window !== 'undefined') {
          const sessionKey = 'ilovepdf_chunk_reload_' + window.location.pathname;
          const hasReloaded = sessionStorage.getItem(sessionKey);
          if (!hasReloaded) {
            sessionStorage.setItem(sessionKey, '1');
            window.location.reload();
            return new Promise(() => {}); // Prevent uncaught exception while reloading
          }
        }

        if (attempts >= retries) {
          console.warn(`Dynamic import warning after ${retries} attempts:`, error);
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, interval * attempts));
      }
    }
    return await factory();
  });
}
