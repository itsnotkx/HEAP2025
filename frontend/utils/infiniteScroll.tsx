// lib/useInfiniteScroll.ts
import { useEffect, useRef } from "react";

export default function useInfiniteScroll(callback: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    const current = bottomRef.current;

    if (current) observerRef.current.observe(current);

    return () => {
      if (current) observerRef.current?.unobserve(current);
    };
  }, [callback]);

  return bottomRef;
}
