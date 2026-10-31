import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const ASSET_DIR = path.join(DIST_DIR, "assets");
const ENTRY_BUDGET_BYTES = 80 * 1024;
const HEAVY_THREE_PATTERN = /(three|cinematicstage|effectcomposer|renderpass|unrealbloom)/i;

function fail(message) {
  console.error(`Performance budget failed: ${message}`);
  process.exitCode = 1;
}

const html = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
const entryMatch = html.match(/<script[^>]+src="([^"]+\.js)"/);

if (!entryMatch) {
  fail("could not resolve the JavaScript entry from dist/index.html");
  process.exit();
}

// Vite's `base` changes the public URL (for example /me/assets/foo.js),
// but assets still live in dist/assets. Resolve from the assets segment.
const assetParts = entryMatch[1].split("/").filter(Boolean);
const assetsIndex = assetParts.indexOf("assets");
if (assetsIndex < 0) {
  fail("could not map the JavaScript entry to dist/assets");
  process.exit();
}
const entryPath = path.join(DIST_DIR, ...assetParts.slice(assetsIndex));
const entrySize = (await stat(entryPath)).size;
if (entrySize > ENTRY_BUDGET_BYTES) {
  fail(
    `entry ${path.basename(entryPath)} is ${(entrySize / 1024).toFixed(1)} KB; ` +
      `budget is ${ENTRY_BUDGET_BYTES / 1024} KB`,
  );
}

const assets = await readdir(ASSET_DIR);
for (const required of ["vendor-react-", "vendor-motion-"]) {
  if (!assets.some((asset) => asset.startsWith(required) && asset.endsWith(".js"))) {
    fail(`missing stable ${required.slice(0, -1)} chunk`);
  }
}

// 终端场景已全部改用 DOM，构建不应再携带闲置的 3D pipeline。
const graphicsAssets = assets.filter((asset) => HEAVY_THREE_PATTERN.test(asset));
if (graphicsAssets.length > 0) fail(`unused graphics chunks: ${graphicsAssets.join(", ")}`);

if (!process.exitCode) {
  console.log(
    `Performance budget passed: entry ${(entrySize / 1024).toFixed(1)} KB, ` +
      "stable React/GSAP vendors, DOM scenes only.",
  );
}
