/**
 * コンテンツを読む唯一の入口。ページはここの関数だけを使う。
 * ヘッドレス CMS に移るときは、このファイルの中身（読み込み元）だけを差し替える。
 * Zod スキーマは移行後も「入口の検証」としてそのまま使う。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import type { z } from "zod";
import { VenueSchema, TrimmerSchema, type Venue, type Trimmer } from "@/lib/schema";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type TrimmerEntry = Trimmer & { body: string; file: string };
export type VenueEntry = Venue & { file: string };

type Store = { trimmer: TrimmerEntry[]; venues: VenueEntry[] };
let cache: Store | null = null;

function listFiles(dir: string, ext: string) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext) && !f.startsWith("_"))
    .map((f) => path.join(full, f));
}

function formatIssues(file: string, error: z.ZodError) {
  const rel = path.relative(process.cwd(), file);
  return `${rel}\n${error.issues.map((i) => `  - ${i.path.join(".") || "(全体)"}: ${i.message}`).join("\n")}`;
}

/** 全コンテンツを読み、検証する。1件でも不正があれば全件まとめて例外にする */
export function loadContent(): Store {
  if (cache) return cache;
  const errors: string[] = [];

  const venues: VenueEntry[] = [];
  for (const file of listFiles("salon", ".yaml")) {
    const result = VenueSchema.safeParse(YAML.parse(fs.readFileSync(file, "utf8")));
    if (!result.success) {
      errors.push(formatIssues(file, result.error));
      continue;
    }
    if (result.data.slug !== path.basename(file, ".yaml")) {
      errors.push(`${path.relative(process.cwd(), file)}\n  - slug とファイル名を一致させる`);
    }
    venues.push({ ...result.data, file });
  }

  const trimmer: TrimmerEntry[] = [];
  for (const file of listFiles("trimmer", ".mdx")) {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    const result = TrimmerSchema.safeParse(data);
    if (!result.success) {
      errors.push(formatIssues(file, result.error));
      continue;
    }
    const s = result.data;
    const rel = path.relative(process.cwd(), file);
    if (s.slug !== path.basename(file, ".mdx")) errors.push(`${rel}\n  - slug とファイル名を一致させる`);
    for (const c of s.venues) {
      if (!venues.some((cl) => cl.slug === c.slug)) {
        errors.push(`${rel}\n  - venues: content/salon/${c.slug}.yaml がない`);
      }
    }
    if (!fs.existsSync(path.join(PUBLIC_DIR, s.photo.src))) {
      errors.push(`${rel}\n  - photo.src: public${s.photo.src} がない`);
    }
    trimmer.push({ ...s, body: content, file });
  }

  if (errors.length > 0) {
    throw new Error(`コンテンツの検証に失敗しました（${errors.length}件）\n\n${errors.join("\n\n")}`);
  }

  trimmer.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime() || a.slug.localeCompare(b.slug),
  );
  cache = { trimmer, venues };
  return cache;
}

const showDrafts = process.env.SHOW_DRAFTS === "1";

/** 公開中のトリマー（新着順） */
export function getAllTrimmers(): TrimmerEntry[] {
  return loadContent().trimmer.filter((s) => showDrafts || !s.draft);
}

export function getTrimmer(slug: string) {
  return getAllTrimmers().find((s) => s.slug === slug);
}

export function getAllVenues(): VenueEntry[] {
  return loadContent().venues;
}

export function getVenue(slug: string) {
  return getAllVenues().find((c) => c.slug === slug);
}

/** トリマーが働いている場所（1つ目が主な場所） */
export function venuesOf(s: Trimmer): VenueEntry[] {
  return s.venues.map((c) => getVenue(c.slug)!).filter(Boolean);
}

/** その場所で働いているトリマー（新着順）。Trimmer.venues から逆にたどる */
export function trimmersOfVenue(venueSlug: string) {
  return getAllTrimmers().filter((s) => s.venues.some((c) => c.slug === venueSlug));
}
