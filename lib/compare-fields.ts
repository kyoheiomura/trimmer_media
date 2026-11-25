/**
 * 個別ページ「〇〇さんの仕事のしかた」に載せる項目の並びと書き方（components/CompareFieldsList.tsx）。
 * kind: short = 短い値／long = 文章／list = 箇条書き
 * 値に優劣の色付けはしない。
 */
import type { TrimmerCompareData } from "@/lib/view";

export type FieldValue = string | string[];
export type CompareField = {
  key: string;
  label: string;
  kind: "short" | "long" | "list";
  get: (d: TrimmerCompareData) => FieldValue;
};
export type CompareGroup = { key: string; label: string; fields: CompareField[] };

const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    key: "person",
    label: "人",
    fields: [
      { key: "concerns", label: "よく引き受ける相談", kind: "list", get: (d) => d.concernLabels },
      {
        key: "qualifications",
        label: "資格",
        kind: "list",
        get: (d) => (d.qualifications.length ? d.qualifications : ["特になし"]),
      },
      { key: "years", label: "トリマー歴", kind: "short", get: (d) => `${d.years}年` },
      { key: "why", label: "トリマーになったきっかけ", kind: "long", get: (d) => d.compare.why },
    ],
  },
  {
    key: "belief",
    label: "考え",
    fields: [
      { key: "belief", label: "いちばん大切にしていること", kind: "long", get: (d) => d.compare.belief },
      { key: "approach", label: "嫌がる子への向き合い方", kind: "long", get: (d) => d.compare.approach },
      { key: "message", label: "飼い主へのメッセージ", kind: "long", get: (d) => `「${d.compare.message}」` },
      { key: "notFor", label: "ほかを勧めることがあるケース", kind: "long", get: (d) => d.compare.notFor },
    ],
  },
  {
    key: "work",
    label: "仕事のしかた",
    fields: [
      { key: "feature", label: "特徴", kind: "long", get: (d) => d.compare.feature },
      { key: "animals", label: "引き受けている動物", kind: "list", get: (d) => d.compare.animals },
      { key: "breeds", label: "得意な犬種・猫種", kind: "list", get: (d) => d.compare.breeds },
      { key: "tone", label: "動物への接し方", kind: "short", get: (d) => d.compare.tone },
      { key: "styles", label: "お預かりの形", kind: "list", get: (d) => d.compare.styles },
      { key: "attend", label: "トリミング中の飼い主", kind: "short", get: (d) => d.compare.attend },
      { key: "tools", label: "シャンプー・道具", kind: "list", get: (d) => d.compare.tools },
      { key: "explanation", label: "仕上がりの決め方", kind: "long", get: (d) => d.compare.explanation },
      {
        key: "firstVisit",
        label: "はじめての日の流れ",
        kind: "short",
        get: (d) => `お話を聞く${d.compare.firstVisit.hearingMin}分＋トリミング${d.compare.firstVisit.groomingMin}分（小型犬の目安）`,
      },
      { key: "report", label: "当日の様子の伝え方", kind: "short", get: (d) => d.compare.report },
      { key: "pace", label: "通う間隔の考え方", kind: "long", get: (d) => d.compare.pace },
      {
        key: "homecare",
        label: "家でのお手入れの提案",
        kind: "short",
        get: (d) => (d.compare.homecare ? "あり" : "なし"),
      },
      { key: "worries", label: "よく受ける心配ごと", kind: "list", get: (d) => d.compare.worryLabels },
    ],
  },
  {
    key: "access",
    label: "通いやすさ",
    fields: [
      { key: "venue", label: "サロン", kind: "list", get: (d) => d.venues.map((c) => c.name) },
      {
        key: "area",
        label: "エリア・最寄り駅",
        kind: "long",
        get: (d) => d.venues.map((c) => `${c.area}　${c.stations}`),
      },
      { key: "hours", label: "営業時間", kind: "long", get: (d) => d.venues.map((c) => c.hours) },
      {
        key: "features",
        label: "設備・対応",
        kind: "list",
        get: (d) => (d.features.length ? d.features : ["特になし"]),
      },
      { key: "gender", label: "トリマーの性別", kind: "short", get: (d) => d.gender ?? "非公開" },
      {
        key: "price",
        label: "料金（税込・小型犬）",
        kind: "long",
        get: (d) =>
          [`シャンプー ${yen(d.compare.price.shampoo)}から`, `シャンプー・カット ${yen(d.compare.price.cut)}から`, d.compare.price.note].filter(
            (v): v is string => Boolean(v),
          ),
      },
    ],
  },
];
