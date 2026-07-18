-- Add agreement-acceptance columns to the users table
ALTER TABLE users
  ADD COLUMN agreed_terms     BOOLEAN  NOT NULL DEFAULT FALSE,
  ADD COLUMN agreed_terms_at  DATETIME NULL DEFAULT NULL;
