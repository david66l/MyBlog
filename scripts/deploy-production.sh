#!/usr/bin/env bash
# 在腾讯云服务器上运行（ubuntu 用户）：
#   curl -fsSL https://raw.githubusercontent.com/david66l/MyBlog/main/scripts/deploy-production.sh | bash
# 或 clone 后：
#   cd /var/www/louis-dev && bash scripts/deploy-production.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/louis-dev}"
REPO_URL="${REPO_URL:-https://github.com/david66l/MyBlog.git}"
DOMAIN="${DOMAIN:-louis-dev.cloud}"
USE_HTTPS="${USE_HTTPS:-0}"
if [[ "$USE_HTTPS" == "1" ]]; then
  API_URL="https://api.${DOMAIN}"
  WEB_ORIGIN="https://${DOMAIN}"
  ADMIN_ORIGIN="https://admin.${DOMAIN}"
else
  API_URL="http://api.${DOMAIN}"
  WEB_ORIGIN="http://${DOMAIN}"
  ADMIN_ORIGIN="http://admin.${DOMAIN}"
fi

echo "==> 检查 sudo..."
sudo -v

echo "==> 安装系统依赖..."
if ! command -v node >/dev/null || [[ "$(node -p "process.version")" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
fi
sudo apt-get update -qq
sudo apt-get install -y -qq git nginx
if ! command -v pm2 >/dev/null; then
  sudo npm i -g pm2
fi

echo "==> 配置 swap（若无）..."
if ! swapon --show | grep -q swapfile; then
  if [[ ! -f /swapfile ]]; then
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
  fi
  sudo swapon /swapfile || true
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> 拉取代码..."
sudo mkdir -p /var/www
sudo chown -R "$USER:$USER" /var/www
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"
git pull --ff-only

echo "==> 写入环境变量..."
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 32)}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-$(openssl rand -base64 16)}"

mkdir -p api
cat > api/.env << EOF
DATABASE_URL="file:./prod.db"
JWT_SECRET="${JWT_SECRET}"
ADMIN_EMAIL="admin@${DOMAIN}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
PORT=4000
CORS_ORIGIN="${WEB_ORIGIN},http://www.${DOMAIN},${ADMIN_ORIGIN},http://124.221.25.80,http://124.221.25.80:8080"
EOF

cat > .env.local << EOF
NEXT_PUBLIC_API_URL=${API_URL}
EOF

cat > admin/.env.local << EOF
NEXT_PUBLIC_API_URL=${API_URL}
EOF

echo "==> 安装依赖..."
npm install
npm install --prefix api
npm install --prefix admin

echo "==> 初始化数据库..."
if [[ ! -f api/prisma/prod.db ]]; then
  npm run db:setup --prefix api
else
  npm run db:generate --prefix api
fi

echo "==> 构建（较久，请耐心等待）..."
npm run build
npm run build --prefix admin
npm run build --prefix api

echo "==> PM2 启动..."
pm2 delete louis-api louis-web louis-admin 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null | tail -1 | sudo bash || true

echo "==> Nginx..."
sudo cp "deploy/nginx-${DOMAIN}.conf" "/etc/nginx/sites-available/${DOMAIN}"
sudo ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
sudo rm -f /etc/nginx/sites-enabled/louis.dev /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=============================================="
echo "  部署完成（HTTP，证书需单独申请）"
echo "=============================================="
echo "  前台:  http://${DOMAIN}"
echo "  Admin: http://admin.${DOMAIN}/login"
echo "  API:   http://api.${DOMAIN}/api/articles"
echo ""
echo "  Admin 账号: admin@${DOMAIN}"
echo "  Admin 密码: ${ADMIN_PASSWORD}"
echo "  JWT_SECRET 已写入 api/.env"
echo ""
if [[ "$USE_HTTPS" == "1" ]]; then
  echo "  HTTPS 已启用（USE_HTTPS=1）"
else
  echo "  当前为纯 HTTP 部署（未配置 SSL）"
fi
echo "=============================================="
