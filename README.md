# KI-Schule

**Lernpfade zu künstlicher Intelligenz für die ganze Schulgemeinschaft eines Gymnasiums in Baden-Württemberg: für Lehrkräfte aller Fächer, für Schülerinnen und Schüler von Klasse 5 bis 13 und für Eltern.**

Website: **[jrs1986.github.io/KISchule](https://jrs1986.github.io/KISchule/)**. Sie läuft im Browser ohne Konto; abgehakte Schritte bleiben nur in diesem Browser.

Zielschule ist das Dietrich-Bonhoeffer-Gymnasium Filderstadt; das Programm passt aber an jedes Gymnasium im Land. KI-Schule ist ein unabhängiges, privates Angebot und **kein offizielles Angebot der Schule**, des Kultusministeriums oder eines Anbieters. Stand der Prüfung: **26. Oktober 2026**.

## Für wen was da ist

| Wer | Pfade | Worum es geht |
|---|---|---|
| **Lehrkräfte, Grundlagen für alle** | [L1 KI verstehen](docs/LERNPFADE.md#l1-ki-verstehen) · [L2 Rechtssicher in BW](docs/LERNPFADE.md#l2-rechtssicher-nutzen-in-baden-württemberg) · [L3 Unterricht vorbereiten](docs/LERNPFADE.md#l3-unterricht-vorbereiten-mit-f13-und-aischat) · [L4 Prüfungen neu denken](docs/LERNPFADE.md#l4-aufgaben-und-prüfungen-neu-denken) | Was alles KI ist und wie Maschinen lernen, Datenschutz und Prüfungsrecht, F13 und AIS.chat, GFS und Aufgabenkultur |
| **Schulleitung und KI-Gruppe** | [L5 Schulentwicklung](docs/LERNPFADE.md#l5-schulentwicklung-ki-leitlinie-und-pädagogischer-tag) | KI-Leitlinie, Pädagogischer Tag, Fortbildungsplan |
| **Lehrkräfte nach Fach** | [Deutsch](docs/LERNPFADE.md#fd-deutsch) · [Fremdsprachen](docs/LERNPFADE.md#fs-fremdsprachen) · [Mathematik](docs/LERNPFADE.md#fm-mathematik) · [Informatik und Medienbildung](docs/LERNPFADE.md#fi-informatik-und-medienbildung) · [Naturwissenschaften und NwT](docs/LERNPFADE.md#fn-biologie-chemie-physik-und-nwt) · [Gesellschaftswissenschaften](docs/LERNPFADE.md#fg-geschichte-geographie-gemeinschaftskunde-und-wbs) · [Kunst und Musik](docs/LERNPFADE.md#fk-kunst-und-musik) · [Religion, Ethik, Philosophie](docs/LERNPFADE.md#fr-religion-ethik-und-philosophie) | Je drei Unterrichtsideen mit Bezug zum Bildungsplan 2016 |
| **Schülerinnen und Schüler** | [Klasse 5–7](docs/LERNPFADE.md#s1-klasse-57-ki-entdecken-und-selbst-trainieren) · [Klasse 8–10](docs/LERNPFADE.md#s2-klasse-810-ki-verstehen-bauen-bewerten) · [Klasse 11–13](docs/LERNPFADE.md#s3-klasse-1113-wie-neuronale-netze-lernen) | Von KI ohne Computer bis zum Gradientenabstieg und einem eigenen Wettbewerbsprojekt |
| **Eltern** | [KI verstehen](docs/LERNPFADE.md#e1-ki-verstehen-ohne-technikvorwissen) · [Kinder begleiten](docs/LERNPFADE.md#e2-kinder-beim-lernen-mit-ki-begleiten) · [Sicher bleiben](docs/LERNPFADE.md#e3-sicher-bleiben-deepfakes-erpressung-ki-begleiter) | Ohne Technikvorwissen: Hausaufgaben, Elternkontrollen, Deepfakes, KI-Begleiter |

Dazu die **[Werkstatt](docs/WERKSTATT.md)** mit neun Projekten mit Calliope mini, LEGO, fischertechnik, Arduino und Raspberry Pi, jeweils mit einer Variante ohne Hardware-Kauf.

## Was die Auswahl ausmacht

- **KI ist mehr als ChatGPT.** Die [KI-Landkarte](docs/KI-LANDKARTE.md) ordnet sechs Familien, von Suchen und Planen über Wahrnehmen bis Handeln. Chatbots sind eine davon; die Werkstatt zeigt vor allem die anderen.

- **Hauptquelle für Klasse 8 bis 13 ist der [KI-Kurs](https://ki-kurs.org)** des Bundeswettbewerbs KI am Tübingen AI Center: kostenlos, auf Deutsch, Python im Browser, anonym über einen Klassencode nutzbar.
- **114 geprüfte Einträge** im [Material](docs/KATALOG.md), vor allem von Landesinstituten, Hochschulen und öffentlichen Stellen. Jeder Eintrag sagt, ob ein Konto, Geld oder Hardware nötig ist.
- **Baden-Württemberg im Blick:** [Rechtsrahmen](docs/RECHT.md) mit Quellen, die Landeswerkzeuge F13 und AIS.chat, das neue Fach Informatik und Medienbildung, NwT und NIT.
- **Für Eltern konkret:** [Altersgrenzen und Elternkontrollen](docs/ALTERSGRENZEN.md), [Hilfe im Ernstfall](docs/HILFE.md) und ein fertiger [Elternabend](docs/ELTERNABEND.md).
- **Für die Schule als Ganzes:** ein [Leitfaden](docs/SCHULE.md) mit Jahresplan, Pädagogischem Tag, Ausstattung und Wettbewerbskalender.

## Mitmachen und weiterentwickeln

Alle Inhalte stehen als Markdown im Ordner [`docs/`](docs/). Ein kleines Python-Skript baut daraus die Website; bei jedem Push auf `main` veröffentlicht GitHub Actions sie auf GitHub Pages.

```sh
npm test
npm run preview
```

Die Vorschau läuft dann unter `http://127.0.0.1:4174/`. Nötig sind Python 3.9+ und Node.js 22+, sonst nichts. Hinweise zum Melden von Fehlern und zu neuen Einträgen stehen unter [Mitmachen](docs/MITMACHEN.md), die Auswahlkriterien unter [Auswahl und Quellen](docs/METHODE.md).

Texte: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.de). Code: MIT. Verlinktes Material gehört den jeweiligen Anbietern.
