#!/bin/sh
# Railway などでコンテナ起動時に API_URL を書き込み。再ビルドなしでバックエンドURLを変更可能。
API_URL="${API_URL:-${VITE_API_URL}}"
if [ -n "$API_URL" ]; then
  clean_url=$(echo "$API_URL" | sed 's#/$##')
  # JSON用にエスケープ（バックスラッシュと二重引用符）
  escaped=$(printf '%s' "$clean_url" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo "{\"apiUrl\":\"$escaped\"}" > /usr/share/nginx/html/config.json
else
  echo '{"apiUrl":""}' > /usr/share/nginx/html/config.json
fi
exec nginx -g "daemon off;"
