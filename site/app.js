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
      "Die Grammatik hast du perfekt verstanden. Beim Stamm ist nur ein kleiner Fehler.";
  } else if (!grammarCorrect && stemDistance === 0) {
    feedback = `Der Stamm ist richtig. Pruefe die Endung "${suffix}" noch einmal.`;
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
      title: "Phase A - Erkennen",
      prompt: `Was bedeutet "${entry.lemma}"?`,
      formKey,
      expectedWord,
      expectedStem: entry.stem,
      expectedSuffix: chosenSuffix.suffix,
      options,
      correctAnswer: entry.meaning,
      helper: `${entry.emoji} Audio + Wort erkannt`,
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
      title: "Phase B - Struktur",
      prompt: `Waehle die passende Endung fuer Stamm "${entry.stem}-"`,
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
    title: "Phase C - Produktion",
    prompt: `Schreibe die Form zu "${entry.lemma}" (${chosenSuffix.functionLabel}).`,
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
    alert("Bitte zuerst mindestens 2 Vokabeln im Pool haben.");
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
      alert("Bitte eine Option auswaehlen.");
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
        ? "Sehr gut! Diese Phase hast du richtig geloest."
        : "Fast. Versuche es noch einmal und achte auf die Struktur.",
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
    alert(`Sprint abgeschlossen! Du hast ${total} Aufgaben geschafft.`);
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
    taskContainer.innerHTML = "<p class='muted'>Starte einen Sprint, um Aufgaben zu sehen.</p>";
    return;
  }

  sprintMeta.textContent = `${state.profile.name} | ${state.profile.schoolBook} Lektion ${state.profile.lesson} | Aufgabe ${sprint.taskIndex + 1}/${sprint.tasks.length}`;

  const colorBadge = `<span class="badge" style="background:${task.colorCode}33;color:#e2e8f0">${task.functionLabel}</span>`;
  if (task.phase === "production") {
    taskContainer.innerHTML = `
      <h3 class="task-title">${task.title} ${colorBadge}</h3>
      <p>${task.prompt}</p>
      <p class="muted">${task.helper}</p>
      <label>
        Deine Antwort
        <input id="productionInput" autocomplete="off" placeholder="z. B. ${task.expectedWord}" />
      </label>
    `;
    return;
  }

  const optionsHtml = task.options
    .map((option) => {
      const active = sprint.selectedOption === option ? "active" : "";
      return `<button class="option-button ${active}" data-option="${option}">${option}</button>`;
    })
    .join("");

  taskContainer.innerHTML = `
    <h3 class="task-title">${task.title} ${colorBadge}</h3>
    <p>${task.prompt}</p>
    <p class="muted">${task.helper}</p>
    <div class="option-grid">${optionsHtml}</div>
  `;

  Array.from(taskContainer.querySelectorAll(".option-button")).forEach((button) => {
    button.addEventListener("click", () => {
      sprint.selectedOption = button.dataset.option;
      saveState();
      renderAll();
    });
  });
}

function renderFeedback() {
  const sprint = state.activeSprint;
  const evaluation = sprint?.lastEvaluation;
  if (!evaluation) {
    feedbackOutput.textContent = "Noch keine Auswertung vorhanden.";
    return;
  }
  feedbackOutput.textContent = JSON.stringify(evaluation, null, 2);
}

function renderImportedList() {
  if (state.uploadedVocabulary.length === 0) {
    importedList.innerHTML = "<li class='muted'>Noch keine importierten Vokabeln.</li>";
    return;
  }
  importedList.innerHTML = state.uploadedVocabulary
    .map((item) => `<li>${item.lemma} - ${item.meaning} <span class="muted">(Stamm: ${item.stem})</span></li>`)
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
    sprintMeta.textContent = "Noch kein Sprint gestartet.";
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
const imagePreview = document.getElementById("imagePreview");
const importStatus = document.getElementById("importStatus");
const importedList = document.getElementById("importedList");

startSprintButton.addEventListener("click", startSprint);
submitAnswerButton.addEventListener("click", gradeCurrentTask);
nextTaskButton.addEventListener("click", nextTask);

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) {
    imagePreview.classList.add("hidden");
    imagePreview.removeAttribute("src");
    return;
  }
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("hidden");
});

importImageVocabButton.addEventListener("click", () => {
  const lines = vocabPairsInput.value.split("\n");
  const imported = buildImportedVocabulary(lines);
  if (imported.length === 0) {
    importStatus.textContent = "Keine gueltigen Zeilen erkannt. Format: Latein - Deutsch";
    return;
  }

  state.uploadedVocabulary.push(...imported);
  importStatus.textContent = `${imported.length} Vokabeln aus dem Bild-Input importiert.`;
  vocabPairsInput.value = "";
  saveState();
  renderAll();
});

renderAll();
