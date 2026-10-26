#!/usr/bin/env python3
"""Prüft lokale Markdown-Links und Anker. Externe Links werden hier nicht abgerufen (siehe docs/METHODE.md)."""
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def text(path):
    return re.sub(r"^```[^\n]*\n.*?^```\s*$", "", path.read_text(), flags=re.M | re.S)


def anchors(path):
    body = text(path)
    result = set(re.findall(r'<a\s+(?:id|name)="([^"]+)"', body))
    seen = {}
    for heading in re.findall(r"^#{1,6}\s+(.+?)\s*#*\s*$", body, re.M):
        heading = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", heading)
        slug = re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")
        count = seen.get(slug, 0)
        seen[slug] = count + 1
        result.add(slug + (f"-{count}" if count else ""))
    return result


def main():
    errors, checked = [], 0
    files = sorted(p for p in ROOT.rglob("*.md") if not {".git", "_site", "node_modules"} & set(p.parts))
    for path in files:
        for raw in re.findall(r"\[[^\]]*\]\(([^\s)]+)(?:\s+\"[^\"]*\")?\)", text(path)):
            url = urlsplit(raw.strip("<>"))
            if url.scheme or url.netloc:
                if url.scheme not in {"http", "https", "mailto"}:
                    errors.append(f"{path.relative_to(ROOT)}: unerlaubtes Schema {raw}")
                continue
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            checked += 1
            if not target.exists():
                errors.append(f"{path.relative_to(ROOT)}: Datei fehlt {raw}")
            elif url.fragment and target.suffix == ".md" and unquote(url.fragment) not in anchors(target):
                errors.append(f"{path.relative_to(ROOT)}: Anker fehlt {raw}")
    ids = re.findall(r'<a id="(k\d+)"', (ROOT / "docs/KATALOG.md").read_text())
    if len(ids) != len(set(ids)):
        errors.append("Doppelte Katalog-IDs")
    if errors:
        print("\n".join(errors))
        return 1
    print(f"{len(files)} Markdown-Dateien, {checked} lokale Verweise, {len(ids)} Katalogeinträge geprüft.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
