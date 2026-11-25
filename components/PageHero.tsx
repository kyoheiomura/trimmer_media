import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

/** 内側のページの見出し。うすいミントの面に、パンくず → h1 → 導入文。下は波 */
export function PageHero({ crumbs, title, lead, children }: { crumbs: Crumb[]; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="mx-3 rounded-[2.5rem] bg-towel min-[768px]:mx-6">
      <Breadcrumbs items={crumbs} />
      <div className="container-page pt-8 pb-12 min-[768px]:pt-12 min-[768px]:pb-16">
        <h1 className="pop-in max-w-[40rem] text-[clamp(1.625rem,1.2rem+1.8vw,2.5rem)] leading-[1.5] font-extrabold">{title}</h1>
        {lead && <div className="pop-in mt-4 max-w-[36rem] text-[0.9375rem] leading-[1.95]">{lead}</div>}
        {children}
      </div>
    </section>
  );
}
