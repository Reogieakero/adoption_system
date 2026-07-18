# Paw Connect — Complete Database Schema

**Database:** `paw_connect`  
**Engine:** MySQL (InnoDB)  

---

## 1. `users`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `first_name` | `VARCHAR(100)` | NOT NULL | |
| `last_name` | `VARCHAR(100)` | NOT NULL | |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE | |
| `password_hash` | `VARCHAR(255)` | NULLABLE | NULL for Google-auth users |
| `is_verified` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | |
| `verification_code` | `VARCHAR(255)` | NULLABLE | Email verification |
| `verification_code_expires` | `DATETIME` | NULLABLE | |
| `provider` | `ENUM('local','google')` | NULLABLE | Auth provider |
| `google_uid` | `VARCHAR(255)` | NULLABLE | Google OAuth ID |
| `role` | `ENUM('Administrator','Rescuer','Adopter','Citizen')` | NOT NULL | |
| `status` | `ENUM('Active','Pending','Suspended')` | NOT NULL | |
| `phone` | `VARCHAR(20)` | NULLABLE | |
| `address` | `VARCHAR(255)` | NULLABLE | |
| `completed_modules` | `INT` | NOT NULL, DEFAULT `0` | Learning modules passed |
| `agreed_terms` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | Migration: `migration_add_agreed_terms.sql` |
| `agreed_terms_at` | `DATETIME` | NULLABLE | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |
| `last_login_at` | `TIMESTAMP` | NULLABLE | |

---

## 2. `staff`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `full_name` | `VARCHAR(150)` | NOT NULL, UNIQUE | |
| `email` | `VARCHAR(255)` | NULLABLE | |
| `role` | `VARCHAR(100)` | NULLABLE | |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `TRUE` | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |

---

## 3. `animals`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `VARCHAR(20)` | PK | e.g., `A001` |
| `name` | `VARCHAR(100)` | NOT NULL | |
| `species` | `ENUM('Dog','Cat')` | NOT NULL | |
| `breed` | `VARCHAR(100)` | NOT NULL | |
| `sex` | `ENUM('Male','Female')` | NOT NULL | |
| `age` | `VARCHAR(50)` | NOT NULL | e.g., `2 years` |
| `size` | `ENUM('Small','Medium','Large')` | NOT NULL | |
| `color_markings` | `VARCHAR(255)` | NOT NULL | |
| `rescue_status` | `ENUM('Reported','Rescued','In Shelter')` | NOT NULL | |
| `adoption_status` | `ENUM('Available','Pending','Adopted','Unavailable')` | NOT NULL | |
| `health_status` | `ENUM('Healthy','Under Treatment','Recovering','Critical')` | NOT NULL | |
| `vaccination_status` | `ENUM('Vaccinated','Not Fully Vaccinated','Due','Not Vaccinated')` | NOT NULL | |
| `heart_rate` | `VARCHAR(20)` | NULLABLE | |
| `heart_rate_bpm` | `SMALLINT UNSIGNED` | NULLABLE | |
| `location` | `VARCHAR(200)` | NOT NULL | |
| `date_rescued` | `DATE` | NULLABLE | |
| `date_added` | `DATE` | NOT NULL | |
| `last_updated` | `DATE` | NOT NULL | |
| `bio` | `TEXT` | NOT NULL | |
| `photo_url` | `VARCHAR(500)` | NOT NULL | |
| `model_3d_url` | `VARCHAR(500)` | NULLABLE | Migration: `migration_add_3d_model_fields.sql` |
| `model_3d_status` | `ENUM('none','pending','ready','failed')` | NOT NULL, DEFAULT `'none'` | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | |

**Indexes:** `adoption_status`, `rescue_status`, `species`, `health_status`

---

## 4. `animal_health_history`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `animal_id` | `VARCHAR(20)` | NOT NULL, FK → `animals(id)` ON DELETE CASCADE | |
| `event_date` | `DATE` | NOT NULL | |
| `event_title` | `VARCHAR(150)` | NOT NULL | |
| `notes` | `TEXT` | NOT NULL | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |

**Indexes:** `animal_id`, `event_date`

---

## 5. `adoption_applications`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `VARCHAR(20)` | PK | e.g., `ADP-001` |
| `user_id` | `INT UNSIGNED` | NULLABLE, FK → `users(id)` ON DELETE SET NULL | |
| `applicant_name` | `VARCHAR(150)` | NOT NULL | |
| `applicant_email` | `VARCHAR(255)` | NOT NULL | |
| `animal_id` | `VARCHAR(20)` | NOT NULL, FK → `animals(id)` ON DELETE RESTRICT | |
| `application_date` | `DATE` | NOT NULL | |
| `status` | `ENUM('Pending','Under Review','Approved','Rejected','Adopted')` | NOT NULL, DEFAULT `'Pending'` | |
| `assigned_staff_id` | `INT UNSIGNED` | NULLABLE, FK → `staff(id)` ON DELETE SET NULL | |
| `assigned_staff_name` | `VARCHAR(150)` | NULLABLE | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | |

