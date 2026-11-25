/** 線のアイコン。装飾なので aria-hidden。色は currentColor */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Svg>
);
export const SlidersIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Svg>
);
export const BookIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z" />
    <path d="M12 6.5v13" />
  </Svg>
);
export const SproutIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 20v-8" />
    <path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.5-2.5 6.5-7 6.5z" />
    <path d="M12 14c0-3.5-2-5.5-6.5-5.5 0 3.8 2.2 5.5 6.5 5.5z" />
  </Svg>
);
export const PeopleIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3" />
    <path d="M6.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" />
    <circle cx="5" cy="10" r="2.2" />
    <path d="M1.8 18c.4-2.2 1.7-3.6 3.6-3.9" />
    <circle cx="19" cy="10" r="2.2" />
    <path d="M22.2 18c-.4-2.2-1.7-3.6-3.6-3.9" />
  </Svg>
);
export const ChatIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12c0-4.2 3.6-7.5 8-7.5s8 3.3 8 7.5-3.6 7.5-8 7.5c-1.3 0-2.6-.3-3.7-.8L4 20l1.2-3.6C4.4 15.1 4 13.6 4 12z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.6} />
  </Svg>
);
export const BookmarkIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p}>
    <path d="M6.5 4h11v16l-5.5-4-5.5 4z" fill={filled ? "currentColor" : "none"} />
  </Svg>
);
export const HomeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 11l8-6.5 8 6.5" />
    <path d="M6 9.5V19h12V9.5" />
  </Svg>
);
export const ChevronRight = (p: P) => (
  <Svg {...p}>
    <path d="M9.5 6l6 6-6 6" />
  </Svg>
);
export const ArrowRight = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5" />
  </Svg>
);
export const TargetIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 20l7-7" />
    <path d="M14 4.5a5.5 5.5 0 1 1-4.3 9" />
    <path d="M4 15v5h5" />
  </Svg>
);
export const NoteIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
  </Svg>
);
export const HeartHandIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 19.5s-7.5-4.3-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.5c0 5.1-7.5 9.4-7.5 9.4z" />
  </Svg>
);
export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const PlusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
