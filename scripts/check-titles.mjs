// ビルド後の HTML を走査し、全ページの <title> に「トリマー」が入っているかを確かめる。
// 何のメディアかを検索結果で常に示す決まり（npm run build の最後に走る）
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".next", "server", "app");
if (!fs.existsSync(ROOT)) {
  console.error("✖ .next/server/app がありません。先に next build を実行してください。");
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".html") ? [p] : [];
  });
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

const pages = walk(ROOT).filter((f) => !f.includes("_global-error"));
const problems = [];
const seen = new Map();

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const route = "/" + path.relative(ROOT, file).replace(/\\/g, "/").replace(/(index)?\.html$/, "");
  if (!title) problems.push(`${route}  title がない`);
  else if (!/トリマー/.test(title)) problems.push(`${route}  「トリマー」が入っていない: ${title}`);
  if (title) seen.set(title, [...(seen.get(title) ?? []), route]);
  if (!/<html[^>]*lang="ja"/.test(html)) problems.push(`${route}  <html lang="ja"> がない`);
}

for (const [title, routes] of seen) {
  if (routes.length > 1) console.log(`⚠ warn  title が重複: ${title}\n         ${routes.join(", ")}`);
}

if (problems.length) {
  problems.forEach((p) => console.log(`✖ error ${p}`));
  console.log(`\n${pages.length}ページ中 ${problems.length}件の問題`);
  process.exit(1);
}
console.log(`✓ ${pages.length}ページすべての title に「トリマー」が入っています`);
