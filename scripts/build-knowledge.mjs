import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE = path.join(
  ROOT,
  "knowledge",
  "source",
  "tarife.md"
);

const OUT = path.join(ROOT, "knowledge");

if (!fs.existsSync(SOURCE)) {
  console.error("ERROR: tarife.md not found.");
  console.error(SOURCE);
  process.exit(1);
}

const raw = fs
  .readFileSync(SOURCE, "utf8")
  .replace(/\r\n/g, "\n");

function faToEn(value) {
  const map = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9"
  };

  return Number(
    String(value).replace(
      /[۰-۹]/g,
      digit => map[digit]
    )
  );
}

function clean(value = "") {
  return value
    .replace(/<a\s+id="[^"]*"><\/a>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractArticles(markdown) {
  const heading =
    /^##\s*ماده\s*([۰-۹0-9]+)\s*$/gm;

  const matches = [...markdown.matchAll(heading)];
  const articles = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    const article = faToEn(current[1]);

    const start =
      current.index + current[0].length;

    const end =
      next ? next.index : markdown.length;

    const body = clean(
      markdown.slice(start, end)
    );

    articles.push({
      id: `article-${article}`,
      article,
      title: `ماده ${article}`,
      text: body
    });
  }

  return articles;
}

function writeJson(filename, data) {
  const target = path.join(OUT, filename);

  fs.writeFileSync(
    target,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(
    `Created: ${path.relative(ROOT, target)}`
  );
}

const articles = extractArticles(raw);

if (articles.length !== 58) {
  console.error(
    `ERROR: Expected 58 articles, found ${articles.length}.`
  );
  process.exit(1);
}

writeJson("articles.json", articles);

writeJson(
  "rules.json",
  articles.map(a => ({
    id: `rules-article-${a.article}`,
    article: a.article,
    status: "pending-review",
    rules: []
  }))
);

writeJson(
  "questions.json",
  articles.map(a => ({
    article: a.article,
    status: "pending-review",
    questions: []
  }))
);

writeJson(
  "workflow.json",
  articles.map(a => ({
    id: `workflow-article-${a.article}`,
    article: a.article,
    enabled: false,
    firstQuestion: null,
    status: "pending-review"
  }))
);

writeJson(
  "coefficients.json",
  {
    version: 1,
    status: "pending-review",
    coefficients: []
  }
);

console.log("");
console.log(
  `SUCCESS: ${articles.length} articles extracted.`
);