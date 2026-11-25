import Image from "next/image";
import Link from "next/link";
import { ConcernChips } from "@/components/ConcernChips";
import type { TrimmerSummary } from "@/lib/view";

type Props = {
  s: TrimmerSummary;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
};

/**
 * インタビューカード。写真 → 相談のしるし → 本人の一言 → 記事で読めること（章の見出し）→ 名前・サロン。
 * カード全体がリンク（名前のリンクを全面に広げる）。
 */
export function TrimmerCard({ s, headingLevel = "h3", priority }: Props) {
  const Heading = headingLevel;
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-[translate] duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-towel">
        <Image src={s.photo.src} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={priority} className="photo-zoom object-cover object-[50%_35%]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <ConcernChips slugs={s.concerns} />
        <p className="phrase mt-4 text-[1.1875rem] leading-[1.6] font-extrabold">
          <span className="-ml-[0.5em]">「</span>
          {s.catchphrase}」
        </p>
        {s.chapters.length > 0 && (
          <ul className="mt-4 space-y-1 text-[0.8125rem] leading-[1.7] text-sub">
            {s.chapters.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-mint" />
                {c}
              </li>
            ))}
          </ul>
        )}
        <div aria-hidden="true" className="min-h-5 flex-1" />
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-dashed border-line pt-4">
          <Heading className="text-[0.9375rem]">
            <Link href={`/trimmer/${s.slug}/`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline group-hover:decoration-mint group-hover:decoration-2">
              {s.name} さん
              <span className="sr-only">のインタビューを読む</span>
            </Link>
          </Heading>
          <p className="text-[0.75rem] text-sub">
            {s.venueName}（{s.areaLabel}）
          </p>
        </div>
      </div>
    </article>
  );
}

export function TrimmerGrid({
  people,
  headingLevel,
  priorityCount = 0,
  note = true,
}: {
  people: TrimmerSummary[];
  headingLevel?: "h2" | "h3";
  priorityCount?: number;
  /** 掲載イメージの注釈を下に添えるか。同じページで先に出しているときは false */
  note?: boolean;
}) {
  return (
    <>
      <ul className="grid gap-6 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-8">
        {people.map((s, i) => (
          <li key={s.slug} className="reveal">
            <TrimmerCard s={s} headingLevel={headingLevel} priority={i < priorityCount} />
          </li>
        ))}
      </ul>
      {note && people.length > 0 && <SampleNote />}
    </>
  );
}

/**
 * いま載っているトリマーは掲載イメージ用の架空の人物なので、その人の言葉や写真を見せる場所の下に必ず添える
 * （カードの一覧・トップの「ことば」）。同じページに何度も出さない。
 * 実際の取材記事に入れ替えたら、このコンポーネントごと消す。
 */
export function SampleNote({ className = "mt-8" }: { className?: string }) {
  return (
    <p className={`${className} text-[0.75rem] leading-[1.9] text-sub`}>
      ※ いまは掲載イメージです。トリマーとサロンは架空のもので、写真はAIで作成しています。実際のインタビューは、集まり次第掲載します。
    </p>
  );
}
