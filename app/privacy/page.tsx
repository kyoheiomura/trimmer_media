import { TextPage } from "@/components/TextPage";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "プライバシーポリシー",
  description: `${SITE.name}（${SITE.kind}）のプライバシーポリシーです。`,
  path: "/privacy/",
});

// 公開前に、運営者情報・アクセス解析の有無に合わせて専門家の確認を受けて差し替えること
export default function PrivacyPage() {
  return (
    <TextPage crumbs={[{ href: "/privacy/", label: "プライバシーポリシー" }]} title="プライバシーポリシー">
      <section aria-labelledby="draft">
        <h2 id="draft">（下書き）</h2>
        <p>このページは公開前に内容を確定します。</p>
      </section>
      <section aria-labelledby="contact">
        <h2 id="contact">お問い合わせ</h2>
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
