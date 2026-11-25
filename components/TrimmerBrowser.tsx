"use client";

/**
 * トリマー一覧の絞り込みと並び替え。並び順は「新着順」と「エリア順」の2つだけ。
 * 条件は URL のクエリに残す（トップの検索パネルからも同じパラメータで来る）。
 * 最初の描画は条件なし＝静的 HTML と同じ。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { SampleNote, TrimmerCard } from "@/components/TrimmerCard";
import { CheckIcon, SearchIcon, SlidersIcon } from "@/components/icons";
import { PAGE_SIZE } from "@/data/site";
import { CONCERNS, WORRIES } from "@/data/vocab";
import { CONDITIONS } from "@/lib/conditions";
import type { TrimmerSummary } from "@/lib/view";

type AreaOption = { slug: string; name: string; cities: { slug: string; name: string }[] };
type Sort = "new" | "area";
type Filters = {
  concerns: string[];
  pref: string;
  city: string;
  worries: string[];
  conds: string[];
  q: string;
  sort: Sort;
};

const EMPTY: Filters = { concerns: [], pref: "", city: "", worries: [], conds: [], q: "", sort: "new" };

function fromQuery(q: URLSearchParams): Filters {
  const list = (k: string) => q.getAll(k).flatMap((v) => v.split(",")).filter(Boolean);
  // area=tokyo/setagaya の形でも受ける
  const [areaPref, areaCity] = (q.get("area") ?? "").split("/");
  return {
    concerns: list("concern"),
    pref: q.get("pref") || areaPref || "",
    city: q.get("city") || areaCity || "",
    worries: list("worry"),
    conds: list("cond"),
    q: q.get("q")?.trim() ?? "",
    sort: q.get("sort") === "area" ? "area" : "new",
  };
}

function toQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.concerns.length) q.set("concern", f.concerns.join(","));
  if (f.pref) q.set("pref", f.pref);
  if (f.city) q.set("city", f.city);
  if (f.worries.length) q.set("worry", f.worries.join(","));
  if (f.conds.length) q.set("cond", f.conds.join(","));
  if (f.q) q.set("q", f.q);
  if (f.sort !== "new") q.set("sort", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const norm = (s: string) => s.normalize("NFKC").toLowerCase();

export function TrimmerBrowser({ people, areas }: { people: TrimmerSummary[]; areas: AreaOption[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const panel = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setF(fromQuery(new URLSearchParams(window.location.search)));
    // 「さらに条件で絞り込む」から来たら絞り込みを開いておく
    if (window.location.hash === "#filters" && panel.current) panel.current.open = true;
  }, []);

  const update = (next: Filters) => {
    setF(next);
    setLimit(PAGE_SIZE);
    window.history.replaceState(null, "", `${window.location.pathname}${toQuery(next)}${window.location.hash}`);
  };

  const results = useMemo(() => {
    const words = norm(f.q).split(/\s+/).filter(Boolean);
    const filtered = people.filter(
      (s) =>
        (!f.concerns.length || f.concerns.some((t) => s.concerns.includes(t))) &&
        (!f.pref || s.prefSlug === f.pref) &&
        (!f.city || s.citySlugs.includes(f.city)) &&
        (!f.worries.length || f.worries.some((c) => s.worries.includes(c))) &&
        f.conds.every((k) => CONDITIONS.find((c) => c.key === k)?.test(s) ?? true) &&
        words.every((w) => norm(s.searchText).includes(w)),
    );
    // people は新着順で渡ってくる。エリア順は地域コード順で、同じ地域の中は新着順
    return f.sort === "area" ? [...filtered].sort((a, b) => a.areaCode - b.areaCode) : filtered;
  }, [people, f]);

  const pref = areas.find((a) => a.slug === f.pref);
  const chips = [
    ...(f.q ? [{ label: `「${f.q}」`, remove: { ...f, q: "" } }] : []),
    ...f.concerns.map((t) => ({ label: CONCERNS.find((x) => x.slug === t)?.label ?? t, remove: { ...f, concerns: toggle(f.concerns, t) } })),
    ...(f.city && pref
      ? [{ label: pref.cities.find((c) => c.slug === f.city)?.name ?? f.city, remove: { ...f, city: "" } }]
      : f.pref && pref
        ? [{ label: pref.name, remove: { ...f, pref: "" } }]
        : []),
    ...f.worries.map((c) => ({
      label: WORRIES.find((x) => x.slug === c)?.label ?? c,
      remove: { ...f, worries: toggle(f.worries, c) },
    })),
    ...f.conds.map((k) => ({
      label: CONDITIONS.find((c) => c.key === k)?.label ?? k,
      remove: { ...f, conds: toggle(f.conds, k) },
    })),
  ];

  return (
    <div>
      <label className="mb-6 block">
        <span className="sr-only">フリーワード</span>
        <span className="relative block">
          <SearchIcon size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sub" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => update({ ...f, q: e.target.value })}
            placeholder="名前・犬種・駅名・サロン名などで探す"
            className="field !pl-11"
          />
        </span>
      </label>
      <div className="card px-5 py-3 min-[768px]:px-7">
        <details ref={panel} id="filters" open className="group scroll-mt-24">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 px-1 text-[0.9375rem] font-bold [&::-webkit-details-marker]:hidden">
            <SlidersIcon size={18} />
            条件で絞り込む
            
          </summary>
          <div className="mt-3 grid gap-6 border-t border-line pt-5 min-[768px]:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-bold text-sub">相談</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONCERNS.map((v) => (
                  <CheckChip key={v.slug} checked={f.concerns.includes(v.slug)} onChange={() => update({ ...f, concerns: toggle(f.concerns, v.slug) })}>
                    {v.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-bold text-sub">エリア</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label>
                  <span className="sr-only">都道府県</span>
                  <select value={f.pref} onChange={(e) => update({ ...f, pref: e.target.value, city: "" })} className="field">
                    <option value="">都道府県</option>
                    {areas.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">市区町村</span>
                  <select
                    value={f.city}
                    disabled={!pref}
                    onChange={(e) => update({ ...f, city: e.target.value })}
                    className="field disabled:text-sub disabled:opacity-60"
                  >
                    <option value="">市区町村</option>
                    {pref?.cities.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="min-[768px]:col-span-2">
              <legend className="text-xs font-bold text-sub">心配ごと</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {WORRIES.map((c) => (
                  <CheckChip
                    key={c.slug}
                    checked={f.worries.includes(c.slug)}
                    onChange={() => update({ ...f, worries: toggle(f.worries, c.slug) })}
                  >
                    {c.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="min-[768px]:col-span-2">
              <legend className="text-xs font-bold text-sub">特徴・こだわり</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <CheckChip key={c.key} checked={f.conds.includes(c.key)} onChange={() => update({ ...f, conds: toggle(f.conds, c.key) })}>
                    {c.label}
                  </CheckChip>
                ))}
              </div>
            </fieldset>
          </div>
        </details>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="font-bold">
          <span className="num text-[1.5rem] leading-none">{results.length}</span> 人のトリマー
        </p>
        <fieldset className="flex items-center gap-0 rounded-full border border-line bg-paper p-0.5 text-sm">
          <legend className="sr-only">並び順</legend>
          {(
            [
              ["new", "新着順"],
              ["area", "エリア順"],
            ] as const
          ).map(([v, label]) => (
            <label
              key={v}
              className={`cursor-pointer rounded-full px-4 py-1.5 font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent ${
                f.sort === v ? "bg-accent text-white" : "text-sub hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="sort"
                value={v}
                checked={f.sort === v}
                onChange={() => update({ ...f, sort: v })}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => update(c.remove)}
              className="inline-flex min-h-9 items-center gap-1 rounded-full bg-towel px-3.5 text-[0.75rem] hover:bg-line"
            >
              {c.label}
              <span aria-hidden="true">×</span>
              <span className="sr-only">の条件を外す</span>
            </button>
          ))}
          <button type="button" onClick={() => update({ ...EMPTY, sort: f.sort })} className="ml-1 text-sub underline">
            すべて外す
          </button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="font-bold">
            この条件では、まだ取材していません。
          </p>
          <p className="mt-2 text-sm text-sub">上の「×」で条件を1つ外してみてください。</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-8">
          {results.slice(0, limit).map((s, i) => (
            <li key={s.slug}>
              <TrimmerCard s={s} headingLevel="h2" priority={i < 2} />
            </li>
          ))}
        </ul>
      )}
      {results.length > 0 && <SampleNote className="mt-8" />}

      {results.length > limit && (
        <p className="mt-10 text-center">
          <button type="button" onClick={() => setLimit(limit + PAGE_SIZE)} className="btn-outline">
            もっと見る（残り{results.length - limit}人）
          </button>
        </p>
      )}
    </div>
  );
}

function CheckChip({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`inline-flex min-h-10 cursor-pointer items-center gap-1 rounded-full border-2 px-3.5 text-[0.8125rem] font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        checked ? "border-accent bg-accent text-white" : "border-line bg-paper hover:border-mint"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {checked && <CheckIcon size={14} />}
      {children}
    </label>
  );
}
