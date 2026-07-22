-- =============================================================================
-- Analytics Seed Data — data within the last 12 months so charts render
-- =============================================================================

USE adoption_system;

-- Additional pets with varied statuses, sexes, ages, and source types
-- Using explicit pet_ids (50-56) to avoid conflicts with existing data
INSERT INTO pets (pet_id, source_type, posted_by_user_id, species, breed_type, breed_detail, name, age_estimate, sex, description, status, location_area, created_by_user_id, updated_by_user_id, created_at) VALUES
(50, 'shelter', NULL, 'dog', 'aspin', 'Aspin (Asong Pinoy)', 'Brownie', '1 year', 'female', 'Friendly female aspin rescued from Barangay Dahican.', 'available', 'Barangay Dahican', 1, 1, '2026-01-10 08:00:00'),
(51, 'shelter', NULL, 'cat', 'puspin', 'Puspin (Pusang Pinoy)', 'Snowball', '2 years', 'female', 'White cat rescued near the church.', 'available', 'Barangay Central', 1, 1, '2026-02-05 09:00:00'),
(52, 'shelter', NULL, 'dog', 'other', 'Labrador Mix', 'Buddy', '6 months', 'male', 'Labrador mix puppy surrendered by owner.', 'available', 'Barangay Don Enrique Lopez', 1, 1, '2026-03-01 10:00:00'),
(53, 'community', 2, 'dog', 'aspin', 'Aspin Mix', 'Aspin', '3 years', 'male', 'Community rescue from Bobon area.', 'available', 'Barangay Bobon', 2, 1, '2026-04-15 14:00:00'),
(54, 'shelter', NULL, 'cat', 'puspin', 'Puspin (Pusang Pinoy)', 'Oreo', '10 months', 'male', 'Black and white kitten.', 'adopted', 'Barangay Badas', 1, 1, '2025-09-01 08:00:00'),
(55, 'shelter', NULL, 'dog', 'other', 'Aspin Mix', 'Tagpi', '4 years', 'female', 'Spotted dog rescued from a construction site.', 'available', 'Barangay Dawan', 1, 1, '2025-08-20 10:00:00'),
(56, 'shelter', NULL, 'cat', 'puspin', 'Puspin Mix', 'Smoky', '5 years', 'male', 'Gray cat with respiratory infection.', 'available', 'Barangay Sainz', 1, 1, '2025-11-10 09:00:00');

-- Health records for the new pets
INSERT INTO health_records (pet_id, medical_history, vaccination_status, heart_rate_bpm, created_by_user_id, last_updated_by) VALUES
(50, 'General checkup — healthy.', 'Vaccinated', 85, 1, 1),
(51, 'Checkup — healthy.', 'Vaccinated', 90, 1, 1),
(52, 'Puppy shots administered.', 'Vaccinated', 100, 1, 1),
(53, 'Dewormed and vaccinated.', 'Vaccinated', 88, 1, 1),
(54, 'Adopted — healthy.', 'Vaccinated', 95, 1, 1),
(55, 'Under treatment for skin infection.', 'Pending', 145, 1, 1),
(56, 'Respiratory infection being treated.', 'Pending', 150, 1, 1);

-- Update existing health records to have varied vaccination statuses and heart rates
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 80 WHERE pet_id = 1;
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 75 WHERE pet_id = 2;
UPDATE health_records SET vaccination_status = 'Pending', heart_rate_bpm = 110 WHERE pet_id = 3;
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 82 WHERE pet_id = 4;
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 78 WHERE pet_id = 5;
UPDATE health_records SET vaccination_status = 'Not Vaccinated', heart_rate_bpm = 95 WHERE pet_id = 6;
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 80 WHERE pet_id = 7;
UPDATE health_records SET vaccination_status = 'Vaccinated', heart_rate_bpm = 85 WHERE pet_id = 8;

