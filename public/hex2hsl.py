import re
import sys
import colorsys

def hex_to_hsl(rgb_hex, alpha_hex=None):
    # 1. 先将十六进制字符串转换为0-1范围的RGB值
    r = int(rgb_hex[0:2], 16) / 255.0
    g = int(rgb_hex[2:4], 16) / 255.0
    b = int(rgb_hex[4:6], 16) / 255.0

    # 2. 使用 colorsys 进行核心转换
    h, l, s = colorsys.rgb_to_hls(r, g, b)

    # 3. 对结果进行格式化，得到最终HSL字符串
    h_deg = round(h * 360)
    s_percent = round(s * 100)
    l_percent = round(l * 100)

    if alpha_hex:
        alpha = round(int(alpha_hex, 16) / 255.0, 2)
        alpha_str = f"{alpha:.2f}".rstrip('0').rstrip('.') if '.' in f"{alpha:.2f}" else f"{alpha:.2f}"
        return f"hsla({h_deg}, {s_percent}%, {l_percent}%, {alpha_str})"
    else:
        return f"hsl({h_deg}, {s_percent}%, {l_percent}%)"

def replace_hex(match):
    return hex_to_hsl(match.group(1), match.group(2))

def process_text(text):
    pattern = re.compile(r'#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?(?![0-9A-Fa-f])')
    return pattern.sub(replace_hex, text)

def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = sys.stdin.read()
    sys.stdout.write(process_text(content))

if __name__ == "__main__":
    main()
