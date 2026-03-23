-- PostgreSQL Schema fuer die Latein Sprint App
-- Fokus: Trennung von Wortstamm, Endung, Lernfortschritt und Fehlerarten

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'word_type') THEN
    CREATE TYPE word_type AS ENUM ('verb', 'noun', 'adjective', 'other');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'error_type') THEN
    CREATE TYPE error_type AS ENUM ('spelling', 'grammar', 'mixed', 'none');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_phase') THEN
    CREATE TYPE task_phase AS ENUM ('recognition', 'structure', 'production');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'upload_status') THEN
    CREATE TYPE upload_status AS ENUM ('uploaded', 'processing', 'ready', 'failed');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_book TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_book, lesson_number)
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lesson(id) ON DELETE SET NULL,
  lemma TEXT NOT NULL,
  word_stem TEXT NOT NULL,
  word_type word_type NOT NULL,
  meaning_de TEXT NOT NULL,
  audio_url TEXT,
  visual_aid_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grammar_suffixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suffix TEXT NOT NULL,
  function_label TEXT NOT NULL,
  color_code CHAR(7) NOT NULL,
  UNIQUE (suffix, function_label)
);

-- Verknuepft einen Wortstamm mit moeglichen Endungen (morphologische Formen)
CREATE TABLE IF NOT EXISTS vocabulary_form (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vocabulary_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  suffix_id UUID NOT NULL REFERENCES grammar_suffixes(id) ON DELETE RESTRICT,
  full_form TEXT NOT NULL,
  person_label TEXT,
  number_label TEXT,
  tense_label TEXT,
  mood_label TEXT,
  voice_label TEXT,
  UNIQUE (vocabulary_id, suffix_id, full_form)
);

CREATE TABLE IF NOT EXISTS sprint_session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lesson(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sprint_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_session_id UUID NOT NULL REFERENCES sprint_session(id) ON DELETE CASCADE,
  vocabulary_form_id UUID NOT NULL REFERENCES vocabulary_form(id) ON DELETE CASCADE,
  phase task_phase NOT NULL,
  prompt_payload JSONB NOT NULL,
  position_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sprint_session_id, position_index)
);

CREATE TABLE IF NOT EXISTS task_attempt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_task_id UUID NOT NULL REFERENCES sprint_task(id) ON DELETE CASCADE,
  user_input TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  levenshtein_distance INTEGER,
  grammar_correct BOOLEAN,
  spelling_correct BOOLEAN,
  error_type error_type NOT NULL DEFAULT 'none',
  feedback_text TEXT NOT NULL,
  denars_earned INTEGER NOT NULL DEFAULT 0,
  response_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SRS-Status pro Nutzer und Wortform
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  vocabulary_form_id UUID NOT NULL REFERENCES vocabulary_form(id) ON DELETE CASCADE,
  last_seen TIMESTAMPTZ,
  stability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  next_due_at TIMESTAMPTZ,
  last_error_type error_type NOT NULL DEFAULT 'none',
  streak_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, vocabulary_form_id)
);

CREATE TABLE IF NOT EXISTS avatar_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cost_denars INTEGER NOT NULL CHECK (cost_denars >= 0)
);

CREATE TABLE IF NOT EXISTS user_wallet (
  user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
  denars_balance INTEGER NOT NULL DEFAULT 0 CHECK (denars_balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_avatar_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  avatar_item_id UUID NOT NULL REFERENCES avatar_item(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, avatar_item_id)
);

-- Bild-Upload fuer OCR / Aufgaben-Generierung
CREATE TABLE IF NOT EXISTS image_upload (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  status upload_status NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS upload_extraction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_upload_id UUID NOT NULL REFERENCES image_upload(id) ON DELETE CASCADE,
  raw_text TEXT,
  entities JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_upload_id UUID NOT NULL REFERENCES image_upload(id) ON DELETE CASCADE,
  vocabulary_form_id UUID REFERENCES vocabulary_form(id) ON DELETE SET NULL,
  phase task_phase NOT NULL,
  task_payload JSONB NOT NULL,
  confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_due
  ON user_progress (user_id, next_due_at);

CREATE INDEX IF NOT EXISTS idx_task_attempt_error
  ON task_attempt (error_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_task_upload
  ON generated_task (image_upload_id, approved);
