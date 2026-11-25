/**
 * エリアのマスター。教えている場所の住所はここにある slug からしか選べない（表記ゆれ対策）。
 * code は全国地方公共団体コード（都道府県は2桁、市区町村は上5桁）。「エリア順」の並びに使う。
 * 都道府県は47すべてを載せる。市区町村は、掲載するときにその県の cities に足す。
 */
export type City = { slug: string; name: string; code: number };
export type Prefecture = { slug: string; name: string; code: number; region: RegionKey; cities: City[] };

/** 地方。/area/ の一覧で、この順に見出しを立てる */
export const REGIONS = [
  { key: "hokkaido-tohoku", label: "北海道・東北" },
  { key: "kanto", label: "関東" },
  { key: "chubu", label: "中部" },
  { key: "kinki", label: "近畿" },
  { key: "chugoku", label: "中国" },
  { key: "shikoku", label: "四国" },
  { key: "kyushu-okinawa", label: "九州・沖縄" },
] as const;
export type RegionKey = (typeof REGIONS)[number]["key"];

const pref = (code: number, slug: string, name: string, region: RegionKey, cities: City[] = []): Prefecture => ({
  slug,
  name,
  code,
  region,
  cities,
});

export const PREFECTURES: Prefecture[] = [
  pref(1, "hokkaido", "北海道", "hokkaido-tohoku"),
  pref(2, "aomori", "青森県", "hokkaido-tohoku"),
  pref(3, "iwate", "岩手県", "hokkaido-tohoku"),
  pref(4, "miyagi", "宮城県", "hokkaido-tohoku"),
  pref(5, "akita", "秋田県", "hokkaido-tohoku"),
  pref(6, "yamagata", "山形県", "hokkaido-tohoku"),
  pref(7, "fukushima", "福島県", "hokkaido-tohoku"),

  pref(8, "ibaraki", "茨城県", "kanto"),
  pref(9, "tochigi", "栃木県", "kanto"),
  pref(10, "gunma", "群馬県", "kanto"),
  pref(11, "saitama", "埼玉県", "kanto"),
  pref(12, "chiba", "千葉県", "kanto"),
  pref(13, "tokyo", "東京都", "kanto", [
    { slug: "minato", name: "港区", code: 13103 },
    { slug: "setagaya", name: "世田谷区", code: 13112 },
    { slug: "shibuya", name: "渋谷区", code: 13113 },
    { slug: "suginami", name: "杉並区", code: 13115 },
  ]),
  pref(14, "kanagawa", "神奈川県", "kanto", [
    { slug: "yokohama-kohoku", name: "横浜市港北区", code: 14109 },
    { slug: "kawasaki-nakahara", name: "川崎市中原区", code: 14133 },
  ]),

  pref(15, "niigata", "新潟県", "chubu"),
  pref(16, "toyama", "富山県", "chubu"),
  pref(17, "ishikawa", "石川県", "chubu"),
  pref(18, "fukui", "福井県", "chubu"),
  pref(19, "yamanashi", "山梨県", "chubu"),
  pref(20, "nagano", "長野県", "chubu"),
  pref(21, "gifu", "岐阜県", "chubu"),
  pref(22, "shizuoka", "静岡県", "chubu"),
  pref(23, "aichi", "愛知県", "chubu"),

  pref(24, "mie", "三重県", "kinki"),
  pref(25, "shiga", "滋賀県", "kinki"),
  pref(26, "kyoto", "京都府", "kinki"),
  pref(27, "osaka", "大阪府", "kinki", [{ slug: "osaka-kita", name: "大阪市北区", code: 27127 }]),
  pref(28, "hyogo", "兵庫県", "kinki"),
  pref(29, "nara", "奈良県", "kinki"),
  pref(30, "wakayama", "和歌山県", "kinki"),

  pref(31, "tottori", "鳥取県", "chugoku"),
  pref(32, "shimane", "島根県", "chugoku"),
  pref(33, "okayama", "岡山県", "chugoku"),
  pref(34, "hiroshima", "広島県", "chugoku"),
  pref(35, "yamaguchi", "山口県", "chugoku"),

  pref(36, "tokushima", "徳島県", "shikoku"),
  pref(37, "kagawa", "香川県", "shikoku"),
  pref(38, "ehime", "愛媛県", "shikoku"),
  pref(39, "kochi", "高知県", "shikoku"),

  pref(40, "fukuoka", "福岡県", "kyushu-okinawa"),
  pref(41, "saga", "佐賀県", "kyushu-okinawa"),
  pref(42, "nagasaki", "長崎県", "kyushu-okinawa"),
  pref(43, "kumamoto", "熊本県", "kyushu-okinawa"),
  pref(44, "oita", "大分県", "kyushu-okinawa"),
  pref(45, "miyazaki", "宮崎県", "kyushu-okinawa"),
  pref(46, "kagoshima", "鹿児島県", "kyushu-okinawa"),
  pref(47, "okinawa", "沖縄県", "kyushu-okinawa"),
];

export function findPref(prefSlug: string) {
  return PREFECTURES.find((p) => p.slug === prefSlug);
}

export function findCity(prefSlug: string, citySlug: string) {
  return findPref(prefSlug)?.cities.find((c) => c.slug === citySlug);
}
