import { z } from "zod";
import { findCity } from "@/data/areas";
import {
  ANIMALS,
  ATTENDS,
  CONCERN_SLUGS,
  FEATURES,
  REPORTS,
  ROLES,
  STYLES,
  TONES,
  VENUE_KINDS,
  WEEKDAYS,
  WORRY_SLUGS,
} from "@/data/vocab";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "半角英小文字・数字・ハイフンで書く（例: mihon-ken）");
const text = (max: number) =>
  z.string().trim().min(1, "空にしない").max(max, `${max}字以内で書く`);
const kana = z.string().regex(/^[ぁ-んー 　]+$/, "ひらがなで書く");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM で書く");
const yen = z.number().int().nonnegative();

export const PhotoSchema = z.object({
  src: z.string().startsWith("/images/", "public/images/ 以下のパスを書く"),
  alt: z.string().min(10, "写真の内容が分かる alt を10字以上で書く"),
});

export const TrimmerSchema = z
  .object({
    slug,
    name: text(20),
    nameKana: kana,
    photo: PhotoSchema,
    catchphrase: text(32),
    /** 記事の冒頭に置く導入文。編集部の言葉で、どんな人・どんな場所かを紹介する */
    lead: text(400).optional(),
    /** トップの「トリマーさんのことば」に出す、本文から抜き出した一文（かぎかっこは付けない） */
    hook: text(70).optional(),
    concerns: z.array(z.enum(CONCERN_SLUGS)).min(1),
    /** 資格（JKC公認トリマー など）。団体名も含めてそのまま書く。コンテストの成績はここに書かない */
    qualifications: z.array(text(40)).default([]),
    startedYear: z.number().int().min(1950).max(2100),
    venues: z
      .array(z.object({ slug, role: z.enum(ROLES), days: text(30).optional() }))
      .min(1, "働いている場所を1つ以上書く"),

    // 比較項目。並び順は lib/compare-fields.ts で決める
    compare: z
      .object({
        feature: text(24), // 仕事のしかたの特徴（ひとことで）
        message: text(60), // 飼い主へのメッセージ
        why: text(60),
        belief: text(60),
        approach: text(80), // 嫌がる子・苦手な工程への向き合い方
        animals: z.array(z.enum(ANIMALS)).min(1),
        /** 得意な犬種・猫種。自由に書いてよい */
        breeds: z.array(text(20)).min(1).max(8),
        tone: z.enum(TONES),
        report: z.enum(REPORTS),
        attend: z.enum(ATTENDS),
        styles: z.array(z.enum(STYLES)).min(1),
        /** シャンプー剤や道具。商品名ではなく種類で書く */
        tools: z.array(text(30)).min(1).max(6),
        explanation: text(60), // 仕上がりの決め方
        /** はじめての日の時間配分（小型犬のシャンプー・カットの目安） */
        firstVisit: z.object({
          hearingMin: z.number().int().positive(),
          groomingMin: z.number().int().positive(),
        }),
        pace: text(60),
        homecare: z.boolean(),
        worries: z.array(z.enum(WORRY_SLUGS)).min(1).max(5),
        notFor: text(80),
        gender: z.enum(["女性", "男性"]).optional(),
        /** 小型犬の通常料金（税込）。割引や初回価格は書かない */
        price: z.object({ shampoo: yen, cut: yen, note: text(60).optional() }),
      })
      .strict(),

    interviewedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    verifiedAt: z.coerce.date(),
    interviewer: text(30),
    photographer: text(30).optional(),
    listing: z.enum(["free", "paid"]).default("free"),
    draft: z.boolean().default(false),
  })
  .strict()
  .superRefine((s, ctx) => {
    if (s.publishedAt < s.interviewedAt) {
      ctx.addIssue({ code: "custom", path: ["publishedAt"], message: "取材日より前になっている" });
    }
  });

export const VenueSchema = z
  .object({
    slug,
    name: text(40),
    nameKana: kana,
    kind: z.enum(VENUE_KINDS),
    address: z.object({
      prefSlug: z.string(),
      citySlug: z.string(),
      line: text(60),
      building: text(40).optional(),
    }),
    stations: z
      .array(z.object({ line: text(20), name: text(20), walkMin: z.number().int().positive() }))
      .min(1),
    hours: z
      .array(z.object({ days: z.array(z.enum(WEEKDAYS)).min(1), open: time, close: time }))
      .min(1),
    hoursNote: text(80).optional(),
    booking: z
      .object({
        phone: z.string().regex(/^[0-9-]+$/, "数字とハイフンで書く").optional(),
        url: z.url().optional(),
        line: z.url().optional(),
      })
      .refine((b) => b.phone || b.url || b.line, "予約の窓口を1つ以上書く"),
    features: z.array(z.enum(FEATURES)).default([]),
    verifiedAt: z.coerce.date(),
  })
  .strict()
  .superRefine((c, ctx) => {
    if (!findCity(c.address.prefSlug, c.address.citySlug)) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: `data/areas.ts にない地域: ${c.address.prefSlug}/${c.address.citySlug}`,
      });
    }
  });

export type Trimmer = z.infer<typeof TrimmerSchema>;
export type Venue = z.infer<typeof VenueSchema>;
