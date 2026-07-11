-- ============================================================
-- Paw Connect — Admin domain schema (users table already exists)
-- Run this in HeidiSQL against your paw_connect database
-- ============================================================

USE paw_connect;

-- ----------------------------------------------------------
-- STAFF (from assignedStaff values in adoptions mock)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(150) NOT NULL,
  email       VARCHAR(255) NULL,
  role        VARCHAR(100) NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_staff_full_name (full_name)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- ANIMALS (from animalsData.ts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS animals (
  id                  VARCHAR(20)  PRIMARY KEY,
  name                VARCHAR(100) NOT NULL,
  species             ENUM('Dog', 'Cat') NOT NULL,
  breed               VARCHAR(100) NOT NULL,
  sex                 ENUM('Male', 'Female') NOT NULL,
  age                 VARCHAR(50)  NOT NULL,
  size                ENUM('Small', 'Medium', 'Large') NOT NULL,
  color_markings      VARCHAR(255) NOT NULL,
  rescue_status       ENUM('Reported', 'Rescued', 'In Shelter') NOT NULL,
  adoption_status     ENUM('Available', 'Pending', 'Adopted', 'Unavailable') NOT NULL,
  health_status       ENUM('Healthy', 'Under Treatment', 'Recovering', 'Critical') NOT NULL,
  vaccination_status  ENUM('Vaccinated', 'Not Fully Vaccinated', 'Due', 'Not Vaccinated') NOT NULL,
  heart_rate          VARCHAR(20)  NULL,
  heart_rate_bpm      SMALLINT UNSIGNED NULL,
  location            VARCHAR(200) NOT NULL,
  date_rescued        DATE         NULL,
  date_added          DATE         NOT NULL,
  last_updated        DATE         NOT NULL,
  bio                 TEXT         NOT NULL,
  photo_url           VARCHAR(500) NOT NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_animals_adoption_status (adoption_status),
  INDEX idx_animals_rescue_status   (rescue_status),
  INDEX idx_animals_species         (species),
  INDEX idx_animals_health_status   (health_status)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- ANIMAL HEALTH HISTORY (from health/data.ts history[])
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS animal_health_history (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  animal_id    VARCHAR(20)  NOT NULL,
  event_date   DATE         NOT NULL,
  event_title  VARCHAR(150) NOT NULL,
  notes        TEXT         NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_health_history_animal
    FOREIGN KEY (animal_id) REFERENCES animals(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_health_history_animal (animal_id),
  INDEX idx_health_history_date   (event_date)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- ADOPTION APPLICATIONS (from adoptions/data.ts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS adoption_applications (
  id                    VARCHAR(20)  PRIMARY KEY,
  user_id               INT UNSIGNED NULL,
  applicant_name        VARCHAR(150) NOT NULL,
  applicant_email       VARCHAR(255) NOT NULL,
  animal_id             VARCHAR(20)  NOT NULL,
  application_date      DATE         NOT NULL,
  status                ENUM('Pending', 'Under Review', 'Approved', 'Rejected', 'Adopted') NOT NULL DEFAULT 'Pending',
  assigned_staff_id     INT UNSIGNED NULL,
  assigned_staff_name   VARCHAR(150) NULL,
  created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_applications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_applications_animal
    FOREIGN KEY (animal_id) REFERENCES animals(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_applications_staff
    FOREIGN KEY (assigned_staff_id) REFERENCES staff(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_applications_status (status),
  INDEX idx_applications_date   (application_date),
  INDEX idx_applications_email  (applicant_email)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- APPLICATION DETAIL PROFILE (from ApplicationDetails in types.ts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS adoption_application_profiles (
  application_id              VARCHAR(20) PRIMARY KEY,
  applicant_id                VARCHAR(20)  NOT NULL,
  profile_photo_url           VARCHAR(500) NULL,
  date_of_birth               DATE         NOT NULL,
  age                         TINYINT UNSIGNED NOT NULL,
  sex                         ENUM('Male', 'Female') NOT NULL,
  civil_status                ENUM('Single', 'Married', 'Widowed', 'Separated') NOT NULL,
  nationality                 VARCHAR(50)  NOT NULL,
  mobile_number               VARCHAR(30)  NOT NULL,
  alternate_contact_number    VARCHAR(30)  NULL,
  home_address                VARCHAR(255) NOT NULL,
  barangay                    VARCHAR(100) NOT NULL,
  city_municipality           VARCHAR(100) NOT NULL,
  province                    VARCHAR(100) NOT NULL,
  zip_code                    VARCHAR(10)  NOT NULL,
  gov_id_type                 VARCHAR(50)  NOT NULL,
  gov_id_number               VARCHAR(50)  NULL,
  gov_id_photo_url            VARCHAR(500) NOT NULL,
  occupation                  VARCHAR(100) NOT NULL,
  employer                    VARCHAR(150) NULL,
  monthly_income_range        VARCHAR(50)  NULL,
  residence_type              ENUM('House', 'Apartment', 'Condominium', 'Others') NOT NULL,
  home_ownership              ENUM('Owned', 'Rented') NOT NULL,
  household_members           TINYINT UNSIGNED NOT NULL,
  children                    TINYINT UNSIGNED NOT NULL DEFAULT 0,
  has_existing_pets           BOOLEAN      NOT NULL DEFAULT FALSE,
  existing_pets_count         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  why_adopt                   TEXT         NOT NULL,
  owned_pet_before            TEXT         NOT NULL,
  primary_caregiver           VARCHAR(150) NOT NULL,
  hours_alone                 VARCHAR(50)  NOT NULL,
  can_provide_vet_care        TEXT         NOT NULL,
  household_in_favor          TEXT         NOT NULL,
  has_secure_area             TEXT         NOT NULL,
  preferred_contact_method    VARCHAR(50)  NOT NULL,
  preferred_adoption_date     DATE         NOT NULL,
  emergency_contact_name        VARCHAR(150) NOT NULL,
  emergency_contact_relationship VARCHAR(50) NOT NULL,
  emergency_contact_number    VARCHAR(30)  NOT NULL,
  created_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_profiles_application
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- APPLICATION DOCUMENTS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS adoption_application_documents (
  application_id        VARCHAR(20) PRIMARY KEY,
  government_id_url     VARCHAR(500) NOT NULL,
  proof_of_address_url  VARCHAR(500) NOT NULL,
  proof_of_income_url   VARCHAR(500) NULL,
  other_documents       JSON        NULL,

  CONSTRAINT fk_documents_application
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- RESCUE CASES (from rescues/mockData.ts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS rescue_cases (
  id                    VARCHAR(20)  PRIMARY KEY,
  animal_type           VARCHAR(100) NOT NULL,
  condition_description TEXT         NOT NULL,
  location              TEXT         NOT NULL,
  reporter_name         VARCHAR(150) NOT NULL,
  priority              ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
  stage                 ENUM('New Reports', 'Verified Reports', 'Rescue Operations') NOT NULL,
  reported_at           DATETIME     NOT NULL,
  image_url             VARCHAR(500) NOT NULL,
  latitude              DECIMAL(10, 7) NOT NULL,
  longitude             DECIMAL(10, 7) NOT NULL,
  status                VARCHAR(100) NOT NULL,
  species               VARCHAR(50)  NOT NULL,
  breed                 VARCHAR(100) NOT NULL,
  estimated_age         VARCHAR(50)  NOT NULL,
  sex                   VARCHAR(20)  NOT NULL,
  color_markings        VARCHAR(255) NOT NULL,
  size                  VARCHAR(20)  NOT NULL,
  injuries              TEXT         NOT NULL,
  temperament           TEXT         NOT NULL,
  collar_tag            VARCHAR(100) NOT NULL,
  animals_involved      TINYINT UNSIGNED NOT NULL DEFAULT 1,
  last_seen_at          DATETIME     NULL,
  current_situation     TEXT         NOT NULL,
  barangay              VARCHAR(100) NOT NULL,
  landmarks             TEXT         NOT NULL,
  contact_number        VARCHAR(30)  NOT NULL,
  email                 VARCHAR(255) NOT NULL,
  reporter_type         VARCHAR(50)  NOT NULL,
  is_anonymous          BOOLEAN      NOT NULL DEFAULT FALSE,
  assigned_rescuer      VARCHAR(150) NULL,
  rescue_team           VARCHAR(100) NULL,
  assigned_at           DATETIME     NULL,
  eta                   VARCHAR(50)  NULL,
  dispatch_time         DATETIME     NULL,
  outcome               TEXT         NULL,
  animal_name           VARCHAR(150) NULL,
  incident_description  TEXT         NOT NULL,
  additional_notes      TEXT         NULL,
  operational_status    VARCHAR(50)  NOT NULL,
  verification_status   VARCHAR(100) NOT NULL,
  completion_time       VARCHAR(20)  NULL,
  internal_notes        TEXT         NULL,
  evidence_file_name    VARCHAR(255) NULL,
  linked_animal_id      VARCHAR(20)  NULL,
  created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_rescue_linked_animal
    FOREIGN KEY (linked_animal_id) REFERENCES animals(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_rescue_stage      (stage),
  INDEX idx_rescue_priority   (priority),
  INDEX idx_rescue_reported   (reported_at),
  INDEX idx_rescue_barangay   (barangay)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- RESCUE TIMELINE STEPS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS rescue_case_timeline_steps (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rescue_case_id  VARCHAR(20)  NOT NULL,
  step_order      TINYINT UNSIGNED NOT NULL,
  title           VARCHAR(150) NOT NULL,
  step_timestamp  VARCHAR(100) NOT NULL,
  is_active       BOOLEAN      NOT NULL DEFAULT FALSE,

  CONSTRAINT fk_timeline_rescue_case
    FOREIGN KEY (rescue_case_id) REFERENCES rescue_cases(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY uk_timeline_case_order (rescue_case_id, step_order)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- Optional seed staff from adoptions mock
-- ----------------------------------------------------------
INSERT INTO staff (full_name) VALUES
  ('Elena Rostova'),
  ('Marcus Vance'),
  ('System Risk Engine')
ON DUPLICATE KEY UPDATE full_name = full_name;
