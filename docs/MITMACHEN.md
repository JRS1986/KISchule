# Mitmachen

KI-Schule lebt davon, dass Lehrkräfte, Eltern und Schülerinnen und Schüler sagen, was funktioniert und was nicht.

## Was hilft

- **Ein Link ist kaputt oder ein Angebot kostet plötzlich Geld.** Bitte als [Issue auf GitHub](https://github.com/JRS1986/KISchule/issues) melden, mit dem Katalogeintrag (zum Beispiel K12).
- **Sie haben eine Unterrichtsidee ausprobiert.** Beschreiben Sie Klassenstufe, Fach, Dauer und was die Klasse gelernt hat. Gute Erfahrungen wandern als Unterrichtsidee in den passenden Fachpfad.
- **Ihre Fachschaft hat Material erstellt.** Wenn es unter einer freien Lizenz steht (zum Beispiel CC BY-SA), kann es in den Katalog.
- **Ein Werkstatt-Projekt ist gebaut.** Fotos ohne erkennbare Kinder, die Stückliste und Stolperstellen helfen der nächsten AG.

## Was in den Katalog kommt

Ein neuer Eintrag muss drei Fragen beantworten. Wer steht dahinter (Hochschule, Landesinstitut, anerkannter Verein, Hersteller der eigenen Plattform)? Gibt es nachprüfbare Rückmeldungen (Auszeichnungen, Verbreitung, Einsatz in anderen Programmen)? Ist das Material kostenlos nutzbar und für Schülerinnen und Schüler datenschutzfreundlich? Die Kriterien stehen ausführlich in [Auswahl und Quellen](METHODE.md).

## Technisch

Alle Inhalte stehen als Markdown im Ordner `docs/`. Der Katalog in [KATALOG.md](KATALOG.md), die Lernpfade in [LERNPFADE.md](LERNPFADE.md) und die Projekte in [WERKSTATT.md](WERKSTATT.md). Ein Skript baut daraus die Website; bei jedem Push auf `main` wird sie automatisch auf GitHub Pages veröffentlicht.

```sh
npm test
npm run preview
```

Danach ist die Vorschau unter `http://127.0.0.1:4174/` erreichbar. Es gibt keine Paketabhängigkeiten; nötig sind nur Python 3.9+ und Node.js 22+.

## Grenzen

KI-Schule ist ein unabhängiges, privates Angebot. Es ist kein offizielles Angebot einer Schule und ersetzt weder Vorgaben des Kultusministeriums noch die Entscheidung einer Schulleitung, welche Werkzeuge an einer Schule zugelassen sind.
