import type { ReactNode } from "react";
import { type Crumb } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";

/** 読み物ページ（掲載のご案内・ポリシーなど）の共通の形 */
export function TextPage({ crumbs, title, lead, children }: { crumbs: Crumb[]; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={crumbs} title={title} lead={lead} />
      <div className="container-page">
        <div className="container-text card mt-8 space-y-12 p-7 min-[768px]:p-12 [&_h2]:font-display [&_h2]:text-[1.25rem] [&_h2]:font-extrabold min-[768px]:[&_h2]:text-[1.5rem] [&_li]:text-[0.9375rem] [&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4">
          {children}
        </div>
      </div>
    </>
  );
}
