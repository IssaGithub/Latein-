# Latein Sprint App

Eine motivierende Lern-App fuer Latein, die gezielt auf zwei Kernprobleme eingeht:

1. **Motivationsverlust durch Frust**
2. **Rechtschreibschwaeche (LRS) trotz vorhandener Grammatik-Kompetenz**

Die App trennt daher systematisch:

- **grammatikalisches Verstehen** (Stamm + Endung + Funktion)
- **orthografische Genauigkeit** (Buchstabenfolge)

So wird Leistung sichtbar gemacht, auch wenn ein Wort noch nicht perfekt geschrieben wurde.

## Zielbild

- Kurze, hochfrequente Lerneinheiten ("Daily Sprint", 5 Minuten)
- Spielartige Interaktion mit Belohnungssystem (Denare, Avatar-Fortschritt)
- Intelligente Korrektur statt binaer "richtig/falsch"
- Farbleitsystem fuer grammatikalische Muster
- Bild-Upload als Quelle fuer neue Vokabel-/Aufgabenpakete

## Projektstruktur

- `docs/architecture.md`: User Flow, Feature-Architektur, API-Konzept
- `db/schema.sql`: Relationales Datenmodell inkl. SRS und LRS-Fehlerklassifikation
- `src/smartCorrection.js`: Referenzimplementierung des LRS-freundlichen Korrektur-Algorithmus
- `tests/smartCorrection.test.js`: Unit-Tests fuer die Bewertungslogik

## Schnellstart (Algorithmus-Tests)

```bash
node --test tests/smartCorrection.test.js
```

## Tech-Entscheidung (Empfehlung)

- **Mobile Frontend**: Flutter oder React Native (Animationen, Cross-Platform)
- **Backend/API**: Node.js + PostgreSQL
- **KI-Komponente**: OpenAI API fuer adaptive Beispielsatz-Generierung auf Basis des aktuellen Lernstands
- **Bildverarbeitung**: Upload -> OCR/Objekterkennung -> Aufgaben-Generator

## Kernprinzip

Feedback priorisiert Motivation:

> "Die Grammatik hast du richtig erkannt. Achte im Stamm noch auf das 'h'."

Damit wird Fortschritt sichtbar, ohne Fehler zu beschoenigen.
