# CineWorld

**带自然语言搜索与流媒体可用性的电影发现平台。**

在线站点：[https://cineworld-site.vercel.app](https://cineworld-site.vercel.app)

作者：**Brenda Tavares**（ShipClaw）——作品集/联系方式：**tavaresbrenda@proton.me**

---

## 问题所在

找一部电影是零散的。你打开一个流媒体平台，先浏览已有的片单，然后才发现你真正想看的那部电影在你所在的国家并不提供。搜索引擎不会回答可用性。Letterboxd 式的数据库告诉你一部电影*是什么*，却不会告诉你*你现在可以在哪里合法观看它*。

反向的问题同样常见：你模糊地记得一部电影——"那个有潜水员的、背景设定在太空的、大概是 2010 年代"——却想不起片名。关键词搜索帮不上忙，因为你根本没有关键词。

CineWorld 用一个界面同时解决这两个问题:用日常语言描述你想要的东西，取回片名，并立刻看到它是免费播放、靠订阅、租借还是购买。

## 解决方案

一个单页电影目录，把回忆和发现合为同一个流程：

1. **浏览或筛选**——热门、最高评分、即将上映、国产或国际，按类型、年份或来源。
2. **按意图搜索**——输入一段描述而不是片名。AI 端点会把它解析为真实目录中的条目。
3. **查看可用性**——每个条目都会显示它在哪些平台播放，分为免费、订阅、租借和购买。

## 功能特性

- **自然语言 AI 搜索**——用你自己的话描述一部电影；Gemini 提取意图，并在 TMDB 目录中完成解析。
- **识别模式**——针对模糊的回忆。返回最匹配的条目，并附上本地化的"为什么匹配"说明。
- **流媒体可用性**——订阅、租借、购买和带广告免费的提供商，按国家解析，巴西为回退。
- **筛选与排序**——人气、评分、上映日期、即将上映、类型、年份，以及国产与进口。
- **8 种语言**——英语、葡萄牙语、西班牙语、简体中文、繁体中文（香港）、日语、俄语和韩语，全部在客户端完成，无需刷新。
- **无需账号**——没有需要注册的东西，也不会在你控制之外的服务器上存储任何数据。
- **响应式**——同一个布局适配桌面、平板和手机。

## 技术栈

| 层 | 选择 | 原因 |
|---|---|---|
| 前端 | HTML5、CSS3、原生 JavaScript | UI 是一个带筛选功能的目录视图。引入框架会带来构建步骤和一个运行时，却不会减少真正的复杂度。 |
| 后端 | 运行在 Vercel Serverless Functions 上的 Node.js | TMDB 和 Gemini 的密钥绝不能到达浏览器。Serverless 意味着没有需要维护的服务器，API 面只是五个小端点。 |
| HTTP 客户端 | `axios` | 在整个 API 层保持一致的超时与错误处理。 |
| 电影数据 | TMDB API | 标题、元数据、海报和流媒体提供商的参考目录。 |
| AI | Google Gemini API | 把自由格式的描述转换为结构化的搜索意图。 |
| 消毒 | DOMPurify (cdnjs) | 目录文本以 HTML 渲染。DOMPurify 会在注入的标记到达 DOM 之前把它清除。 |
| 图标 | Font Awesome (cdnjs) | 一致的图标集，无需打包图标字体。 |
| 托管 | Vercel | 静态前端加 serverless 函数，全球 CDN，按区域执行。 |

### 项目结构

```
front-end/
  index.html          所有语言共用的单页
  style.css           全部样式
  script.js           i18n 字典、目录渲染、筛选、AI 搜索
  js/lang-selector.js 语言下拉框，独立于 script.js
  <locale>/           每种语言版本的关于、隐私、条款页面
api/
  movies.js           目录列表、筛选、排序
  movie.js            单个条目详情
  genres.js           类型列表
  streaming.js        按国家的流媒体提供商
  ai-search.js        自然语言与识别搜索
  index.js            API 入口
lib/
  rate-limit.js       共享的按 IP 请求限速器
vercel.json           路由（rewrites）与安全响应头
```

## 快速开始

需要 Node.js 22 或更新版本。本地在 Node 22 上测试；Vercel 使用 Node 24（`engines.node`）构建。

```bash
npm install
cp .env.example .env   # 然后填入你的密钥
vercel dev
```

### 环境变量

| 变量 | 必需 | 用途 |
|---|---|---|
| `TMDB_API_KEY` | 是 | 目录数据。由 `movies`、`movie`、`genres` 和 `streaming` 使用。 |
| `GEMINI_API_KEY` | 否 | 自然语言搜索。没有它，网站其余部分仍正常工作。 |
| `GOOGLE_SEARCH_API_KEY` | 否 | AI 结果的可选补充网页搜索。未设置时处于非活动状态。 |
| `GOOGLE_SEARCH_CX` | 否 | 上方搜索引擎所用的搜索引擎 ID。 |

在这里获取 TMDB 密钥：[themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)；在这里获取 Gemini 密钥：[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)。

## 安全

- **密钥只保存在服务端。** 所有密钥均从环境变量读取。前端包中不含任何密钥。
- **速率限制。** 共享的按 IP 限速器限制每个端点的请求数（`lib/rate-limit.js`）。由于 Vercel 函数是无状态且分布式的，这是按实例的近似限制，而不是全局限制。

### 依赖审计

`axios` 是唯一的运行时依赖，`npm audit` 报告 **0 个漏洞**。

`package.json` 中没有 `@vercel/node`。Vercel 的 Node.js 运行时使用平台自带的构建器来构建 `/api` 函数，因此这里从不需要该包——它只会引入一条构建期依赖链（`ts-morph` → `fast-glob` → `micromatch` → `braces`），本项目曾有过的所有安全通告都来自这条链，包括 `node-tar` 的关键漏洞。`@vercel/speed-insights` 仍是 devDependency：从 `/_vercel/speed-insights/script.js` 提供的脚本来自 Vercel 的边缘网络，而不是 `node_modules`。

`engines.node` 固定为 `24.x`，因为 Vercel 已于 2026-10-01 停用 Node.js 20，任何固定 `20.x` 的构建现在都会立即失败，报 `BUILD_UTILS_NODE_VERSION_DISCONTINUED`。

- **输入验证。** 搜索查询会先检查长度，并在到达任何上游 API 之前被拒绝。
- **渲染消毒。** API 文本在插入 DOM 之前会用 DOMPurify 消毒。
- **内容安全策略。** `connect-src` 仅为 `'self'`，因此浏览器只能与该站点自身的 API 通信，不能访问其他任何地方。`script-src` 仅允许 self、cdnjs 和内联 JSON-LD 哈希。`img-src` 限于 self、TMDB 图片、Wikimedia 和 `data:`。`frame-src` 和 `object-src` 为 `none`，`base-uri` 为 `self`，`form-action` 为 `self`，`frame-ancestors` 为 `none`。
- **跨域请求**仅限生产环境源站。
- **传输**仅限 HTTPS，并强制执行 `upgrade-insecure-requests`。

## 隐私

CineWorld 没有账号、没有数据库、没有广告。不使用 Google AdSense 或 Google Analytics。写入你设备的唯一数据是你的语言选择，保存在 `localStorage` 的 `cineworld_language` 中。

接收数据的第三方：TMDB（搜索词）、Gemini（你的查询，仅在使用 AI 搜索时）、Google Fonts（IP 地址和来源页面）、Vercel（托管与请求日志）、Vercel Speed Insights（Core Web Vitals 指标和浏览器 user agent）、cdnjs（图标）以及 Wikimedia Commons（平台标志）。完整细节见隐私政策，提供全部 8 种语言版本。

## 技术细节

- **架构：** 在 Vercel 上以 `/api/*` 函数实现 serverless；静态前端位于 `/front-end/` 下。
- **CSP（面向生产）：** 严格，无内联事件处理器；客户端渲染时使用 DOMPurify；强制 HTTPS。
- **安全：** 按 IP 速率限制（`lib/rate-limit.js`），CORS 限于生产源，输入验证/消毒。
- **依赖：** 运行时仅有 `axios`，`@vercel/speed-insights` 为 devDependency；`npm audit = 0`（Node 24.x）。
- **质量保障：** 修改过的端点均通过 `node -c` 验证 JS 语法；仓库中无密钥；行尾（EOL）已规范化；进行过兼容 CSP 的重构，以避免 `unsafe-inline` 被阻断。
- **持续进行：** 持续评审加固项（headers、缓存、一致性）；测试和检查保持轻量，并按需运行。

## 致谢

目录数据与海报图像由 [TMDB](https://www.themoviedb.org/) 提供。本产品使用 TMDB API，但未经 TMDB 背书或认证。

---

## 作者

**Brenda Tavares**——全栈开发者

- 巴伊亚联邦大学（UFBA）人文学科学士
- 后端开发，Pitágoras Unopar Anhanguera 大学
- GitHub：<https://github.com/Brenda-Tavares>
- LinkedIn：<https://www.linkedin.com/in/brenda-campos-tavares/>
- 邮箱：tavaresbrenda@proton.me

---

English: [README.md](README.md) | Português:
[README-PT.md](README-PT.md)
