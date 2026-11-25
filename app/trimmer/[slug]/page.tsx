import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareFieldsList } from "@/components/CompareFieldsList";
import { JsonLd } from "@/components/JsonLd";
import { TrimmerGrid } from "@/components/TrimmerCard";
import { SITE } from "@/data/site";
import { ConcernChips } from "@/components/ConcernChips";
import { findConcern } from "@/data/vocab";
import { venuesOf, getAllTrimmers, getTrimmer } from "@/lib/content";
import { chaptersOf, renderInterview } from "@/lib/mdx";
import { pageMeta } from "@/lib/meta";
import { areaOf, formatDate, formatMonth, formatYen, hoursLabel, stationLabel, toCompareData, toSummary } from "@/lib/view";

/*
 * トリマーの取材記事。上から、
 *   写真と見出し（一言・名前・場所・導入文） → 目次 → 章ごとの質問と答え
 *   → 仕事のしかたのまとめ → お願いするには（場所・料金・予約の窓口）
 * の順。記事が主役で、まとめと連絡先は読み終えたあとに置く。
 */
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTrimmers().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = getTrimmer((await params).slug);
  if (!s) return {};
  const area = areaOf(venuesOf(s)[0]);
  return pageMeta({
    title: `トリマー ${s.name}さんの取材記事（${area.label}）`,
    description: s.lead ?? `${area.fullLabel}のトリマー、${s.name}さんの取材記事。${s.compare.belief}`,
    path: `/trimmer/${s.slug}/`,
    ogType: "article",
  });
}

