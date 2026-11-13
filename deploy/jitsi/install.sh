#!/usr/bin/env bash
# Installs a self-hosted Jitsi Meet (docker-jitsi-meet) with JWT auth on a fresh Ubuntu 22.04/24.04 VPS.
# Usage (as root):  DOMAIN=meet.ruralconnect-app.eu EMAIL=you@example.org bash install.sh
# Prints the JITSI_APP_SECRET at the end — put it in Hostinger env vars (never commit it).
set -euo pipefail

: "${DOMAIN:?set DOMAIN, e.g. meet.ruralconnect-app.eu}"
: "${EMAIL:?set EMAIL for LetsEncrypt}"
APP_ID="ruralconnect"

# 1. Docker + firewall
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
apt-get install -y ufw unzip curl openssl >/dev/null
ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; ufw allow 10000/udp
ufw --force enable

# 2. Latest stable docker-jitsi-meet release
mkdir -p /opt/jitsi && cd /opt/jitsi
URL=$(curl -s https://api.github.com/repos/jitsi/docker-jitsi-meet/releases/latest | grep zipball_url | cut -d '"' -f 4)
curl -fsSL "$URL" -o jitsi.zip
unzip -qo jitsi.zip && rm jitsi.zip
cd "$(ls -d jitsi-docker-jitsi-meet-* | head -1)"

# 3. Config
[ -f .env ] || cp env.example .env
SECRET=$(openssl rand -hex 32)
./gen-passwords.sh
set_env() { grep -q "^$1=" .env && sed -i "s|^$1=.*|$1=$2|" .env || echo "$1=$2" >> .env; }
set_env PUBLIC_URL "https://$DOMAIN"
set_env ENABLE_AUTH 1
set_env AUTH_TYPE jwt
set_env ENABLE_GUESTS 0
set_env JWT_APP_ID "$APP_ID"
set_env JWT_APP_SECRET "$SECRET"
set_env ENABLE_LETSENCRYPT 1
set_env LETSENCRYPT_DOMAIN "$DOMAIN"
set_env LETSENCRYPT_EMAIL "$EMAIL"
set_env HTTP_PORT 80
set_env HTTPS_PORT 443
set_env ENABLE_PREJOIN_PAGE 0
set_env CONFIG "$(pwd)/config"
mkdir -p config/{web,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb} config/storage/{web,prosody}
# Recent docker-jitsi-meet images run as uid 1000 and refuse to start if the volumes are root-owned.
chown -R 1000:1000 config

# 4. Start
docker compose up -d

cat <<MSG

Jitsi is starting at https://$DOMAIN  (first certificate can take ~1 minute).
Set these in Hostinger → Deployments → Settings (then redeploy):
  JITSI_DOMAIN=$DOMAIN
  JITSI_APP_ID=$APP_ID
  JITSI_APP_SECRET=$SECRET
MSG
