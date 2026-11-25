import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx";

const CHAPTER = /^##\s+(.+)$/gm;

/** 本文の「## 見出し」＝章。目次に使う。id は chapter-1, chapter-2 … */
export function chaptersOf(body: string) {
  return [...body.matchAll(CHAPTER)].map((m, i) => ({ id: `chapter-${i + 1}`, no: String(i + 1).padStart(2, "0"), title: m[1].trim() }));
}

/** 取材記事の本文（MDX）をサーバー側で描画する。章の見出しには、目次から飛べる id と番号を付ける */
export async function renderInterview(body: string) {
  let n = 0;
  const source = body.replace(CHAPTER, (_, title: string) => {
    n += 1;
    return `<ChapterTitle id="chapter-${n}" no="${String(n).padStart(2, "0")}">${title.trim()}</ChapterTitle>`;
  });
  const { default: Content } = await evaluate(source, { ...runtime, baseUrl: import.meta.url });
  return <Content components={mdxComponents} />;
}
