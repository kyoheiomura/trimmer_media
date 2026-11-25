import Image from "next/image";
import Link from "next/link";
import { CoatPlay } from "@/components/CoatPlay";
import { ConcernDirectory } from "@/components/ConcernDirectory";
import { Scissors, Sparkle } from "@/components/Doodles";
import { JsonLd } from "@/components/JsonLd";
import { SectionHead } from "@/components/SectionHead";
import { SampleNote, TrimmerGrid } from "@/components/TrimmerCard";
import { SITE } from "@/data/site";
import { getAreaTree } from "@/lib/areas-index";
import { getAllTrimmers } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { toSummary } from "@/lib/view";

/*
 * トップ。読みたくなる入口を、上から順に置く。
 * 見出しと写真 → トリマーさんのことば（本文から抜き出した一文）→ 新しいインタビュー
 * → 相談からさがす → 使い方 → エリア → トリマーの方へ → おまけ（なでてみる）
 */
export const metadata = pageMeta({ absoluteTitle: SITE.defaultTitle, path: "/" });

/** 使い方。実際に順番のある手順なので番号を付ける */
const STEPS = [
  { verb: "読む", body: "トリマーになったきっかけ、嫌がる子への向き合い方、どんな人に来てほしいか。本人の言葉を、3つの章にまとめています。" },
  { verb: "確かめる", body: "はじめての日の時間配分、お預かりの形、料金、サロンの場所と営業時間。予約の前に知りたいことも、同じページにあります。" },
  { verb: "予約する", body: `お願いしたい人が決まったら、記事の最後にあるサロンの窓口へ。${SITE.name}は予約を受け付けていません。` },
];

