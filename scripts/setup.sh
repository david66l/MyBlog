#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "安装依赖..."
npm install
npm install --prefix api
npm install --prefix admin

[[ -f api/.env ]] || cp api/.env.example api/.env
[[ -f .env.local ]] || cp .env.example .env.local
[[ -f admin/.env.local ]] || cp admin/.env.example admin/.env.local

echo "初始化数据库..."
npm run db:setup --prefix api

echo ""
echo "完成。运行 npm run dev:all 一键启动。"
