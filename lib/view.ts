/**
 * コンテンツから、表示とクライアントに渡すための形を作る。
 * ここで作るオブジェクトはすべてシリアライズ可能（Date は文字列にする）。
 */
import { findCity, findPref } from "@/data/areas";
import { CONCERNS, WEEKDAYS, worryLabel } from "@/data/vocab";
import { venuesOf, type VenueEntry, type TrimmerEntry } from "@/lib/content";
import type { Venue, Trimmer } from "@/lib/schema";

const BUILD_YEAR = new Date().getFullYear();

/** 「シニアの子・皮膚や被毛が気になる」。並びは data/vocab.ts の順 */
export function concernLabels(concerns: Trimmer["concerns"]) {
  return CONCERNS.filter((s) => concerns.includes(s.slug)).map((s) => s.label);
}
export function concernsLabel(concerns: Trimmer["concerns"]) {
  return concernLabels(concerns).join("・");
}
export function yearsOfWork(s: Trimmer) {
  return Math.max(1, BUILD_YEAR - s.startedYear);
}

export function areaOf(c: Venue) {
  const pref = findPref(c.address.prefSlug)!;
  const city = findCity(c.address.prefSlug, c.address.citySlug)!;
  return { pref, city, label: city.name, fullLabel: `${pref.name}${city.name}` };
}

export function formatMonth(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatYen(n: number) {
  return `${n.toLocaleString("ja-JP")}円`;
}

export function stationLabel(c: Venue) {
  return c.stations.map((s) => `${s.line} ${s.name}駅 徒歩${s.walkMin}分`).join("／");
}

/** 「月・火・木 10:00〜20:00」の形に */
export function hoursLabel(c: Venue) {
  return c.hours
    .map((h) => {
      const days = [...h.days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
      return `${days.join("・")} ${h.open}〜${h.close}`;
    })
    .join("／");
}

const opensWeekend = (c: Venue) => c.hours.some((h) => h.days.includes("土") || h.days.includes("日"));
const opensEvening = (c: Venue) => c.hours.some((h) => h.close > "19:00");

/** 一覧・カードで使う要約 */
export type TrimmerSummary = {
  slug: string;
  name: string;
  nameKana: string;
  catchphrase: string;
  /** 本文から抜き出した一文（トップのふきだし） */
  hook?: string;
  /** 章の見出し（カードの「この記事で読めること」） */
  chapters: string[];
  photo: { src: string; alt: string };
  concerns: Trimmer["concerns"];
  concernsLabel: string;
  concernLabels: string[];
  areaLabel: string;
  venueName: string;
  prefSlug: string;
  citySlugs: string[];
  areaCode: number;
  worries: string[];
  animals: string[];
  breeds: string[];
  styles: string[];
  attend: string;
  gender?: string;
  tone: string;
  features: string[];
  weekend: boolean;
  evening: boolean;
  publishedAt: string;
  /** フリーワード検索の対象（名前・一言・比較項目・場所・地域） */
  searchText: string;
};

export function toSummary(s: TrimmerEntry): TrimmerSummary {
  const venues = venuesOf(s);
  const main = areaOf(venues[0]);
  return {
    slug: s.slug,
    name: s.name,
    nameKana: s.nameKana,
    catchphrase: s.catchphrase,
    hook: s.hook,
    chapters: [...s.body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim()),
    photo: s.photo,
    concerns: s.concerns,
    concernsLabel: concernsLabel(s.concerns),
    concernLabels: concernLabels(s.concerns),
    areaLabel: main.label,
    venueName: venues[0].name,
    prefSlug: main.pref.slug,
    citySlugs: venues.map((c) => c.address.citySlug),
    areaCode: main.city.code,
    worries: s.compare.worries,
    animals: s.compare.animals,
    breeds: s.compare.breeds,
    styles: s.compare.styles,
    attend: s.compare.attend,
    gender: s.compare.gender,
    tone: s.compare.tone,
    features: [...new Set(venues.flatMap((c) => c.features))],
    weekend: venues.some(opensWeekend),
    evening: venues.some(opensEvening),
    publishedAt: s.publishedAt.toISOString(),
    searchText: [
      s.name,
      s.nameKana,
      s.catchphrase,
      concernsLabel(s.concerns),
      s.compare.feature,
      s.compare.belief,
      s.compare.approach,
      ...s.compare.animals,
      ...s.compare.breeds,
      ...s.compare.tools,
      ...s.compare.worries.map(worryLabel),
      ...venues.flatMap((c) => [c.name, areaOf(c).fullLabel, ...c.stations.map((st) => st.name)]),
    ].join(" "),
  };
}

/** 比較項目の表示に使う形 */
export type TrimmerCompareData = TrimmerSummary & {
  qualifications: string[];
  years: number;
  compare: Omit<Trimmer["compare"], "worries"> & { worryLabels: string[] };
  venues: { name: string; area: string; stations: string; hours: string; hoursNote?: string }[];
};

export function toCompareData(s: TrimmerEntry): TrimmerCompareData {
  const venues = venuesOf(s);
  return {
    ...toSummary(s),
    qualifications: s.qualifications,
    years: yearsOfWork(s),
    compare: { ...s.compare, worryLabels: s.compare.worries.map(worryLabel) },
    venues: venues.map((c: VenueEntry, i) => ({
      name: s.venues[i].days ? `${c.name}（${s.venues[i].days}）` : c.name,
      area: areaOf(c).fullLabel,
      stations: stationLabel(c),
      hours: hoursLabel(c),
      hoursNote: c.hoursNote,
    })),
  };
}
