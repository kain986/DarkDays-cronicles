#!/usr/bin/env node
// Builds Dark Days Chronicles from the modular sources in src/.
//   node tools/build.mjs                 → all outputs
//   node tools/build.mjs --inline-fonts  → also embeds the Google Fonts in the Android build (needs internet)
// Outputs:
//   dist/dark-days-chronicles.html          single-file page without <html>/<head> (Claude artifact format)
//   docs/index.html                         full web page (GitHub Pages)
//   app/src/main/assets/index.html          Android app page (IS_APP = true, back-button hook)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const args = new Set(process.argv.slice(2));

const gradle = readFileSync(join(ROOT, "app/build.gradle.kts"), "utf8");
const version = (gradle.match(/versionName\s*=\s*"([^"]+)"/) || [])[1] || "dev";

// Source order: the numbered files in src/, with every chapter folder (src/chapters/*/) inserted
// right after 15_chapters.js, so chapters can use the registry and the core data.
const files = readdirSync(SRC).filter(f => !f.startsWith(".")).sort();
const shell = readFileSync(join(SRC, files.find(f => f.endsWith(".html"))), "utf8");
const chapterFiles = () => readdirSync(join(SRC, "chapters")).sort().flatMap(d => readdirSync(join(SRC, "chapters", d)).filter(f => f.endsWith(".js")).sort().map(f => join("chapters", d, f)));
const order = files.filter(f => f.endsWith(".js")).flatMap(f => f === "15_chapters.js" ? [f, ...chapterFiles()] : [f]);
export const SOURCE_ORDER = order;
let js = order.map(f => `/* ===== ${f} ===== */\n` + readFileSync(join(SRC, f), "utf8")).join("\n");
js = js.replace('var GAME_VERSION = "dev";', `var GAME_VERSION = "${version}";`);
if (!js.includes(`var GAME_VERSION = "${version}"`)) throw new Error("GAME_VERSION marker not found in src/10_data.js");

// Syntax check without running the game.
try { new Function(js); } catch (e) { console.error("JavaScript syntax error:", e.message); process.exit(1); }

const page = `${shell}\n<script>\n${js}\n</script>\n`;
const HEAD = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="description" content="Dark Days Chronicles — turn-based tactical RPG inspired by D&D 5th edition, in Italian, English and Spanish.">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);color-scheme:dark}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
`;
const BACK = `<script>window.ddcBack=function(){var m=document.querySelectorAll(".modal");if(m.length&&!m[m.length-1].querySelector("#dgo,#vOk,#lRetry,#lvOk,[data-asi]")){m.forEach(function(x){x.remove()});if(typeof SCREEN!=="undefined"&&SCREEN==="story"&&typeof renderStory==="function")renderStory();return true}return false};</script>`;

async function inlineFonts(html) {
  const m = html.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/[^"]+)">/);
  if (!m) return html;
  const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
  let css = await (await fetch(m[1].replace(/&amp;/g, "&"), { headers: { "User-Agent": UA } })).text();
  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(x => x[1]))];
  for (const u of urls) {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    css = css.split(u).join(`data:font/woff2;base64,${buf.toString("base64")}`);
  }
  console.log(`  fonts embedded: ${urls.length} files`);
  return html.replace(m[0], `<style>${css}</style>`);
}

const out = (p, s) => { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), s); console.log(`  ${p}  ${(s.length / 1024).toFixed(0)} KB`); };
console.log(`Dark Days Chronicles v${version}`);
out("dist/dark-days-chronicles.html", page);
out("docs/index.html", HEAD + page + "</body>\n</html>\n");
let app = HEAD + page.replace("var IS_APP = false;", "var IS_APP = true;") + BACK + "\n</body>\n</html>\n";
if (args.has("--inline-fonts")) { try { app = await inlineFonts(app); } catch (e) { console.warn("  fonts not embedded (offline?):", e.message); } }
out("app/src/main/assets/index.html", app);
