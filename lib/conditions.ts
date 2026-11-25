/** 「特徴・こだわり」の絞り込み条件。検索パネルと一覧の両方で使う */
import type { TrimmerSummary } from "@/lib/view";

export const CONDITIONS = [
  { key: "solo", label: "1頭ずつ貸し切り", test: (s: TrimmerSummary) => s.styles.includes("1頭ずつ貸し切り") },
  { key: "attend", label: "トリミング中の様子を見られる", test: (s: TrimmerSummary) => s.attend !== "お預かりのみ" },
  { key: "wait", label: "その子のペースを待つ", test: (s: TrimmerSummary) => s.tone === "その子のペースを待つ" },
  { key: "quick", label: "手早く終えて負担を減らす", test: (s: TrimmerSummary) => s.tone === "手早く終えて負担を減らす" },
  { key: "female", label: "女性のトリマー", test: (s: TrimmerSummary) => s.gender === "女性" },
  { key: "large", label: "大型犬をお願いできる", test: (s: TrimmerSummary) => s.animals.includes("大型犬") },
  { key: "cat", label: "猫をお願いできる", test: (s: TrimmerSummary) => s.animals.includes("猫") },
  { key: "pickup", label: "送迎がある", test: (s: TrimmerSummary) => s.features.includes("送迎") },
  { key: "vet", label: "動物病院と連携している", test: (s: TrimmerSummary) => s.features.includes("動物病院と連携") },
  { key: "weekend", label: "土日にお願いできる", test: (s: TrimmerSummary) => s.weekend },
  { key: "evening", label: "19時以降もお迎えに行ける", test: (s: TrimmerSummary) => s.evening },
] as const;
