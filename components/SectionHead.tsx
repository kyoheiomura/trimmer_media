import type { ReactNode } from "react";

/** セクションの見出し：肉球のしるし＋小さな欧文（飾り）＋和文の見出し。まんなかに置く */
export function SectionHead({ id, en, title, lead }: { id: string; en: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="reveal mx-auto max-w-[36rem] text-center">
      <p aria-hidden="true" className="label">
        {en}
      </p>
      <h2 id={id} className="section-title mt-4">
        {title}
      </h2>
      {lead && <p className="phrase mt-3 text-[0.9375rem] leading-[1.9] text-sub">{lead}</p>}
    </div>
  );
}
