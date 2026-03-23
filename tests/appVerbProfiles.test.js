const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createDummyElement() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    style: {},
    files: [],
    classList: {
      add() {},
      remove() {},
      toggle() {},
    },
    addEventListener() {},
    querySelectorAll() {
      return [];
    },
    removeAttribute() {},
  };
}

function loadAppContext() {
  const appPath = path.join(__dirname, "..", "site", "app.js");
  const code = fs.readFileSync(appPath, "utf8");
  const elements = new Map();
  const storage = new Map();

  const context = {
    console,
    Math,
    Date,
    JSON,
    Promise,
    setTimeout,
    clearTimeout,
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, createDummyElement());
        return elements.get(id);
      },
    },
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
    },
    alert() {},
    URL: {
      createObjectURL() {
        return "blob:test";
      },
    },
    window: {
      Tesseract: null,
    },
  };

  vm.createContext(context);
  vm.runInContext(code, context, { filename: appPath });
  return context;
}

test("3.-io-Verben werden mit io/it/iunt gebaut", () => {
  const context = loadAppContext();
  const suffixes = Array.from(context.inferSuffixProfileForLemma("capere"), (item) => item.suffix);
  assert.deepEqual(suffixes, ["io", "it", "iunt"]);
});

test("parere wird als 2. Konjugation behandelt", () => {
  const context = loadAppContext();
  const suffixes = Array.from(context.inferSuffixProfileForLemma("parere"), (item) => item.suffix);
  assert.deepEqual(suffixes, ["eo", "et", "ent"]);
});

test("exire nutzt kuratierte irregulaere Formen", () => {
  const context = loadAppContext();
  const entry = context.buildVocabularyEntry({
    id: "irreg-exire",
    lemma: "exire",
    meaning: "hinausgehen",
  });

  assert.equal(entry.stem, "ex");
  assert.deepEqual(
    Array.from(entry.suffixes, (item) => item.suffix),
    ["eo", "it", "eunt"]
  );
  assert.equal(entry.isVerifiedConjugation, true);
});

test("nicht verifiziertes -ere-Verb wird nicht als sicher markiert", () => {
  const context = loadAppContext();
  const entry = context.buildVocabularyEntry({
    id: "unknown-pingere",
    lemma: "pingere",
    meaning: "malen",
  });

  assert.equal(entry.isVerifiedConjugation, false);
});
