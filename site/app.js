const STORAGE_KEY = "latein_sprint_state_v2";

const BASE_VOCABULARY = [
  {
    id: "amare",
    lemma: "amare",
    stem: "am",
    meaning: "lieben",
    emoji: "❤️",
    suffixes: [
      { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "at", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "avisti", functionLabel: "2. Pers. Sg. Perfekt", colorCode: "#3b82f6" },
    ],
  },
  {
    id: "videre",
    lemma: "videre",
    stem: "vid",
    meaning: "sehen",
    emoji: "👀",
    suffixes: [
      { suffix: "eo", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "et", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "isti", functionLabel: "2. Pers. Sg. Perfekt", colorCode: "#3b82f6" },
    ],
  },
  {
    id: "trahere",
    lemma: "trahere",
    stem: "trah",
    meaning: "ziehen",
    emoji: "🧲",
    suffixes: [
      { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "it", functionLabel: "3. Pers. Sg. Perfekt", colorCode: "#3b82f6" },
      { suffix: "unt", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
    ],
  },
  {
    id: "scribere",
    lemma: "scribere",
    stem: "scrib",
    meaning: "schreiben",
    emoji: "✍️",
    suffixes: [
      { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
      { suffix: "it", functionLabel: "3. Pers. Sg. Perfekt", colorCode: "#3b82f6" },
      { suffix: "imus", functionLabel: "1. Pers. Pl. Praesens", colorCode: "#eab308" },
    ],
  },
];

const SUFFIX_PROFILES = {
  first: [
    { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "at", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "ant", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
  ],
  second: [
    { suffix: "eo", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "et", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "ent", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
  ],
  third: [
    { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "it", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "unt", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
  ],
  fourth: [
    { suffix: "io", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "it", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
    { suffix: "iunt", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
  ],
};

const SECOND_CONJ_LEMMAS = new Set([
  "videre",
  "habere",
  "tenere",
  "tacere",
  "ridere",
  "docere",
  "monere",
  "movere",
  "timere",
  "respondere",
  "audere",
  "sedere",
  "manere",
]);

const CAMPUS2_LESSON_BANK = {
  1: [
    { lemma: "amare", meaning: "lieben", emoji: "❤️" },
    { lemma: "laudare", meaning: "loben", emoji: "👏" },
    { lemma: "portare", meaning: "tragen", emoji: "🎒" },
    { lemma: "habitare", meaning: "wohnen", emoji: "🏠" },
    { lemma: "parare", meaning: "vorbereiten", emoji: "🧰" },
  ],
  2: [
    { lemma: "vocare", meaning: "rufen", emoji: "📣" },
    { lemma: "narrare", meaning: "erzaehlen", emoji: "🗣️" },
    { lemma: "spectare", meaning: "anschauen", emoji: "👀" },
    { lemma: "donare", meaning: "schenken", emoji: "🎁" },
    { lemma: "rogare", meaning: "fragen", emoji: "❓" },
  ],
  3: [
    { lemma: "audire", meaning: "hoeren", emoji: "👂" },
    { lemma: "dormire", meaning: "schlafen", emoji: "😴" },
    { lemma: "venire", meaning: "kommen", emoji: "🚶" },
    { lemma: "sentire", meaning: "fuehlen", emoji: "💭" },
    { lemma: "finire", meaning: "beenden", emoji: "🏁" },
  ],
  4: [
    { lemma: "videre", meaning: "sehen", emoji: "👁️" },
    { lemma: "habere", meaning: "haben", emoji: "🧩" },
    { lemma: "tenere", meaning: "halten", emoji: "✋" },
    { lemma: "tacere", meaning: "schweigen", emoji: "🤫" },
    { lemma: "ridere", meaning: "lachen", emoji: "😄" },
  ],
  5: [
    { lemma: "scribere", meaning: "schreiben", emoji: "✍️" },
    { lemma: "legere", meaning: "lesen", emoji: "📖" },
    { lemma: "mittere", meaning: "schicken", emoji: "📨" },
    { lemma: "ducere", meaning: "fuehren", emoji: "🧭" },
    { lemma: "currere", meaning: "laufen", emoji: "🏃" },
  ],
  6: [
    { lemma: "facere", meaning: "machen", emoji: "🛠️" },
    { lemma: "capere", meaning: "fassen", emoji: "🤏" },
    { lemma: "ponere", meaning: "legen", emoji: "📌" },
    { lemma: "quaerere", meaning: "suchen", emoji: "🔎" },
    { lemma: "petere", meaning: "anstreben", emoji: "🎯" },
  ],
  7: [
    { lemma: "iuvare", meaning: "helfen", emoji: "🤝" },
    { lemma: "orare", meaning: "bitten", emoji: "🙏" },
    { lemma: "explicare", meaning: "erklaeren", emoji: "💡" },
    { lemma: "monstrare", meaning: "zeigen", emoji: "👉" },
    { lemma: "servare", meaning: "retten", emoji: "🛟" },
  ],
  8: [
    { lemma: "ambulare", meaning: "spazieren", emoji: "🚶‍♂️" },
    { lemma: "pugnare", meaning: "kaempfen", emoji: "⚔️" },
    { lemma: "celebrare", meaning: "feiern", emoji: "🎉" },
    { lemma: "laborare", meaning: "arbeiten", emoji: "💼" },
    { lemma: "custodire", meaning: "bewachen", emoji: "🛡️" },
  ],
  9: [
    { lemma: "docere", meaning: "lehren", emoji: "🧑‍🏫" },
    { lemma: "monere", meaning: "warnen", emoji: "⚠️" },
    { lemma: "movere", meaning: "bewegen", emoji: "🎬" },
    { lemma: "timere", meaning: "fuerchten", emoji: "😨" },
    { lemma: "respondere", meaning: "antworten", emoji: "💬" },
  ],
  10: [
    { lemma: "cognoscere", meaning: "kennenlernen", emoji: "🧠" },
    { lemma: "vincere", meaning: "siegen", emoji: "🏆" },
    { lemma: "perdere", meaning: "verlieren", emoji: "💥" },
    { lemma: "defendere", meaning: "verteidigen", emoji: "🛡️" },
    { lemma: "oppugnare", meaning: "angreifen", emoji: "🧱" },
  ],
  11: [
    { lemma: "navigare", meaning: "segeln", emoji: "⛵" },
    { lemma: "intrare", meaning: "hineingehen", emoji: "🚪" },
    { lemma: "exire", meaning: "hinausgehen", emoji: "🏃" },
    { lemma: "manere", meaning: "bleiben", emoji: "🕒" },
    { lemma: "advenire", meaning: "ankommen", emoji: "🚌" },
  ],
  12: [
    { lemma: "clamare", meaning: "schreien", emoji: "📢" },
    { lemma: "cantare", meaning: "singen", emoji: "🎵" },
    { lemma: "saltare", meaning: "springen", emoji: "🤸" },
    { lemma: "spectare", meaning: "zuschauen", emoji: "👓" },
    { lemma: "ludere", meaning: "spielen", emoji: "🎮" },
  ],
  13: [
    { lemma: "invenire", meaning: "finden", emoji: "🔍" },
    { lemma: "aperire", meaning: "oeffnen", emoji: "🔓" },
    { lemma: "claudere", meaning: "schliessen", emoji: "🔒" },
    { lemma: "parere", meaning: "gehorchen", emoji: "🙋" },
    { lemma: "stare", meaning: "stehen", emoji: "🧍" },
  ],
  14: [
    { lemma: "iacere", meaning: "werfen", emoji: "🥏" },
    { lemma: "sedere", meaning: "sitzen", emoji: "🪑" },
    { lemma: "currere", meaning: "rennen", emoji: "🏃‍♀️" },
    { lemma: "salutare", meaning: "gruessen", emoji: "👋" },
    { lemma: "intrare", meaning: "betreten", emoji: "🚶" },
  ],
  15: [
    { lemma: "narrare", meaning: "berichten", emoji: "📰" },
    { lemma: "ostendere", meaning: "zeigen", emoji: "🪄" },
    { lemma: "cogitare", meaning: "nachdenken", emoji: "🤔" },
    { lemma: "scribere", meaning: "notieren", emoji: "📝" },
    { lemma: "legere", meaning: "vorlesen", emoji: "📚" },
  ],
  16: [
    { lemma: "frangere", meaning: "brechen", emoji: "🪓" },
    { lemma: "tangere", meaning: "beruehren", emoji: "🖐️" },
    { lemma: "agere", meaning: "handeln", emoji: "⚙️" },
    { lemma: "ducere", meaning: "ziehen", emoji: "🧲" },
    { lemma: "trahere", meaning: "schleppen", emoji: "🪢" },
  ],
  17: [
    { lemma: "petere", meaning: "anpeilen", emoji: "🎯" },
    { lemma: "quaerere", meaning: "erfragen", emoji: "❔" },
    { lemma: "invitare", meaning: "einladen", emoji: "💌" },
    { lemma: "accipere", meaning: "annehmen", emoji: "📥" },
    { lemma: "recipere", meaning: "zuruecknehmen", emoji: "↩️" },
  ],
  18: [
    { lemma: "monstrare", meaning: "erklaeren", emoji: "🧭" },
    { lemma: "habitare", meaning: "leben", emoji: "🏡" },
    { lemma: "laborare", meaning: "muhe geben", emoji: "💪" },
    { lemma: "conservare", meaning: "bewahren", emoji: "🧰" },
    { lemma: "ornare", meaning: "schmuecken", emoji: "🎀" },
  ],
  19: [
    { lemma: "parere", meaning: "erscheinen", emoji: "✨" },
    { lemma: "discedere", meaning: "weggehen", emoji: "🚶‍♂️" },
    { lemma: "ascendere", meaning: "hinaufsteigen", emoji: "🧗" },
    { lemma: "descendere", meaning: "hinabsteigen", emoji: "⬇️" },
    { lemma: "manere", meaning: "verweilen", emoji: "🕰️" },
  ],
  20: [
    { lemma: "audere", meaning: "wagen", emoji: "🔥" },
    { lemma: "sperare", meaning: "hoffen", emoji: "🌟" },
    { lemma: "timere", meaning: "Angst haben", emoji: "😬" },
    { lemma: "vincere", meaning: "gewinnen", emoji: "🥇" },
    { lemma: "celebrare", meaning: "feiern", emoji: "🎊" },
  ],
};

function normalize(input) {
  return (input || "").toLowerCase().trim().replace(/\s+/g, "");
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeBookName(name) {
  return normalize(name).replace(/[^a-z0-9]/g, "");
}

function isCampus2Book(name) {
  const value = normalizeBookName(name);
  return value.includes("campus2");
}

function normalizeLessonNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.floor(parsed));
}

function lessonKey(bookName, lessonNumber) {
  return `${normalizeBookName(bookName)}::${normalizeLessonNumber(lessonNumber)}`;
}

function deriveStemFromLemma(lemma) {
  const rawLemma = normalize(lemma);
  if (rawLemma.endsWith("are")) return rawLemma.slice(0, -3);
  if (rawLemma.endsWith("ere")) return rawLemma.slice(0, -3);
  if (rawLemma.endsWith("ire")) return rawLemma.slice(0, -3);
  if (rawLemma.length > 3) return rawLemma.slice(0, -1);
  return rawLemma;
}

function inferSuffixProfileForLemma(lemma) {
  const rawLemma = normalize(lemma);
  if (rawLemma.endsWith("are")) return SUFFIX_PROFILES.first;
  if (rawLemma.endsWith("ire")) return SUFFIX_PROFILES.fourth;
  if (rawLemma.endsWith("ere")) {
    if (SECOND_CONJ_LEMMAS.has(rawLemma)) return SUFFIX_PROFILES.second;
    return SUFFIX_PROFILES.third;
  }
  return SUFFIX_PROFILES.third;
}

function buildVocabularyEntry({
  id,
  lemma,
  meaning,
  emoji = "🧠",
  suffixes,
}) {
  const normalizedLemma = normalize(lemma);
  const profile = suffixes || inferSuffixProfileForLemma(normalizedLemma);
  return {
    id,
    lemma: normalizedLemma,
    stem: deriveStemFromLemma(normalizedLemma),
    meaning: String(meaning || "").trim().toLowerCase(),
    emoji,
    suffixes: profile.map((item) => ({ ...item })),
  };
}

function mergeVocabularyEntries(...groups) {
  const merged = new Map();
  groups
    .flat()
    .filter(Boolean)
    .forEach((entry) => {
      const key = `${normalize(entry.lemma)}::${normalize(entry.meaning)}`;
      if (!merged.has(key)) merged.set(key, entry);
    });
  return Array.from(merged.values());
}

function getCampus2LessonVocabulary(lessonNumber) {
  const lessonRows = CAMPUS2_LESSON_BANK[normalizeLessonNumber(lessonNumber)] || [];
  return lessonRows.map((row, index) =>
    buildVocabularyEntry({
      id: `campus2-l${normalizeLessonNumber(lessonNumber)}-${normalize(row.lemma)}-${index}`,
      lemma: row.lemma,
      meaning: row.meaning,
      emoji: row.emoji || "📘",
    })
  );
}

function getCampus2AvailableLessonNumbers() {
  return Object.keys(CAMPUS2_LESSON_BANK)
    .map((key) => Number(key))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
}

function getCampus2NeighborVocabulary(lessonNumber, maxDistance = 1) {
  const normalized = normalizeLessonNumber(lessonNumber);
  const available = getCampus2AvailableLessonNumbers();
  const neighbors = available.filter(
    (candidate) => candidate !== normalized && Math.abs(candidate - normalized) <= maxDistance
  );
  return mergeVocabularyEntries(...neighbors.map((candidate) => getCampus2LessonVocabulary(candidate)));
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

  let feedback = "Guter Versuch! Schau dir Wortanfang und Endung nochmal getrennt an.";
  if (grammarCorrect && stemDistance === 0) {
    feedback = "Stark! Alles richtig.";
  } else if (grammarCorrect && stemDistance <= 1) {
    feedback =
      "Mega! Die Endung passt. Beim Wortanfang fehlt nur ein kleiner Buchstaben-Feinschliff.";
  } else if (!grammarCorrect && stemDistance === 0) {
    feedback = `Wortanfang passt! Check die Endung "${suffix}" nochmal.`;
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

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(values, count) {
  return shuffle(values).slice(0, count);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setRuntimeStatus("");
  } catch {
    setRuntimeStatus(
      "Dein Browser blockiert Speichern. Du kannst trotzdem spielen, aber dein Fortschritt bleibt nicht dauerhaft.",
      true
    );
  }
}

function defaultState() {
  return {
    profile: {
      name: "Schueler",
      schoolBook: "Campus 2",
      lesson: 1,
    },
    wallet: { denars: 0, streak: 0 },
    progress: {},
    lessonVocabulary: {},
    uploadedVocabulary: [],
    activeSprint: null,
    activePractice: null,
    ui: {
      activeTab: "challenge",
    },
  };
}

let state = loadState() || defaultState();

if (!state.profile || typeof state.profile !== "object") {
  state.profile = { ...defaultState().profile };
}
if (!state.wallet || typeof state.wallet !== "object") {
  state.wallet = { ...defaultState().wallet };
}
if (!state.progress || typeof state.progress !== "object") {
  state.progress = {};
}
if (!state.lessonVocabulary || typeof state.lessonVocabulary !== "object") {
  state.lessonVocabulary = {};
}
if (!Array.isArray(state.uploadedVocabulary)) {
  state.uploadedVocabulary = [];
}
if (!state.ui || typeof state.ui !== "object") {
  state.ui = { activeTab: "challenge" };
}
if (!state.ui.activeTab) {
  state.ui.activeTab = "challenge";
}
if (!state.activePractice || typeof state.activePractice !== "object") {
  state.activePractice = null;
}

if (
  state.uploadedVocabulary.length > 0 &&
  Object.keys(state.lessonVocabulary).length === 0 &&
  state.profile?.schoolBook
) {
  const migratedKey = lessonKey(state.profile.schoolBook, state.profile.lesson || 1);
  state.lessonVocabulary[migratedKey] = [...state.uploadedVocabulary];
}

function getLessonVocabularyFromUser(bookName, lessonNumber) {
  return state.lessonVocabulary[lessonKey(bookName, lessonNumber)] || [];
}

function getSelectedBookName() {
  return bookInput?.value?.trim() || state.profile.schoolBook || "Campus 2";
}

function getSelectedLessonNumber() {
  return normalizeLessonNumber(lessonInput?.value || state.profile.lesson || 1);
}

function getLessonPool(bookName, lessonNumber) {
  const isCampus2 = isCampus2Book(bookName);
  const builtInCampusLesson = isCampus2 ? getCampus2LessonVocabulary(lessonNumber) : [];
  const nearbyCampusLesson = isCampus2 ? getCampus2NeighborVocabulary(lessonNumber, 1) : [];
  const importedForLesson = getLessonVocabularyFromUser(bookName, lessonNumber);

  let pool = mergeVocabularyEntries(builtInCampusLesson, importedForLesson);
  let usesNeighborLesson = false;
  if (pool.length < 2 && nearbyCampusLesson.length > 0) {
    pool = mergeVocabularyEntries(pool, nearbyCampusLesson);
    usesNeighborLesson = true;
  }

  let usesFallback = false;
  if (pool.length < 2) {
    pool = mergeVocabularyEntries(pool, BASE_VOCABULARY);
    usesFallback = true;
  }

  return {
    pool,
    builtInCampusLesson,
    nearbyCampusLesson,
    importedForLesson,
    usesNeighborLesson,
    usesFallback,
  };
}

function allSuffixesFromPool(pool) {
  return pool.flatMap((entry) => entry.suffixes.map((s) => s.suffix));
}

function buildWordCycleTask(entry, phase, index, pool) {
  const chosenSuffix = entry.suffixes[Math.floor(Math.random() * entry.suffixes.length)];
  const formKey = `${entry.id}::${chosenSuffix.suffix}`;
  const expectedWord = `${entry.stem}${chosenSuffix.suffix}`;

  if (phase === "recognition") {
    const distractors = sample(
      pool.filter((v) => v.id !== entry.id).map((v) => v.meaning),
      3
    );
    const options = shuffle([entry.meaning, ...distractors]);
    return {
      id: `${formKey}::A::${index}`,
      phase,
      title: "Runde A - Erkennen",
      prompt: `Was bedeutet "${entry.lemma}"?`,
      formKey,
      expectedWord,
      expectedStem: entry.stem,
      expectedSuffix: chosenSuffix.suffix,
      options,
      correctAnswer: entry.meaning,
      helper: `${entry.emoji} Tipp: Geh nach Bedeutung und Gefuehl.`,
      colorCode: chosenSuffix.colorCode,
      functionLabel: chosenSuffix.functionLabel,
    };
  }

  if (phase === "structure") {
    const suffixPool = Array.from(new Set(allSuffixesFromPool(pool).filter((s) => s !== chosenSuffix.suffix)));
    const distractors = sample(suffixPool, 3);
    const options = shuffle([chosenSuffix.suffix, ...distractors]);
    return {
      id: `${formKey}::B::${index}`,
      phase,
      title: "Runde B - Endung-Check",
      prompt: `Welche Endung passt zu "${entry.stem}-"?`,
      formKey,
      expectedWord,
      expectedStem: entry.stem,
      expectedSuffix: chosenSuffix.suffix,
      options,
      correctAnswer: chosenSuffix.suffix,
      helper: chosenSuffix.functionLabel,
      colorCode: chosenSuffix.colorCode,
      functionLabel: chosenSuffix.functionLabel,
    };
  }

  return {
    id: `${formKey}::C::${index}`,
    phase,
    title: "Runde C - Selber schreiben",
    prompt: `Schreib die passende Form zu "${entry.lemma}" (${chosenSuffix.functionLabel}).`,
    formKey,
    expectedWord,
    expectedStem: entry.stem,
    expectedSuffix: chosenSuffix.suffix,
    helper: `Stamm: ${entry.stem}- | Endung: ${chosenSuffix.suffix}`,
    colorCode: chosenSuffix.colorCode,
    functionLabel: chosenSuffix.functionLabel,
  };
}

function startSprint() {
  state.profile.name = nameInput.value.trim() || "Schueler";
  state.profile.schoolBook = getSelectedBookName();
  state.profile.lesson = getSelectedLessonNumber();

  const lessonPool = getLessonPool(state.profile.schoolBook, state.profile.lesson);
  const pool = lessonPool.pool;
  if (pool.length < 2) {
    alert("Zu wenig Woerter fuer diese Lektion. Lade erst ein Foto hoch oder waehle eine andere Lektion.");
    return;
  }

  const wordCount = Number(sprintWordCount.value || 3);
  const chosenEntries = sample(pool, Math.min(wordCount, pool.length));
  const tasks = [];

  chosenEntries.forEach((entry, index) => {
    tasks.push(buildWordCycleTask(entry, "recognition", index, pool));
    tasks.push(buildWordCycleTask(entry, "structure", index, pool));
    tasks.push(buildWordCycleTask(entry, "production", index, pool));
  });

  state.activeSprint = {
    startedAt: new Date().toISOString(),
    taskIndex: 0,
    tasks,
    lastEvaluation: null,
    selectedOption: null,
    textAnswer: "",
    bookName: state.profile.schoolBook,
    lessonNumber: state.profile.lesson,
  };
  state.ui.activeTab = "challenge";

  saveState();
  renderAll();
}

function buildPracticeTasks(scannedPool, practiceWordCount) {
  const chosenEntries = sample(scannedPool, Math.min(practiceWordCount, scannedPool.length));
  const tasks = [];

  chosenEntries.forEach((entry, index) => {
    const distractors = sample(
      scannedPool.filter((item) => item.id !== entry.id).map((item) => item.meaning),
      3
    );
    const options = shuffle([entry.meaning, ...distractors]);
    tasks.push({
      id: `practice-meaning-${entry.id}-${index}`,
      kind: "meaning",
      formKey: `${entry.id}::meaning`,
      title: "Uebung 1 - Bedeutung",
      prompt: `Was bedeutet "${entry.lemma}"?`,
      options,
      correctAnswer: entry.meaning,
      helper: `${entry.emoji} Aus dem Buch-Scan`,
    });

    const suffix = entry.suffixes[Math.floor(Math.random() * entry.suffixes.length)];
    const expectedWord = `${entry.stem}${suffix.suffix}`;
    tasks.push({
      id: `practice-write-${entry.id}-${index}`,
      kind: "write",
      formKey: `${entry.id}::${suffix.suffix}`,
      title: "Uebung 2 - Schreiben",
      prompt: `Schreib die Form zu "${entry.lemma}" (${suffix.functionLabel}).`,
      helper: `Stamm: ${entry.stem}- | Endung: ${suffix.suffix}`,
      expectedStem: entry.stem,
      expectedSuffix: suffix.suffix,
      expectedWord,
      colorCode: suffix.colorCode,
      functionLabel: suffix.functionLabel,
    });
  });

  return tasks;
}

function startPractice() {
  state.profile.name = nameInput.value.trim() || "Schueler";
  state.profile.schoolBook = getSelectedBookName();
  state.profile.lesson = getSelectedLessonNumber();

  const scannedPool = getLessonVocabularyFromUser(state.profile.schoolBook, state.profile.lesson);
  if (scannedPool.length < 2) {
    alert(
      "Fuer Uebungen brauchst du erst Woerter aus dem Buch-Scan. Wechsle in den Uebungs-Reiter, scanne und importiere."
    );
    state.ui.activeTab = "practice";
    saveState();
    renderAll();
    return;
  }

  const practiceWordCount = Number(practiceWordCountSelect?.value || 3);
  const tasks = buildPracticeTasks(scannedPool, practiceWordCount);
  state.activePractice = {
    startedAt: new Date().toISOString(),
    taskIndex: 0,
    tasks,
    selectedOption: null,
    lastEvaluation: null,
    bookName: state.profile.schoolBook,
    lessonNumber: state.profile.lesson,
  };
  state.ui.activeTab = "practice";
  saveState();
  renderAll();
}

function gradePracticeTask() {
  const practice = state.activePractice;
  if (!practice) return;
  const task = practice.tasks[practice.taskIndex];
  if (!task) return;

  let evaluation;
  if (task.kind === "meaning") {
    const selected = practice.selectedOption;
    if (!selected) {
      alert("Waehle zuerst eine Antwort aus.");
      return;
    }
    const isCorrect = selected === task.correctAnswer;
    evaluation = {
      isCorrect,
      errorType: isCorrect ? "none" : "mixed",
      denars: isCorrect ? 4 : 1,
      feedback: isCorrect ? "Stark! Bedeutung korrekt." : "Fast - lies das Wort nochmal genau.",
    };
  } else {
    const input = (document.getElementById("practiceWriteInput")?.value || "").trim();
    evaluation = evaluateAnswer(task.expectedStem, task.expectedSuffix, input);
    updateProgress(task.formKey, evaluation);
  }

  state.wallet.denars += evaluation.denars;
  if (evaluation.errorType === "none") state.wallet.streak += 1;
  else state.wallet.streak = 0;

  practice.lastEvaluation = {
    taskId: task.id,
    kind: task.kind,
    evaluation,
    expected: task.expectedWord || task.correctAnswer,
  };

  submitPracticeButton.classList.add("hidden");
  nextPracticeButton.classList.remove("hidden");
  saveState();
  renderAll();
}

function nextPracticeTask() {
  const practice = state.activePractice;
  if (!practice) return;

  practice.taskIndex += 1;
  practice.selectedOption = null;
  practice.lastEvaluation = null;

  if (practice.taskIndex >= practice.tasks.length) {
    const total = practice.tasks.length;
    state.activePractice = null;
    alert(`Uebung geschafft! Du hast ${total} Scan-Aufgaben trainiert.`);
  }

  saveState();
  renderAll();
}

function updateProgress(formKey, evaluation) {
  const previous = state.progress[formKey] || {
    stability: 0,
    lastErrorType: "none",
    lastSeen: null,
  };

  let stability = previous.stability;
  if (evaluation.errorType === "none") stability += 0.25;
  else if (evaluation.errorType === "spelling") stability += 0.1;
  else if (evaluation.errorType === "grammar") stability = Math.max(0, stability - 0.05);
  else stability = Math.max(0, stability - 0.08);

  state.progress[formKey] = {
    stability: Number(stability.toFixed(2)),
    lastErrorType: evaluation.errorType,
    lastSeen: new Date().toISOString(),
  };
}

function gradeCurrentTask() {
  const sprint = state.activeSprint;
  if (!sprint) return;
  const task = sprint.tasks[sprint.taskIndex];
  if (!task) return;

  let evaluation;
  if (task.phase === "production") {
    const input = (document.getElementById("productionInput")?.value || "").trim();
    evaluation = evaluateAnswer(task.expectedStem, task.expectedSuffix, input);
  } else {
    const selected = sprint.selectedOption;
    if (!selected) {
      alert("Waehle zuerst eine Antwort aus.");
      return;
    }
    const isCorrect = selected === task.correctAnswer;
    evaluation = {
      isCorrect,
      grammarCorrect: task.phase === "structure" ? isCorrect : true,
      spellingCorrect: task.phase === "recognition" ? true : isCorrect,
      errorType: isCorrect ? "none" : task.phase === "structure" ? "grammar" : "mixed",
      denars: isCorrect ? 5 : 2,
      feedback: isCorrect
        ? "Yes! Das war richtig."
        : "Knapp vorbei - probier es nochmal.",
    };
  }

  state.wallet.denars += evaluation.denars;
  if (evaluation.errorType === "none") state.wallet.streak += 1;
  else state.wallet.streak = 0;

  updateProgress(task.formKey, evaluation);
  sprint.lastEvaluation = {
    taskId: task.id,
    phase: task.phase,
    evaluation,
    expected: task.expectedWord,
  };

  submitAnswerButton.classList.add("hidden");
  nextTaskButton.classList.remove("hidden");
  feedbackCard.classList.remove("hidden");
  saveState();
  renderAll();
}

function nextTask() {
  const sprint = state.activeSprint;
  if (!sprint) return;

  sprint.taskIndex += 1;
  sprint.selectedOption = null;
  sprint.textAnswer = "";
  sprint.lastEvaluation = null;

  if (sprint.taskIndex >= sprint.tasks.length) {
    const total = sprint.tasks.length;
    state.activeSprint = null;
    alert(`Stark! Dein Run ist fertig: ${total} Aufgaben geschafft.`);
  }

  saveState();
  renderAll();
}

function averageStability() {
  const entries = Object.values(state.progress);
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, item) => acc + Number(item.stability || 0), 0);
  return sum / entries.length;
}

function renderTask(task, sprint) {
  if (!task) {
    taskContainer.innerHTML = "<p class='muted'>Starte eine Challenge, um Aufgaben zu sehen.</p>";
    return;
  }

  sprintMeta.textContent = `${state.profile.name} | ${state.profile.schoolBook} Lektion ${state.profile.lesson} | Run ${sprint.taskIndex + 1}/${sprint.tasks.length}`;

  const colorBadge = `<span class="badge" style="background:${task.colorCode}33;color:#e2e8f0">${escapeHtml(task.functionLabel)}</span>`;
  if (task.phase === "production") {
    taskContainer.innerHTML = `
      <h3 class="task-title">${task.title} ${colorBadge}</h3>
      <p>${escapeHtml(task.prompt)}</p>
      <p class="muted">${escapeHtml(task.helper)}</p>
      <label>
        Deine Antwort
        <input id="productionInput" autocomplete="off" placeholder="z. B. ${escapeHtml(task.expectedWord)}" />
      </label>
    `;
    return;
  }

  const optionsHtml = task.options
    .map((option, optionIndex) => {
      const active = sprint.selectedOption === option ? "active" : "";
      return `<button type="button" class="option-button ${active}" data-option-index="${optionIndex}">${escapeHtml(option)}</button>`;
    })
    .join("");

  taskContainer.innerHTML = `
    <h3 class="task-title">${task.title} ${colorBadge}</h3>
    <p>${escapeHtml(task.prompt)}</p>
    <p class="muted">${escapeHtml(task.helper)}</p>
    <div class="option-grid">${optionsHtml}</div>
  `;

  Array.from(taskContainer.querySelectorAll(".option-button")).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.optionIndex);
      sprint.selectedOption = task.options[index] || null;
      saveState();
      renderAll();
    });
  });
}

