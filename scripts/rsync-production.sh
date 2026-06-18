#!/usr/bin/env bash
# 同步代码到生产服务器（不会覆盖 api/.env、.env.local 等环境配置）
set -euo pipefail

HOST="${DEPLOY_HOST:-ubuntu@124.221.25.80}"
REMOTE_DIR="${DEPLOY_DIR:-/var/www/louis-dev}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

rsync -avz \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude 'api/prisma/*.db' \
  --exclude api/.env \
  --exclude .env.local \
  --exclude admin/.env.local \
  -e "ssh -o StrictHostKeyChecking=no" \
  "$ROOT/" "$HOST:$REMOTE_DIR/"

echo ""
echo "Synced to $HOST:$REMOTE_DIR"
echo "Next on server:"
echo "  cd $REMOTE_DIR/api && npm install && npx prisma db push && npm run build"
echo "  cd $REMOTE_DIR && npm run build && npm run build --prefix admin"
echo "  pm2 restart all --update-env"
echo ""
echo "Do NOT overwrite admin/.env.local unless switching API URL."
echo ""
echo "备案期间仅用 IP 进后台（云安全组只需放行 8080）："
echo "  admin/.env.local → NEXT_PUBLIC_API_URL=http://124.221.25.80:8080/_api"
echo "  npm run build --prefix admin && pm2 restart louis-admin louis-api --update-env"
echo "  后台: http://124.221.25.80:8080/login"
echo ""
echo "或本机 hosts 绑定域名（仍走 80 端口，无需改 admin 构建）："
echo "  124.221.25.80 louis-dev.cloud admin.louis-dev.cloud api.louis-dev.cloud"
