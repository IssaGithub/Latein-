const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateAnswerWithPolicy,
  shouldAcceptAiCandidate,
  buildVerifiedFormSet,
} = require("../src/latinValidationFlow");

test("deterministische verifizierte Form wird sofort als korrekt bewertet", async () => {
  const result = await validateAnswerWithPolicy({
    lemma: "amare",
    userAnswer: "amat",
    canonicalForm: "amat",
    acceptedForms: [],
  });

  assert.equal(result.isCorrect, true);
  assert.equal(result.reasonCode, "verified_form_match");
  assert.equal(result.usedAiCandidate, false);
});

test("KI-Kandidat wird abgelehnt, wenn Form nicht verifiziert ist", async () => {
  const result = await validateAnswerWithPolicy(
    {
      lemma: "amare",
      userAnswer: "amat",
      canonicalForm: "amant",
      acceptedForms: ["amant"],
    },
    {
      requestAiCandidate: () => ({
        suggestedCanonicalForm: "amat",
        confidence: 0.99,
      }),
      aiMinConfidence: 0.8,
    }
  );

  assert.equal(result.isCorrect, false);
  assert.equal(result.reasonCode, "no_verified_match");
  assert.equal(result.usedAiCandidate, false);
});

test("KI-Kandidat wird akzeptiert, wenn hoch-konfident und verifiziert", async () => {
  const result = await validateAnswerWithPolicy(
    {
      lemma: "malo",
      userAnswer: "mavis",
      canonicalForm: "mavis",
      acceptedForms: ["ma vis", "mavis"],
    },
    {
      requestAiCandidate: () => ({
        suggestedCanonicalForm: "mavis",
        confidence: 0.95,
      }),
      aiMinConfidence: 0.8,
    }
  );

  assert.equal(result.isCorrect, true);
  assert.equal(result.reasonCode, "verified_ai_candidate");
  assert.equal(result.usedAiCandidate, true);
});

test("fehlende verifizierte Formen fuehren zu hartem Fehlerstatus", async () => {
  const result = await validateAnswerWithPolicy({
    lemma: "amare",
    userAnswer: "amat",
    canonicalForm: "",
    acceptedForms: [],
  });

  assert.equal(result.isCorrect, false);
  assert.equal(result.reasonCode, "missing_verified_forms");
});

test("shouldAcceptAiCandidate prueft confidence und verifizierte Form", () => {
  const verifiedForms = buildVerifiedFormSet({
    canonicalForm: "amat",
    acceptedForms: ["amatis"],
  });

  assert.equal(
    shouldAcceptAiCandidate({
      aiCandidate: { suggestedCanonicalForm: "amat", confidence: 0.91 },
      verifiedForms,
      minConfidence: 0.8,
    }),
    true
  );

  assert.equal(
    shouldAcceptAiCandidate({
      aiCandidate: { suggestedCanonicalForm: "amant", confidence: 0.99 },
      verifiedForms,
      minConfidence: 0.8,
    }),
    false
  );

  assert.equal(
    shouldAcceptAiCandidate({
      aiCandidate: { suggestedCanonicalForm: "amat", confidence: 0.4 },
      verifiedForms,
      minConfidence: 0.8,
    }),
    false
  );
});

