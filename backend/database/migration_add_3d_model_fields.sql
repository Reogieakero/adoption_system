ALTER TABLE animals
  ADD COLUMN model_3d_url    VARCHAR(500) NULL DEFAULT NULL,
  ADD COLUMN model_3d_status ENUM('none','pending','ready','failed') NOT NULL DEFAULT 'none';
