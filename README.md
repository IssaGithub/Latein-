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

## GitHub Pages Deployment

Die statische Demo-Seite liegt in `site/` und wird ueber GitHub Actions automatisch nach GitHub Pages deployed:

- Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: Push auf `main` und `cursor/app-konzept-datenmodell-cf88` (oder manueller Workflow-Start)

Erwartete URL nach erfolgreichem Deployment:

`https://issagithub.github.io/Latein-/`

## Aktueller MVP-Status (Pages)

Die Pages-App enthaelt jetzt:

- Onboarding/Check-in (Name, Buch, Lektion, Sprint-Laenge)
- Daily Sprint mit 3 Phasen (Erkennen, Struktur, Produktion)
- LRS-freundliche Smart-Correction in Phase C
- Denare + Streak + Stabilitaetsanzeige (lokal gespeichert)
- Bild-Upload mit OCR via Tesseract.js (Browser-seitig)
- Automatische Erkennung von Vokabelpaaren (`Latein - Deutsch`) zur Uebernahme in den Aufgabenpool
- Campus-2-Lektionsmodus: Aufgaben werden aus der gewaehlten Lektion aufgebaut

## Tech-Entscheidung (Empfehlung)

- **Mobile Frontend**: Flutter oder React Native (Animationen, Cross-Platform)
- **Backend/API**: Node.js + PostgreSQL
- **KI-Komponente**: OpenAI API fuer adaptive Beispielsatz-Generierung auf Basis des aktuellen Lernstands
- **Bildverarbeitung**: Upload -> OCR/Objekterkennung -> Aufgaben-Generator

## Kernprinzip

Feedback priorisiert Motivation:

> "Die Grammatik hast du richtig erkannt. Achte im Stamm noch auf das 'h'."

Damit wird Fortschritt sichtbar, ohne Fehler zu beschoenigen.
