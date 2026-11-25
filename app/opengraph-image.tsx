import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

// サイト共通の OGP 画像。泡の白の地に、コンセプトと毛の色の帯
export const alt = SITE.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEXT = `${SITE.name}${SITE.kind}${SITE.tagline.join("")}`;

/** 使う文字だけを Google Fonts から取得する（ビルド時に1回） */
async function loadFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(TEXT)}`,
  ).then((r) => r.text());
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error(`OGP 用フォントを取得できませんでした: ${family}`);
  return fetch(src).then((r) => r.arrayBuffer());
}

export default async function OgImage() {
  const gothic = await loadFont("LINE+Seed+JP", 800);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          background: "#f6f3ec",
          color: "#1c1c1a",
          borderBottom: "36px solid #6fd3c1",
          fontFamily: "Gothic",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SITE.tagline.map((l) => (
            <div key={l} style={{ fontSize: 92, lineHeight: 1.35, display: "flex" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", borderTop: "3px solid #1c1c1a", paddingTop: 28 }}>
          <span style={{ fontSize: 48 }}>{SITE.name}</span>
          <span style={{ fontSize: 26, marginLeft: 24, color: "#6a6964" }}>{SITE.kind}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Gothic", data: gothic, weight: 800, style: "normal" }],
    },
  );
}