function renderPracticeTask(practice) {
  const task = practice?.tasks?.[practice.taskIndex];
  if (!task) {
    practiceTaskContainer.innerHTML =
      "<p class='muted'>Starte Uebungen, um Scan-Aufgaben zu sehen.</p>";
    return;
  }

  practiceMeta.textContent = `${state.profile.name} | ${state.profile.schoolBook} Lektion ${state.profile.lesson} | Uebung ${
    practice.taskIndex + 1
  }/${practice.tasks.length}`;

  if (task.kind === "write") {
    const colorBadge = `<span class="badge" style="background:${task.colorCode}33;color:#e2e8f0">${escapeHtml(
      task.functionLabel
    )}</span>`;
    practiceTaskContainer.innerHTML = `
      <h3 class="task-title">${task.title} ${colorBadge}</h3>
      <p>${escapeHtml(task.prompt)}</p>
      <p class="muted">${escapeHtml(task.helper)}</p>
      <label>
        Deine Antwort
        <input id="practiceWriteInput" autocomplete="off" placeholder="z. B. ${escapeHtml(
          task.expectedWord
        )}" />
      </label>
    `;
    return;
  }

  const optionsHtml = task.options
    .map((option, optionIndex) => {
      const active = practice.selectedOption === option ? "active" : "";
      return `<button type="button" class="option-button ${active}" data-practice-option-index="${optionIndex}">${escapeHtml(
        option
      )}</button>`;
    })
    .join("");

  practiceTaskContainer.innerHTML = `
    <h3 class="task-title">${task.title}</h3>
    <p>${escapeHtml(task.prompt)}</p>
    <p class="muted">${escapeHtml(task.helper)}</p>
    <div class="option-grid">${optionsHtml}</div>
  `;

  Array.from(practiceTaskContainer.querySelectorAll(".option-button")).forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.practiceOptionIndex);
      practice.selectedOption = task.options[optionIndex] || null;
      saveState();
      renderAll();
    });
  });
}

