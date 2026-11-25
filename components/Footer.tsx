import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SITE } from "@/data/site";

const GROUPS = [
  {
    label: "さがす",
    links: [
      { href: "/trimmer/", label: "トリマーをさがす" },
      { href: "/concern/", label: "相談からさがす" },
      { href: "/area/", label: "エリアからさがす" },
    ],
  },
  {
    label: "このサイトについて",
    links: [
      { href: "/join/", label: "掲載を希望するトリマーの方へ" },
      { href: SITE.contactUrl, label: "お問い合わせ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-4">
      <div className="bg-paper">
        {/* ならんだ犬と猫のイラスト。飾りなので読み上げない */}
        <div className="container-page overflow-hidden">
          <Image src="/images/top/friends.png" alt="" width={1536} height={448} sizes="(min-width: 768px) 560px, 80vw" className="reveal reveal-peek mx-auto w-[80%] max-w-[35rem]" />
        </div>
        <div className="container-page grid gap-10 border-t border-line pt-10 pb-10 min-[768px]:grid-cols-12 min-[768px]:pt-12">
          <div className="min-[768px]:col-span-6">
            <Logo size="lg" />
            <p className="mt-5 max-w-[24rem] text-[0.875rem] leading-[1.9] text-sub">
              {SITE.name}は、トリマー一人ひとりに話を聞いて、動物への接し方と人柄を本人の言葉で届けるインタビューメディアです。
            </p>
          </div>
          {GROUPS.map((g) => (
            <nav key={g.label} aria-label={`フッター（${g.label}）`} className="min-[768px]:col-span-3">
              <p className="text-[0.8125rem] font-bold text-sub">{g.label}</p>
              <ul className="mt-3 space-y-2 text-[0.875rem]">
                {g.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href} className="hover:underline">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} target="_blank" rel="noopener" className="hover:underline">
                        {l.label}
                        <span className="sr-only">（新しいタブで開きます）</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="container-page border-t border-line py-5 text-[0.75rem] text-sub">
          © {SITE.name} {SITE.kind}
        </p>
      </div>
    </footer>
  );
}
