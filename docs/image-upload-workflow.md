# Bild-Upload zu Aufgaben: End-to-End Ablauf

## Ziel

Aus hochgeladenen Bildern (z. B. Buchseite, Tafelbild, Arbeitsblatt) sollen automatisch:

1. Vokabelkandidaten extrahiert
2. Stamm/Endung erkannt
3. Aufgaben fuer Sprint-Phasen A/B/C erzeugt werden

## Ablauf

1. **Upload**
   - Client sendet `multipart/form-data` an `/api/uploads/images`
   - Server speichert Originaldatei und erzeugt `image_upload` Datensatz

2. **Vorverarbeitung**
   - Bildrotation/Entrauschen/Kontrast
   - OCR mit Sprachprofil Latein/Deutsch

3. **Sprachliche Extraktion**
   - Erkennung von Vokabelpaaren (Latein -> Deutsch)
   - Segmentierung in moegliche Staemme und Endungen
   - Konfidenzbewertung je Kandidat

4. **Aufgabengenerierung**
   - Phase A: Audio/Bild/Bedeutungs-Optionen
   - Phase B: Stamm + Endungswahl
   - Phase C: Schreibaufgabe

5. **Freigabe**
   - Aufgaben mit niedriger Konfidenz gehen in manuellen Review
   - freigegebene Aufgaben werden in `generated_task` aktiviert

## Validierungsregeln

- OCR-Konfidenz < 0.7 -> nur Vorschlag, keine automatische Aktivierung
- Unbekannte Endung -> als "review_required" markieren
- Dubletten zu existierenden Formen nicht erneut importieren

## Ergebnis fuer Nutzer

- Nach dem Upload stehen neue, personalisierte Sprint-Aufgaben bereit
- Fehleranalysen aus diesen Aufgaben fliessen direkt in `user_progress`
