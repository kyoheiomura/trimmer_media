import { PageHero } from "@/components/PageHero";
import { TrimmerBrowser } from "@/components/TrimmerBrowser";
import { getAreaTree } from "@/lib/areas-index";
import { getAllTrimmers } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

export const metadata = pageMeta({
  title: "トリマーをさがす（インタビュー一覧）",
  description:
    "取材したトリマーの一覧です。相談・エリア・心配ごとで絞り込んで、気になるトリマーのインタビューを読めます。",
  path: "/trimmer/",
});

export default function TrimmerListPage() {
  const people = getAllTrimmers().map(toSummary);
  const areas = getAreaTree().map((p) => ({
    slug: p.slug,
    name: p.name,
    cities: p.cities.map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/trimmer/", label: "トリマーをさがす" }]}
        title="トリマーをさがす"
        lead={`${people.length}人のトリマーに話を聞きました。相談やエリアで絞り込んで、気になる人から読んでみてください。`}
      />
      <div className="container-page pt-10 min-[768px]:pt-14">
        <div>
          <TrimmerBrowser people={people} areas={areas} />
        </div>
      </div>
    </>
  );
}
