import { SITE } from "@/data/site";

/**
 * ロゴ：歩いていく2つの足あと＋小文字の「tocotoco」＋小さな読み＋右に小さなはさみ。
 * 読み上げは外側のリンクの aria-label が担当するので、ここは飾りとして扱う。
 */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-2">
      <StepsMark className={size === "lg" ? "h-10 w-12" : "h-7 w-9 min-[400px]:h-8 min-[400px]:w-10"} />
      <span className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-[-0.01em] ${size === "lg" ? "text-[2rem]" : "text-[1.3125rem] min-[400px]:text-[1.5rem]"}`}>{SITE.nameEn}</span>
        <span className="mt-1 text-[0.5625rem] font-bold tracking-[0.42em] text-sub">{SITE.kana}</span>
      </span>
      <ScissorsMark className={size === "lg" ? "size-9" : "hidden size-7 min-[400px]:block"} />
    </span>
  );
}

const PAW = (
  <>
    <ellipse cx="-6.200" cy="-2.500" rx="1.900" ry="2.500" transform="rotate(-18 -6.200 -2.500)" />
    <ellipse cx="-2.300" cy="-6" rx="1.900" ry="2.600" transform="rotate(-6 -2.300 -6)" />
    <ellipse cx="2.300" cy="-6" rx="1.900" ry="2.600" transform="rotate(6 2.300 -6)" />
    <ellipse cx="6.200" cy="-2.500" rx="1.900" ry="2.500" transform="rotate(18 6.200 -2.500)" />
    <path d="M0-2.600c2.800 0 5.100 2.700 5.100 5.200 0 1.900-1.700 2.700-3 2.400C1.200 4.800.700 4.500 0 4.500s-1.200.300-2.100.500c-1.400.300-3.100-.500-3.100-2.400 0-2.500 2.400-5.200 5.200-5.200z" />
  </>
);

/** 足あとが2つ、右上へ歩いていく。手前がミント、先が黄色 */
export function StepsMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <g transform="translate(12 21) rotate(18)" fill="#6fd3c1">
        <g className="step-a">{PAW}</g>
      </g>
      <g transform="translate(29 11) rotate(18) scale(0.86)" fill="#ffd83d">
        <g className="step-b">{PAW}</g>
      </g>
    </svg>
  );
}

/** はさみ。持ち手の輪はミントと黄色、刃は墨色。少し開いた形 */
export function ScissorsMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false" fill="none" strokeLinecap="round">
      <path d="M11.500 19.500 25 5M16.500 21 9 4" stroke="#1c1c1a" strokeWidth="2.6" />
      <circle cx="8" cy="24" r="4" stroke="#6fd3c1" strokeWidth="3" />
      <circle cx="19.500" cy="25.500" r="4" stroke="#ffd83d" strokeWidth="3" />
      <circle cx="14.300" cy="15.800" r="1.300" fill="#1c1c1a" />
    </svg>
  );
}