function renderPracticeFeedback(practice) {
  if (!practice || !practice.lastEvaluation) {
    practiceFeedbackOutput.textContent = "Nach deiner Antwort erscheint hier dein Uebungs-Feedback.";
    return;
  }

  const evaluation = practice.lastEvaluation;
  const points = evaluation.evaluation.denars || 0;
  const resultLabel = evaluation.evaluation.isCorrect ? "Treffer!" : "Noch nicht ganz";
  practiceFeedbackOutput.textContent = [
    `Ergebnis: ${resultLabel}`,
    `Punkte: +${points} Denare`,
    `Feedback: ${evaluation.evaluation.feedback}`,
    `Loesung: ${evaluation.expected}`,
  ].join("\n");
}

function renderFeedback() {
  const sprint = state.activeSprint;
  const evaluation = sprint?.lastEvaluation;
  if (!evaluation) {
    feedbackOutput.textContent = "Nach deiner Antwort erscheint hier dein Feedback.";
    return;
  }
  const points = evaluation.evaluation.denars || 0;
  const errorType = evaluation.evaluation.errorType || "none";
  const badge =
    errorType === "none"
      ? "Top"
      : errorType === "spelling"
      ? "Fast richtig"
      : errorType === "grammar"
      ? "Endung nochmal checken"
      : "Nochmal probieren";

  feedbackOutput.textContent = [
    `Ergebnis: ${badge}`,
    `Punkte: +${points} Denare`,
    `Feedback: ${evaluation.evaluation.feedback}`,
    `Zielwort: ${evaluation.expected}`,
  ].join("\n");
}

