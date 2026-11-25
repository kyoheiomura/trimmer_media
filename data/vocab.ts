/**
 * 比較項目で使う決まった語彙。自由入力にすると絞り込みと比較が崩れるので、増やすときはここに足す。
 */

/**
 * 相談（サイトの主な探し方）。slug は URL（/concern/[slug]/）に使うので、公開後は変えない。
 * 並びは一覧・絞り込みの順。
 * lead は相談ページの冒頭の文。結果を約束する言い方や、病気への効果は書かない。
 */
export type Concern = { slug: string; label: string; short: string; lead: string };
export const CONCERNS: Concern[] = [
  {
    slug: "first",
    label: "はじめてのトリミング",
    short: "はじめて",
    lead: "子犬や迎えたばかりの子の、最初の一回を引き受けることが多いトリマーたちです。",
  },
  {
    slug: "shy",
    label: "怖がり・苦手な工程がある",
    short: "怖がり",
    lead: "ドライヤーの音や爪切り、知らない場所が苦手な子と、時間をかけて向き合うトリマーたちです。",
  },
  {
    slug: "senior",
    label: "シニアの子",
    short: "シニア",
    lead: "立っていられる時間や体調に合わせて、手順と時間を組み替えるトリマーたちです。",
  },
  {
    slug: "skin",
    label: "皮膚や被毛が気になる",
    short: "皮膚・被毛",
    lead: "皮膚や毛の状態を見ながら、シャンプーの選び方や洗い方を相談できるトリマーたちです。",
  },
  {
    slug: "matting",
    label: "毛玉・もつれ",
    short: "毛玉",
    lead: "もつれた毛をどこまでほどき、どこから短くするかを、飼い主と相談して決めるトリマーたちです。",
  },
  {
    slug: "style",
    label: "カットスタイルを相談したい",
    short: "スタイル",
    lead: "毛質や骨格、暮らし方を聞いたうえで、その子に合う形を一緒に考えるトリマーたちです。",
  },
  {
    slug: "large",
    label: "中型犬・大型犬",
    short: "中・大型犬",
    lead: "体の大きな子の洗い方、乾かし方、抜け毛の手入れに慣れているトリマーたちです。",
  },
  {
    slug: "cat",
    label: "猫のトリミング",
    short: "猫",
    lead: "猫の体の扱い方と、負担をかけない時間配分を心得ているトリマーたちです。",
  },
];
export const CONCERN_SLUGS = CONCERNS.map((s) => s.slug) as [string, ...string[]];
export const findConcern = (slug: string) => CONCERNS.find((s) => s.slug === slug);
export const concernLabel = (slug: string) => findConcern(slug)?.label ?? slug;

/** よく受ける相談（こまかい心配ごと）。「〜が直る」「〜できるようになる」とは書かない */
export const WORRIES = [
  { slug: "kamu", label: "手を出すと噛もうとすることがある" },
  { slug: "dryer", label: "ドライヤーの音が苦手" },
  { slug: "tsume", label: "爪切りや足先を触られるのが苦手" },
  { slug: "azukari", label: "長い時間のお預けが心配" },
  { slug: "tsuuin", label: "持病があり通院している" },
  { slug: "kotowari", label: "ほかのサロンで断られたことがある" },
  { slug: "tsutae", label: "仕上がりの希望をうまく伝えられない" },
  { slug: "ie", label: "家でのお手入れを教わりたい" },
  { slug: "rusuban", label: "飼い主と離れると不安がる" },
  { slug: "tatou", label: "多頭飼いでまとめてお願いしたい" },
] as const;
export const WORRY_SLUGS = WORRIES.map((g) => g.slug) as [string, ...string[]];
export const worryLabel = (slug: string) => WORRIES.find((g) => g.slug === slug)?.label ?? slug;

/** 引き受けている動物 */
export const ANIMALS = ["小型犬", "中型犬", "大型犬", "猫", "うさぎ・小動物"] as const;

/** 動物への接し方。優劣ではなく相性の項目 */
export const TONES = ["その子のペースを待つ", "手早く終えて負担を減らす", "声をかけ続ける", "その子に合わせて変える"] as const;
/** 飼い主への伝え方の中心 */
export const REPORTS = ["お迎えのときに口頭で", "写真つきのメモで", "記録を一緒に見ながら", "当日中にメッセージで"] as const;
/** トリミング中、飼い主がそばにいられるか */
export const ATTENDS = ["そばで見ていられる", "ガラス越しに見られる", "お預かりのみ"] as const;
/** お預かりの形 */
export const STYLES = ["1頭ずつ貸し切り", "同じ時間に2〜3頭", "出張・訪問"] as const;
export const ROLES = ["オーナー", "店長", "所属トリマー", "フリーランス"] as const;

export const VENUE_KINDS = ["トリミングサロン", "自宅サロン", "動物病院併設", "ペットホテル併設", "出張・訪問", "その他"] as const;
export const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日", "祝"] as const;
export const FEATURES = [
  "完全予約制",
  "1頭ずつ貸し切り",
  "トリミング室が見える",
  "送迎",
  "駐車場",
  "ペットホテル",
  "動物病院と連携",
  "大型犬対応",
  "猫対応",
  "キャッシュレス対応",
] as const;
