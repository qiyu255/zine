#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.resolve("public");
const OUTPUT_FILE = path.resolve("public", "toc.html");

const HTML_EXT = ".html";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push({
        type: "dir",
        name: entry.name,
        children: await walk(fullPath),
      });
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(HTML_EXT)
    ) {
      // 跳过输出文件自身
      if (path.resolve(fullPath) === OUTPUT_FILE) {
        continue;
      }

      const relativePath = path.relative(PUBLIC_DIR, fullPath);

      const title = await extractTitle(fullPath);

      result.push({
        type: "file",
        name: entry.name,
        path: safeHref(relativePath),
        title: title || entry.name.replace(/\.html$/i, ""),
      });
    }
  }

  return result;
}

async function extractTitle(file) {
  try {
    const content = await fs.readFile(file, "utf8");

    const match = content.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i
    );

    if (!match) return null;

    return escapeHtml(
      match[1]
        .replace(/\s+/g, " ")
        .trim()
    );
  } catch {
    return null;
  }
}

function safeHref(relativePath) {
  const normalized = relativePath
    .replace(/\\/g, "/")
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");

  return normalized;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderTree(nodes, depth = 0) {
  if (!nodes.length) return "";

  return `
<ul class="tree depth-${depth}">
  ${nodes.map(renderNode).join("\n")}
</ul>
`;
}

function renderNode(node) {
  if (node.type === "dir") {
    return `
<li class="dir">
  <details open>
    <summary>${escapeHtml(node.name)}</summary>
    ${renderTree(node.children)}
  </details>
</li>
`;
  }

  return `
<li class="file">
  <a href="${node.path}">
    <span class="title">${node.title}</span>
    <span class="path">${escapeHtml(node.name)}</span>
  </a>
</li>
`;
}

function buildHtml(treeHtml, count = 0) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>HTML 目录</title>

<style>
:root {
  --bg_h: #1d2021;
  --bg:   #282828;
  --bg_s: #32302f;
  --bg1:  #3c3836;
  --bg2:  #504945;
  --bg3:  #665c54;
  --bg4:  #7c6f64;
  --fg:  #fbf1c7;
  --fg1: #ebdbb2;
  --fg2: #d5c4a1;
  --fg3: #bdae93;
  --fg4: #a89984;
  --red:    #fb4934;
  --green:  #b8bb26;
  --yellow: #fabd2f;
  --blue:   #83a598;
  --purple: #d3869b;
  --aqua:   #8ec07c;
  --gray:   #928374;
  --orange: #fe8019;
  --red-dim:    #cc2412;
  --green-dim:  #98971a;
  --yellow-dim: #d79921;
  --blue-dim:   #458588;
  --purple-dim: #b16286;
  --aqua-dim:   #689d6a;
  --gray-dim:   #a89984;
  --orange-dim: #d65d0e;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--bg_h);
  color: var(--fg1);
  font-family:
    Inter,
    "Noto Sans SC",
    system-ui,
    sans-serif;
}

body {
  min-height: 100vh;
  padding: 24px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.title {
  margin: 0;
  font-size: clamp(28px, 4vw, 42px);
  color: var(--yellow);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.subtitle {
  margin-top: 10px;
  color: var(--fg4);
  line-height: 1.6;
}

.panel {
  background: linear-gradient(
    180deg,
    var(--bg_s),
    var(--bg)
  );
  border: 1px solid var(--bg2);
  border-radius: 18px;
  padding: 18px;
  box-shadow:
    0 10px 30px rgba(0,0,0,.25),
    inset 0 1px 0 rgba(255,255,255,.03);
}

.tree {
  list-style: none;
  margin: 0;
  padding-left: 18px;
}

.tree > li + li {
  margin-top: 8px;
}

.dir > details {
  border-left: 1px dashed var(--bg3);
  padding-left: 12px;
}

.dir summary {
  cursor: pointer;
  list-style: none;
  color: var(--aqua);
  font-weight: 700;
  padding: 6px 0;
  user-select: none;
}

.dir summary::-webkit-details-marker {
  display: none;
}

.dir summary::before {
  content: "▾";
  display: inline-block;
  width: 1em;
  color: var(--green);
}

.dir details:not([open]) summary::before {
  content: "▸";
}

.file a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-decoration: none;
  color: var(--fg1);
  background: var(--bg_s);
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  transition:
    background .18s ease,
    border-color .18s ease,
    transform .18s ease;
}

.file a:hover {
  background: var(--bg1);
  border-color: var(--blue-dim);
  transform: translateY(-1px);
}

.file .title {
  font-size: 15px;
  font-weight: 700;
  color: var(--fg);
  overflow-wrap: anywhere;
}

.file .path {
  font-size: 12px;
  color: var(--fg4);
  white-space: nowrap;
}

.footer {
  margin-top: 18px;
  text-align: center;
  color: var(--gray);
  font-size: 13px;
}

@media (max-width: 640px) {
  body {
    padding: 14px;
  }

  .panel {
    padding: 14px;
    border-radius: 14px;
  }

  .file a {
    flex-direction: column;
    align-items: flex-start;
  }

  .file .path {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .tree {
    padding-left: 12px;
  }
}
</style>
</head>

<body>
  <div class="container">
    <header class="header">
      <h1 class="title">HTML 目录</h1>
      <div class="subtitle">
        ${count} 个页面
      </div>
    </header>

    <main class="panel">
      ${treeHtml}
    </main>

    <footer class="footer">
      Generated at ${new Date().toLocaleString()}
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  try {
    await fs.access(PUBLIC_DIR);
  } catch {
    console.error("public 目录不存在");
    process.exit(1);
  }

  const tree = await walk(PUBLIC_DIR);

  const html = buildHtml(renderTree(tree), tree.length);

  await fs.writeFile(OUTPUT_FILE, html, "utf8");

  console.log(
    `目录生成完成: ${path.relative(process.cwd(), OUTPUT_FILE)}`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});