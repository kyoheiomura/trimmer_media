"use client";

/**
 * スマートフォン用のメニュー。ヘッダー右の「メニュー」ボタンで、ヘッダーの下に白い面が開く。
 * リンクを押したとき・ページが変わったとき・Esc キーで閉じる。
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-[820px]:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="flex size-11 flex-col items-center justify-center gap-[5px] rounded-full bg-towel"
      >
        <span className="sr-only">{open ? "メニューを閉じる" : "メニューを開く"}</span>
        <span aria-hidden="true" className={`h-0.5 w-5 rounded-full bg-ink transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
        <span aria-hidden="true" className={`h-0.5 w-5 rounded-full bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span aria-hidden="true" className={`h-0.5 w-5 rounded-full bg-ink transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </button>
      <nav id="mobile-menu" aria-label="メニュー" hidden={!open} className="absolute inset-x-0 top-full border-t border-line bg-paper px-5 pt-2 pb-6">
        <ul>
          {links.map((l) => (
            <li key={l.href} className="border-b border-line">
              <Link href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between text-[1rem] font-bold">
                {l.label}
                <span aria-hidden="true" className="size-2 rotate-45 border-t-2 border-r-2 border-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
