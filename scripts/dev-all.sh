#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d api/node_modules ]]; then
  echo "缺少依赖，请先运行: npm run setup"
  exit 1
fi

[[ -f api/.env ]] || cp api/.env.example api/.env
[[ -f .env.local ]] || cp .env.example .env.local
[[ -f admin/.env.local ]] || cp admin/.env.example admin/.env.local

if [[ ! -f api/dev.db ]]; then
  echo "初始化数据库..."
  npm run db:setup --prefix api
fi

echo ""
echo "启动 Louis.dev 开发环境"
echo "  API:   http://localhost:4000"
echo "  Admin: http://localhost:3001/login  (admin@louis.dev / admin123)"
echo "  Web:   http://localhost:3000"
echo "  Ctrl+C 停止全部服务"
echo ""

cleanup() {
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

npm run dev --prefix api &
npm run dev --prefix admin &
npm run dev &

wait
