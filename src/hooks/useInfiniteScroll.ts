import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInfiniteScrollOptions {
  batchSize?: number;
  threshold?: number;
  rootMargin?: string;
}

export interface UseInfiniteScrollResult<T> {
  /** Visible slice of items */
  visibleItems: T[];
  /** Ref for the static sentinel at the bottom */
  loaderRef: RefObject<HTMLDivElement>;
  /** True if there are more items remain */
  hasMore: boolean;
  /** Count of items loaded so far */
  totalLoaded: number;
}

export function useInfiniteScroll<T>(
  items: T[],
  options: UseInfiniteScrollOptions = {},
): UseInfiniteScrollResult<T> {
  const {
    batchSize = 20,
    threshold = 0,
    rootMargin = "0px 0px 300px 0px",
  } = options;

  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [items, batchSize]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            prev < items.length
              ? Math.min(prev + batchSize, items.length)
              : prev,
          );
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [items, batchSize, threshold, rootMargin]);

  return {
    visibleItems: items.slice(0, visibleCount),
    loaderRef,
    hasMore: visibleCount < items.length,
    totalLoaded: visibleCount,
  };
}
