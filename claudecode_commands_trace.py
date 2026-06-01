import argparse
import json
import re
from pathlib import Path
from collections import defaultdict

def sanitize_filename(name):
    """Làm sạch tên project để tạo tên file hợp lệ trên Windows/Linux"""
    return re.sub(r'[\\/*?:"<>|]', "", name)

def export_claude_logs(log_dir, output_path, merge_single_file):
    # Xử lý đường dẫn thư mục log
    log_path = Path(log_dir).expanduser()
    if not log_path.exists():
        print(f"❌ Không tìm thấy thư mục log: {log_path}")
        return

    jsonl_files = list(log_path.rglob("*.jsonl"))
    if not jsonl_files:
        print(f"⚠️ Không tìm thấy file log .jsonl nào trong: {log_path}")
        return

    print(f"🔍 Tìm thấy {len(jsonl_files)} file logs. Đang phân tích dữ liệu...")

    # Cấu trúc lưu trữ: { 'tên_project': [ (câu_lệnh, kết_quả), ... ] }
    all_project_data = defaultdict(list)

    for file_path in jsonl_files:
        try:
            relative_path = file_path.relative_to(log_path)
            # Lấy tên thư mục cha đầu tiên ngay sau thư mục log gốc
            project_name = relative_path.parts[0] if relative_path.parts else "Default_Project"
        except ValueError:
            project_name = file_path.parent.name

        pending_commands = {}

        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    _parse_log_events(data, pending_commands, all_project_data[project_name])
                except json.JSONDecodeError:
                    continue

    out_path = Path(output_path).expanduser()

    if merge_single_file:
        _write_single_file(all_project_data, out_path, log_path)
    else:
        _write_split_files(all_project_data, out_path, log_path)


def _write_single_file(all_project_data, output_file, log_path):
    """Ghi tất cả vào một file Markdown duy nhất"""
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as md:
        md.write("# 📜 Nhật ký Lệnh và Kết quả từ Claude Code\n\n")
        md.write(f"- **Thư mục nguồn:** `{log_path}`\n")
        md.write(f"- **Tổng số Project:** {len(all_project_data)}\n\n")
        md.write("---\n\n")

        for project_name, items in all_project_data.items():
            if not items:
                continue
            _write_project_content(md, project_name, items)
            md.write("\n---\n\n")
            
    print(f"✅ Đã gộp toàn bộ lịch sử {len(all_project_data)} project vào 1 file: {output_file.resolve()}")


def _write_split_files(all_project_data, output_dir, log_path):
    """Ghi mỗi project ra một file Markdown riêng biệt"""
    output_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    
    for project_name, items in all_project_data.items():
        if not items:
            continue
        
        # Xử lý tên file an toàn
        safe_name = sanitize_filename(project_name)
        if not safe_name:
            safe_name = f"Project_{count+1}"
        
        file_path = output_dir / f"{safe_name}.md"
        
        with open(file_path, 'w', encoding='utf-8') as md:
            md.write(f"# 📜 Lịch sử Project: `{project_name}`\n\n")
            md.write(f"- **Thư mục nguồn:** `{log_path}`\n\n")
            md.write("---\n\n")
            _write_project_content(md, project_name, items)
        
        count += 1
        
    print(f"✅ Đã tách và xuất {count} file .md riêng biệt vào thư mục: {output_dir.resolve()}")


def _write_project_content(md_file, project_name, items):
    """Hàm tiện ích để render format Markdown cho danh sách lệnh"""
    md_file.write(f"## 📁 Thư mục / Project: `{project_name}`\n\n")
    for idx, (command, result) in enumerate(items, 1):
        md_file.write(f"### 🔹 Lệnh #{idx}\n")
        md_file.write("```bash\n")
        md_file.write(f"{command}\n")
        md_file.write("```\n\n")
        
        md_file.write("**Kết quả thực thi:**\n")
        if result:
            md_file.write("```text\n")
            md_file.write(f"{result}\n")
            md_file.write("```\n\n")
        else:
            md_file.write("*(Không có kết quả trả về hoặc lệnh chạy nền)*\n\n")
        md_file.write("  \n")


def _parse_log_events(data, pending_commands, project_item_list):
    """Hàm đệ quy quét cấu trúc JSON để kết nối lệnh (tool_use) và kết quả (tool_result)"""
    if isinstance(data, dict):
        if data.get("type") == "tool_use":
            tool_name = data.get("name", "").lower()
            if tool_name in ["bash", "run_command", "shell"]:
                tool_id = data.get("id")
                input_data = data.get("input", {})
                command = input_data.get("command") or input_data.get("cmd") or str(input_data)
                
                if tool_id and command:
                    pending_commands[tool_id] = command
        
        elif data.get("type") == "tool_result":
            tool_id = data.get("tool_use_id")
            if tool_id in pending_commands:
                command = pending_commands[tool_id]
                content = data.get("content", "")
                
                if isinstance(content, list):
                    text_parts = [c.get("text", "") for c in content if c.get("type") == "text"]
                    result_text = "\n".join(text_parts)
                else:
                    result_text = str(content)
                
                project_item_list.append((command.strip(), result_text.strip()))
                del pending_commands[tool_id]

        for value in data.values():
            _parse_log_events(value, pending_commands, project_item_list)

    elif isinstance(data, list):
        for item in data:
            _parse_log_events(item, pending_commands, project_item_list)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Lọc và xuất log của Claude Code ra file Markdown.")
    parser.add_argument(
        "-d", "--dir", 
        default="~/.claude/projects/", 
        help="Đường dẫn thư mục log gốc (mặc định: ~/.claude/projects/)"
    )
    parser.add_argument(
        "-o", "--output", 
        default="claude_logs_output", 
        help="Đường dẫn đầu ra: Tên thư mục (nếu xuất nhiều file) hoặc tên file (nếu gộp). Mặc định: claude_logs_output"
    )
    parser.add_argument(
        "-m", "--merge", 
        action="store_true", 
        help="Bật chế độ này để gộp toàn bộ log vào 1 file duy nhất."
    )
    args = parser.parse_args()
    
    # Xử lý tự động đổi tên file mặc định nếu người dùng chọn gộp file nhưng không đổi tên tham số -o
    final_output = args.output
    if args.merge and final_output == "claude_logs_output":
        final_output = "claude_projects_history.md"
        
    export_claude_logs(args.dir, final_output, args.merge)
  
