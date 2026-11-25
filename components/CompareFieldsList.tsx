import { COMPARE_GROUPS } from "@/lib/compare-fields";
import type { TrimmerCompareData } from "@/lib/view";

/** 個別ページの「〇〇さんの仕事のしかた」。項目の並びと見出しは lib/compare-fields.ts で決める */
export function CompareFieldsList({ data }: { data: TrimmerCompareData }) {
  return (
    <div className="space-y-5">
      {COMPARE_GROUPS.map((g) => (
        <section key={g.key} id={`cf-${g.key}`} aria-labelledby={`cf-${g.key}-title`} className="card scroll-mt-24 p-6 min-[768px]:p-9">
          <h3 id={`cf-${g.key}-title`} className="flex items-center gap-3 text-[1.125rem]">
            <span aria-hidden="true" className="h-5 w-1.5 rounded-full bg-mint" />
            {g.label}
          </h3>
          <dl className="mt-3 divide-y divide-dashed divide-line">
            {g.fields.map((f) => {
              const v = f.get(data);
              const values = Array.isArray(v) ? v : [v];
              return (
                <div key={f.key} className="grid gap-1 py-3.5 min-[768px]:grid-cols-[13rem_1fr] min-[768px]:gap-6">
                  <dt className="text-[0.8125rem] leading-[2.1] font-bold text-sub">{f.label}</dt>
                  <dd className="text-[0.9375rem]">
                    {f.kind === "list" ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {values.map((x) => (
                          <li key={x} className="rounded-full bg-towel px-3 text-[0.8125rem] leading-[2]">
                            {x}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      values.map((x) => <p key={x}>{x}</p>)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
