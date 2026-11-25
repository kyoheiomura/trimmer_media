import { PageHero } from "@/components/PageHero";
import { ConcernDirectory } from "@/components/ConcernDirectory";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "相談からトリマーを探す",
  description: "取材したトリマーを、はじめてのトリミング・怖がりの子・シニアの子・皮膚や被毛など、相談したいことから探せます。",
  path: "/concern/",
});

export default function ConcernIndexPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/concern/", label: "相談からさがす" }]}
        title="相談からさがす"
        lead="その相談をよく引き受けているトリマーを、相談ごとにまとめています。数字は、話を聞いた人数です。"
      />
      <div className="container-page pt-10 min-[768px]:pt-14">
        <div>
          <ConcernDirectory headingLevel="h2" />
        </div>
      </div>
    </>
  );
}
