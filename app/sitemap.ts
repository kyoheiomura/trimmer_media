import type { MetadataRoute } from "next";
import { AREA_INDEX_MIN, SITE } from "@/data/site";
import { getAreaTree } from "@/lib/areas-index";
import { getConcernIndex } from "@/lib/concerns-index";
import { getAllVenues, getAllTrimmers } from "@/lib/content";

// noindex のページ（少人数のエリア・目的）は入れない
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE.url}${path}`;
  const trimmer = getAllTrimmers();
  const latest = trimmer[0]?.publishedAt;

  const fixed = ["/", "/trimmer/", "/concern/", "/area/", "/join/", "/privacy/"].map(
    (p) => ({ url: url(p), lastModified: ["/", "/trimmer/"].includes(p) ? latest : undefined }),
  );

  const areas = getAreaTree().flatMap((p) => [
    ...(p.count >= AREA_INDEX_MIN ? [{ url: url(`/area/${p.slug}/`) }] : []),
    ...p.cities.filter((c) => c.count >= AREA_INDEX_MIN).map((c) => ({ url: url(`/area/${p.slug}/${c.slug}/`) })),
  ]);

  const concerns = getConcernIndex()
    .filter((s) => s.count >= AREA_INDEX_MIN)
    .map((s) => ({ url: url(`/concern/${s.slug}/`) }));

  return [
    ...fixed,
    ...concerns,
    ...trimmer.map((s) => ({ url: url(`/trimmer/${s.slug}/`), lastModified: s.updatedAt ?? s.publishedAt })),
    ...getAllVenues().map((c) => ({ url: url(`/salon/${c.slug}/`), lastModified: c.verifiedAt })),
    ...areas,
  ];
}
