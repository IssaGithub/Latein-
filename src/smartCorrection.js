/**
 * LRS-freundliche Korrektur-Logik fuer Lateinformen.
 * Trennt grammatikalische Leistung (Suffix) von Orthografie (Stamm).
 */

function normalize(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
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
  if (j !== i + 1) return false;
  return a[i] === b[j] && a[j] === b[i];
}

function buildFeedback({ grammarCorrect, stemDistance, expectedStem, expectedSuffix }) {
  if (grammarCorrect && stemDistance === 0) {
    return "Perfekt! Grammatik und Schreibweise sind korrekt.";
  }

  if (grammarCorrect && stemDistance <= 1) {
    return `Die Grammatik hast du perfekt verstanden. Achte beim Stamm noch auf die Schreibweise in "${expectedStem}".`;
  }

  if (!grammarCorrect && stemDistance === 0) {
    return `Der Stamm ist richtig. Pruefe die Endung "${expectedSuffix}" noch einmal.`;
  }

  return "Guter Versuch. Schau dir Stamm und Endung noch einmal getrennt an.";
}

/**
 * Bewertet eine Nutzerantwort auf Wortebene.
 *
 * @param {Object} input
 * @param {string} input.expectedStem z.B. "am"
 * @param {string} input.expectedSuffix z.B. "avisti"
 * @param {string} input.userAnswer z.B. "amavisti"
 * @returns {{
 *   isCorrect: boolean,
 *   grammarCorrect: boolean,
 *   spellingCorrect: boolean,
 *   errorType: "none" | "spelling" | "grammar" | "mixed",
 *   levenshtein: number,
 *   stemDistance: number,
 *   denars: number,
 *   feedback: string
 * }}
 */
function evaluateAnswer({ expectedStem, expectedSuffix, userAnswer }) {
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

  const spellingCorrect = stemDistance === 0 && grammarCorrect;
  const exactCorrect = answer === expectedWord;

  let errorType = "none";
  if (!grammarCorrect && stemDistance > 0) errorType = "mixed";
  else if (!grammarCorrect) errorType = "grammar";
  else if (stemDistance > 0) errorType = "spelling";

  let denars = 0;
  if (exactCorrect) denars = 10;
  else if (grammarCorrect && stemDistance <= 1) denars = 7;
  else if (grammarCorrect) denars = 5;
  else if (!grammarCorrect && stemDistance <= 1) denars = 3;
  else denars = 1;

  return {
    isCorrect: exactCorrect,
    grammarCorrect,
    spellingCorrect,
    errorType,
    levenshtein,
    stemDistance,
    denars,
    feedback: buildFeedback({
      grammarCorrect,
      stemDistance,
      expectedStem: stem,
      expectedSuffix: suffix,
    }),
  };
}

module.exports = {
  evaluateAnswer,
  levenshteinDistance,
  hasSingleAdjacentTransposition,
};