**Indexes:** `status`, `application_date`, `applicant_email`

---

## 6. `adoption_application_profiles`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `application_id` | `VARCHAR(20)` | PK, FK → `adoption_applications(id)` ON DELETE CASCADE | |
| `applicant_id` | `VARCHAR(20)` | NOT NULL | |
| `profile_photo_url` | `VARCHAR(500)` | NULLABLE | |
| `date_of_birth` | `DATE` | NOT NULL | |
| `age` | `TINYINT UNSIGNED` | NOT NULL | |
| `sex` | `ENUM('Male','Female')` | NOT NULL | |
| `civil_status` | `ENUM('Single','Married','Widowed','Separated')` | NOT NULL | |
| `nationality` | `VARCHAR(50)` | NOT NULL | |
| `mobile_number` | `VARCHAR(30)` | NOT NULL | |
| `alternate_contact_number` | `VARCHAR(30)` | NULLABLE | |
| `home_address` | `VARCHAR(255)` | NOT NULL | |
| `barangay` | `VARCHAR(100)` | NOT NULL | |
| `city_municipality` | `VARCHAR(100)` | NOT NULL | |
| `province` | `VARCHAR(100)` | NOT NULL | |
| `zip_code` | `VARCHAR(10)` | NOT NULL | |
| `gov_id_type` | `VARCHAR(50)` | NOT NULL | |
| `gov_id_number` | `VARCHAR(50)` | NULLABLE | |
| `gov_id_photo_url` | `VARCHAR(500)` | NOT NULL | |
| `occupation` | `VARCHAR(100)` | NOT NULL | |
| `employer` | `VARCHAR(150)` | NULLABLE | |
| `monthly_income_range` | `VARCHAR(50)` | NULLABLE | |
| `residence_type` | `ENUM('House','Apartment','Condominium','Others')` | NOT NULL | |
| `home_ownership` | `ENUM('Owned','Rented')` | NOT NULL | |
| `household_members` | `TINYINT UNSIGNED` | NOT NULL | |
| `children` | `TINYINT UNSIGNED` | NOT NULL, DEFAULT `0` | Number of children in household |
| `has_existing_pets` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | |
| `existing_pets_count` | `TINYINT UNSIGNED` | NOT NULL, DEFAULT `0` | |
| `why_adopt` | `TEXT` | NOT NULL | |
| `owned_pet_before` | `TEXT` | NOT NULL | |
| `primary_caregiver` | `VARCHAR(150)` | NOT NULL | |
| `hours_alone` | `VARCHAR(50)` | NOT NULL | How many hours pet will be alone |
| `can_provide_vet_care` | `TEXT` | NOT NULL | |
| `household_in_favor` | `TEXT` | NOT NULL | |
| `has_secure_area` | `TEXT` | NOT NULL | |
| `preferred_contact_method` | `VARCHAR(50)` | NOT NULL | |
| `preferred_adoption_date` | `DATE` | NOT NULL | |
| `emergency_contact_name` | `VARCHAR(150)` | NOT NULL | |
| `emergency_contact_relationship` | `VARCHAR(50)` | NOT NULL | |
| `emergency_contact_number` | `VARCHAR(30)` | NOT NULL | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | |

---

## 7. `adoption_application_documents`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `application_id` | `VARCHAR(20)` | PK, FK → `adoption_applications(id)` ON DELETE CASCADE | |
| `government_id_url` | `VARCHAR(500)` | NOT NULL | |
| `proof_of_address_url` | `VARCHAR(500)` | NOT NULL | |
| `proof_of_income_url` | `VARCHAR(500)` | NULLABLE | |
| `other_documents` | `JSON` | NULLABLE | |

---