-- Adoption applications spread across recent months
INSERT INTO adoption_applications (pet_id, resident_id, status, reason_for_adopting, living_situation, has_other_pets, household_members_count, submitted_at, decided_at, decided_by_admin_id, handover_confirmed_at) VALUES
(50, 2, 'approved', 'I want to adopt Brownie as a companion.', 'House with fenced yard', TRUE, 3, '2025-09-05 10:00:00', '2025-09-10 14:00:00', 1, '2025-09-15 09:00:00'),
(51, 3, 'approved', 'Looking for a cat for my children.', 'Single detached house', FALSE, 4, '2025-10-01 09:00:00', '2025-10-05 10:00:00', 1, '2025-10-10 14:00:00'),
(52, 5, 'approved', 'I have experience with Labradors.', 'House with large yard', TRUE, 4, '2025-11-15 14:00:00', '2025-11-20 10:00:00', 1, '2025-11-25 09:00:00'),
(53, 6, 'pending_review', 'I want to adopt Aspin.', 'Apartment with balcony', FALSE, 2, '2026-06-10 08:00:00', NULL, NULL, NULL),
(5, 5, 'approved', 'Rocky would be a great companion.', 'Farm lot', TRUE, 5, '2025-08-01 10:00:00', '2025-08-05 14:00:00', 1, '2025-08-10 09:00:00'),
(5, 2, 'pet_unavailable', 'Another application was approved first.', 'House with garden', FALSE, 3, '2025-08-02 11:00:00', '2025-08-05 14:01:00', 1, NULL),
(54, 3, 'approved', 'I want to adopt Oreo.', 'House with screened windows', FALSE, 2, '2025-09-20 10:00:00', '2025-09-25 14:00:00', 1, '2025-09-30 09:00:00'),
(55, 6, 'rejected', 'Not enough space for a dog under treatment.', 'Apartment', FALSE, 2, '2026-05-01 09:00:00', '2026-05-10 10:00:00', 1, NULL),
(56, 2, 'pending_review', 'I can give Smoky a quiet home.', 'House with garden', TRUE, 4, '2026-07-01 14:00:00', NULL, NULL, NULL);

-- Animal reports spread across recent months for time-series charts
INSERT INTO animal_reports (resident_id, species, condition_description, photo_url, latitude, longitude, location_area, contact_preference, status, resolution_notes, is_synced, is_valid_for_heatmap, submitted_at, resolved_at) VALUES
(2, 'dog', 'Stray dog near the beach, looks hungry but friendly.', '/uploads/reports/analytics_01.jpg', 6.950000, 126.280000, 'Barangay Dahican', 'Phone call', 'resolved', 'Dog was rescued and brought to shelter.', TRUE, TRUE, '2025-09-10 08:00:00', '2025-09-11 10:00:00'),
(3, 'cat', 'Kitten stuck in a tree near the church.', '/uploads/reports/analytics_02.jpg', 6.951000, 126.215000, 'Barangay Central', 'Text/SMS', 'resolved', 'Kitten rescued and given to a foster family.', TRUE, TRUE, '2025-10-05 14:00:00', '2025-10-05 16:30:00'),
(5, 'dog', 'Injured dog limping near the market.', '/uploads/reports/analytics_03.jpg', 6.953000, 126.218000, 'Barangay Central', 'Phone call', 'resolved', 'Dog captured and brought to vet. Leg sprain treated.', TRUE, TRUE, '2025-11-20 09:00:00', '2025-11-21 11:00:00'),
(6, 'cat', 'Litter of kittens found in a drainage area.', '/uploads/reports/analytics_04.jpg', 6.900000, 126.170000, 'Barangay Bobon', 'Text/SMS', 'resolved', 'All kittens rescued and brought to shelter.', TRUE, TRUE, '2026-01-15 10:00:00', '2026-01-15 14:00:00'),
(2, 'dog', 'Aggressive dog roaming near the school.', '/uploads/reports/analytics_05.jpg', 6.898000, 126.165000, 'Barangay Bobon', 'Phone call', 'in_progress', 'Team dispatched.', TRUE, TRUE, '2026-06-20 08:00:00', NULL),
(5, 'unknown', 'Possible injured animal near the highway.', '/uploads/reports/analytics_06.jpg', 6.870000, 126.230000, 'Barangay Don Martin Marundan', 'Email', 'submitted', NULL, TRUE, TRUE, '2026-07-10 14:00:00', NULL),
(3, 'dog', 'Mother dog with puppies under an abandoned building.', '/uploads/reports/analytics_07.jpg', 6.920000, 126.190000, 'Barangay Dawan', 'Phone call', 'resolved', 'Mother and puppies rescued and placed in foster care.', TRUE, TRUE, '2026-03-05 09:00:00', '2026-03-06 12:00:00'),
(6, 'cat', 'Injured cat found near the port area.', '/uploads/reports/analytics_08.jpg', 6.960000, 126.220000, 'Barangay Central', 'Text/SMS', 'in_progress', 'Rescue team en route.', TRUE, TRUE, '2026-07-15 16:00:00', NULL);
