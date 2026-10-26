#!/usr/bin/env python3
"""Baut aus den Markdown-Quellen in docs/ eine abhängigkeitsfreie statische Website in _site/."""
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '_site'
REVIEWED = '2026-10-26'
REPOSITORY = 'https://github.com/JRS1986/KISchule'
AUDIENCES = {'lehrkraefte': 'Lehrkräfte', 'schueler': 'Schülerinnen und Schüler', 'eltern': 'Eltern'}
# Kurzformen in der Spalte "Für" des Katalogs.
TARGETS = {'Lehrkräfte': 'L', 'Kl. 5–7': 'S1', 'Kl. 8–10': 'S2', 'Kl. 11–13': 'S3', 'Eltern': 'E'}
ACCESS = ('Frei', 'Kostenlos mit Konto', 'Teilweise kostenpflichtig', 'Hardware nötig')


def slug(text):
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    return re.sub(r'[^\w\- ]', '', text.lower()).replace(' ', '-')


def meta(block):
    """Liest einen Kommentar der Form <!-- schlüssel: wert; schlüssel: wert -->."""
    found = re.search(r'<!--(.*?)-->', block, re.S)
    if not found:
        return {}
    pairs = [part.split(':', 1) for part in found[1].split(';') if ':' in part]
    return {key.strip(): value.strip() for key, value in pairs}


def sections(path):
    source = path.read_text()
    for part in re.split(r'^## ', source, flags=re.M)[1:]:
        heading, _, body = part.partition('\n')
        yield heading.strip(), body


def hours(value):
    return float(value.replace(',', '.'))


def table_bounds(lines):
    start = next((i for i, line in enumerate(lines) if line.startswith('|')), None)
    if start is None:
        return None, None
    end = start
    while end < len(lines) and lines[end].startswith('|'):
        end += 1
    return start, end


def refs(body, kind):
    pattern = {'k': r'KATALOG\.md#(k\d+)', 'w': r'WERKSTATT\.md#(w\d+)'}[kind]
    return [r.upper() for r in dict.fromkeys(re.findall(pattern, body))]


def strip_meta(body):
    return re.sub(r'<!--.*?-->\n?', '', body, flags=re.S).strip()


