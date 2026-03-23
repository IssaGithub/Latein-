const test = require("node:test");
const assert = require("node:assert/strict");

const {
  evaluateAnswer,
  levenshteinDistance,
  hasSingleAdjacentTransposition,
} = require("../src/smartCorrection");

test("levenshteinDistance berechnet einfache Distanz korrekt", () => {
  assert.equal(levenshteinDistance("amare", "amara"), 1);
  assert.equal(levenshteinDistance("trahere", "trahere"), 0);
});

test("adjazente Vertauschung wird erkannt", () => {
  assert.equal(hasSingleAdjacentTransposition("trha", "trah"), true);
  assert.equal(hasSingleAdjacentTransposition("amor", "roma"), false);
});

test("exakt korrekt: volle Denare und kein Fehler", () => {
  const result = evaluateAnswer({
    expectedStem: "am",
    expectedSuffix: "avisti",
    userAnswer: "amavisti",
  });

  assert.equal(result.isCorrect, true);
  assert.equal(result.errorType, "none");
  assert.equal(result.denars, 10);
});

test("grammatik korrekt, stamm mit 1 Fehler: spelling statt grammar", () => {
  const result = evaluateAnswer({
    expectedStem: "trah",
    expectedSuffix: "ere",
    userAnswer: "traheere",
  });

  assert.equal(result.grammarCorrect, true);
  assert.equal(result.errorType, "spelling");
  assert.equal(result.denars, 7);
});

test("stamm korrekt, endung falsch: grammar Fehler", () => {
  const result = evaluateAnswer({
    expectedStem: "am",
    expectedSuffix: "at",
    userAnswer: "amunt",
  });

  assert.equal(result.grammarCorrect, false);
  assert.equal(result.errorType, "grammar");
});

test("endung und stamm fehlerhaft: mixed Fehler", () => {
  const result = evaluateAnswer({
    expectedStem: "scrib",
    expectedSuffix: "it",
    userAnswer: "scbrunt",
  });

  assert.equal(result.grammarCorrect, false);
  assert.equal(result.errorType, "mixed");
});
