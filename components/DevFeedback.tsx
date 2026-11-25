"use client";

/**
 * 開発中だけ出す、画面への書き込みツール（Agentation）。
 * 右下のボタンから要素をクリックしてメモを付け、Copy した Markdown を Claude に貼る。
 * 本番ビルドには入らない：NODE_ENV が development のときだけ import する（ビルド時に分岐ごと消える）
 */
import dynamic from "next/dynamic";

const Agentation =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("agentation").then((m) => m.Agentation), { ssr: false })
    : null;

export function DevFeedback() {
  return Agentation ? <Agentation appName="tocotoco" /> : null;
}
