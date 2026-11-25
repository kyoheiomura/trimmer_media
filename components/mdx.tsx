/**
 * 取材記事の本文（MDX）で使える部品。CMS のリッチテキストに置き換えやすいよう、数を絞る。
 *   ## 章の見出し            章（目次に出る）。lib/mdx.tsx が <ChapterTitle> に置きかえる
 *   <Q>質問</Q>              聞き手の質問（小見出し）。答えは、その下にふつうの段落で書く
 *   <Photo src alt caption align />  写真。align="left" で文章の左に回りこむ（省くと中央）
 *   <Quote>言葉</Quote>      本文から抜き出した、大きく見せる言葉（使わなくてもよい）
 */
import Image from "next/image";
import type { ReactNode } from "react";

export function ChapterTitle({ id, no, children }: { id: string; no: string; children: ReactNode }) {
  return (
    <h2 id={id} className="!mt-20 flex scroll-mt-28 items-start gap-4 first:!mt-0 min-[768px]:!mt-28">
      <span aria-hidden="true" className="num mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-[1.125rem] text-white">
        {Number(no)}
      </span>
      <span className="text-[clamp(1.375rem,1.15rem+1vw,1.875rem)] leading-[1.55] font-extrabold">{children}</span>
    </h2>
  );
}

export function Q({ children }: { children: ReactNode }) {
  return (
    <h3 className="!mt-12 clear-both flex gap-3 rounded-2xl bg-towel px-5 py-4 text-[1rem] leading-[1.8]">
      <span aria-hidden="true" className="latin shrink-0 text-[1.125rem] leading-[1.6]">
        Q.
      </span>
      <span>{children}</span>
    </h3>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return <blockquote className="bubble !my-14 clear-both px-7 py-8 text-center text-[1.25rem] leading-[1.8] font-bold min-[768px]:text-[1.5rem]">{children}</blockquote>;
}

export function Photo({ src, alt, caption, align = "center" }: { src: string; alt: string; caption?: string; align?: "center" | "left" }) {
  return (
    <figure className={align === "left" ? "!mt-6 min-[768px]:float-left min-[768px]:mr-8 min-[768px]:mb-3 min-[768px]:w-[46%]" : "!my-8 clear-both"}>
      <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-soft)] bg-towel">
        <Image src={src} alt={alt} fill sizes={align === "left" ? "(min-width: 768px) 340px, 100vw" : "(min-width: 768px) 740px, 100vw"} className="object-cover" />
      </div>
      {caption && <figcaption className="mt-2 text-[0.75rem] leading-relaxed text-sub">{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = { ChapterTitle, Q, Quote, Photo };
