-- Run this in your Supabase project: Dashboard → SQL Editor → New query

CREATE TABLE contact_submissions (
  id             BIGSERIAL PRIMARY KEY,
  language       TEXT        NOT NULL,
  prenom         TEXT,
  nom            TEXT,
  email          TEXT        NOT NULL,
  etudiant_fr    TEXT,
  pays           TEXT,
  diplome        TEXT,
  niveau         TEXT,
  niveau_detail  TEXT,
  campus         TEXT,
  programme      TEXT,
  message        TEXT,
  rgpd_accept    TEXT        NOT NULL,
  newsletter     TEXT,
  submitted_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Allow the service role (used by the Netlify function) to insert rows.
-- Row Level Security is enabled but the service role bypasses it by default.
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
