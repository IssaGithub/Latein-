/**
 * Referenz-Flow fuer API-basierte Latein-Antwortvalidierung.
 *
 * Ziel:
 * - KI darf helfen (Erklaerung, Kandidaten, Hint), aber
 * - "korrekt" wird nur vergeben, wenn eine verifizierte Form getroffen ist.
 */

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

function uniqueNormalizedForms(values) {
  return Array.from(
    new Set(
      (values || [])
        .map((item) => normalize(item))
        .filter(Boolean)
    )
  );
}

function buildVerifiedFormSet({ canonicalForm, acceptedForms = [] }) {
  const forms = uniqueNormalizedForms([canonicalForm, ...acceptedForms]);
  return new Set(forms);
}

function deterministicCheck({ userAnswer, verifiedForms }) {
  const normalizedAnswer = normalize(userAnswer);
  const isCorrect = verifiedForms.has(normalizedAnswer);
  return {
    normalizedAnswer,
    isCorrect,
    reasonCode: isCorrect ? "verified_form_match" : "no_verified_match",
  };
}

function shouldAcceptAiCandidate({ aiCandidate, verifiedForms, minConfidence = 0.8 }) {
  if (!aiCandidate || typeof aiCandidate !== "object") return false;
  const candidateForm = normalize(aiCandidate.suggestedCanonicalForm);
  const confidence = Number(aiCandidate.confidence || 0);
  if (!candidateForm) return false;
  if (confidence < minConfidence) return false;
  return verifiedForms.has(candidateForm);
}

/**
 * @param {Object} input
 * @param {string} input.lemma
 * @param {string} input.userAnswer
 * @param {string} input.canonicalForm verifizierte Zielform (z. B. "amat")
 * @param {string[]} [input.acceptedForms] weitere verifizierte Varianten
 *
 * @param {Object} options
 * @param {(payload: Object) => Promise<Object>|Object} [options.requestAiCandidate]
 * @param {number} [options.aiMinConfidence]
 *
 * @returns {Promise<{
 *   isCorrect: boolean,
 *   reasonCode: string,
 *   normalizedAnswer: string,
 *   resolvedCanonicalForm: string,
 *   usedAiCandidate: boolean,
 *   audit: {
 *     lemma: string,
 *     verifiedForms: string[],
 *     aiCandidateAccepted: boolean
 *   }
 * }>}
 */
async function validateAnswerWithPolicy(input, options = {}) {
  const {
    lemma,
    userAnswer,
    canonicalForm,
    acceptedForms = [],
  } = input || {};

  const verifiedForms = buildVerifiedFormSet({ canonicalForm, acceptedForms });
  if (verifiedForms.size === 0) {
    return {
      isCorrect: false,
      reasonCode: "missing_verified_forms",
      normalizedAnswer: normalize(userAnswer),
      resolvedCanonicalForm: normalize(canonicalForm),
      usedAiCandidate: false,
      audit: {
        lemma: normalize(lemma),
        verifiedForms: [],
        aiCandidateAccepted: false,
      },
    };
  }

  const deterministic = deterministicCheck({ userAnswer, verifiedForms });
  if (deterministic.isCorrect) {
    return {
      isCorrect: true,
      reasonCode: deterministic.reasonCode,
      normalizedAnswer: deterministic.normalizedAnswer,
      resolvedCanonicalForm: deterministic.normalizedAnswer,
      usedAiCandidate: false,
      audit: {
        lemma: normalize(lemma),
        verifiedForms: Array.from(verifiedForms.values()),
        aiCandidateAccepted: false,
      },
    };
  }

  let aiCandidate = null;
  if (typeof options.requestAiCandidate === "function") {
    aiCandidate = await options.requestAiCandidate({
      lemma: normalize(lemma),
      userAnswer: deterministic.normalizedAnswer,
      canonicalForm: normalize(canonicalForm),
      acceptedForms: Array.from(verifiedForms.values()),
    });
  }

  const aiAccepted = shouldAcceptAiCandidate({
    aiCandidate,
    verifiedForms,
    minConfidence: Number(options.aiMinConfidence || 0.8),
  });

  if (aiAccepted) {
    return {
      isCorrect: true,
      reasonCode: "verified_ai_candidate",
      normalizedAnswer: deterministic.normalizedAnswer,
      resolvedCanonicalForm: normalize(aiCandidate.suggestedCanonicalForm),
      usedAiCandidate: true,
      audit: {
        lemma: normalize(lemma),
        verifiedForms: Array.from(verifiedForms.values()),
        aiCandidateAccepted: true,
      },
    };
  }

  return {
    isCorrect: false,
    reasonCode: deterministic.reasonCode,
    normalizedAnswer: deterministic.normalizedAnswer,
    resolvedCanonicalForm: normalize(canonicalForm),
    usedAiCandidate: false,
    audit: {
      lemma: normalize(lemma),
      verifiedForms: Array.from(verifiedForms.values()),
      aiCandidateAccepted: false,
    },
  };
}

module.exports = {
  normalize,
  validateAnswerWithPolicy,
  shouldAcceptAiCandidate,
  buildVerifiedFormSet,
};

