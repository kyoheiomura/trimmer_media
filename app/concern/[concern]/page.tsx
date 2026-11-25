import Link from "next/link";
import { notFound } from "next/navigation";
import { ListPage } from "@/components/ListPage";
import { AREA_INDEX_MIN } from "@/data/site";
import { pageMeta } from "@/lib/meta";
import { trimmersOfConcern, getAllConcerns } from "@/lib/concerns-index";
import { toSummary } from "@/lib/view";

type Props = { params: Promise<{ concern: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // まだ取材していない相談のページも作る（「これから取材します」と出す。少ないうちは noindex）
  return getAllConcerns().map((s) => ({ concern: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { concern: concernSlug } = await params;
  const concern = getAllConcerns().find((s) => s.slug === concernSlug);
  if (!concern) return {};
  return pageMeta({
    title: `「${concern.label}」の相談を引き受けるトリマー`,
    description: `「${concern.label}」の相談をよく引き受けるトリマーのインタビュー。動物への接し方と人柄を、本人の言葉で紹介しています。`,
    path: `/concern/${concern.slug}/`,
    // 薄いページを増やさないため、少ないうちはインデックスさせない
    noindex: concern.count < AREA_INDEX_MIN,
  });
}

export default async function ConcernPage({ params }: Props) {
  const { concern: concernSlug } = await params;
  const concern = getAllConcerns().find((s) => s.slug === concernSlug);
  if (!concern) notFound();
  return (
    <ListPage
      crumbs={[
        { href: "/concern/", label: "相談からさがす" },
        { href: `/concern/${concern.slug}/`, label: concern.label },
      ]}
      title={concern.label}
      lead={
        <p>
          {concern.lead}
          進め方も考え方も、人によって違います。それぞれのインタビューで確かめてください。
        </p>
      }
      people={trimmersOfConcern(concern.slug).map(toSummary)}
    >
      {concern.count === 0 && (
        <div className="card p-10 text-center">
          <p className="font-bold">この相談を引き受けるトリマーは、これから取材します。</p>
          <p className="mt-2 text-sm text-sub">
            <Link href="/trimmer/" className="link">
              すべてのトリマーを見る
            </Link>
          </p>
        </div>
      )}
    </ListPage>
  );
}
