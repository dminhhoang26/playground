#!/bin/bash

DRY_RUN=false

# Kiểm tra nếu có tham số --dry-run
if [ "$1" == "--dry-run" ]; then
    DRY_RUN=true
    echo "🔍 DRY RUN: Listing all server/**/bin and server/**/obj folders that would be removed..."
else
    echo "🧹 Cleaning all server/**/bin and server/**/obj folders..."
fi

# Hàm xử lý thư mục theo chế độ
clean_folder() {
    local path="$1"
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would remove: $path"
    else
        echo "Removing: $path"
        rm -rf "$path"
    fi
}

# Tìm và xử lý các thư mục bin
find ./server -type d -name "bin" | while read -r dir; do
    clean_folder "$dir"
done

# Tìm và xử lý các thư mục obj
find ./server -type d -name "obj" | while read -r dir; do
    clean_folder "$dir"
done

echo "✅ Done. All **/bin and **/obj folders have been removed."
