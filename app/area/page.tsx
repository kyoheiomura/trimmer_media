import { AreaLinks } from "@/components/AreaLinks";
import { PageHero } from "@/components/PageHero";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "エリアからトリマーを探す",
  description: "取材したトリマーを、都道府県・市区町村から探せます。",
  path: "/area/",
});

export default function AreaIndexPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/area/", label: "エリアからさがす" }]}
        title="エリアからさがす"
        lead="数字は、話を聞いたトリマーの人数です。数字のない都道府県は、これから取材します。"
      />
      <div className="container-page pt-10 min-[768px]:pt-14">
        <div>
          <AreaLinks headingLevel="h2" />
        </div>
      </div>
    </>
  );
}
