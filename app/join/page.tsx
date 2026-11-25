import { TextPage } from "@/components/TextPage";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "掲載を希望するトリマーの方へ（取材のご案内）",
  description: `${SITE.name}での取材・掲載を希望するトリマーの方へのご案内です。`,
  path: "/join/",
});

export default function JoinPage() {
  return (
    <TextPage
      crumbs={[{ href: "/join/", label: "掲載を希望するトリマーの方へ" }]}
      title="掲載を希望するトリマーの方へ"
      lead={<p>読んだ人が「この人にお願いしたい」と思えるトリマーを見つけられるように、動物への接し方と人柄を、ご本人の言葉で届けたいと考えています。</p>}
    >
      <section aria-labelledby="who">
        <h2 id="who">取材をお願いしたい方</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>トリミングサロン、自宅サロン、動物病院などで、犬や猫のトリミングをしている方。出張やフリーランスの方も歓迎します。</li>
          <li>得意な犬種や、サロンの大きさ、経験の年数は問いません。コンテストの成績も問いません。</li>
        </ul>
      </section>

      <section aria-labelledby="flow">
        <h2 id="flow">取材の流れ</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>お問い合わせフォームからご連絡ください。働いているサロンと、ご連絡先をお書き添えください。</li>
          <li>お話を伺い、原稿にまとめます。進め方はご相談のうえで決めます。</li>
          <li>原稿をご確認いただいてから公開します。</li>
        </ol>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">ご連絡先</h2>
        <p>
          <a href={SITE.contactUrl} target="_blank" rel="noopener" className="link">
            お問い合わせフォーム
            <span className="sr-only">（新しいタブで開きます）</span>
          </a>
        </p>
      </section>
    </TextPage>
  );
}
