import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`PWA REGRESSION TEST FAILED: ${message}`);
}

const root = process.cwd();
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "public/manifest.webmanifest"), "utf8"),
) as {
  name?: string;
  start_url?: string;
  display?: string;
  icons?: Array<{ src?: string; sizes?: string }>;
};
const serviceWorker = fs.readFileSync(
  path.join(root, "public/sw.js"),
  "utf8",
);
const main = fs.readFileSync(path.join(root, "src/main.tsx"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

assert(manifest.name === "ExpertFee", "manifest name mismatch");
assert(manifest.start_url === "/", "start URL mismatch");
assert(manifest.display === "standalone", "standalone display missing");
for (const size of ["192x192", "512x512"]) {
  const icon = manifest.icons?.find((item) => item.sizes === size);
  assert(icon?.src, `manifest icon ${size} missing`);
  assert(
    fs.existsSync(path.join(root, "public", icon.src.replace(/^\//, ""))),
    `manifest icon file ${size} missing`,
  );
}
assert(html.includes('rel="manifest"'), "manifest link missing from HTML");
assert(main.includes('serviceWorker.register("/sw.js")'), "registration missing");
assert(serviceWorker.includes("cache.addAll(CORE_ASSETS)"), "precache missing");
assert(serviceWorker.includes('request.mode === "navigate"'), "navigation fallback missing");
assert(serviceWorker.includes("offline.html"), "offline fallback missing");

console.log("PWA REGRESSION: ALL TESTS PASSED");
