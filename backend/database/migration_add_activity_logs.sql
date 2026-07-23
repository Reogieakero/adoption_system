-- =============================================================================
-- Migration: Add activity_logs table for admin audit trail
-- =============================================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  log_id        INT           NOT NULL AUTO_INCREMENT,
  user_id       INT           NULL COMMENT 'NULL for system-generated events',
  action        VARCHAR(255)  NOT NULL COMMENT 'e.g. Created, Updated, Deleted, Logged In',
  entity_type   VARCHAR(50)   NOT NULL COMMENT 'e.g. Animal, Adoption, User, Settings',
  entity_id     INT           NULL,
  description   TEXT          NULL,
  ip_address    VARCHAR(45)   NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (log_id),
  INDEX idx_al_entity_type (entity_type),
  INDEX idx_al_created_at (created_at),
  INDEX idx_al_user_id (user_id),

  CONSTRAINT fk_al_user
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
