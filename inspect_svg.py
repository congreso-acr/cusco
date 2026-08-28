import xml.etree.ElementTree as ET
import re

svg_path = r"C:\Users\MSI GF63\.gemini\antigravity\scratch\congreso-conservacion\mapa_acr_cusco.svg"

with open(svg_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx, line in enumerate(lines):
    if '<g id=' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
    elif '<text' in line:
        print(f"Text Line {idx+1}: {line.strip()[:100]}")