export default function Home() {
  const all = getAllTrimmers();
  const cards = all.slice(0, 3).map(toSummary);
  const prefs = getAreaTree();
  const first = cards[0];

  return (
    <>
      <section aria-labelledby="hero-title" className="overflow-x-clip">
        {/* 狭い画面：見出し → 写真 → 説明とボタン（写真を最初の画面に入れる）。広い画面：左に見出しと説明、右に写真 */}
        <div className="container-page grid gap-x-10 pt-7 pb-14 min-[900px]:grid-cols-12 min-[900px]:grid-rows-[1fr_auto_auto_1fr] min-[900px]:pt-16 min-[900px]:pb-20">
          <div className="order-1 min-[900px]:order-none min-[900px]:col-span-6 min-[900px]:row-start-2">
            <p className="label pop-in">{SITE.descriptor}</p>
            <h1 id="hero-title" className="mt-4 text-[clamp(2.125rem,1.1rem+4.2vw,4.25rem)] leading-[1.3] font-extrabold min-[900px]:mt-6">
              <span className="pop-in block whitespace-nowrap" style={{ "--i": 1 } as React.CSSProperties}>
                あずけるのは、
              </span>
              <span className="pop-in block whitespace-nowrap" style={{ "--i": 2 } as React.CSSProperties}>
                <span className="marker marker-draw">どんな人</span>だろう。
              </span>
            </h1>
          </div>

          <div className="order-3 mt-14 min-[900px]:order-none min-[900px]:col-span-6 min-[900px]:row-start-3 min-[900px]:mt-0">
            <p className="pop-in max-w-[30rem] leading-[2.05] min-[900px]:mt-6" style={{ "--i": 3 } as React.CSSProperties}>
              {SITE.name}
              は、トリマーさん本人に話を聞いたインタビューメディアです。どんな人が、どんな考えで仕事をしているのか。予約する前に、じっくり読めます。
            </p>
            <div className="pop-in mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 min-[900px]:mt-8" style={{ "--i": 4 } as React.CSSProperties}>
              <Link href="/trimmer/" className="btn-primary">
                トリマーさんの話を読む
              </Link>
              <Link href="#concerns" className="link-quiet">
                相談からさがす
              </Link>
            </div>
          </div>

          <div className="relative order-2 mx-auto mt-[4.75rem] w-[86%] max-w-[24rem] self-center min-[900px]:order-none min-[900px]:col-span-6 min-[900px]:col-start-7 min-[900px]:row-span-4 min-[900px]:row-start-1 min-[900px]:mt-0 min-[900px]:w-full min-[900px]:max-w-none min-[900px]:pl-6">
            <div aria-hidden="true" className="pop-scale absolute top-[6%] right-[-4%] h-[92%] w-[92%] rounded-[58%_42%_48%_52%/46%_56%_44%_54%] bg-mint" style={{ "--i": 1 } as React.CSSProperties} />
            <div className="pop-scale relative aspect-square overflow-hidden rounded-[46%_54%_52%_48%/52%_44%_56%_48%] bg-towel" style={{ "--i": 2 } as React.CSSProperties}>
              <Image src={first.photo.src} alt={first.photo.alt} fill priority sizes="(min-width: 900px) 44vw, 90vw" className="object-cover" />
            </div>
            <Link href={`/trimmer/${first.slug}/`} className="bubble phrase pop-scale absolute -top-16 -right-3 block max-w-[14.5rem] px-5 py-3.5 text-[0.8125rem] leading-[1.7] font-bold min-[900px]:-top-4 min-[900px]:-right-4 min-[900px]:max-w-[15.5rem] min-[900px]:py-4 min-[900px]:text-[0.875rem]" style={{ "--i": 7 } as React.CSSProperties}>
              「{first.catchphrase}」
              <span className="mt-1 block text-[0.75rem] font-medium text-sub">{first.name} さん</span>
            </Link>
            <div className="pop-scale absolute -bottom-6 -left-2 size-[34%] overflow-hidden rounded-full border-[6px] border-foam bg-towel min-[900px]:left-2" style={{ "--i": 5 } as React.CSSProperties}>
              <Image src="/images/interview/hinagata-mai-finish.jpg" alt="" fill sizes="200px" className="object-cover object-[60%_50%]" />
            </div>
            <Sparkle className="sway absolute top-[14%] -left-3 size-9 text-yellow min-[900px]:left-0" />
            <Scissors className="sway absolute right-[2%] bottom-[2%] size-10 [animation-delay:-2s]" />
          </div>
        </div>
      </section>

      <section aria-labelledby="voices" className="mx-3 overflow-hidden rounded-[2rem] bg-towel py-12 min-[768px]:mx-6 min-[768px]:rounded-[2.5rem] min-[768px]:py-20">
        <div className="container-page">
          <SectionHead id="voices" en="Voices" title="トリマーさんの、ことば" lead="インタビューの途中で、思わず手が止まったひとこと。つづきは記事で読めます。" />
          <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:mt-10 min-[900px]:grid min-[900px]:grid-cols-3 min-[900px]:gap-8 min-[900px]:overflow-visible min-[900px]:px-0 [&::-webkit-scrollbar]:hidden">
            {cards
              .filter((s) => s.hook)
              .map((s) => (
                <li key={s.slug} className="reveal reveal-pop flex w-[84%] shrink-0 snap-center flex-col min-[900px]:w-auto">
                  <p className="bubble phrase flex-1 px-6 py-6 text-[1rem] leading-[1.9] font-bold min-[900px]:px-7 min-[900px]:py-7 min-[900px]:text-[1.0625rem]">「{s.hook}」</p>
                  <Link href={`/trimmer/${s.slug}/`} className="group mt-6 flex items-center gap-4 pl-3">
                    <span className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-paper">
                      <Image src={s.photo.src} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="text-[0.8125rem] leading-[1.6]">
                      <span className="block font-bold">{s.name} さん</span>
                      <span className="link-quiet !text-[0.8125rem]">つづきを読む</span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
          <p aria-hidden="true" className="mt-4 text-center text-[0.75rem] font-bold text-sub min-[900px]:hidden">← 横にスワイプできます →</p>
          <SampleNote className="mt-6 text-center min-[900px]:mt-10" />
        </div>
      </section>

      <section aria-labelledby="latest" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="latest" en="Interviews" title="新しいインタビュー" />
        <div className="mt-10">
          <TrimmerGrid people={cards} note={false} />
        </div>
        <p className="reveal mt-10 text-center">
          <Link href="/trimmer/" className="btn-outline">
            {all.length}人すべてを見る
          </Link>
        </p>
      </section>

      <section id="concerns" aria-labelledby="concerns-title" className="mx-3 mt-20 scroll-mt-24 rounded-[2rem] bg-towel py-12 min-[768px]:mx-6 min-[768px]:rounded-[2.5rem] min-[768px]:mt-28 min-[768px]:py-20">
        <div className="container-page">
          <SectionHead id="concerns-title" en="Find by concern" title="相談からさがす" lead="その相談をよく引き受けているトリマーさんが並びます。数字は、話を聞いた人数です。" />
          <div className="mt-10">
            <ConcernDirectory headingLevel="h3" withLead={false} />
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="how" en="How to use" title={`${SITE.name}の使い方`} />
        <ol className="mt-10 grid gap-6 min-[768px]:grid-cols-3 min-[768px]:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.verb} className="reveal reveal-pop card relative p-7 pt-10">
              <span aria-hidden="true" className="num absolute -top-5 left-6 flex size-11 items-center justify-center rounded-full bg-ink text-[1.125rem] text-white">
                {i + 1}
              </span>
              <p className="text-[1.375rem] font-extrabold">{s.verb}</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.95]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="area" className="container-page pt-20 min-[768px]:pt-28">
        <SectionHead id="area" en="Find by area" title="エリアからさがす" />
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {prefs.map((p) => (
            <li key={p.slug} className="reveal reveal-pop">
              <Link href={`/area/${p.slug}/`} className="flex min-h-14 items-center gap-3 rounded-full border-2 border-transparent bg-paper py-2 pr-4 pl-6 font-bold transition-colors hover:border-mint">
                {p.name}
                <span className="rounded-full bg-yellow px-2.5 text-[0.75rem] leading-[1.9]">{p.count}人</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/area/" className="link-quiet">
            47都道府県の一覧を見る
          </Link>
        </p>
      </section>

      <section aria-labelledby="for-trimmers" className="container-page pt-20 min-[768px]:pt-28">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-mint min-[768px]:rounded-[2.5rem]">
          <div className="relative grid items-center min-[900px]:grid-cols-2 min-[900px]:gap-8">
            <div className="p-8 min-[768px]:p-14">
              <h2 id="for-trimmers" className="text-[clamp(1.625rem,1.2rem+1.8vw,2.5rem)] leading-[1.5] font-extrabold">
                トリマーさんへ。
                <br />
                お話を聞かせてください。
              </h2>
              <p className="mt-4 max-w-[26rem] text-[0.9375rem] leading-[2]">取材を受けていただけるトリマーさんを探しています。取材の流れと、載せる内容をまとめました。</p>
              <Link href="/join/" className="btn-primary mt-7">
                掲載について読む
              </Link>
            </div>
            <div className="relative min-h-[13rem] self-stretch min-[900px]:min-h-[22rem]">
              <Image src="/images/top/talk.jpg" alt="サロンの受付で、小さな犬を抱いた飼い主とトリマーが話している" fill sizes="(min-width: 900px) 40vw, 100vw" className="object-cover min-[900px]:rounded-l-[6rem]" />
            </div>
          </div>
        </div>
      </section>

      {/* おまけ。読み終えたあとの、ちょっとした遊び */}
      <section aria-labelledby="play" className="container-page pt-20 min-[768px]:pt-28">
        <div className="reveal mx-auto max-w-[44rem] text-center">
          <p aria-hidden="true" className="label">
            おまけ
          </p>
          <h2 id="play" className="mt-4 text-[1.25rem] min-[768px]:text-[1.5rem]">
            さいごに、ちょっとなでていきませんか。
          </h2>
          <p className="mt-2 text-[0.875rem] text-sub">指やカーソルでなでると、毛並みが流れます。毛色もえらべます。</p>
          <div className="mt-6">
            <CoatPlay />
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          alternateName: `${SITE.name} ${SITE.kind}`,
          url: `${SITE.url}/`,
          description: SITE.description,
          inLanguage: "ja",
        }}
      />
    </>
  );
}
