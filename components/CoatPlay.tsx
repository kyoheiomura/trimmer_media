"use client";

/**
 * トップのいちばん下に置く「おまけ」。画面の毛並みを手でなでられる、ちょっとした遊び。
 * - 読み込み時に一度だけ、くしが左から右へ通り、乱れた毛がととのう。
 * - 指やカーソルでなでると、なでた向きに毛が流れる。手を離すと、ゆっくり元の流れに戻る。
 * - 毛色を選べる。
 * - 動きを減らす設定では、最初からととのった状態で止まっている（なでても動かない）。
 * 毛並みは飾りなので読み上げない。縦のスクロールは妨げない（touch-action: pan-y）。
 */
import { useEffect, useRef, useState } from "react";

type Rgb = [number, number, number];
type Coat = { key: string; label: string; dark: Rgb; mid: Rgb; light: Rgb; base: string; onDark: boolean };

/** 毛色。暗い根もと → 明るい毛先の3色と、毛の下の地の色 */
const COATS: Coat[] = [
  { key: "apricot", label: "アプリコット", dark: [176, 122, 76], mid: [221, 172, 122], light: [249, 232, 208], base: "#c9925b", onDark: false },
  { key: "white", label: "ホワイト", dark: [214, 207, 194], mid: [238, 234, 226], light: [255, 255, 255], base: "#e4dfd3", onDark: false },
  { key: "silver", label: "シルバー", dark: [124, 127, 132], mid: [178, 182, 188], light: [240, 242, 245], base: "#95989e", onDark: false },
  { key: "brown", label: "ブラウン", dark: [78, 52, 36], mid: [124, 86, 60], light: [190, 150, 116], base: "#5f402c", onDark: true },
  { key: "black", label: "ブラック", dark: [22, 22, 24], mid: [52, 52, 56], light: [128, 128, 134], base: "#1e1e20", onDark: true },
];
const STEPS = 14;
const lut = (c: Coat) =>
  Array.from({ length: STEPS }, (_, i) => {
    const t = i / (STEPS - 1);
    const [a, b, k] = t < 0.5 ? [c.dark, c.mid, t * 2] : [c.mid, c.light, (t - 0.5) * 2];
    return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(" ")})`;
  });

type Strand = { x: number; y: number; len: number; rest: number; a: number; bend: number; held: number };

export function CoatPlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const coatRef = useRef(0);
  const redraw = useRef<() => void>(() => {});
  const [coat, setCoat] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tables = COATS.map(lut);

    let w = 0;
    let h = 0;
    // 色の段階ごと・太さごとに毛をまとめる（1段階を1回の stroke で描く）
    let buckets: Strand[][] = [];
    let all: Strand[] = [];
    let raf = 0;
    let comb = still ? Infinity : -0.15;
    const last = { x: 0, y: 0, has: false };
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 11;
      buckets = Array.from({ length: STEPS }, () => []);
      all = [];
      const gap = w < 640 ? 6.5 : w < 1400 ? 7.5 : 8.5;
      for (let y = -8; y < h + 12; y += gap * 0.8) {
        for (let x = -12; x < w + 12; x += gap) {
          const sx = x + (rnd() - 0.5) * gap * 1.2;
          const sy = y + (rnd() - 0.5) * gap * 1.2;
          // ととのった流れ：右下へ、大きくゆったりうねる
          const rest = 0.62 + Math.sin(sx * 0.0036 + sy * 0.0068) * 0.42 + Math.cos(sx * 0.0015 - sy * 0.0042) * 0.26;
          // つや：流れに沿った明るい帯と暗い帯。1本ごとに少しばらつかせる
          const sheen = 0.5 + Math.sin(sx * 0.0052 - sy * 0.0125 + 0.8) * 0.26 + Math.sin(sx * 0.0019 + sy * 0.003) * 0.12 + (rnd() - 0.5) * 0.5;
          const s: Strand = {
            x: sx,
            y: sy,
            len: 20 + rnd() * 24,
            rest,
            a: still ? rest : rest + (rnd() - 0.5) * 3.2,
            bend: (rnd() - 0.5) * 0.8,
            held: 0,
          };
          buckets[Math.min(STEPS - 1, Math.max(0, Math.floor(sheen * STEPS)))].push(s);
          all.push(s);
        }
      }
    }

    function draw() {
      const c = COATS[coatRef.current];
      const table = tables[coatRef.current];
      ctx!.fillStyle = c.base;
      ctx!.fillRect(0, 0, w, h);
      ctx!.lineCap = "round";
      // 暗い毛を先に、明るい毛を上に重ねる
      buckets.forEach((list, i) => {
        ctx!.beginPath();
        for (const s of list) {
          const ex = s.x + Math.cos(s.a) * s.len;
          const ey = s.y + Math.sin(s.a) * s.len;
          const k = s.len * s.bend * 0.35;
          ctx!.moveTo(s.x, s.y);
          ctx!.quadraticCurveTo((s.x + ex) / 2 - Math.sin(s.a) * k, (s.y + ey) / 2 + Math.cos(s.a) * k, ex, ey);
        }
        ctx!.strokeStyle = table[i];
        ctx!.lineWidth = 1.05 + (i / STEPS) * 0.7;
        ctx!.stroke();
      });
    }

    function tick() {
      let moving = false;
      if (comb < 1.3) {
        comb += 0.009;
        moving = true;
      }
      const combX = comb * w;
      for (const s of all) {
        if (s.x > combX) continue; // まだくしが通っていない
        if (s.held > 0) {
          s.held -= 1;
          moving = true;
          continue;
        }
        const d = s.rest - s.a;
        if (Math.abs(d) > 0.004) {
          s.a += d * 0.06;
          moving = true;
        }
      }
      draw();
      raf = moving ? requestAnimationFrame(tick) : 0;
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    redraw.current = () => (raf ? undefined : draw());

    function stroke(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cur = cursorRef.current;
      if (cur && e.pointerType === "mouse") {
        cur.style.opacity = "1";
        cur.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (still) return;
      if (last.has) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.hypot(dx, dy) > 1.5) {
          const dir = Math.atan2(dy, dx);
          const reach = w < 640 ? 56 : 92;
          for (const s of all) {
            const d = Math.hypot(s.x - x, s.y - y);
            if (d > reach) continue;
            // 近いほうの回り方で、なでた向きへ寄せる
            const diff = Math.atan2(Math.sin(dir - s.a), Math.cos(dir - s.a));
            s.a += diff * (1 - d / reach) * 0.55;
            s.held = 170;
          }
          wake();
        }
      }
      last.x = x;
      last.y = y;
      last.has = true;
    }
    const leave = () => {
      last.has = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    build();
    draw();
    wake();
    const ro = new ResizeObserver(() => {
      if (Math.abs(canvas!.getBoundingClientRect().width - w) < 1) return;
      comb = Infinity;
      build();
      for (const s of all) s.a = s.rest;
      draw();
    });
    ro.observe(canvas);
    canvas.addEventListener("pointermove", stroke);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerup", leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", stroke);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerup", leave);
    };
  }, []);

  useEffect(() => {
    coatRef.current = coat;
    redraw.current();
  }, [coat]);

  const onDark = COATS[coat].onDark;
  return (
    <div>
      <div className="relative isolate h-[clamp(11rem,22vw,15rem)] overflow-hidden rounded-[var(--radius-soft)]" style={{ background: COATS[coat].base }}>
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full touch-pan-y min-[900px]:cursor-none" />
        {/* カーソルについてくる丸いしるし（マウスのときだけ） */}
        <span
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 hidden size-20 items-center justify-center rounded-full text-[0.8125rem] font-bold opacity-0 transition-opacity duration-300 min-[900px]:flex ${onDark ? "bg-white text-ink" : "bg-yellow text-ink"}`}
        >
          なでなで
        </span>
      </div>
      <fieldset className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <legend className="sr-only">毛色をえらぶ</legend>
        {COATS.map((c, i) => (
          <label
            key={c.key}
            className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-2 bg-paper py-1 pr-4 pl-1.5 text-[0.8125rem] font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${coat === i ? "border-ink" : "border-transparent hover:border-line"}`}
          >
            <input type="radio" name="coat" value={c.key} checked={coat === i} onChange={() => setCoat(i)} className="sr-only" />
            <span aria-hidden="true" className="size-6 rounded-full" style={{ background: `rgb(${c.mid.join(" ")})` }} />
            {c.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
