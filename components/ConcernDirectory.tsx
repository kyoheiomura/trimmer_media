import Link from "next/link";
import { getAllConcerns } from "@/lib/concerns-index";

/**
 * 相談の一覧（トップと /concern/）。白いタイルが並ぶ。
 * まだ取材していない相談も載せる（人数の代わりに「これから」と出す）。
 */
export function ConcernDirectory({ headingLevel = "h2", withLead = true }: { headingLevel?: "h2" | "h3"; withLead?: boolean }) {
  const Heading = headingLevel;
  return (
    <ul className={`grid gap-3 min-[640px]:grid-cols-2 min-[768px]:gap-4 ${withLead ? "" : "min-[1024px]:grid-cols-4"}`}>
      {getAllConcerns().map((c) => (
        <li key={c.slug} className="reveal reveal-pop">
          <Link href={`/concern/${c.slug}/`} className="card group flex h-full flex-col gap-2 border-2 border-transparent p-5 transition-colors hover:border-mint min-[768px]:p-6">
            <span className="flex items-start justify-between gap-3">
              <Heading className="text-[1.0625rem] leading-[1.5] ">{c.label}</Heading>
              <span className={`shrink-0 rounded-full px-2.5 text-[0.75rem] leading-[1.9] font-bold ${c.count > 0 ? "bg-yellow" : "bg-foam text-sub"}`}>{c.count > 0 ? `${c.count}人` : "これから"}</span>
            </span>
            {withLead && <span className="text-[0.8125rem] leading-[1.8] text-sub">{c.lead}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
