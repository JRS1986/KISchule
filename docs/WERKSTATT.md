# Werkstatt: KI zum Anfassen

[Start](../README.md) · [Lernpfade](LERNPFADE.md) · [Material](KATALOG.md) · [Für die Schule](SCHULE.md)

In jedem Projekt sammeln Schülerinnen und Schüler selbst Daten, trainieren ein Modell und prüfen, wo es versagt. Vier Kernideen tauchen immer wieder auf: **Sensoren liefern Daten**, **ein Modell ordnet Beispiele Klassen zu**, **die Trainingsdaten bestimmen das Ergebnis**, und **Regeln, die Menschen schreiben, sind etwas anderes als Regeln, die aus Daten gelernt werden**.

Vor jedem Hardware-Projekt lohnt sich eine Stunde ohne Gerät mit [AI Unplugged](KATALOG.md#k45). Preise sind Richtwerte vom 26.10.2026 inklusive Mehrwertsteuer. Wichtig für die Beschaffung: **LEGO verkauft SPIKE Prime und SPIKE Essential seit 30.06.2026 nicht mehr**, EV3 ist schon länger ausgelaufen. Vorhandene Sets bleiben nutzbar, EV3 am besten über [Open Roberta](KATALOG.md#k64). Welche Ausstattung sich lohnt, steht im [Leitfaden für die Schule](SCHULE.md#ausstattung-für-die-werkstatt).

## W1 Mein KI-Bewegungsdetektiv
<!-- stufe: 5–7; ort: Informatik und Medienbildung, Projekttag, Unterstufen-AG; hardware: Calliope mini 3; kosten: ca. 40 € pro Board, 15 Boards ca. 650 €; dauer: 2 Doppelstunden; kurz: Bewegungen aufnehmen, ein Modell trainieren und erleben, warum mehr und vielfältigere Daten helfen. -->

**Lernziel:** Ein Modell lernt aus Beispielen. Es ordnet Sensordaten einer Klasse zu und ist sich dabei mehr oder weniger sicher.

1. Einstieg ohne Gerät: Wie erkennt ein Fitnessarmband, dass jemand joggt? Dazu eine Karte aus [AI Unplugged](KATALOG.md#k45).
2. In der Web-App [Calliope KI-Training](KATALOG.md#k60) drei Klassen anlegen, zum Beispiel Springen, Winken und Stillstehen, mit je zehn Aufnahmen.
3. Trainieren, live testen und jede Fehlerkennung notieren.
4. Daten verbessern: andere Personen, anderes Tempo, Calliope anders am Handgelenk. Neu trainieren und vergleichen.
5. Das Modell in MakeCode übernehmen: Bei „Springen“ zählt die LED-Anzeige mit.
6. Gespräch: Wo stecken solche Modelle im Alltag, und wem gehören eigentlich Bewegungsdaten?

**Ohne Calliope:** Der [micro:bit V2 mit CreateAI](KATALOG.md#k63) funktioniert genauso (Website nur Englisch). **Weiterführen:** Hampelmann-Zähler im Sportunterricht, Wettbewerb um das beste Modell der Klasse.

## W2 Stein, Schere, Papier gegen die KI
<!-- stufe: 5–7; ort: Informatik, Vertretungsstunde, Tag der offenen Tür, Elternabend; hardware: keine, Laptop oder Tablet mit Kamera; kosten: 0 €; dauer: 1 Doppelstunde; kurz: Ohne Hardware-Kauf ein Bildmodell trainieren und entdecken, wie einseitige Daten zu Fehlern führen. -->

**Lernziel:** Bilder klassifizieren und erleben, dass ein Modell auch Dinge lernt, die niemand gemeint hat: den Hintergrund, das Licht, die Hand einer einzigen Person.

1. Aufwärmen ohne Gerät mit dem Brettspiel aus [AI Unplugged](KATALOG.md#k45).
2. In [Teachable Machine](KATALOG.md#k65) ein Bildprojekt mit drei Klassen anlegen: Stein, Schere, Papier. Je 30 Bilder, **alle von derselben Person**.
3. Andere Kinder testen das Modell. Fehler an der Tafel sammeln.
4. Vermutungen aufstellen („Die KI hat den Pullover gelernt“) und gezielt Daten ergänzen.
5. Vergleichen: Wie viele und welche Daten braucht ein Modell, das für alle funktioniert?

**Weiterführen:** Mit [Calliope Teachable Machine](KATALOG.md#k61) zeigt der Calliope das Ergebnis an. Das ist der Übergang zu W3. Die Webcam-Bilder bleiben im Browser; trotzdem keine Gesichter aufnehmen.

## W3 Die Müll-Sortier-Ampel
<!-- stufe: 6–8; ort: Informatik, BNT oder Biologie, Geographie, Projekttage; hardware: Calliope mini 3, Laptop mit Webcam, optional Servo und Karton; kosten: ca. 40–50 € pro Gruppe; dauer: 3–4 Stunden; kurz: Eine Kamera erkennt Papier, Plastik und Bioabfall und der Calliope zeigt die richtige Tonne. -->

**Lernziel:** Klassifikation mit Konfidenz, Grenzen bei unbekannten Gegenständen und warum lokale Datenhaltung ein Datenschutzthema ist.

1. Echten Müll fotografieren: Papier, Plastik, Bio, je 20–40 Bilder.
2. In [Calliope Teachable Machine](KATALOG.md#k61) trainieren und die Genauigkeit prüfen.
3. Mit dem Calliope koppeln: Farbe oder Symbol zeigt die Tonne, optional zeigt ein Servo-Zeiger darauf.
4. Stresstest mit Gegenständen, die nie im Training waren. Danach eine Klasse „weiß nicht“ einführen.
5. Ergebnisse vorstellen, mit Genauigkeit vorher und nachher.

**Weiterführen:** Wettbewerb Mensch gegen Maschine: Wer sortiert schneller, wer richtiger? Mit dem [LEGO-Set Informatik & KI](KATALOG.md#k67) wird daraus ein Sortierband.

## W4 Ein neuronales Netz fährt Roboter
<!-- stufe: 8–10; ort: IMP, Informatik, Mathematik, NwT; hardware: keine, Simulator im Browser, optional vorhandene EV3 oder SPIKE; kosten: 0 €; dauer: 3 Doppelstunden; kurz: Im Open-Roberta-Simulator erst eine Regel, dann ein kleines neuronales Netz einen Linienfolger steuern lassen. -->

**Lernziel:** Aufbau eines künstlichen neuronalen Netzes mit Eingaben (Lichtsensoren) und Ausgaben (Motoren), Training über Epochen und Fehler, und der Unterschied zwischen Regelung und Lernen.

1. Im [Open Roberta Lab](KATALOG.md#k64) einen Linienfolger klassisch programmieren: Wenn der Sensor dunkel misst, dann lenken.
2. Dieselbe Aufgabe als neuronales Netz anlegen, mit zwei Eingaben und zwei Ausgaben.
3. Trainingsdaten als Tabelle erstellen (Sensorwert und gewünschte Motorleistung) und trainieren. Den Fehler über die Epochen beobachten.
4. Beide Lösungen auf neuen Strecken vergleichen.
5. Diskussion: Wann ist eine Regel besser, weil sie erklärbar und sicher ist, und wann lohnt sich Lernen?

**Weiterführen:** Gewichte von Hand ändern und als lineare Funktion deuten (Mathematik). Das Programm auf EV3 oder SPIKE aus dem Bestand übertragen.

## W5 KI-Qualitätskontrolle an der Mini-Sortieranlage
<!-- stufe: 9–10; ort: NwT, Erfinderclub, World Robot Olympiad Future Innovators; hardware: fischertechnik STEM Coding Ultimate AI oder LEGO Informatik & KI 7–9; kosten: ca. 650 € pro fischertechnik-Set für 3–4 Lernende; dauer: 6–8 Doppelstunden; kurz: Eine kleine Fertigungsanlage sortiert Teile per Bilderkennung aus, wie in der Industrie 4.0. -->

**Lernziel:** Bilderkennung direkt auf dem Controller, Trainingsdaten unter echten Bedingungen (Licht!) und was falsch-positive und falsch-negative Entscheidungen in einer Produktion kosten.

1. Förderband oder Sortierer nach Anleitung bauen und Sensoren und Motoren testen.
2. Mit dem KI-Werkzeug des [fischertechnik-Sets](KATALOG.md#k69) Bilder von „gut“ und „fehlerhaft“ aufnehmen und ein Netz trainieren. Das Training läuft lokal, ohne Cloud.
3. Modell auf den Controller übertragen und die Sortierlogik programmieren, in Blockly oder Python.
4. Messreihe mit 50 Teilen und Konfusionsmatrix.
5. Optimieren: Beleuchtung, mehr Daten. Ergebnisse vergleichen.
6. Kurzvortrag: Wer haftet, wenn die Anlage falsch sortiert?

**Weiterführen:** Teilnahme an der [World Robot Olympiad](KATALOG.md#k75) in der Kategorie Future Innovators oder bei [Jugend forscht](KATALOG.md#k53).

## W6 Ist unsere KI fair?
<!-- stufe: 8–10; ort: Informatik, IMP, Ethik, Gemeinschaftskunde, Projekttag; hardware: vorhandene Calliope mini 3 oder micro:bit V2; kosten: 0 € zusätzlich; dauer: 2 Doppelstunden; kurz: Ein Gestenmodell, das nur eine Gruppe kennt, versagt bei anderen. Wir messen, wie stark. -->

**Lernziel:** Verzerrung (Bias) messbar machen. Ein Modell, das nur mit Daten einer Gruppe trainiert wurde, funktioniert für andere schlechter.

1. Gruppe A trainiert mit [Calliope KI-Training](KATALOG.md#k60) ein Gestenmodell nur mit eigenen Daten, zum Beispiel nur Rechtshänder.
2. Gruppe B testet es systematisch und trägt jedes Ergebnis pro Testperson in eine Tabelle ein.
3. Genauigkeit nach Gruppen auswerten und als Diagramm darstellen.
4. Mit vielfältigen Daten neu trainieren und den Unterschied messen.
5. Übertragen auf echte Fälle: Gesichtserkennung, Bewerbungssoftware.

**Weiterführen:** Daten als Tabelle exportieren und mit Entscheidungsbäumen auswerten, wie in den [IT2School-KI-Modulen](KATALOG.md#k78).

## W7 Sprachbefehl ohne Cloud
<!-- stufe: 11–13; ort: Informatik Kursstufe, Seminarkurs, Physik, Jugend forscht; hardware: Arduino Nano 33 BLE Sense Rev2; kosten: ca. 50 € pro Board; dauer: 4–6 Doppelstunden; kurz: Eine Schlüsselworterkennung trainieren, die direkt auf dem Mikrocontroller läuft. -->

**Lernziel:** Die ganze Kette des maschinellen Lernens: Daten aufnehmen, Merkmale bilden (Spektrogramm), Netz trainieren, auf dem Mikrocontroller ausführen. Dazu der Vergleich Edge gegen Cloud bei Energie und Datenschutz.

1. Physik-Einstieg: Schall als Signal, Spektrogramm mit dem Board aufnehmen.
2. Eigene Schlüsselwörter wie „Licht an“ und „Licht aus“ plus eine Klasse „Rauschen“ aufnehmen, je mindestens 50 Clips von einer Sekunde.
3. In [Edge Impulse](KATALOG.md#k71) eine Pipeline bauen und trainieren. Ein Konto der Lehrkraft verwenden und keine personenbezogenen Daten hochladen.
4. Als Arduino-Bibliothek exportieren, aufspielen und eine LED schalten.
5. Robustheit testen (Lärm, andere Stimmen) und dokumentieren.

**Ohne Cloud-Konto:** Gestenerkennung mit TensorFlow Lite Micro nach der [Arduino-Anleitung](KATALOG.md#k70). **Weiterführen:** Anomalieerkennung an einem Ventilator mit dem Bewegungssensor.

## W8 Das KI-Vogelhaus
<!-- stufe: 10–13; ort: Seminarkurs, Informatik Kursstufe, Biologie, Jugend forscht; hardware: Raspberry Pi 4 oder 5 mit Raspberry Pi AI Camera; kosten: ca. 180–200 € pro Station; dauer: 4 Doppelstunden Aufbau, danach Wochen der Beobachtung; kurz: Eine Kamera am Futterhaus erkennt Vogelarten und zählt Besuche, die Auswertung läuft direkt am Gerät. -->

**Lernziel:** Objekterkennung mit vortrainierten Modellen und Nachtrainieren mit eigenen Fotos, Datenqualität bei Gegenlicht und Dämmerung, Schwellenwerte für Konfidenz und Datenschutz (keine Personen filmen).

1. Pi aufsetzen und die [AI Camera](KATALOG.md#k72) mit einem fertigen Modell testen.
2. Ein wetterfestes Gehäuse am Futterhaus anbringen, etwa mit dem 3D-Drucker.
3. Klassen festlegen (Meise, Spatz, Taube, leer) und eigene Bilder beschriften.
4. Modell nachtrainieren, auf die Kamera laden und Besuche protokollieren.
5. Auswerten: Besuchszeiten, Arten, Fehlerquote per Stichprobe von Hand prüfen.

**Weiterführen:** Vergleich mit Citizen-Science-Daten wie der NABU-„Stunde der Wintervögel“.

## W9 Das neuronale Netz von Hand nachrechnen
<!-- stufe: 11–13; ort: Informatik Kursstufe, Mathematik, Physik; hardware: keine, Browser und Python im Browser oder Jupyter; kosten: 0 €; dauer: 2–3 Doppelstunden; kurz: Die Gewichte aus dem Roboter-Netz von W4 mit Perzeptron und Gradientenabstieg selbst berechnen und mit einem klassischen Regler vergleichen. -->

**Lernziel:** Verstehen, was beim Training wirklich passiert: Gewichte, Fehlerfunktion, Gradientenabstieg. Und warum ein klassischer P-Regler oft genauso gut ist.

1. Das Netz aus W4 im [Open Roberta Lab](KATALOG.md#k64) trainieren und die Gewichte notieren.
2. Ein Perzeptron mit denselben Daten in Python nachbauen und Schritt für Schritt per Gradientenabstieg trainieren.
3. Die Gewichte vergleichen und erklären, warum sie nicht genau gleich sind.
4. Im Simulator einen P-Regler (später PID) programmieren und gegen das Netz antreten lassen.
5. Fazit schreiben: Wann ist Lernen nötig, wann ist eine Formel besser?

**Vertiefung:** Die Mathematik hinter dem Gradientenabstieg erklärt das Kapitel im [KI-Kurs](KATALOG.md#k50).
