import fs from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(
      `HOME SHARE RESULT BUILDER INTEGRATION FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync("src/pages/HomePage.tsx", "utf8");
const sharePage = fs.readFileSync("src/pages/SharePage.tsx", "utf8");

assert(
  page.includes('import type { ShareResultInput } from "../share/ShareResult";'),
  "typed share result contract missing",
);

assert(page.includes("onOpenShare?.({"), "quick result is not handed to share route");
assert(page.includes("evaluationValueToman: parseMoneyValue(quickValue)"), "evaluation value handoff missing");
assert(page.includes("expertCount: 1"), "expert count handoff missing");
assert(page.includes("calculatedFeeToman: quickFee"), "calculated fee handoff missing");
assert(sharePage.includes("createShareText("), "share text builder missing from share route");
assert(sharePage.includes("navigator.share"), "Web Share API was removed");
assert(sharePage.includes("navigator.clipboard.writeText(shareText)"), "Clipboard fallback was removed");

assert(page.includes("calculateCommonFee"), "quick calculation was removed");
assert(page.includes("ARTICLE_11"), "Article 11 quick calculation contract was removed");

console.log("HOME SHARE RESULT BUILDER INTEGRATION: ALL TESTS PASSED");