def extract_catalog():
    resources, category = [], ''
    for line in (ROOT / 'docs/KATALOG.md').read_text().splitlines():
        if line.startswith('## '):
            category = line[3:].strip()
        match = re.search(r'<a id="(k\d+)"', line)
        if not match:
            continue
        cells = [cell.strip() for cell in line.strip().strip('|').split('|')]
        if len(cells) != 4:
            raise ValueError('Katalogzeile braucht vier Spalten: ' + line)
        link = re.search(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', cells[0])
        if link is None:
            raise ValueError('Katalogzeile ohne Link: ' + line)
        targets = [TARGETS[t.strip()] for t in cells[1].split(',') if t.strip()]
        if not targets:
            raise ValueError('Katalogzeile ohne Zielgruppe: ' + line)
        access = next((a for a in ACCESS if cells[3].startswith('**' + a)), None)
        if access is None:
            raise ValueError('Zugang muss mit einer Kategorie beginnen: ' + line)
        fmt, _, scope = cells[2].partition(',')
        resources.append({
            'id': match[1].upper(), 'title': link[1], 'url': link[2],
            'provider': cells[0].split(' — ', 1)[1].strip() if ' — ' in cells[0] else '',
            'category': category, 'targets': targets, 'format': fmt.strip(), 'scope': scope.strip(),
            'access': access, 'notes': cells[3],
        })
    return resources


def extract_paths():
    paths = []
    for heading, body in sections(ROOT / 'docs/LERNPFADE.md'):
        found = re.match(r'([A-Z]{1,2}\d?) (.+)', heading)
        info = meta(body)
        if not found or 'zielgruppe' not in info:
            continue
        lines = strip_meta(body).splitlines()
        start, end = table_bounds(lines)
        steps = []
        for line in lines[start:end]:
            cells = [cell.strip() for cell in line.strip('|').split('|')]
            if len(cells) == 3 and cells[0].isdigit():
                steps.append({'order': int(cells[0]), 'text': cells[1], 'hours': hours(cells[2])})
        total = re.search(r'\*\*Umfang:\*\* ([\d,]+) h', body)
        if total is None or abs(sum(s['hours'] for s in steps) - hours(total[1])) > 0.01:
            raise ValueError('Stunden passen nicht zum Umfang in ' + heading)
        if info['zielgruppe'] not in AUDIENCES:
            raise ValueError('Unbekannte Zielgruppe in ' + heading)
        paths.append({
            'id': found[1], 'title': found[2], 'anchor': slug(heading), 'audience': info['zielgruppe'],
            'area': info.get('bereich', ''), 'short': info.get('kurz', ''), 'icon': info.get('symbol', ''),
            'hours': hours(total[1]), 'intro': '\n'.join(lines[:start]).strip(), 'steps': steps,
            'outcome': '\n'.join(lines[end:]).strip(), 'resources': refs(body, 'k'), 'projects': refs(body, 'w'),
        })
    return paths


def extract_projects():
    projects = []
    for heading, body in sections(ROOT / 'docs/WERKSTATT.md'):
        found = re.match(r'(W\d+) (.+)', heading)
        if not found:
            continue
        info = meta(body)
        projects.append({
            'id': found[1], 'title': found[2], 'anchor': slug(heading),
            'grades': info.get('stufe', ''), 'place': info.get('ort', ''), 'hardware': info.get('hardware', ''),
            'cost': info.get('kosten', ''), 'duration': info.get('dauer', ''), 'short': info.get('kurz', ''),
            'body': strip_meta(body), 'resources': refs(body, 'k'),
        })
    return projects


def extract_data():
    resources, paths, projects = extract_catalog(), extract_paths(), extract_projects()
    ids = {r['id'] for r in resources}
    if len(ids) != len(resources):
        raise ValueError('Doppelte Katalog-IDs')
    project_ids = {p['id'] for p in projects}
    for item in [*paths, *projects]:
        missing = set(item['resources']) - ids
        if missing:
            raise ValueError(f"Unbekannte Ressource in {item['id']}: {sorted(missing)}")
    for path in paths:
        if set(path['projects']) - project_ids:
            raise ValueError('Unbekanntes Projekt in ' + path['id'])
    guides = {}
    for path in sorted((ROOT / 'docs').glob('*.md')):
        if path.stem in {'KATALOG', 'LERNPFADE', 'WERKSTATT'}:
            continue
        text = path.read_text()
        guides[path.stem.lower()] = {'title': text.splitlines()[0].removeprefix('# '), 'source': 'docs/' + path.name, 'body': text}
    return {'schemaVersion': 1, 'reviewed': REVIEWED, 'repository': REPOSITORY, 'audiences': AUDIENCES,
            'paths': paths, 'resources': resources, 'projects': projects, 'guides': guides}


def main():
    data = extract_data()
    # Nur das eigene Build-Verzeichnis wird gelöscht, nie Quellen.
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n'
    # Alle Module, Styles und Inhalte bekommen dieselbe Version, damit Browser-Caches nichts mischen.
    sources = {p.name: p.read_text() for p in sorted((ROOT / 'web').iterdir()) if p.is_file()}
    version = hashlib.sha256((json.dumps(sources, sort_keys=True) + payload).encode()).hexdigest()[:12]
    names = {n: f'{Path(n).stem}.{version}{Path(n).suffix}' for n in [*sources, 'data.json'] if n != 'index.html'}

    def versioned(text):
        for old, new in names.items():
            text = text.replace('./' + old, './' + new)
        return text

    for name, source in sources.items():
        (OUTPUT / ('index.html' if name == 'index.html' else names[name])).write_text(versioned(source))
    (OUTPUT / names['data.json']).write_text(payload)
    (OUTPUT / 'data.json').write_text(payload)
    (OUTPUT / '.nojekyll').touch()
    print(f"Gebaut: {len(data['paths'])} Lernpfade, {len(data['resources'])} Ressourcen, "
          f"{len(data['projects'])} Werkstatt-Projekte, {len(data['guides'])} Leitfäden.")


if __name__ == '__main__':
    main()
