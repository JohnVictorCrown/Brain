import { build } from "bun";
import { SveltePlugin } from "bun-plugin-svelte";
import { renameSync, existsSync, unlinkSync, copyFileSync } from "fs";

const result = await build({
  entrypoints: ["./src/main.ts"],
  outdir: "./public",
  target: "browser",
  plugins: [SveltePlugin()],
});

if (!result.success) {
  console.error("Build failed");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Ensure index.js exists (rename or copy main.js)
if (existsSync("./public/main.js")) {
  if (existsSync("./public/index.js")) {
    unlinkSync("./public/index.js");
  }
  renameSync("./public/main.js", "./public/index.js");
}

console.log("Frontend build complete");