function renderImportedList() {
  const selectedBook = getSelectedBookName();
  const selectedLesson = getSelectedLessonNumber();
  const importedForLesson = getLessonVocabularyFromUser(selectedBook, selectedLesson);

  if (importedForLesson.length === 0) {
    importedList.innerHTML =
      "<li class='muted'>Noch keine extra Woerter fuer diese Lektion importiert.</li>";
    return;
  }
  importedList.innerHTML = importedForLesson
    .map(
      (item) =>
        `<li>${escapeHtml(item.lemma)} - ${escapeHtml(item.meaning)} <span class="muted">(Stamm: ${escapeHtml(item.stem)})</span></li>`
    )
    .join("");
}

function updateLessonPoolHint() {
  if (!lessonPoolHint) return;
  const selectedBook = getSelectedBookName();
  const selectedLesson = getSelectedLessonNumber();
  const {
    builtInCampusLesson,
    nearbyCampusLesson,
    importedForLesson,
    usesNeighborLesson,
    usesFallback,
  } = getLessonPool(
    selectedBook,
    selectedLesson
  );

  if (isCampus2Book(selectedBook)) {
    const availableLessons = getCampus2AvailableLessonNumbers();
    const minLesson = availableLessons[0];
    const maxLesson = availableLessons[availableLessons.length - 1];

    if (builtInCampusLesson.length > 0) {
      lessonPoolHint.textContent = `Campus 2 Lektion ${selectedLesson}: ${builtInCampusLesson.length} Starter-Woerter + ${importedForLesson.length} eigene Woerter (verfuegbar: Lektion ${minLesson}-${maxLesson}).`;
      return;
    }

    if (usesNeighborLesson && nearbyCampusLesson.length > 0) {
      lessonPoolHint.textContent = `Fuer Lektion ${selectedLesson} gibt es noch kein eigenes Starter-Pack. Ich nutze zurzeit Woerter aus Nachbarlektionen + deine eigenen (${importedForLesson.length}).`;
      return;
    }

    lessonPoolHint.textContent = `Campus 2 Lektion ${selectedLesson}: Noch kein Starter-Pack. Lade ein Foto hoch, dann bauen wir daraus Aufgaben (verfuegbar: Lektion ${minLesson}-${maxLesson}).`;
    return;
  }

  if (usesFallback) {
    lessonPoolHint.textContent =
      "Fuer dieses Buch/Lektion gibt es noch keine feste Liste. Du kannst per Foto schnell eigene Woerter laden.";
    return;
  }

  lessonPoolHint.textContent = `${importedForLesson.length} eigene Woerter fuer diese Lektion bereit.`;
}

