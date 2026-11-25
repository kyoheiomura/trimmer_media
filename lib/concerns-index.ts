/** 目的ごとの索引。目的ページ・トップのバーベルと /concern/ の一覧で使う */
import { CONCERNS } from "@/data/vocab";
import { getAllTrimmers } from "@/lib/content";

export function trimmersOfConcern(concernSlug: string) {
  return getAllTrimmers().filter((s) => s.concerns.includes(concernSlug));
}

/** すべての目的（data/vocab.ts の順）と、取材した人数。まだ0人の目的も含む */
export function getAllConcerns() {
  return CONCERNS.map((concern) => ({ ...concern, count: trimmersOfConcern(concern.slug).length }));
}

/** 取材したトリマーがいる目的だけ（サイトマップなど） */
export function getConcernIndex() {
  return getAllConcerns().filter((s) => s.count > 0);
}