export default async function TrimmerPage({ params }: Props) {
  const s = getTrimmer((await params).slug);
  if (!s) notFound();

  const venues = venuesOf(s);
  const main = areaOf(venues[0]);
  const data = toCompareData(s);
  const chapters = chaptersOf(s.body);
  const interview = await renderInterview(s.body);
  const concern = findConcern(s.concerns[0]);
  const station = venues[0].stations[0];

  // 「おすすめ」ではなく、同じ地域で話を聞いたトリマーを新着順に
  const others = getAllTrimmers().filter((o) => o.slug !== s.slug);
  const sameCity = others.filter((o) => toSummary(o).citySlugs.some((c) => data.citySlugs.includes(c)));
  const related = (sameCity.length ? sameCity : others.filter((o) => toSummary(o).prefSlug === main.pref.slug))
    .slice(0, 3)
    .map(toSummary);

  return (
    <>
      <section className="mx-3 rounded-[2rem] bg-towel min-[768px]:mx-6 min-[768px]:rounded-[2.5rem]">
        <Breadcrumbs
          items={[
            ...(concern ? [{ href: `/concern/${concern.slug}/`, label: concern.label }] : []),
            { href: `/trimmer/${s.slug}/`, label: `${s.name}さん` },
          ]}
        />
        <header className="container-page grid items-center gap-x-12 gap-y-8 pt-8 pb-12 min-[900px]:grid-cols-12 min-[900px]:pt-12 min-[900px]:pb-16">
          <div className="relative min-[900px]:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-paper min-[900px]:aspect-[4/5] min-[900px]:rounded-[2.5rem]">
              <Image src={s.photo.src} alt={s.photo.alt} fill priority sizes="(min-width: 900px) 40vw, 100vw" className="object-cover object-[50%_30%]" />
            </div>
          </div>
          <div className="min-[900px]:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <ConcernChips slugs={s.concerns} className="[&_.chip]:bg-paper" />
              {/* 有料掲載は必ず明示する。表示順には影響しない */}
              {s.listing === "paid" && <span className="badge text-sub">掲載プラン利用</span>}
            </div>
            <h1 className="mt-5">
              <span className="bubble block px-7 py-6 text-[clamp(1.5rem,1.15rem+1.6vw,2.375rem)] leading-[1.6] font-extrabold [text-wrap:balance] min-[768px]:px-9 min-[768px]:py-8">
                「{s.catchphrase}」
              </span>
              <span className="mt-8 block pl-3 text-[1.125rem] font-bold">
                {s.name} さん
                <span className="sr-only">の取材記事</span>
              </span>
            </h1>
            <p className="pl-3 text-[0.8125rem] text-sub">
              {venues.map((c) => c.name).join("／")}（{main.label}／{station.name}駅）
            </p>
            {s.lead && <p className="mt-6 pl-3 text-[0.9375rem] leading-[2.05]">{s.lead}</p>}
            <p className="mt-6 pl-3 text-[0.75rem] text-sub">
              取材日 {formatDate(s.interviewedAt)}／聞き手 {s.interviewer}
              {s.photographer && `／撮影 ${s.photographer}`}／最終更新日 {formatDate(s.updatedAt ?? s.publishedAt)}
            </p>
          </div>
        </header>
      </section>

      <article aria-label={`${s.name}さんの取材記事の本文`} className="container-page">
        <div className="mx-auto mt-8 max-w-[46rem] min-[768px]:mt-12">
          {chapters.length > 0 && (
            <nav aria-labelledby="toc" className="card p-6 min-[768px]:p-8">
              <p id="toc" className="text-[0.8125rem] font-bold text-sub">
                この記事の目次
              </p>
              <ol className="phrase mt-4 space-y-2.5 [&_li]:[word-break:inherit]">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="flex items-baseline gap-4 font-bold hover:underline">
                      <span className="num w-4 shrink-0">{Number(c.no)}</span>
                      {c.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#fields" className="flex items-baseline gap-4 font-bold hover:underline">
                    <span aria-hidden="true" className="w-4 shrink-0">＋</span>
                    {s.name}さんの仕事のしかた・お願いするには
                  </a>
                </li>
              </ol>
            </nav>
          )}

          <div className="interview mt-14 min-[768px]:mt-20">{interview}</div>
          <div className="clear-both" />
        </div>

        <section id="fields" aria-labelledby="fields-title" className="mx-auto max-w-[56rem] scroll-mt-24 pt-20 min-[768px]:pt-28">
          <p aria-hidden="true" className="label mb-2">
            Profile
          </p>
          <h2 id="fields-title" className="section-title mt-2">
            {s.name}さんの仕事のしかた
          </h2>
          <p className="mt-3 text-[0.875rem] leading-[1.9] text-sub">動物への接し方、はじめての日の流れ、料金など、予約の前に知っておきたいことをまとめています。</p>
          <div className="mt-8">
            <CompareFieldsList data={data} />
          </div>
        </section>

        <section id="visit" aria-labelledby="visit-title" className="mx-auto max-w-[56rem] scroll-mt-24 pt-20 min-[768px]:pt-28">
          <p aria-hidden="true" className="label mb-2">
            Visit
          </p>
          <h2 id="visit-title" className="section-title mt-2">
            {s.name}さんにお願いするには
          </h2>
          <div className="mt-8 grid gap-5 min-[900px]:grid-cols-2">
            {venues.map((c, i) => (
              <section key={c.slug} aria-labelledby={`venue-${c.slug}`} className="rounded-[var(--radius-soft)] bg-towel p-7 min-[768px]:p-10">
                <h3 id={`venue-${c.slug}`} className="text-[1.25rem]">
                  <Link href={`/salon/${c.slug}/`} className="hover:underline">
                    {c.name}
                  </Link>
                </h3>
                {s.venues[i].days && <p className="mt-1 text-[0.8125rem] font-bold">{s.venues[i].days}に担当</p>}
                <dl className="mt-5 space-y-3 text-[0.875rem]">
                  <Row label="場所">
                    {areaOf(c).fullLabel}
                    {c.address.line}
                    {c.address.building && ` ${c.address.building}`}
                  </Row>
                  <Row label="最寄り駅">{stationLabel(c)}</Row>
                  <Row label="営業時間">
                    {hoursLabel(c)}
                    {c.hoursNote && <span className="block text-sub">{c.hoursNote}</span>}
                  </Row>
                  {i === 0 && (
                    <Row label="料金（税込）">
                      小型犬のシャンプー {formatYen(s.compare.price.shampoo)}から／シャンプー・カット {formatYen(s.compare.price.cut)}から
                      {s.compare.price.note && <span className="block text-sub">{s.compare.price.note}</span>}
                    </Row>
                  )}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  {c.booking.url && (
                    <a href={c.booking.url} target="_blank" rel="noopener" className="btn-outline">
                      公式サイトで予約方法を見る
                      <span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  )}
                  {c.booking.phone && (
                    <a href={`tel:${c.booking.phone}`} className="btn-outline">
                      電話する（{c.booking.phone}）
                    </a>
                  )}
                  {c.booking.line && (
                    <a href={c.booking.line} target="_blank" rel="noopener" className="btn-outline">
                      LINEで問い合わせる
                      <span className="sr-only">（新しいタブで開きます）</span>
                    </a>
                  )}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-4 text-xs text-sub">予約は、それぞれのサロンの窓口で受け付けています。</p>
        </section>

        <footer className="mx-auto max-w-[56rem] pt-8">
          <div className="space-y-1.5 text-[0.6875rem] leading-relaxed text-sub">
            <p>掲載している情報は{formatMonth(s.verifiedAt)}に確認したものです。料金や営業時間は変わることがあります。</p>
            <p>皮膚や体調に気になることがあるときは、トリミングの前に動物病院に相談してください。</p>
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="container-page pt-20 min-[768px]:pt-28">
          <p aria-hidden="true" className="label mb-2">
            More interviews
          </p>
          <h2 id="related" className="section-title mt-2">
            同じエリアで話を聞いたトリマー
          </h2>
          <div className="mt-8">
            <TrimmerGrid people={related} />
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${s.name}さんの取材記事「${s.catchphrase}」`,
          datePublished: s.publishedAt.toISOString(),
          dateModified: (s.updatedAt ?? s.publishedAt).toISOString(),
          image: `${SITE.url}${s.photo.src}`,
          inLanguage: "ja",
          author: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/` },
          publisher: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/` },
          mainEntityOfPage: `${SITE.url}/trimmer/${s.slug}/`,
          about: {
            "@type": "Person",
            name: s.name,
            jobTitle: "トリマー",
            hasCredential: s.qualifications.map((l) => ({ "@type": "EducationalOccupationalCredential", name: l })),
            worksFor: venues.map((c) => ({
              "@type": "LocalBusiness",
              name: c.name,
              url: `${SITE.url}/salon/${c.slug}/`,
            })),
          },
        }}
      />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3">
      <dt className="font-bold text-sub">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
