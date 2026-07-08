import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  /** Children to render */
  children: React.ReactNode;
  /** Optional offset in px to trigger earlier/later */
  rootMargin?: string;
  /** Optional className to merge */
  className?: string;
}

/**
 * FadeIn component that uses IntersectionObserver to add a `visible` class
 * when the element scrolls into view, creating a smooth fade‑in + slide‑up effect.
 *
 * Usage example:
 * ```tsx
 * <FadeIn className="my-card">...</FadeIn>
 * ```
 */
export default function FadeIn({ children, rootMargin = "0px", className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`fade-in ${visible ? "visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
