import React, { useEffect, useRef } from 'react';

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
 * ⚠️ WARNING:
 * This hook **does not work reliably** with elements rendered using `ReactDOM.createPortal`,
 * especially if the portalled element is:
 *   - outside the scrollable root,
 *   - inside a `position: fixed` container,
 *   - or not part of the visible scroll hierarchy.
 *
 * If you need infinite scroll inside a portalled context (like modals or drawers),
 * consider using scroll/resize event listeners or ensure the portal is mounted within
 * the same scroll container.
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold }
    );

    const el = targetRef.current;
    if (el) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, targetRef, threshold]);
}
