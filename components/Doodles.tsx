/** 小さな線画。見出しのそばに少しだけ置く飾りなので、読み上げない。色は currentColor */
type P = { className?: string };
const base = { "aria-hidden": true, focusable: false, fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Paw = ({ className = "" }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false" fill="currentColor">
    <ellipse cx="9" cy="17" rx="4" ry="5.2" transform="rotate(-18 9 17)" />
    <ellipse cx="17" cy="9.5" rx="4" ry="5.4" transform="rotate(-6 17 9.5)" />
    <ellipse cx="26.5" cy="10.5" rx="4" ry="5.4" transform="rotate(10 26.5 10.5)" />
    <ellipse cx="33" cy="19" rx="3.8" ry="5" transform="rotate(24 33 19)" />
    <path d="M20.5 19c5.2 0 9.5 5 9.5 9.6 0 3.6-3.2 5-5.6 4.4-1.6-.4-2.6-1-4-1s-2.5.6-4 1c-2.6.7-5.8-.8-5.8-4.4 0-4.6 4.6-9.6 9.9-9.6z" />
  </svg>
);

export const Scissors = ({ className = "" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...base}>
    <circle cx="11" cy="35" r="6" />
    <circle cx="31" cy="38" r="6" />
    <path d="M15 30.500 38 6M27.500 33 14 8" />
  </svg>
);

export const Sparkle = ({ className = "" }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false" fill="currentColor">
    <path d="M20 2c1.400 9.500 5 14.600 16 18-11 3.400-14.600 8.500-16 18-1.400-9.500-5-14.600-16-18 11-3.400 14.600-8.500 16-18z" />
  </svg>
);

/** 以前は波の区切りを描いていた。いまは面を角丸のブロックで置くので、何も描かない */
export const Wave = (_: P) => null;
