# Louis.dev — 前后端分离架构

```
website/
├── src/                 # 前台 Next.js（端口 3000）
├── admin/               # 管理后台 Next.js（端口 3001）
└── api/                 # 后端 API + 数据库（端口 4000）
```

## 端口一览

| 服务 | 端口 | 命令 |
|------|------|------|
| 前台 | 3000 | `npm run dev`（仓库根目录） |
| Admin CMS | 3001 | `cd admin && npm run dev` |
| API | 4000 | `cd api && npm run dev` |

## 本地开发

### 一键启动（推荐）

```bash
cd website
npm run setup    # 首次运行：安装依赖 + 初始化数据库
npm run dev:all  # 同时启动 API / Admin / 前台
```

| 服务 | 地址 |
|------|------|
| API | http://localhost:4000 |
| Admin | http://localhost:3001/login |
| 前台 | http://localhost:3000 |

按 `Ctrl+C` 停止全部服务。

### 分开启动

```bash
cd api
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

默认管理员：

- Email: `admin@louis.dev`
- Password: `admin123`

### 2. 启动前台

```bash
cd ..
cp .env.example .env.local
npm install
npm run dev
```

打开 http://localhost:3000

### 3. 启动管理后台

```bash
cd admin
cp .env.example .env.local
npm install
npm run dev
```

打开 http://localhost:3001/login

## 发布流程

1. 在 Admin 新建文章 → 保存为 **DRAFT**，或使用 **import_md_** 上传 Markdown
2. 编辑完成后点击 **publish_**
3. 前台通过 API 读取已发布文章（ISR 60 秒刷新）

草稿不会出现在前台。

### Markdown 导入

Admin → Articles → **import_md_**，选择 `.md` 文件后后台会自动解析字段并预览，确认后导入为草稿。

支持的 YAML frontmatter（可选）：

```markdown
---
title: 文章标题
slug: my-article
category: astrobiology
excerpt: 摘要（可选，不写则从正文提取）
readTime: 8 min
status: draft
---

## 第一节

正文 Markdown...
```

`category` 可选值：`astrobiology`、`exoplanets`、`extremophiles`、`ai-agent`、`llm`、`toolchain`、`engineering`、`reading`、`thoughts`。

无 frontmatter 时：从 `# 标题` 或文件名推断标题，自动生成 slug、摘要和阅读时间。

| Admin | `POST /admin/articles/parse-markdown` | 解析 Markdown，返回字段预览 |
| Admin | `POST /admin/articles/import-markdown` | 解析并创建文章（默认草稿） |

请求体：`{ "markdown": "...", "filename": "optional.md" }`

## API 概览

| 类型 | 路径 | 说明 |
|------|------|------|
| Public | `GET /api/articles` | 已发布文章列表 |
| Public | `GET /api/articles/:slug` | 文章详情 |
| Public | `GET /api/topics` | 专题 |
| Public | `GET /api/projects` | 项目 |
| Auth | `POST /auth/login` | 登录获取 JWT |
| Admin | `GET /admin/articles` | 全部文章（含草稿） |
| Admin | `POST /admin/articles/:id/publish` | 发布 |
| Admin | `POST /admin/articles/:id/unpublish` | 撤回为草稿 |

Admin 接口需在 Header 携带 `Authorization: Bearer <token>`。

## 数据库

开发默认 **SQLite**（`api/prisma/dev.db`）。

生产建议 PostgreSQL，在 `api/.env` 设置：

```
DATABASE_URL="postgresql://user:pass@host:5432/louis_dev"
```

然后执行：

```bash
cd api
npx prisma db push
npm run db:seed
```

## 部署建议

| 服务 | 平台 |
|------|------|
| 前台 `website/` | Vercel |
| 管理台 `admin/` | Vercel（可限制访问） |
| API `api/` | Railway / Render / Fly.io |
| PostgreSQL | Neon / Supabase / RDS |

环境变量：

- 前台：`NEXT_PUBLIC_API_URL=https://api.your-domain.com`
- Admin：同上
- API：`DATABASE_URL`、`JWT_SECRET`、`CORS_ORIGIN`（前台+Admin 域名）

## 后续扩展

数据库已预留 User 表，可继续加：

- Newsletter 订阅表 + `POST /api/newsletter`
- 评论、标签、媒体上传
- Topics / Projects 的管理接口
- 角色权限（编辑 / 管理员）
