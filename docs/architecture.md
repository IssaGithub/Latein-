# Architekturentwurf: Vom Frust zum Erfolg

## 1) User Flow

Der Kernflow ist fuer kurze, wiederholbare Sessions optimiert.

### 1.1 Onboarding & Check-in

1. Nutzer waehlt:
   - Klasse/Jahrgang
   - aktuelles Schulbuch
   - aktuelle Lektion
2. App laedt passendes Vokabel- und Grammatikpaket.
3. App startet mit einer sehr leichten Einstiegsaufgabe, um Erfolg direkt sichtbar zu machen.

### 1.2 Daily Sprint (5 Minuten)

#### Phase A: Erkennen (ohne Schreibdruck)

- Input: Audio + Wortanzeige
- Aktion: passendes Bild oder deutsche Bedeutung waehlen
- Ziel: semantische Aktivierung ohne orthografische Huerde

#### Phase B: Struktur (Stamm/Endung)

- Input: Wortstamm + mehrere Endungen
- Aktion: richtige Endung antippen
- Ziel: Grammatiklogik trainieren, ohne Vollschreibung zu erzwingen

#### Phase C: Produktion (Schreiben)

- Input: Zielwort/Form
- Aktion: Wort schreiben
- Ziel: Transfer in aktive Produktion

### 1.3 Intelligente Korrektur ("LRS-Filter")

Bewertung in Ebenen:

1. **Grammatik-Ebene**:
   - Endung korrekt?
   - morphologische Funktion korrekt?
2. **Orthografie-Ebene**:
   - Levenshtein-Distanz
   - typische Buchstabenvertauschungen

Feedback trennt beides explizit:

- "Grammatik stark"
- "Stamm noch unsicher"

So bleibt Motivation erhalten, waehrend gezielt nachgeschult wird.

### 1.4 Belohnung & Progression

- Denare pro Aufgabe (abhaengig von Genauigkeit + Streak)
- kosmetische Avatar-Items
- Freischaltbare Themen/Level
- Tagesziel/Serie fuer hohe Frequenz

## 2) Farbleitsystem (Visual Anchoring)

Konsistente Farben fuer Mustererkennung:

- Akkusativ: Gruen
- Genitiv: Gelb
- Perfekt-Endungen: Blau

Farben werden in Aufgabenkarten, Feedbackchips und Auswertungen identisch verwendet.

## 3) API-Schnittstellen (V1)

### 3.1 Sprint

- `POST /api/sprints/start`
  - input: `userId`, `lessonId`
  - output: `sprintSessionId`, `tasks[]`

- `POST /api/sprints/{id}/submit`
  - input: `taskId`, `answer`, `responseMs`
  - output: `evaluation` (grammar/spelling/suggestion/reward)

### 3.2 Bild-Upload fuer Aufgaben

- `POST /api/uploads/images`
  - multipart upload
  - output: `uploadId`, `storageUrl`

- `POST /api/uploads/images/{id}/extract`
  - startet OCR/Analyse
  - output: `extractionJobId`

- `GET /api/uploads/images/{id}/tasks`
  - output: generierte Vokabeln + Aufgabenentwuerfe mit Konfidenz

### 3.3 Moderation / Freigabe

- `POST /api/generated-content/{id}/approve`
  - Lehrkraft/Eltern bestaetigen generierte Inhalte vor Aktivierung

## 4) Bild-Upload Pipeline

1. Upload in Objektspeicher
2. OCR + Entitaets-Extraktion (Latein, Deutsch, Kontext)
3. Mapping auf bekanntes Lexikon
4. Generierung von Aufgaben (A/B/C)
5. Qualitaetspruefung (Konfidenzschwellen)
6. Optional menschliche Freigabe
7. Uebernahme in Lernpool

## 5) SRS-Logik (Spaced Repetition)

Jede Wortform erhaelt pro Nutzer einen Stabilitaetswert:

- Erfolg in Phase C steigert Stabilitaet deutlich
- Erfolg nur in A/B bei Fehler in C: moderate Steigerung
- reine Stamm-Rechtschreibfehler: geringere Strafe als Grammatikfehler

Das Scheduling priorisiert:

1. Hohe Relevanz + geringe Stabilitaet
2. Fehlercluster nach `error_type` (Spelling vs Grammar)
3. Lange nicht gesehene Inhalte

## 6) Sicherheits- und Datenschutzaspekte

- Rollen: Schueler, Eltern, Lehrkraft, Admin
- Zugriff auf Uploads nur fuer berechtigte Konten
- Bilddaten versioniert und auditierbar
- Loeschkonzept fuer sensible Uploads
- Kein KI-Output ohne Herkunftsmetadaten

## 7) Nicht-funktionale Anforderungen

- Antwortzeit Task-Submit: < 300 ms (ohne KI-Generierung)
- Offline-Cache fuer Sprint-Aufgaben
- Ereignisprotokoll fuer Lernanalytik
- Hohe Animation-Performance auf Mittelklasse-Geraeten
