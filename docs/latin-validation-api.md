# Latein-Antworten API (nur verifizierte Korrektheit)

## Ziel

Die API trennt strikt:

1. **Deterministische Korrektheit** (harte Entscheidung)
2. **KI-Unterstuetzung** (Erklaerung, Kandidaten, Hint)

Damit gilt:

> Eine Antwort darf nur als "korrekt" markiert werden, wenn sie in der verifizierten Formenmenge liegt.

---

## Modell-Empfehlung

- **Primar (qualitativ stark):** GPT-4.1 fuer Analyse/Erklaerungen
- **Kostenoptimiert:** kleineres Modell fuer Standard-Hints
- **Wichtig:** Das Modell entscheidet **nicht final** ueber "korrekt/falsch".

KI darf nur Kandidaten liefern. Die API entscheidet final ueber eine verifizierte Formliste.

---

## Kern-Endpunkte (V1)

### `POST /api/v1/forms/resolve`

Liefert verifizierte Formen fuer ein Lemma + Zielmorphologie.

- Input: Lemma, Konjugationsklasse, Features (tempus, numerus, person, genus verbi)
- Output: `canonicalForm`, `acceptedForms[]`, `source` (lexicon/rule/override), `verified=true`

### `POST /api/v1/answers/validate`

Validiert eine Nutzerantwort gegen verifizierte Formen.

- Input: `lemma`, `userAnswer`, `canonicalForm`, `acceptedForms[]`, `taskContext`
- Output: `isCorrect`, `reasonCode`, `resolvedCanonicalForm`, `feedback`

### `POST /api/v1/feedback/explain` (optional)

Generiert lernfreundliches Feedback mit KI.

- Input: Validierungsergebnis + Kontext
- Output: kurze Erklaerung + naechster Lernhinweis

---

## Validierungs-Flow

1. `forms/resolve` baut die **verifizierte Formenmenge**.
2. `answers/validate` prueft deterministisch:
   - `normalize(userAnswer)` in `verifiedForms`?
3. Optional: KI liefert Kandidat (`suggestedCanonicalForm`, `confidence`).
4. KI-Kandidat wird nur akzeptiert, wenn:
   - `confidence >= threshold`
   - vorgeschlagene Form in `verifiedForms`
5. Ergebnis + Audit speichern.

---

## Entscheidungsregeln

- **Never trust raw LLM output** fuer finale Korrektheit.
- **Whitelisted sources** fuer Formen:
  - kuratierte Tabellen
  - regelbasierter Morphologie-Generator
  - explizite Irregular-Overrides
- **Unknown form** => `isCorrect=false`, `reasonCode=no_verified_match`
- **Missing verified forms** => harte Fehlerantwort (`missing_verified_forms`)

---

## JSON-Schemas

Siehe:

- `docs/schemas/answer-validation-request.schema.json`
- `docs/schemas/answer-validation-response.schema.json`

---

## Beispiel: Produktionsaufgabe

1. Client fragt `forms/resolve` fuer `lemma=capere`, Features `praesens, 1sg, aktiv`.
2. API antwortet `canonicalForm=capio`, `acceptedForms=["capio"]`, `verified=true`.
3. Nutzer antwortet `capo`.
4. `answers/validate` ergibt:
   - `isCorrect=false`
   - `reasonCode=no_verified_match`
5. KI erklaert: "Achte auf die i-Einschubstelle bei 3.-io-Verben."