function updateTabUI() {
  const activeTab = state.ui.activeTab === "practice" ? "practice" : "challenge";
  if (tabChallengeButton) {
    tabChallengeButton.classList.toggle("active", activeTab === "challenge");
  }
  if (tabPracticeButton) {
    tabPracticeButton.classList.toggle("active", activeTab === "practice");
  }
  if (challengePanel) {
    challengePanel.classList.toggle("hidden", activeTab !== "challenge");
  }
  if (practicePanel) {
    practicePanel.classList.toggle("hidden", activeTab !== "practice");
  }
  if (tabDescription) {
    tabDescription.textContent =
      activeTab === "challenge"
        ? "Challenge: 3 Runden mit Punkten und Feedback."
        : "Uebungen: zuerst mit Aufgaben aus deinem Buch-Scan trainieren.";
  }
}

function renderAll() {
  denarsStat.textContent = String(state.wallet.denars);
  streakStat.textContent = String(state.wallet.streak);
  stabilityStat.textContent = averageStability().toFixed(2);

  nameInput.value = state.profile.name;
  bookInput.value = state.profile.schoolBook;
  lessonInput.value = String(normalizeLessonNumber(state.profile.lesson));
  updateLessonPoolHint();
  updateTabUI();

  if (!state.activeSprint) {
    sprintCard.classList.add("hidden");
    feedbackCard.classList.add("hidden");
    sprintMeta.textContent = "Noch kein Run gestartet.";
  } else {
    sprintCard.classList.remove("hidden");
    submitAnswerButton.classList.remove("hidden");
    nextTaskButton.classList.add("hidden");
    if (state.activeSprint.lastEvaluation) {
      submitAnswerButton.classList.add("hidden");
      nextTaskButton.classList.remove("hidden");
      feedbackCard.classList.remove("hidden");
    } else {
      feedbackCard.classList.add("hidden");
    }
    renderTask(state.activeSprint.tasks[state.activeSprint.taskIndex], state.activeSprint);
    renderFeedback();
  }

  if (!state.activePractice) {
    practiceCard.classList.add("hidden");
    practiceMeta.textContent = "Noch keine Uebung gestartet.";
    submitPracticeButton.classList.remove("hidden");
    nextPracticeButton.classList.add("hidden");
    practiceTaskContainer.innerHTML =
      "<p class='muted'>Starte Uebungen, um Scan-Aufgaben zu sehen.</p>";
    practiceFeedbackOutput.textContent = "Nach deiner Antwort erscheint hier dein Uebungs-Feedback.";
  } else {
    practiceCard.classList.remove("hidden");
    submitPracticeButton.classList.remove("hidden");
    nextPracticeButton.classList.add("hidden");
    if (state.activePractice.lastEvaluation) {
      submitPracticeButton.classList.add("hidden");
      nextPracticeButton.classList.remove("hidden");
    }
    renderPracticeTask(state.activePractice);
    renderPracticeFeedback(state.activePractice);
  }

  renderImportedList();
}

