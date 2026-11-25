import { LINE_Seed_JP } from "next/font/google";

// LINE Seed JP ひとつで組む。丸みのある幾何学的なゴシックで、和文も欧文も数字も同じ表情になる。
// 見出しとロゴは 800、強調は 700、本文は 400
export const sans = LINE_Seed_JP({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-sans-jp",
});
