"use client";

/** .reveal の要素が画面に入ったら .is-in を付ける。横に並んだ要素は左から少しずつ遅らせる */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)")];
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.left - b.boundingClientRect.left);
        shown.forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.setProperty("--stagger", `${i * 110}ms`);
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -14% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