## 8. `rescue_cases`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `VARCHAR(20)` | PK | e.g., `RES-001` |
| `animal_type` | `VARCHAR(100)` | NOT NULL | |
| `condition_description` | `TEXT` | NOT NULL | |
| `location` | `TEXT` | NOT NULL | |
| `reporter_name` | `VARCHAR(150)` | NOT NULL | |
| `priority` | `ENUM('Critical','High','Medium','Low')` | NOT NULL | |
| `stage` | `ENUM('New Reports','Verified Reports','Rescue Operations')` | NOT NULL | |
| `reported_at` | `DATETIME` | NOT NULL | |
| `image_url` | `VARCHAR(500)` | NOT NULL | |
| `latitude` | `DECIMAL(10,7)` | NOT NULL | |
| `longitude` | `DECIMAL(10,7)` | NOT NULL | |
| `status` | `VARCHAR(100)` | NOT NULL | |
| `species` | `VARCHAR(50)` | NOT NULL | |
| `breed` | `VARCHAR(100)` | NOT NULL | |
| `estimated_age` | `VARCHAR(50)` | NOT NULL | |
| `sex` | `VARCHAR(20)` | NOT NULL | |
| `color_markings` | `VARCHAR(255)` | NOT NULL | |
| `size` | `VARCHAR(20)` | NOT NULL | |
| `injuries` | `TEXT` | NOT NULL | |
| `temperament` | `TEXT` | NOT NULL | |
| `collar_tag` | `VARCHAR(100)` | NOT NULL | |
| `animals_involved` | `TINYINT UNSIGNED` | NOT NULL, DEFAULT `1` | |
| `last_seen_at` | `DATETIME` | NULLABLE | |
| `current_situation` | `TEXT` | NOT NULL | |
| `barangay` | `VARCHAR(100)` | NOT NULL | |
| `landmarks` | `TEXT` | NOT NULL | |
| `contact_number` | `VARCHAR(30)` | NOT NULL | |
| `email` | `VARCHAR(255)` | NOT NULL | |
| `reporter_type` | `VARCHAR(50)` | NOT NULL | |
| `is_anonymous` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | |
| `assigned_rescuer` | `VARCHAR(150)` | NULLABLE | |
| `rescue_team` | `VARCHAR(100)` | NULLABLE | |
| `assigned_at` | `DATETIME` | NULLABLE | |
| `eta` | `VARCHAR(50)` | NULLABLE | |
| `dispatch_time` | `DATETIME` | NULLABLE | |
| `outcome` | `TEXT` | NULLABLE | |
| `animal_name` | `VARCHAR(150)` | NULLABLE | |
| `incident_description` | `TEXT` | NOT NULL | |
| `additional_notes` | `TEXT` | NULLABLE | |
| `operational_status` | `VARCHAR(50)` | NOT NULL | |
| `verification_status` | `VARCHAR(100)` | NOT NULL | |
| `completion_time` | `VARCHAR(20)` | NULLABLE | |
| `internal_notes` | `TEXT` | NULLABLE | |
| `evidence_file_name` | `VARCHAR(255)` | NULLABLE | |
| `linked_animal_id` | `VARCHAR(20)` | NULLABLE, FK → `animals(id)` ON DELETE SET NULL | Links to animal record after rescue |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | |

**Indexes:** `stage`, `priority`, `reported_at`, `barangay`

---

## 9. `rescue_case_timeline_steps`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `rescue_case_id` | `VARCHAR(20)` | NOT NULL, FK → `rescue_cases(id)` ON DELETE CASCADE | |
| `step_order` | `TINYINT UNSIGNED` | NOT NULL | |
| `title` | `VARCHAR(150)` | NOT NULL | |
| `step_timestamp` | `VARCHAR(100)` | NOT NULL | |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | |

**Unique:** `(rescue_case_id, step_order)`

---

## 10. `learning_modules`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `VARCHAR(20)` | PK | e.g., `LM-001` |
| `title` | `VARCHAR(150)` | NOT NULL | |
| `description` | `TEXT` | NOT NULL | |
| `category` | `VARCHAR(50)` | NOT NULL | |
| `difficulty` | `VARCHAR(20)` | NOT NULL | |
| `duration` | `VARCHAR(20)` | NOT NULL | e.g., `10 min` |
| `status` | `VARCHAR(20)` | NOT NULL | |
| `objectives` | `TEXT` | NOT NULL, DEFAULT `''` | |
| `content` | `TEXT` | NOT NULL, DEFAULT `''` | |
| `video_url` | `VARCHAR(500)` | NOT NULL, DEFAULT `''` | |
| `pdf_url` | `VARCHAR(500)` | NOT NULL, DEFAULT `''` | |
| `views` | `INT` | NOT NULL, DEFAULT `0` | |
| `completion_rate` | `VARCHAR(10)` | NOT NULL, DEFAULT `'0%'` | |
| `image_url` | `VARCHAR(500)` | NOT NULL, DEFAULT `''` | |
| `date_added` | `DATE` | NOT NULL | |
| `last_updated` | `DATE` | NOT NULL | |

---

## 11. `notifications`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `type` | `VARCHAR(50)` | NOT NULL | |
| `title` | `VARCHAR(150)` | NOT NULL | |
| `message` | `TEXT` | NOT NULL | |
| `entity_type` | `VARCHAR(50)` | NULLABLE | e.g., `adoption`, `rescue` |
| `entity_id` | `VARCHAR(20)` | NULLABLE | |
| `priority` | `VARCHAR(10)` | NOT NULL, DEFAULT `'normal'` | |
| `is_read` | `BOOLEAN` | NOT NULL, DEFAULT `FALSE` | |
| `read_at` | `DATETIME` | NULLABLE | |
| `created_by` | `INT UNSIGNED` | NULLABLE | |
| `link` | `VARCHAR(500)` | NULLABLE | |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | |

---

## Entity Relationship Summary

```
users ──1:N── adoption_applications
users ──1:N── rescue_cases (via reporter info)

staff ──1:N── adoption_applications (assigned_staff)

animals ──1:N── animal_health_history
animals ──1:1── adoption_applications (via animal_id)
animals ──1:N── rescue_cases (via linked_animal_id)

adoption_applications ──1:1── adoption_application_profiles
adoption_applications ──1:1── adoption_application_documents

rescue_cases ──1:N── rescue_case_timeline_steps
```

## Admin Authentication

Admin login is configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`), **not** a database table.
