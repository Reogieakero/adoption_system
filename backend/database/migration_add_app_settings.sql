-- Migration: Add app_settings table for system-level key-value settings
-- Run this if you already have the database set up and need the app_settings table.

CREATE TABLE IF NOT EXISTS app_settings (
  setting_key   VARCHAR(100) NOT NULL,
  setting_value TEXT         NOT NULL,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO app_settings (setting_key, setting_value) VALUES
  ('map_location', 'Mati City 8200'),
  ('map_zoom', '12'),
  ('enable_heatmap', 'true'),
  ('module_visibility', 'public'),
  ('allow_quiz_retakes', 'always'),
  ('enable_certificates', 'true'),
  ('enable_reviews', 'true'),
  ('date_format', 'MM/DD/YYYY'),
  ('time_format', '12h'),
  ('time_zone', 'EST'),
  ('session_timeout', '30 minutes'),
  ('enable_2fa', 'false'),
  ('require_strong_passwords', 'true');
