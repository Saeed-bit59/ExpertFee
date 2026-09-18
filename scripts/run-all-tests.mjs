import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const testsDirectory = path.join(projectRoot, "tests");
const tsxBootstrap = pathToFileURL(
  path.join(projectRoot, "scripts", "tsx-runtime-bootstrap.mjs"),
).href;
const testFiles = readdirSync(testsDirectory)
  .filter((name) => name.endsWith(".test.ts"))
  .sort((left, right) => left.localeCompare(right, "en"));

if (testFiles.length === 0) {
  throw new Error("هیچ تست TypeScript در پوشه tests پیدا نشد.");
}

const failures = [];
for (const fileName of testFiles) {
  const result = spawnSync(
    process.execPath,
    [
      `--import=${tsxBootstrap}`,
      "--import=tsx",
      path.join(testsDirectory, fileName),
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: "pipe",
      env: process.env,
    },
  );
  if (result.status !== 0) {
    failures.push(fileName);
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
  } else {
    console.log(`PASS ${fileName}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} test file(s) failed:`);
  failures.forEach((fileName) => console.error(`- ${fileName}`));
  process.exitCode = 1;
} else {
  console.log(`\nALL ${testFiles.length} TYPESCRIPT TEST FILES PASSED`);
}
