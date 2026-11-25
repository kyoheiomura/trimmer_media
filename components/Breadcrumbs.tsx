import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/data/site";

export type Crumb = { href: string; label: string };

/** パンくず。先頭の「ホーム」は自動で付ける。最後の項目が今のページ */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: "ホーム" }, ...items];
  return (
    <>
      <nav aria-label="パンくずリスト" className="container-page pt-5 text-[0.75rem] text-sub">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">›</span>}
              {i === all.length - 1 ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${SITE.url}${c.href}`,
          })),
        }}
      />
    </>
  );
}
