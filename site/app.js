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
      schoolBook: "Campus C",
      lesson: 7,
    },
    wallet: { denars: 0, streak: 0 },
    progress: {},
    uploadedVocabulary: [],
    activeSprint: null,
  };
}

let state = loadState() || defaultState();

function fullVocabulary() {
  return [...BASE_VOCABULARY, ...state.uploadedVocabulary];
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
  const pool = fullVocabulary();
  if (pool.length < 2) {
    alert("Bitte erst mindestens 2 Woerter im Pool haben.");
    return;
  }

  state.profile.name = nameInput.value.trim() || "Schueler";
  state.profile.schoolBook = bookInput.value.trim() || "Campus C";
  state.profile.lesson = Number(lessonInput.value || 1);

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
  };

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
  if (state.uploadedVocabulary.length === 0) {
    importedList.innerHTML = "<li class='muted'>Noch keine extra Woerter importiert.</li>";
    return;
  }
  importedList.innerHTML = state.uploadedVocabulary
    .map(
      (item) =>
        `<li>${escapeHtml(item.lemma)} - ${escapeHtml(item.meaning)} <span class="muted">(Stamm: ${escapeHtml(item.stem)})</span></li>`
    )
    .join("");
}

function renderAll() {
  denarsStat.textContent = String(state.wallet.denars);
  streakStat.textContent = String(state.wallet.streak);
  stabilityStat.textContent = averageStability().toFixed(2);

  nameInput.value = state.profile.name;
  bookInput.value = state.profile.schoolBook;
  lessonInput.value = String(state.profile.lesson);

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

  return parsed.map((item, index) => {
    const rawLemma = normalize(item.latin);
    let stem = rawLemma;
    if (rawLemma.endsWith("are")) stem = rawLemma.slice(0, -3);
    else if (rawLemma.endsWith("ere")) stem = rawLemma.slice(0, -3);
    else if (rawLemma.endsWith("ire")) stem = rawLemma.slice(0, -3);

    return {
      id: `upload-${Date.now()}-${index}`,
      lemma: rawLemma,
      stem,
      meaning: item.german.toLowerCase(),
      emoji: "🖼️",
      suffixes: [
        { suffix: "o", functionLabel: "1. Pers. Sg. Praesens", colorCode: "#22c55e" },
        { suffix: "t", functionLabel: "3. Pers. Sg. Praesens", colorCode: "#22c55e" },
        { suffix: "unt", functionLabel: "3. Pers. Pl. Praesens", colorCode: "#eab308" },
      ],
    };
  });
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
  ocrStatus.textContent = `Nice! ${pairs.length} Wortpaare erkannt (${selectedLanguage}). Jetzt auf "In Challenge packen" klicken.`;
}

const denarsStat = document.getElementById("denarsStat");
const streakStat = document.getElementById("streakStat");
const stabilityStat = document.getElementById("stabilityStat");

const nameInput = document.getElementById("nameInput");
const bookInput = document.getElementById("bookInput");
const lessonInput = document.getElementById("lessonInput");
const sprintWordCount = document.getElementById("sprintWordCount");
const startSprintButton = document.getElementById("startSprintButton");

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
const runtimeStatus = document.getElementById("runtimeStatus");

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
bindClick(submitAnswerButton, gradeCurrentTask);
bindClick(nextTaskButton, nextTask);
bindClick(ocrFromImageButton, runImageOcr);

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
  const lines = vocabPairsInput.value.split("\n");
  const imported = buildImportedVocabulary(lines);
  if (imported.length === 0) {
    importStatus.textContent = "Ich konnte keine gueltigen Zeilen finden. Nutze: Latein - Deutsch";
    return;
  }

  state.uploadedVocabulary.push(...imported);
  importStatus.textContent = `${imported.length} neue Woerter in deine Challenge gepackt!`;
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
