---
title: 单 html 页面
---

`````markdown
用原生web开发一个页面：



- 样式：
  - 优先使用相对值
  - 表单控件默认小圆角，聚焦只调整边框或轮廓的颜色到主色，样式要整体保持相似，同一组合下的控件确保能够对齐
  - 文本风格按钮，主文本颜色，没有背景边框，交互反馈只调整文本颜色深浅
  - 描边风格按钮，主色文本，主色边框，交互反馈只调整背景颜色深浅
  - 贴边的组件确保当前容器全部向对应边对齐

- 页面整体简洁美观，不用过多的层次，不用过多的留白
- 禁止使用阴影、渐变
- 禁止在交互伪类中使用尺寸和位移变换
- 禁止使用图标、emoji和表情符号
- 所有代码写成一个单html文件，不使用外部库
- 使用以下模板，响应布局支持，主题系统支持
  - 禁止修改模板中定义的js和css
  - 颜色、字体、圆角等使用模板中的变量，禁止硬编码，禁止新增定义

```html
<!DOCTYPE html>
<html lang="zh-hans" data-theme="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#282828" id="theme-color-meta">
    <title>标题</title>
    <meta name="description" content="无描述">
    <script>
        (function () {
            const saved = localStorage.getItem('theme-preference');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            let resolvedTheme;
            let preference;

            if (saved === 'dark' || saved === 'light' || saved === 'auto') {
                preference = saved;
            } else {
                preference = 'auto';
            }

            if (preference === 'auto') {
                resolvedTheme = systemDark ? 'dark' : 'light';
            } else {
                resolvedTheme = preference;
            }

            document.documentElement.setAttribute('data-theme', resolvedTheme);
            document.documentElement.setAttribute('data-theme-preference', preference);

            const meta = document.getElementById('theme-color-meta');
            if (meta) {
                meta.setAttribute('content', resolvedTheme === 'dark' ? '#282828' : '#fbf1c7');
            }
        })();
    </script>
    <style>
        :root {
            --font-family:
                system-ui,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                "Helvetica Neue",
                "Noto Sans",
                "Liberation Sans",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
                "Source Han Sans VF",
                "Microsoft YaHei",
                "PingFang SC",
                "Hiragino Sans GB",
                "WenQuanYi Micro Hei",
                Arial,
                sans-serif;

            --font-family-monospace:
                "JetBrains Mono",
                "Liberation Mono",
                "SF Mono",
                Menlo,
                Monaco,
                Consolas,
                "Source Han Sans VF",
                "Microsoft YaHei",
                "PingFang SC",
                "Hiragino Sans GB",
                monospace;

            --transition-time: 0.2s;
            --transition-time-slow: 0.3s;
            --radius-sm: 2px;
            --radius-md: 4px;
            --breakpoint-sm: 576px;
            --breakpoint-md: 768px;
            --breakpoint-lg: 992px;
            --breakpoint-xl: 1200px;

            --color-primary: var(--green);
            --color-secondary: var(--yellow);
            --color-accent: var(--blue);
            --color-success: var(--green);
            --color-warning: var(--orange);
            --color-error: var(--red);
            --color-info: var(--blue);
            --text-primary: var(--fg1);
            --text-secondary: var(--fg-3);
            --text-muted: var(--fg-4);
            --text-inverse: var(--bg1);
            --bg-body: var(--bg);
            --bg-surface: var(--bg-s);
            --bg-overlay: #0000007F;
            --font-size-xs: 0.75rem;
            --font-size-sm: 0.875rem;
            --font-size-base: 1rem;
            --font-size-md: 1.125rem;
            --font-size-lg: 1.25rem;
            --font-size-xl: 1.5rem;
            font-size: 16px;
        }

        [data-theme="dark"] {
            color-scheme: dark;
            --bg_h: #1d2021;
            --bg: #282828;
            --bg_s: #32302f;
            --bg1: #3c3836;
            --bg2: #504945;
            --bg3: #665c54;
            --bg4: #7c6f64;
            --fg: #fbf1c7;
            --fg1: #ebdbb2;
            --fg2: #d5c4a1;
            --fg3: #bdae93;
            --fg4: #a89984;
            --red: #fb4934;
            --green: #b8bb26;
            --yellow: #fabd2f;
            --blue: #83a598;
            --purple: #d3869b;
            --aqua: #8ec07c;
            --gray: #928374;
            --orange: #fe8019;
            --red-dim: #cc2412;
            --green-dim: #98971a;
            --yellow-dim: #d79921;
            --blue-dim: #458588;
            --purple-dim: #b16286;
            --aqua-dim: #689d6a;
            --gray-dim: #a89984;
            --orange-dim: #d65d0e;
        }

        [data-theme="light"] {
            color-scheme: light;
            --bg_h: #f9f5d7;
            --bg: #fbf1c7;
            --bg_s: #f2e5bc;
            --bg1: #ebdbb2;
            --bg2: #d5c4a1;
            --bg3: #bdae93;
            --bg4: #a89984;
            --fg: #282828;
            --fg1: #3c3836;
            --fg2: #504945;
            --fg3: #665c54;
            --fg4: #7c6f64;
            --red: #9d0006;
            --green: #79740e;
            --yellow: #b57614;
            --blue: #076678;
            --purple: #8f3f71;
            --aqua: #427b58;
            --orange: #af3a03;
            --gray: #928374;
            --red-dim: #cc2412;
            --green-dim: #98971a;
            --yellow-dim: #d79921;
            --blue-dim: #458598;
            --purple-dim: #b16286;
            --aqua-dim: #689d6a;
            --orange-dim: #d65d0e;
            --gray-dim: #7c6f64;
        }

        a {
            color: var(--blue);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        a:hover {
            color: var(--blue-dim);
        }

        a:visited {
            color: var(--blue);
        }

        a:active {
            color: var(--blue);
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            scroll-behavior: smooth;
            -webkit-text-size-adjust: 100%;
        }



</head>
<body>

</body>
</html>

```
`````
