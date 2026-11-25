import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SITE } from "@/data/site";

const NAV = [
  { href: "/concern/", label: "相談からさがす" },
  { href: "/area/", label: "エリアからさがす" },
  { href: "/join/", label: "掲載について" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 min-[768px]:h-20">
        <Link href="/" aria-label={`${SITE.name} ホーム`} className="flex shrink-0 items-center gap-4 py-1">
          <Logo />
          <span aria-hidden="true" className="hidden text-[0.75rem] text-sub min-[1024px]:inline">
            {SITE.descriptor}
          </span>
        </Link>
        <nav aria-label="メイン">
          <ul className="flex items-center gap-1 text-[0.875rem] font-bold min-[768px]:gap-2">
            {NAV.map((n) => (
              <li key={n.href} className="hidden min-[820px]:block">
                <Link href={n.href} className="inline-flex min-h-11 items-center px-3 hover:underline hover:decoration-mint hover:decoration-2 hover:underline-offset-8">
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="min-[820px]:ml-2">
              <Link href="/trimmer/" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-white transition-colors hover:bg-[#3a3a37]">
                トリマーをさがす
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
