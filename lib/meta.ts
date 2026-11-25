import type { Metadata } from "next";
import { SITE } from "@/data/site";

/**
 * ページの metadata を作る。title には必ず SITE.titleSuffix（「スポーツトリマーメディア」を含む）が付く。
 * absoluteTitle はトップ用。
 */
export function pageMeta(opts: {
  title?: string;
  absoluteTitle?: string;
  description?: string;
  path: string;
  noindex?: boolean;
  ogType?: "website" | "article";
}): Metadata {
  const title = opts.absoluteTitle ?? `${opts.title}${SITE.titleSuffix}`;
  const description = opts.description ?? SITE.description;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: opts.path },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: opts.path,
      siteName: SITE.name,
      locale: "ja_JP",
      type: opts.ogType ?? "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
