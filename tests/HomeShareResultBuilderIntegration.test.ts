import fs from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(
      `HOME SHARE RESULT BUILDER INTEGRATION FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync("src/pages/HomePage.tsx", "utf8");

assert(
  page.includes('import { buildShareResult } from "../share/ShareResultBuilder";'),
  "ShareResultBuilder import missing",
);

const handleStart = page.indexOf("async function handleShare");
const handleEnd = page.indexOf("\n  }", handleStart);
assert(handleStart >= 0, "handleShare function missing");

const handleShare = page.slice(
  handleStart,
  handleEnd > handleStart ? handleEnd : handleStart + 5000,
);

assert(handleShare.includes("buildShareResult({"), "handleShare does not call buildShareResult");
assert(handleShare.includes("evaluationValueToman: evaluation"), "evaluation value is not passed to builder");
assert(handleShare.includes("expertCount: 1"), "expert count is not passed to builder");
assert(handleShare.includes("calculatedFeeToman: quickFee"), "calculated fee is not passed to builder");
assert(handleShare.includes("const text = shareResult.text"), "Share text is not sourced from builder");
assert(handleShare.includes("title: shareResult.title"), "Share title is not sourced from builder");

assert(!handleShare.includes('"تعداد کارشناسان: ۱ نفر"'), "old inline share text remains");
assert(!handleShare.includes('"ExpertFee",'), "old inline attribution remains");

assert(handleShare.includes("navigator.share"), "Web Share API was removed");
assert(handleShare.includes("navigator.clipboard.writeText(text)"), "Clipboard fallback was removed");

assert(page.includes("calculateCommonFee"), "quick calculation was removed");
assert(page.includes("ARTICLE_11"), "Article 11 quick calculation contract was removed");

console.log("HOME SHARE RESULT BUILDER INTEGRATION: ALL TESTS PASSED");
