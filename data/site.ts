/** サイト名はここだけで決める。変えるときは NAME と NAME_EN を直せば全ページに反映される */
const NAME = "tocotoco";
/** OGP などに添えるローマ字の表記 */
const NAME_EN = "tocotoco";
/** ロゴに小さく添える読み */
const KANA = "とことこ";
const KIND = "トリマーメディア";

export const SITE = {
  name: NAME,
  nameEn: NAME_EN,
  kana: KANA,
  /** title の末尾などに添える種別 */
  kind: KIND,
  /** ロゴの横に添える、何のメディアかの一言 */
  descriptor: "トリマーのインタビューメディア",
  /** コンセプト。トップとフッター・OGP で使う */
  tagline: ["あずけるのは、", "どんな人だろう。"],
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tocotoco-trimmer.example").replace(/\/$/, ""),
  /** トップの title。ほかのページは titleSuffix を付ける */
  defaultTitle: `${NAME}｜お願いしたいトリマーが見つかる${KIND}`,
  titleSuffix: `｜${NAME} ${KIND}`,
  description:
    "tocotoco（とことこ）は、犬や猫のトリマー一人ひとりに話を聞き、動物への接し方と人柄を本人の言葉で届けるメディアです。当日の流れや料金、サロンの情報もあわせて載せています。",
  /** お問い合わせ・取材の希望の窓口（運営会社のフォーム） */
  contactUrl: "https://0450.co.jp/contact",
  /** 掲載中のトリマー・サロンがダミーのあいだは true。robots.txt で全面ブロックする */
  isDummyContent: true,
} as const;

/** 1ページに並べるトリマーの数 */
export const PAGE_SIZE = 24;
/** エリアページ・相談ページをインデックスさせる最少人数 */
export const AREA_INDEX_MIN = 3;
