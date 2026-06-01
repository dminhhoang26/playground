#!/usr/bin/env bash
set -euo pipefail

# Cấu hình: sửa theo repo và đường dẫn file cần xóa
REPO_URL="https://github.com/USERNAME/REPO.git"
SECRET_PATH="path/to/secret.file"   # đường dẫn chính xác trong repo
MIRROR_DIR="repo-mirror.git"
USE_BFG_FALLBACK=true

# Bảo đảm user đã rotate secret
if [ "${SECRET_ROTATED:-}" != "yes" ]; then
  echo "ERROR: Bạn phải revoke/rotate secret trước khi chạy script. Set SECRET_ROTATED=yes và chạy lại."
  exit 1
fi

# 1. Tạo mirror clone
echo "==> Tạo mirror clone từ $REPO_URL"
rm -rf "$MIRROR_DIR"
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

# 2. Thử git-filter-repo (khuyến nghị)
if command -v git-filter-repo >/dev/null 2>&1; then
  echo "==> Dùng git-filter-repo để xóa $SECRET_PATH"
  git filter-repo --invert-paths --path "$SECRET_PATH"
else
  echo "==> git-filter-repo không có trên hệ thống."
  if [ "$USE_BFG_FALLBACK" = true ]; then
    if command -v bfg >/dev/null 2>&1; then
      echo "==> Dùng BFG để xóa $SECRET_PATH"
      # BFG expects a non-bare repo; mirror clone is bare, but BFG works on bare clones too.
      bfg --delete-files "$SECRET_PATH"
      # Sau BFG, cần dọn reflog/gc
      git reflog expire --expire=now --all
      git gc --prune=now --aggressive
    else
      echo "ERROR: Không tìm thấy git-filter-repo hoặc bfg. Cài đặt một trong hai rồi chạy lại."
      exit 2
    fi
  else
    echo "ERROR: Không có phương án thay thế. Cài đặt git-filter-repo."
    exit 2
  fi
fi

# 3. Dọn rác và tối ưu repo
echo "==> Dọn rác và tối ưu repository"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push tất cả branch và tag lên remote
echo "==> Force push tất cả branch và tags lên remote (cẩn thận)"
git push --force --all origin
git push --force --tags origin

echo "==> Hoàn tất. Lưu ý: mọi collaborator cần re-clone hoặc reset theo hướng dẫn."
