import { APP_PAGE_PATHS, resolveAppPage } from "../src/App";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`APP ROUTING REGRESSION FAILED: ${message}`);
}

const entries = Object.entries(APP_PAGE_PATHS);
assert(new Set(entries.map(([, path]) => path)).size === entries.length, "route paths must be unique");
for (const [page, path] of entries) {
  assert(resolveAppPage(path) === page, `route must resolve after refresh: ${path}`);
}
assert(resolveAppPage("/unknown-route") === "HOME", "unknown routes must recover to home");
assert(APP_PAGE_PATHS.HOME === "/", "home route mismatch");
assert(APP_PAGE_PATHS.ARTICLE_11 === "/article-11", "Article 11 deep link mismatch");
assert(APP_PAGE_PATHS.EXPERT_RECORDS === "/records", "records deep link mismatch");

console.log("APP ROUTING REGRESSION: ALL TESTS PASSED");