function buildImportedVocabulary(lines) {
  const parsed = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes("-") ? "-" : line.includes(":") ? ":" : null;
      if (!separator) return null;
      const [latin, german] = line.split(separator).map((part) => part.trim());
      if (!latin || !german) return null;
      return { latin, german };
    })
    .filter(Boolean);

  return parsed.map((item, index) =>
    buildVocabularyEntry({
      id: `upload-${Date.now()}-${index}`,
      lemma: item.latin,
      meaning: item.german,
      emoji: "🖼️",
    })
  );
}

function sanitizePairTerm(input) {
  return String(input || "")
    .replace(/[|()[\]{}<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVocabularyPairsFromText(rawText) {
  const lines = String(rawText || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/[—–]/g, "-").trim())
    .filter(Boolean);

  const pairs = [];
  const seen = new Set();

  lines.forEach((line) => {
    let latin = "";
    let german = "";

    const separatorMatch = line.match(/^(.+?)\s*(?:-|:|=|->|=>)\s*(.+)$/);
    if (separatorMatch) {
      latin = sanitizePairTerm(separatorMatch[1]);
      german = sanitizePairTerm(separatorMatch[2]);
    } else {
      const twoColumnMatch = line.match(/^([A-Za-z][A-Za-z\- ]{1,})\s{2,}([A-Za-z][A-Za-z\- ]{1,})$/);
      if (twoColumnMatch) {
        latin = sanitizePairTerm(twoColumnMatch[1]);
        german = sanitizePairTerm(twoColumnMatch[2]);
      }
    }

    if (!latin || !german) return;
    if (latin.length < 2 || german.length < 2) return;

    const key = `${normalize(latin)}::${normalize(german)}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({ latin, german });
  });

  return pairs;
}

function setButtonBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
  button.style.opacity = busy ? "0.7" : "";
  button.style.cursor = busy ? "wait" : "";
}

function friendlyOcrStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("loading")) return "Lade Sprachdaten";
  if (value.includes("initializing")) return "Starte Texterkennung";
  if (value.includes("recognizing")) return "Erkenne Text";
  if (value.includes("detecting")) return "Suche Textbereiche";
  return "Arbeite am Foto";
}

async function runImageOcr() {
  if (!imageInput || !vocabPairsInput || !ocrStatus) return;
  const file = imageInput.files?.[0];
  if (!file) {
    ocrStatus.textContent = "Waehle zuerst ein Foto aus.";
    return;
  }

  if (!window.Tesseract || typeof window.Tesseract.recognize !== "function") {
    ocrStatus.textContent =
      "Das Lesen aus dem Foto konnte nicht geladen werden. Bitte kurz neu laden.";
    return;
  }

  const languageFallbacks = ["lat+deu+eng", "deu+eng", "eng"];
  let resultText = "";
  let selectedLanguage = "";
  let lastError = null;

  setButtonBusy(ocrFromImageButton, true);
  if (ocrProgress) {
    ocrProgress.value = 0;
    ocrProgress.classList.remove("hidden");
  }
  ocrStatus.textContent = "Ich lese dein Foto...";

  for (const language of languageFallbacks) {
    try {
      ocrStatus.textContent = `Foto wird gelesen (${language})...`;
      const result = await window.Tesseract.recognize(file, language, {
        logger: (message) => {
          if (message.status && typeof message.progress === "number") {
            if (ocrProgress) ocrProgress.value = message.progress;
            ocrStatus.textContent = `${friendlyOcrStatus(message.status)} (${Math.round(
              message.progress * 100
            )}%)`;
          }
        },
      });
      resultText = result?.data?.text || "";
      selectedLanguage = language;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (ocrProgress) ocrProgress.classList.add("hidden");
  setButtonBusy(ocrFromImageButton, false);

  if (!resultText) {
    ocrStatus.textContent =
      "Ich konnte kaum Text erkennen. Probier ein schaerferes Foto oder trag die Woerter unten kurz selbst ein.";
    if (lastError) console.error(lastError);
    return;
  }

  const pairs = parseVocabularyPairsFromText(resultText);
  if (pairs.length === 0) {
    ocrStatus.textContent =
      `Text erkannt (${selectedLanguage}), aber noch keine klaren Wortpaare gefunden. Du kannst unten kurz nachbessern.`;
    vocabPairsInput.value = resultText.trim();
    return;
  }

  vocabPairsInput.value = pairs.map((pair) => `${pair.latin} - ${pair.german}`).join("\n");
  ocrStatus.textContent = `Nice! ${pairs.length} Wortpaare erkannt (${selectedLanguage}). Jetzt auf "In Uebungen & Challenge packen" klicken.`;
}

const denarsStat = document.getElementById("denarsStat");
const streakStat = document.getElementById("streakStat");
const stabilityStat = document.getElementById("stabilityStat");

const tabChallengeButton = document.getElementById("tabChallenge");
const tabPracticeButton = document.getElementById("tabPractice");
const tabDescription = document.getElementById("tabDescription");
const challengePanel = document.getElementById("challengePanel");
const practicePanel = document.getElementById("practicePanel");

const nameInput = document.getElementById("nameInput");
const bookInput = document.getElementById("bookInput");
const lessonInput = document.getElementById("lessonInput");
const sprintWordCount = document.getElementById("sprintWordCount");
const practiceWordCountSelect = document.getElementById("practiceWordCount");
const startSprintButton = document.getElementById("startSprintButton");
const startPracticeButton = document.getElementById("startPracticeButton");

const sprintCard = document.getElementById("sprintCard");
const sprintMeta = document.getElementById("sprintMeta");
const taskContainer = document.getElementById("taskContainer");
const submitAnswerButton = document.getElementById("submitAnswerButton");
const nextTaskButton = document.getElementById("nextTaskButton");

const feedbackCard = document.getElementById("feedbackCard");
const feedbackOutput = document.getElementById("feedbackOutput");

const imageInput = document.getElementById("imageInput");
const vocabPairsInput = document.getElementById("vocabPairsInput");
const importImageVocabButton = document.getElementById("importImageVocabButton");
const ocrFromImageButton = document.getElementById("ocrFromImageButton");
const ocrStatus = document.getElementById("ocrStatus");
const ocrProgress = document.getElementById("ocrProgress");
const imagePreview = document.getElementById("imagePreview");
const importStatus = document.getElementById("importStatus");
const importedList = document.getElementById("importedList");
const lessonPoolHint = document.getElementById("lessonPoolHint");
const runtimeStatus = document.getElementById("runtimeStatus");

const practiceCard = document.getElementById("practiceCard");
const practiceMeta = document.getElementById("practiceMeta");
const practiceTaskContainer = document.getElementById("practiceTaskContainer");
const submitPracticeButton = document.getElementById("submitPracticeButton");
const nextPracticeButton = document.getElementById("nextPracticeButton");
const practiceFeedbackOutput = document.getElementById("practiceFeedbackOutput");

function setRuntimeStatus(message, isError = false) {
  if (!runtimeStatus) return;
  runtimeStatus.textContent = message || "";
  runtimeStatus.style.color = isError ? "#fca5a5" : "";
}

function bindClick(element, handler) {
  if (!element) return;
  element.addEventListener("click", (event) => {
    event.preventDefault();
    Promise.resolve()
      .then(() => handler())
      .catch((error) => {
      console.error(error);
      setRuntimeStatus(
        "Ups, da lief etwas schief. Bitte Seite neu laden (Strg+F5).",
        true
      );
      });
  });
}

bindClick(startSprintButton, startSprint);
bindClick(startPracticeButton, startPractice);
bindClick(submitAnswerButton, gradeCurrentTask);
bindClick(nextTaskButton, nextTask);
bindClick(submitPracticeButton, gradePracticeTask);
bindClick(nextPracticeButton, nextPracticeTask);
bindClick(ocrFromImageButton, runImageOcr);

bindClick(tabChallengeButton, () => {
  state.ui.activeTab = "challenge";
  saveState();
  renderAll();
});
bindClick(tabPracticeButton, () => {
  state.ui.activeTab = "practice";
  saveState();
  renderAll();
});

if (bookInput) {
  bookInput.addEventListener("input", () => {
    updateLessonPoolHint();
    renderImportedList();
  });
}
if (lessonInput) {
  lessonInput.addEventListener("input", () => {
    updateLessonPoolHint();
    renderImportedList();
  });
}

if (imageInput && imagePreview) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) {
      imagePreview.classList.add("hidden");
      imagePreview.removeAttribute("src");
      if (ocrStatus) ocrStatus.textContent = "";
      return;
    }
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.classList.remove("hidden");
    if (ocrStatus) {
      ocrStatus.textContent = "Foto geladen. Wenn du magst: 'Text aus Foto holen'.";
    }
  });
}

bindClick(importImageVocabButton, () => {
  const selectedBook = getSelectedBookName();
  const selectedLesson = getSelectedLessonNumber();
  const lines = vocabPairsInput.value.split("\n");
  const imported = buildImportedVocabulary(lines);
  if (imported.length === 0) {
    importStatus.textContent = "Ich konnte keine gueltigen Zeilen finden. Nutze: Latein - Deutsch";
    return;
  }

  const key = lessonKey(selectedBook, selectedLesson);
  const existing = state.lessonVocabulary[key] || [];
  state.lessonVocabulary[key] = mergeVocabularyEntries(existing, imported);
  state.uploadedVocabulary = mergeVocabularyEntries(state.uploadedVocabulary, imported);
  state.profile.schoolBook = selectedBook;
  state.profile.lesson = selectedLesson;
  importStatus.textContent = `${imported.length} neue Woerter fuer ${selectedBook} Lektion ${selectedLesson} gespeichert (Uebungen + Challenge).`;
  vocabPairsInput.value = "";
  saveState();
  renderAll();
});

if (ocrFromImageButton && (!window.Tesseract || typeof window.Tesseract.recognize !== "function")) {
  ocrFromImageButton.disabled = true;
  if (ocrStatus) {
    ocrStatus.textContent =
      "Foto-Text-Reader ist gerade nicht verfuegbar. Bitte kurz neu laden.";
  }
}

try {
  renderAll();
} catch (error) {
  console.error(error);
  setRuntimeStatus(
    "Die App konnte nicht starten. Bitte Seite neu laden (Strg+F5).",
    true
  );
}
