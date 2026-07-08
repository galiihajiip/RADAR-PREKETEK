"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  ":scope > *",
  "section",
  ".panel",
  "article",
  "[data-scroll-fade]"
].join(",");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector<HTMLElement>("[data-scroll-fade-scope]");
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
      .filter((element, index, list) => list.indexOf(element) === index)
      .filter((element) => !element.closest("[data-scroll-fade-skip]"))
      .filter((element) => !element.closest(".leaflet-container"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    elements.forEach((element, index) => {
      element.classList.remove("is-visible");
      element.classList.add("scroll-fade-item");
      element.style.setProperty("--scroll-fade-delay", `${Math.min(index * 35, 180)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
