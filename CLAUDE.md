# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言约定

回答、文档和代码中的注释使用中文。

## 项目概览

这是一个基于 Astro + Starlight 的文档站点。`src/content/docs/` 下的 `.md` / `.mdx` 文件自动映射为路由。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（端口 3000，监听 0.0.0.0） |
| `pnpm build` | 构建生产站点到 `dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm astro check` | TypeScript 类型检查 |

## 架构要点

- **配置**: `astro.config.mjs` — 定义 Starlight 集成、侧边栏结构。侧边栏分为 "Guides"（手动指定页面）和 "Reference"（根据 `reference/` 目录自动生成）。
- **内容集合**: `src/content.config.ts` — 使用 Starlight 的 `docsLoader` 和 `docsSchema` 定义 `docs` 集合。
- **内容目录**: `src/content/docs/` — 每个文件成为一个路由，首页为 `index.mdx`，子路由按目录结构排列。
- **静态资源**: `src/assets/` 存放图片等资源，在 Markdown 中通过相对路径引用。`public/` 存放 favicon 等不需要处理的静态文件。
- **TypeScript**: 继承 `astro/tsconfigs/strict`，严格模式。
- **包管理器**: pnpm，依赖包括 `astro`、`@astrojs/starlight`、`sharp`。
