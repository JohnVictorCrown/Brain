import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

// Use Tailwind CSS via CDN for now (browser-native @import)
const css = readFileSync("./src/index.css", "utf8");

if (!existsSync("./public")) {
  mkdirSync("./public", { recursive: true });
}

// Copy the CSS as-is - browsers will process @import "tailwindcss" if supported
// For broader compatibility, we use the CDN approach
writeFileSync("./public/index.css", css);
console.log("CSS copied to public/index.css");

// Load and inline Tailwind CSS from CDN for offline support
async function fetchTailwind() {
  try {
    const response = await fetch("https://cdn.tailwindcss.com/");
    const tailwindCSS = await response.text();
    const existingCSS = readFileSync("./public/index.css", "utf8");
    writeFileSync("./public/index.css", tailwindCSS + "\n" + existingCSS);
    console.log("Tailwind CSS inlined from CDN");
  } catch (err) {
    console.log("Using Tailwind @import (requires Tailwind CDN or browser support)");
  }
}

fetchTailwind().catch(() => {});