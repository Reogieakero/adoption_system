-- =============================================================================
-- Integrated Animal Adoption and Rescue Management System
-- Database Schema — City of Mati
-- Engine: InnoDB  |  Charset: utf8mb4  |  Target: HeidiSQL / MySQL
-- =============================================================================

CREATE DATABASE IF NOT EXISTS adoption_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE adoption_system;

-- Disable FK checks during DROP phase
SET FOREIGN_KEY_CHECKS = 0;

-- ── Drop all old tables (safe order: dependants first) ──────────────────────
DROP TABLE IF EXISTS report_exports;
DROP TABLE IF EXISTS module_progress;
DROP TABLE IF EXISTS elearning_modules;
DROP TABLE IF EXISTS elearning_categories;
DROP TABLE IF EXISTS notification_preferences;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS message_threads;
DROP TABLE IF EXISTS animal_reports;
DROP TABLE IF EXISTS adoption_applications;
DROP TABLE IF EXISTS health_records;
DROP TABLE IF EXISTS pet_3d_assets;
DROP TABLE IF EXISTS pet_photos;
DROP TABLE IF EXISTS email_verification_codes;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS users;

-- Legacy tables from previous schema (ensure clean slate)
DROP TABLE IF EXISTS rescue_case_timeline_steps;
DROP TABLE IF EXISTS rescue_cases;
DROP TABLE IF EXISTS adoption_application_documents;
DROP TABLE IF EXISTS adoption_application_profiles;
DROP TABLE IF EXISTS animal_health_history;
DROP TABLE IF EXISTS learning_modules;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS staff;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. users
-- =============================================================================
CREATE TABLE users (
  user_id             INT           NOT NULL AUTO_INCREMENT,
  role                ENUM('resident','admin') NOT NULL,
  full_name           VARCHAR(150)  NOT NULL,
  email               VARCHAR(150)  NOT NULL,
  phone_number        VARCHAR(20)   NULL,
  password_hash       VARCHAR(255)  NULL COMMENT 'NULL if created via Google',
  auth_provider       ENUM('local','google') NOT NULL DEFAULT 'local',
  google_id           VARCHAR(255)  NULL,
  google_linked_at    DATETIME      NULL,
  email_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
  status              ENUM('pending_verification','active','suspended') NOT NULL DEFAULT 'pending_verification',
  address             VARCHAR(255)  NULL,
  profile_photo_url   VARCHAR(255)  NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_phone (phone_number),
  UNIQUE KEY uk_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. email_verification_codes
-- =============================================================================
CREATE TABLE email_verification_codes (
  verification_id   INT           NOT NULL AUTO_INCREMENT,
  user_id           INT           NOT NULL,
  code              VARCHAR(6)    NOT NULL,
  purpose           ENUM('registration','password_reset') NOT NULL,
  expires_at        DATETIME      NOT NULL,
  is_used           BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (verification_id),
  CONSTRAINT fk_evc_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. pets
-- =============================================================================
CREATE TABLE pets (
  pet_id              INT           NOT NULL AUTO_INCREMENT,
  source_type         ENUM('shelter','community') NOT NULL,
  posted_by_user_id   INT           NULL COMMENT 'Resident who posted a community listing',
  species             ENUM('dog','cat') NOT NULL,
  breed_type          ENUM('aspin','puspin','other') NOT NULL,
  breed_detail        VARCHAR(100)  NULL,
  name                VARCHAR(100)  NOT NULL,
  age_estimate        VARCHAR(50)   NULL,
  sex                 ENUM('male','female','unknown') NOT NULL,
  description         TEXT          NULL,
  status              ENUM('pending_verification','available','pending','adopted','rejected') NOT NULL,
  rejection_reason    TEXT          NULL,
  location_area       VARCHAR(150)  NULL,
  created_by_user_id  INT           NOT NULL,
  updated_by_user_id  INT           NULL,
  deleted_by_user_id  INT           NULL,
  deleted_at          DATETIME      NULL COMMENT 'Soft delete',
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (pet_id),
  INDEX idx_pets_status (status),
  INDEX idx_pets_species (species),
  INDEX idx_pets_breed_type (breed_type),

  CONSTRAINT fk_pets_posted_by
    FOREIGN KEY (posted_by_user_id) REFERENCES users (user_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_pets_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pets_updated_by
    FOREIGN KEY (updated_by_user_id) REFERENCES users (user_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_pets_deleted_by
    FOREIGN KEY (deleted_by_user_id) REFERENCES users (user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4. pet_photos
-- =============================================================================
CREATE TABLE pet_photos (
  photo_id      INT           NOT NULL AUTO_INCREMENT,
  pet_id        INT           NOT NULL,
  file_url      VARCHAR(255)  NOT NULL,
  is_primary    BOOLEAN       NOT NULL DEFAULT FALSE,
  uploaded_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (photo_id),
  INDEX idx_pet_photos_pet_id (pet_id),

  CONSTRAINT fk_photos_pet
    FOREIGN KEY (pet_id) REFERENCES pets (pet_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. pet_3d_assets
-- =============================================================================
CREATE TABLE pet_3d_assets (
  asset_id      INT           NOT NULL AUTO_INCREMENT,
  pet_id        INT           NOT NULL,
  asset_url     VARCHAR(255)  NOT NULL,
  asset_type    ENUM('model_3d','360_view') NOT NULL,
  uploaded_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (asset_id),
  UNIQUE KEY uk_3d_asset_pet (pet_id),

  CONSTRAINT fk_3d_asset_pet
    FOREIGN KEY (pet_id) REFERENCES pets (pet_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6. health_records
-- =============================================================================
CREATE TABLE health_records (
  record_id             INT           NOT NULL AUTO_INCREMENT,
  pet_id                INT           NOT NULL,
  medical_history       TEXT          NULL,
  vaccination_status    TEXT          NULL,
  heart_rate_bpm        INT           NULL COMMENT 'Reserved — unused in current phase',
  created_by_user_id    INT           NOT NULL,
  last_updated_by       INT           NOT NULL,
  created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (record_id),
  UNIQUE KEY uk_health_record_pet (pet_id),

  CONSTRAINT fk_health_pet
    FOREIGN KEY (pet_id) REFERENCES pets (pet_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_health_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_health_updated_by
    FOREIGN KEY (last_updated_by) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 7. adoption_applications
-- =============================================================================
CREATE TABLE adoption_applications (
  application_id        INT           NOT NULL AUTO_INCREMENT,
  pet_id                INT           NOT NULL,
  resident_id           INT           NOT NULL,
  status                ENUM('pending_review','approved','rejected','pet_unavailable') NOT NULL DEFAULT 'pending_review',
  rejection_reason      TEXT          NULL,
  reason_for_adopting   TEXT          NULL,
  living_situation      VARCHAR(100)  NULL,
  has_other_pets        BOOLEAN       NULL,
  household_members_count INT         NULL,
  additional_notes      TEXT          NULL,
  submitted_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at            DATETIME      NULL,
  decided_by_admin_id   INT           NULL,
  handover_confirmed_at DATETIME      NULL,
  updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (application_id),
  INDEX idx_adoption_status (status),
  INDEX idx_adoption_pet (pet_id),
  INDEX idx_adoption_resident (resident_id),

  CONSTRAINT fk_adoption_pet
    FOREIGN KEY (pet_id) REFERENCES pets (pet_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_adoption_resident
    FOREIGN KEY (resident_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_adoption_decided_by
    FOREIGN KEY (decided_by_admin_id) REFERENCES users (user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 8. animal_reports
-- =============================================================================
CREATE TABLE animal_reports (
  report_id             INT           NOT NULL AUTO_INCREMENT,
  resident_id           INT           NOT NULL,
  species               ENUM('dog','cat','unknown') NOT NULL,
  condition_description TEXT          NOT NULL,
  photo_url             VARCHAR(255)  NOT NULL,
  latitude              DECIMAL(9,6)  NOT NULL,
  longitude             DECIMAL(9,6)  NOT NULL,
  location_area         VARCHAR(150)  NULL,
  contact_preference    VARCHAR(100)  NULL,
  status                ENUM('submitted','in_progress','resolved') NOT NULL DEFAULT 'submitted',
  resolution_notes      TEXT          NULL,
  is_synced             BOOLEAN       NOT NULL DEFAULT TRUE,
  is_valid_for_heatmap  BOOLEAN       NOT NULL DEFAULT TRUE,
  submitted_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at           DATETIME      NULL,
  updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (report_id),
  INDEX idx_reports_status (status),
  INDEX idx_reports_species (species),

  CONSTRAINT fk_report_resident
    FOREIGN KEY (resident_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 9. message_threads
-- =============================================================================
CREATE TABLE message_threads (
  thread_id     INT           NOT NULL AUTO_INCREMENT,
  linked_type   ENUM('adoption_application','animal_report') NOT NULL,
  linked_id     INT           NOT NULL COMMENT 'FK to adoption_applications.application_id or animal_reports.report_id',
  resident_id   INT           NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (thread_id),
  INDEX idx_threads_linked (linked_type, linked_id),

  CONSTRAINT fk_thread_resident
    FOREIGN KEY (resident_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10. messages
-- =============================================================================
CREATE TABLE messages (
  message_id    INT           NOT NULL AUTO_INCREMENT,
  thread_id     INT           NOT NULL,
  sender_id     INT           NOT NULL,
  message_text  TEXT          NULL,
  photo_url     VARCHAR(255)  NULL,
  is_read       BOOLEAN       NOT NULL DEFAULT FALSE,
  sent_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (message_id),
  INDEX idx_messages_thread (thread_id),

  CONSTRAINT fk_msg_thread
    FOREIGN KEY (thread_id) REFERENCES message_threads (thread_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_msg_sender
    FOREIGN KEY (sender_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT chk_msg_content CHECK (
    message_text IS NOT NULL OR photo_url IS NOT NULL
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 11. notifications
-- =============================================================================
CREATE TABLE notifications (
  notification_id INT           NOT NULL AUTO_INCREMENT,
  recipient_id    INT           NOT NULL,
  type            ENUM('adoption_status','report_status','new_message','new_report','new_community_listing','new_application') NOT NULL,
  linked_type     ENUM('adoption_application','animal_report','pet','message_thread') NULL,
  linked_id       INT           NULL,
  message_text    VARCHAR(255)  NOT NULL,
  is_read         BOOLEAN       NOT NULL DEFAULT FALSE,
  is_emailed      BOOLEAN       NOT NULL DEFAULT FALSE,
  emailed_at      DATETIME      NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (notification_id),
  INDEX idx_notifications_recipient (recipient_id),
  INDEX idx_notifications_type (type),

  CONSTRAINT fk_notif_recipient
    FOREIGN KEY (recipient_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 12. notification_preferences
-- =============================================================================
CREATE TABLE notification_preferences (
  preference_id     INT           NOT NULL AUTO_INCREMENT,
  user_id           INT           NOT NULL,
  notification_type ENUM('adoption_status','report_status','new_message','new_report','new_community_listing','new_application') NOT NULL,
  in_app_enabled    BOOLEAN       NOT NULL DEFAULT TRUE,
  email_enabled     BOOLEAN       NOT NULL DEFAULT TRUE,

  PRIMARY KEY (preference_id),
  UNIQUE KEY uk_notif_pref_user_type (user_id, notification_type),

  CONSTRAINT fk_notif_pref_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 13. elearning_categories
-- =============================================================================
CREATE TABLE elearning_categories (
  category_id   INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  description   TEXT          NULL,
  order_index   INT           NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 14. elearning_modules
-- =============================================================================
CREATE TABLE elearning_modules (
  module_id           INT           NOT NULL AUTO_INCREMENT,
  category_id         INT           NOT NULL,
  title               VARCHAR(150)  NOT NULL,
  description         TEXT          NULL,
  content_body        TEXT          NOT NULL,
  video_url           VARCHAR(255)  NULL,
  cover_image_url     VARCHAR(255)  NULL,
  order_index         INT           NOT NULL,
  status              ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_by_admin_id INT           NOT NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (module_id),
  INDEX idx_em_category (category_id),
  INDEX idx_em_status (status),

  CONSTRAINT fk_em_category
    FOREIGN KEY (category_id) REFERENCES elearning_categories (category_id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_em_created_by
    FOREIGN KEY (created_by_admin_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 15. module_progress
-- =============================================================================
CREATE TABLE module_progress (
  progress_id    INT           NOT NULL AUTO_INCREMENT,
  module_id      INT           NOT NULL,
  resident_id    INT           NOT NULL,
  status         ENUM('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  started_at     DATETIME      NULL,
  completed_at   DATETIME      NULL,

  PRIMARY KEY (progress_id),
  UNIQUE KEY uk_progress_module_resident (module_id, resident_id),

  CONSTRAINT fk_progress_module
    FOREIGN KEY (module_id) REFERENCES elearning_modules (module_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progress_resident
    FOREIGN KEY (resident_id) REFERENCES users (user_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 16. report_exports
-- =============================================================================
CREATE TABLE report_exports (
  export_id             INT           NOT NULL AUTO_INCREMENT,
  requested_by_admin_id INT           NOT NULL,
  export_type           ENUM('adoption_trends','rescue_efficiency','geographic_distribution') NOT NULL,
  format                ENUM('csv','pdf') NOT NULL,
  date_range_start      DATE          NOT NULL,
  date_range_end        DATE          NOT NULL,
  generated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (export_id),

  CONSTRAINT fk_export_admin
    FOREIGN KEY (requested_by_admin_id) REFERENCES users (user_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
