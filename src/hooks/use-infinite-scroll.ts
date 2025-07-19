import { useEffect, useRef } from 'react';

/**
 * useInfiniteScroll - A custom hook to implement infinite scrolling using IntersectionObserver.
 *
 * This hook observes a target DOM element and triggers the provided `fetchNextPage` callback
 * when the element becomes visible in the viewport. It's commonly used for "load more"
 * pagination or infinite scroll behavior in UIs.
 *
 * It safely disconnects and recreates the observer on relevant dependency changes,
 * ensuring that the observer stays in sync with the latest `fetchNextPage` logic
 * and control flags (`hasNextPage`, `isFetchingNextPage`).
 *
 * @param {Object} params
 * @param {React.RefObject<HTMLElement | null>} params.targetRef - Ref of the DOM element to observe
 * @param {boolean} params.hasNextPage - Whether there are more pages to load
 * @param {boolean} params.isFetchingNextPage - Whether a page fetch is currently in progress
 * @param {() => void} params.fetchNextPage - Callback to fetch the next page of data
 * @param {number} [params.threshold=0.1] - Intersection threshold (how much of element must be visible)
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
  // Store a reference to the IntersectionObserver instance
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Disconnect the existing observer before creating a new one
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // If the observed element is visible, and we can fetch, trigger next page load
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Fetch next page', isFetchingNextPage);
          fetchNextPage();
        }
      },
      { threshold } // Trigger when `threshold` portion of the target is visible
    );

    const el = targetRef.current;

    // Start observing the element if it exists
    if (el) {
      observerRef.current.observe(el);
    }

    // Cleanup: disconnect observer when component unmounts or dependencies change
    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, targetRef, threshold]);
}
