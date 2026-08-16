import fs from "node:fs";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `HOME BOTTOM ACTIONS REGRESSION FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync(
  "src/pages/HomePage.tsx",
  "utf8",
);

/* Header must be branding-only. */
assert(
  !page.includes('showComingSoon("درباره نرم‌افزار")'),
  "obsolete Header About action remains",
);

assert(
  !page.includes('showComingSoon("تنظیمات")'),
  "obsolete Header Settings action remains",
);

assert(
  !page.includes("justifySelf: \"start\""),
  "obsolete split Header action layout remains",
);

assert(
  !page.includes("justifySelf: \"end\""),
  "obsolete split Header action layout remains",
);

/* Exactly the approved bottom action IDs. */
for (const id of [
  'data-testid="home-history-action"',
  'data-testid="home-share-action"',
  'data-testid="home-settings-action"',
  'data-testid="home-about-action"',
]) {
  assert(
    page.includes(id),
    `approved bottom action missing: ${id}`,
  );
}

assert(
  page.includes('data-testid="home-bottom-new-actions"'),
  "bottom action container missing",
);

assert(
  page.includes("repeat(3, minmax(0, 1fr))"),
  "three-column new-action layout missing",
);

assert(
  page.includes('data-testid="home-history-action-area"'),
  "existing history action must remain separate from the three new actions",
);

/* Real callbacks, not coming-soon placeholders. */
assert(
  page.includes("onOpenHistory?.()"),
  "History action is not connected",
);

assert(
  page.includes("onOpenSettings?.()"),
  "Settings action is not connected",
);

assert(
  page.includes("onOpenAbout?.()"),
  "About action is not connected",
);

assert(
  page.includes("navigator.share"),
  "Share API integration missing",
);

assert(
  page.includes("navigator.clipboard.writeText"),
  "Share fallback copy integration missing",
);

/* No duplicate About/Settings labels in the Header. */
const headerStart = page.indexOf("<header");
const headerEnd = page.indexOf("</header>");

assert(
  headerStart >= 0 && headerEnd > headerStart,
  "Home header could not be located",
);

const header = page.slice(headerStart, headerEnd);

assert(
  !header.includes("درباره نرم‌افزار"),
  "About is still visible in Header",
);

assert(
  !header.includes("تنظیمات"),
  "Settings is still visible in Header",
);

/* Existing calculation must remain present. */
assert(
  page.includes("calculateCommonFee"),
  "existing quick calculation was removed",
);

assert(
  page.includes("ARTICLE_11"),
  "Article 11 quick calculation contract was removed",
);

console.log(
  "HOME BOTTOM ACTIONS REGRESSION: ALL TESTS PASSED",
);
