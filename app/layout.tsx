import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DevFeedback } from "@/components/DevFeedback";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE } from "@/data/site";
import { RevealObserver } from "@/components/RevealObserver";
import { sans } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.defaultTitle, template: `%s${SITE.titleSuffix}` },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fdf8ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* 出てくる演出は JS が動くときだけ使う（動かなければ最初から見えている） */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-bold focus:text-white"
        >
          本文へ移動
        </a>
        <Header />
        <main id="main" className="pb-16 min-[768px]:pb-24">{children}</main>
        <Footer />
        <RevealObserver />
        {process.env.NODE_ENV === "development" && <DevFeedback />}
      </body>
    </html>
  );
}
