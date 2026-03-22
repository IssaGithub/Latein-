function normalize(input) {
  return (input || "").toLowerCase().trim().replace(/\s+/g, "");
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function hasSingleAdjacentTransposition(a, b) {
  if (a.length !== b.length) return false;
  const mismatches = [];

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) mismatches.push(i);
  }

  if (mismatches.length !== 2) return false;
  const [i, j] = mismatches;
  return j === i + 1 && a[i] === b[j] && a[j] === b[i];
}

function evaluateAnswer(expectedStem, expectedSuffix, userAnswer) {
  const stem = normalize(expectedStem);
  const suffix = normalize(expectedSuffix);
  const answer = normalize(userAnswer);
  const expectedWord = `${stem}${suffix}`;

  const levenshtein = levenshteinDistance(answer, expectedWord);
  const grammarCorrect = answer.endsWith(suffix);
  const candidateStem = grammarCorrect
    ? answer.slice(0, Math.max(0, answer.length - suffix.length))
    : answer.slice(0, Math.min(answer.length, stem.length));

  let stemDistance = levenshteinDistance(candidateStem, stem);
  if (hasSingleAdjacentTransposition(candidateStem, stem)) {
    stemDistance = Math.min(stemDistance, 1);
  }

  let errorType = "none";
  if (!grammarCorrect && stemDistance > 0) errorType = "mixed";
  else if (!grammarCorrect) errorType = "grammar";
  else if (stemDistance > 0) errorType = "spelling";

  let denars = 1;
  if (answer === expectedWord) denars = 10;
  else if (grammarCorrect && stemDistance <= 1) denars = 7;
  else if (grammarCorrect) denars = 5;
  else if (!grammarCorrect && stemDistance <= 1) denars = 3;

  let feedback = "Guter Versuch. Schau dir Stamm und Endung getrennt an.";
  if (grammarCorrect && stemDistance === 0) {
    feedback = "Perfekt! Grammatik und Schreibweise sind korrekt.";
  } else if (grammarCorrect && stemDistance <= 1) {
    feedback =
      "Die Grammatik ist korrekt. Beim Stamm ist nur ein kleiner Fehler.";
  } else if (!grammarCorrect && stemDistance === 0) {
    feedback = "Der Stamm passt. Pruefe die Endung noch einmal.";
  }

  return {
    isCorrect: answer === expectedWord,
    grammarCorrect,
    spellingCorrect: grammarCorrect && stemDistance === 0,
    errorType,
    levenshtein,
    stemDistance,
    denars,
    feedback,
  };
}

const expectedStemEl = document.getElementById("expectedStem");
const expectedSuffixEl = document.getElementById("expectedSuffix");
const userAnswerEl = document.getElementById("userAnswer");
const outputEl = document.getElementById("output");
const buttonEl = document.getElementById("evaluateButton");

function renderEvaluation() {
  const result = evaluateAnswer(
    expectedStemEl.value,
    expectedSuffixEl.value,
    userAnswerEl.value
  );
  outputEl.textContent = JSON.stringify(result, null, 2);
}

buttonEl.addEventListener("click", renderEvaluation);
renderEvaluation();
