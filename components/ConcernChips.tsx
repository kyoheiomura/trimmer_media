import { findConcern } from "@/data/vocab";

/** 相談のしるしを並べる */
export function ConcernChips({ slugs, className = "" }: { slugs: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {slugs.map((slug) => {
        const c = findConcern(slug);
        return c ? (
          <li key={slug} className="chip">
            {c.short}
          </li>
        ) : null;
      })}
    </ul>
  );
}
