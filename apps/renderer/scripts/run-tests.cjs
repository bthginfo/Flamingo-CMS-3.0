const { readdirSync } = require("node:fs");
const { join, relative } = require("node:path");
const { spawnSync } = require("node:child_process");

const appRoot = join(__dirname, "..");
const sourceRoot = join(appRoot, "src");

function collectTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) return collectTestFiles(absolutePath);
      return entry.isFile() && entry.name.endsWith(".test.ts") ? [absolutePath] : [];
    });
}

const testFiles = collectTestFiles(sourceRoot)
  .map((file) => relative(appRoot, file))
  .sort();

if (testFiles.length === 0) {
  console.error("No renderer test files found.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...testFiles],
  {
    cwd: appRoot,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
