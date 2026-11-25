import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `ページが見つかりません${SITE.titleSuffix}` },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page py-20 min-[768px]:py-28">
      <h1 className="text-[clamp(1.625rem,1.2rem+1.8vw,2.5rem)] font-extrabold">ページが見つかりません</h1>
      <p className="mt-6 text-sub">移動したか、削除された可能性があります。一覧から探し直してください。</p>
      <Link href="/trimmer/" className="btn-primary mt-10">
        トリマーをさがす
      </Link>
    </div>
  );
}
