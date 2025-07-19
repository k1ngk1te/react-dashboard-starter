import { useEffect, useRef } from 'react';

/**
 * Hook to implement infinite scrolling using IntersectionObserver.
 *
 * @param {Object} params - Configuration object
 * @param {React.RefObject<HTMLElement | null>} params.targetRef - The ref of the element to observe
 * @param {boolean} params.hasNextPage - Whether there are more pages to fetch
 * @param {boolean} params.isFetchingNextPage - Whether a fetch is currently in progress
 * @param {() => void} params.fetchNextPage - Function to fetch the next page
 * @param {number} [params.threshold=0.1] - How much of the target is visible before triggering (0 to 1)
 */
export default function useInfiniteScroll({
  targetRef,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}) {
  // Ref to store the observer instance so it can be reused/cleaned up
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Store the latest values of `hasNextPage` and `isFetchingNextPage`
  // This avoids issues with stale closures inside the observer callback
  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  // Keep refs up to date when the state changes
  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPageRef.current && !isFetchingNextPageRef.current) {
          // Call the fetch function only if more pages exist and nothing is currently fetching
          fetchNextPage();
        }
      },
      { threshold }
    );

    // Start observing the target element
    const el = targetRef.current;
    if (el) {
      observerRef.current.observe(el);
    }

    // Clean up the observer on unmount or dependency change
    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchNextPage, targetRef, threshold]);
}
