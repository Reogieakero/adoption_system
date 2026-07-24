-- =============================================================================
-- Seed Data — Integrated Animal Adoption and Rescue Management System
-- City of Mati
-- =============================================================================

USE adoption_system;

SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data in dependency-safe order
TRUNCATE TABLE report_exports;
TRUNCATE TABLE module_progress;
TRUNCATE TABLE elearning_modules;
TRUNCATE TABLE elearning_categories;
TRUNCATE TABLE notification_preferences;
TRUNCATE TABLE notifications;
TRUNCATE TABLE messages;
TRUNCATE TABLE message_threads;
TRUNCATE TABLE animal_reports;
TRUNCATE TABLE adoption_applications;
TRUNCATE TABLE health_records;
TRUNCATE TABLE pet_3d_assets;
TRUNCATE TABLE pet_photos;
TRUNCATE TABLE email_verification_codes;
TRUNCATE TABLE pets;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. users
-- =============================================================================
-- Passwords below are bcrypt hashes of "AdoptMati2024!" for local accounts.
-- Admin account
INSERT INTO users (user_id, role, full_name, email, phone_number, password_hash, auth_provider, google_id, google_linked_at, email_verified, status, address, profile_photo_url, created_at) VALUES
(1, 'admin', 'Maria Concepcion Santos', 'admin@matirescue.ph', '09171230001', '$2b$10$dGzVk5YsXwYGBcYJHj5Kce.MH5HR5HR5HR5HR5HR5HR5HR5HR5H', 'local', NULL, NULL, TRUE, 'active', '123 Rizal St., Barangay Central, Mati City', '/uploads/profiles/admin.jpg', '2025-01-01 08:00:00');

-- Resident accounts — mix of auth_provider, statuses
INSERT INTO users (user_id, role, full_name, email, phone_number, password_hash, auth_provider, google_id, google_linked_at, email_verified, status, address, profile_photo_url, created_at) VALUES
(2, 'resident', 'Ana Dela Cruz', 'ana.delacruz@gmail.com', '09171230002', '$2b$10$dGzVk5YsXwYGBcYJHj5Kce.MH5HR5HR5HR5HR5HR5HR5HR5HR5H', 'local', NULL, NULL, TRUE, 'active', '45 Mabini St., Barangay Dahican, Mati City', '/uploads/profiles/ana.jpg', '2025-01-15 09:30:00'),
(3, 'resident', 'Ramil Bacus', 'ramil.bacus@gmail.com', '09171230003', '$2b$10$dGzVk5YsXwYGBcYJHj5Kce.MH5HR5HR5HR5HR5HR5HR5HR5HR5H', 'local', NULL, NULL, TRUE, 'active', '88 Quezon Ave., Barangay Central, Mati City', NULL, '2025-02-01 10:00:00'),
(4, 'resident', 'Liza Fernandez', 'liza.fernandez@yahoo.com', '09171230004', '$2b$10$dGzVk5YsXwYGBcYJHj5Kce.MH5HR5HR5HR5HR5HR5HR5HR5HR5H', 'local', NULL, NULL, FALSE, 'pending_verification', '22 Mabuhay St., Barangay Bobon, Mati City', NULL, '2025-06-10 14:20:00'),
(5, 'resident', 'Carlo Mendoza', 'carlo.mendoza@gmail.com', '09171230005', NULL, 'google', 'google_uid_abc123def456', '2025-03-01 11:00:00', TRUE, 'active', '7 Sunset Blvd., Barangay Dahican, Mati City', '/uploads/profiles/carlo.jpg', '2025-03-01 11:00:00'),
(6, 'resident', 'Jennifer Reyes', 'jennifer.reyes@gmail.com', '09171230006', NULL, 'google', 'google_uid_ghi789jkl012', '2025-04-10 08:15:00', TRUE, 'active', '12 Banawe St., Barangay Dawan, Mati City', NULL, '2025-04-10 08:15:00'),
(7, 'resident', 'Pedro Lim', 'pedro.lim@yahoo.com', '09171230007', '$2b$10$dGzVk5YsXwYGBcYJHj5Kce.MH5HR5HR5HR5HR5HR5HR5HR5HR5H', 'local', NULL, NULL, TRUE, 'suspended', '99 Rizal Ave., Barangay Sainz, Mati City', NULL, '2025-02-20 16:00:00');

-- =============================================================================
-- 2. email_verification_codes
-- =============================================================================
INSERT INTO email_verification_codes (verification_id, user_id, code, purpose, expires_at, is_used, created_at) VALUES
(1, 4, '48291', 'registration', '2025-06-17 14:20:00', FALSE, '2025-06-10 14:20:00'),
(2, 3, '71563', 'password_reset', '2025-05-01 10:00:00', TRUE, '2025-04-30 10:00:00');

-- =============================================================================
-- 3. pets
-- =============================================================================
INSERT INTO pets (pet_id, source_type, posted_by_user_id, species, breed_type, breed_detail, name, age_estimate, sex, description, status, rejection_reason, location_area, created_by_user_id, updated_by_user_id, deleted_by_user_id, deleted_at, created_at) VALUES
(1, 'shelter', NULL, 'dog', 'aspin', 'Aspin (Asong Pinoy)', 'Bantay', '2 years', 'male', 'Friendly brown dog found wandering near Dahican Beach. Food-motivated and good with people.', 'available', NULL, 'Barangay Dahican', 1, 1, NULL, NULL, '2025-01-05 08:00:00'),
(2, 'shelter', NULL, 'cat', 'puspin', 'Puspin (Pusang Pinoy)', 'Mingming', '1 year', 'female', 'Gray tabby cat rescued as a stray kitten behind Mati public market. Sweet and cuddly.', 'adopted', NULL, 'Barangay Central', 1, 1, NULL, NULL, '2025-01-10 09:00:00'),
(3, 'shelter', NULL, 'dog', 'other', 'Shih Tzu Mix', 'Duke', '4 years', 'male', 'Surrendered by owner who could no longer care for him. Recovering from mange.', 'pending', NULL, 'Barangay Badas', 1, 1, NULL, NULL, '2025-02-01 10:00:00'),
(4, 'shelter', NULL, 'cat', 'puspin', 'Puspin (Pusang Pinoy)', 'Luna', '3 years', 'female', 'Calm, affectionate black cat with white paws. Rescued from a flooded sitio.', 'adopted', NULL, 'Barangay Sainz', 1, 1, NULL, NULL, '2025-01-20 11:00:00'),
(5, 'shelter', NULL, 'dog', 'aspin', 'Aspin (Asong Pinoy)', 'Rocky', '5 years', 'male', 'Loyal former stray who guarded a sari-sari store. Black and tan coat.', 'available', NULL, 'Barangay Tagabakid', 1, 1, NULL, NULL, '2025-02-15 08:30:00'),
(6, 'community', 2, 'dog', 'aspin', 'Aspin Puppy Mix', 'Chikoy', '4 months', 'male', 'Brindle-coated puppy from a litter found near a construction site. Playful and curious.', 'pending_verification', NULL, 'Barangay Don Enrique Lopez', 2, NULL, NULL, NULL, '2025-06-01 14:00:00'),
(7, 'shelter', NULL, 'cat', 'puspin', 'Puspin (Pusang Pinoy)', 'Mochi', '8 months', 'female', 'White and orange calico with striking green eyes. Found near Mati port area.', 'rejected', 'Has a pre-existing medical condition requiring ongoing expensive treatment beyond shelter capacity.', 'Barangay Central', 1, 1, NULL, NULL, '2025-03-01 09:00:00'),
(8, 'community', 5, 'dog', 'other', 'Golden Retriever', 'Max', '3 years', 'male', 'Friendly golden retriever found wandering near Dahican Beach. Wearing a collar but no tags.', 'available', NULL, 'Barangay Dahican', 5, 1, NULL, NULL, '2025-05-15 10:00:00');

-- =============================================================================
-- 4. pet_photos (1–3 per pet, one is_primary per pet)
-- =============================================================================
INSERT INTO pet_photos (photo_id, pet_id, file_url, is_primary, uploaded_at) VALUES
-- Bantay (pet 1) — 2 photos
(1, 1, '/uploads/pets/bantay_01.jpg', TRUE, '2025-01-05 08:00:00'),
(2, 1, '/uploads/pets/bantay_02.jpg', FALSE, '2025-01-05 08:05:00'),
-- Mingming (pet 2) — 2 photos
(3, 2, '/uploads/pets/mingming_01.jpg', TRUE, '2025-01-10 09:00:00'),
(4, 2, '/uploads/pets/mingming_02.jpg', FALSE, '2025-01-10 09:05:00'),
-- Duke (pet 3) — 3 photos
(5, 3, '/uploads/pets/duke_01.jpg', TRUE, '2025-02-01 10:00:00'),
(6, 3, '/uploads/pets/duke_02.jpg', FALSE, '2025-02-01 10:05:00'),
(7, 3, '/uploads/pets/duke_03.jpg', FALSE, '2025-02-01 10:10:00'),
-- Luna (pet 4) — 1 photo
(8, 4, '/uploads/pets/luna_01.jpg', TRUE, '2025-01-20 11:00:00'),
-- Rocky (pet 5) — 2 photos
(9, 5, '/uploads/pets/rocky_01.jpg', TRUE, '2025-02-15 08:30:00'),
(10, 5, '/uploads/pets/rocky_02.jpg', FALSE, '2025-02-15 08:35:00'),
-- Chikoy (pet 6) — 1 photo
(11, 6, '/uploads/pets/chikoy_01.jpg', TRUE, '2025-06-01 14:00:00'),
-- Mochi (pet 7) — 1 photo
(12, 7, '/uploads/pets/mochi_01.jpg', TRUE, '2025-03-01 09:00:00'),
-- Max (pet 8) — 2 photos
(13, 8, '/uploads/pets/max_01.jpg', TRUE, '2025-05-15 10:00:00'),
(14, 8, '/uploads/pets/max_02.jpg', FALSE, '2025-05-15 10:05:00');

-- =============================================================================
-- 5. pet_3d_assets — at least 1 pet with a 3D asset
-- =============================================================================
INSERT INTO pet_3d_assets (asset_id, pet_id, asset_url, asset_type, uploaded_at) VALUES
(1, 1, '/uploads/models/3d-bantay-2025-01-10.glb', 'model_3d', '2025-01-10 12:00:00');

-- =============================================================================
-- 6. health_records — one per pet, heart_rate_bpm left NULL
-- =============================================================================
INSERT INTO health_records (record_id, pet_id, medical_history, vaccination_status, heart_rate_bpm, health_status, created_by_user_id, last_updated_by) VALUES
(1, 1, 'Initial checkup 2025-01-05: No parasites found, dewormed. Vaccination 2025-01-15: Core vaccines administered.', 'Core vaccines complete (5-in-1, rabies). Booster due 2026-01-15.', NULL, 'Healthy', 1, 1),
(2, 2, '2025-01-12: Spay surgery performed successfully. Recovered within a week.', 'Fully vaccinated (FVRCP, rabies).', NULL, 'Healthy', 1, 1),
(3, 3, '2025-02-01: Diagnosed with sarcoptic mange. Started medicated baths and oral ivermectin. 2025-02-15: Follow-up — skin improving, continuing treatment.', 'Initial deworming done. Core vaccines pending until skin condition resolves.', NULL, 'Under Treatment', 1, 1),
(4, 4, '2025-01-22: No major health issues found. Minor upper respiratory infection treated with antibiotics.', 'Fully vaccinated (FVRCP, rabies).', NULL, 'Recovering', 1, 1),
(5, 5, '2025-02-16: Tick infestation treated. Dewormed. Overall healthy.', 'Core vaccines complete (5-in-1, rabies).', NULL, 'Healthy', 1, 1),
(6, 6, '2025-06-01: Underweight on intake. Started high-calorie nutrition plan.', 'Not yet vaccinated — too young. Scheduled for first shots at 4 months.', NULL, 'Under Treatment', 2, 2),
(7, 7, '2025-03-02: Diagnosed with chronic kidney disease (early stage). Needs special diet and regular monitoring.', 'Fully vaccinated prior to intake.', NULL, 'Critical', 1, 1),
(8, 8, '2025-05-16: General checkup — healthy. No microchip found.', 'Vaccination status unknown. Core vaccines administered on intake.', NULL, 'Healthy', 5, 1);

-- =============================================================================
-- 7. adoption_applications — all 4 statuses, with pet_unavailable scenario
-- =============================================================================
-- Pet 4 (Luna) is adopted → approval for application 1, pet_unavailable for application 2
INSERT INTO adoption_applications (application_id, pet_id, resident_id, status, rejection_reason, reason_for_adopting, living_situation, has_other_pets, household_members_count, additional_notes, submitted_at, decided_at, decided_by_admin_id, handover_confirmed_at) VALUES
(1, 4, 3, 'approved', NULL, 'I have a quiet home and want to give Luna a loving forever home.', 'Single detached house with fenced yard', FALSE, 3, NULL, '2025-02-01 10:00:00', '2025-02-05 14:00:00', 1, '2025-02-10 09:00:00'),
-- Same pet (4) → auto pet_unavailable when application 1 was approved
(2, 4, 2, 'pet_unavailable', 'Another application was approved for this pet first.', 'We love cats and have space for one more.', 'Apartment with screened balcony', TRUE, 4, 'We currently have one cat.', '2025-02-03 11:00:00', '2025-02-05 14:01:00', 1, NULL),
-- Pet 2 (Mingming) is adopted
(3, 2, 2, 'approved', NULL, 'I want a companion for my elderly mother.', 'House with garden', FALSE, 2, NULL, '2025-01-20 09:00:00', '2025-01-25 10:00:00', 1, '2025-01-30 14:00:00'),
-- Pet 1 (Bantay) — pending_review
(4, 1, 5, 'pending_review', NULL, 'I have a large property and need a guard dog. Bantay seems perfect.', 'Farm lot with caretaker house', TRUE, 5, 'I have 2 other dogs already.', '2025-06-05 14:00:00', NULL, NULL, NULL),
-- Pet 5 (Rocky) — rejected
(5, 5, 4, 'rejected', 'Application incomplete: did not provide required proof of address and did not respond to follow-up requests.', 'I want to adopt a dog for my family.', 'Rented apartment', FALSE, 4, NULL, '2025-04-01 08:00:00', '2025-04-10 09:00:00', 1, NULL),
-- Pet 8 (Max) — pending_review
(6, 8, 6, 'pending_review', NULL, 'I have a Golden Retriever experience and a large fenced yard.', 'House with large fenced yard', TRUE, 4, 'I currently have a 5-year-old Golden Retriever.', '2025-06-12 10:00:00', NULL, NULL, NULL);

-- =============================================================================
-- 8. animal_reports — all 3 statuses, one is_valid_for_heatmap=FALSE
-- =============================================================================
INSERT INTO animal_reports (report_id, resident_id, species, condition_description, photo_url, latitude, longitude, location_area, contact_preference, status, resolution_notes, is_synced, is_valid_for_heatmap, submitted_at, resolved_at) VALUES
(1, 2, 'dog', 'Stray dog with visible limp on left hind leg. Seen near Dahican Beach shoreline. Brown color, medium-sized.', '/uploads/reports/report_01.jpg', 6.948056, 126.275833, 'Barangay Dahican', 'Phone call', 'resolved', 'Animal was located and brought to shelter. Diagnosed with minor sprain — fully recovered.', TRUE, TRUE, '2025-01-02 14:30:00', '2025-01-04 10:00:00'),
(2, 3, 'cat', 'Kitten stuck in a drainage pipe along Rizal Avenue near the public market. Crying loudly.', '/uploads/reports/report_02.jpg', 6.950000, 126.216667, 'Barangay Central', 'Text/SMS', 'resolved', 'Rescued kitten from pipe. Clean bill of health, now available for adoption.', TRUE, TRUE, '2025-02-10 08:00:00', '2025-02-10 10:30:00'),
(3, 5, 'dog', 'Aggressive stray dog roaming near the elementary school in Barangay Bobon. Multiple residents concerned.', '/uploads/reports/report_03.jpg', 6.899722, 126.168889, 'Barangay Bobon', 'Phone call', 'in_progress', 'Team dispatched to locate the animal. Area being monitored.', TRUE, TRUE, '2025-06-08 09:00:00', NULL),
(4, 6, 'cat', 'Litter of 4 kittens found abandoned behind the public market in a cardboard box. Approximately 3-4 weeks old.', '/uploads/reports/report_04.jpg', 6.952778, 126.218333, 'Barangay Central', 'Text/SMS', 'submitted', NULL, TRUE, TRUE, '2025-06-15 16:45:00', NULL),
(5, 2, 'unknown', 'Possible injured animal spotted along the highway near Barangay Don Martin Marundan. Could not get close enough to identify species.', '/uploads/reports/report_05.jpg', 6.867500, 126.226389, 'Barangay Don Martin Marundan', 'Email', 'resolved', 'Investigated area — no animal found. Likely a false alarm or animal moved on.', TRUE, FALSE, '2025-05-20 07:30:00', '2025-05-21 08:00:00');

-- =============================================================================
-- 9. message_threads
-- =============================================================================
INSERT INTO message_threads (thread_id, linked_type, linked_id, resident_id, created_at) VALUES
(1, 'adoption_application', 4, 5, '2025-06-05 14:00:00'),
(2, 'animal_report', 3, 5, '2025-06-08 09:00:00');

-- =============================================================================
-- 10. messages — 3+ per thread, including at least one photo-only message
-- =============================================================================
INSERT INTO messages (message_id, thread_id, sender_id, message_text, photo_url, is_read, sent_at) VALUES
-- Thread 1 (adoption application for Bantay)
(1, 1, 5, 'Hi, I would like to follow up on my application to adopt Bantay. Is there any update?', NULL, TRUE, '2025-06-06 10:00:00'),
(2, 1, 1, 'Hello Carlo! Your application is under review. We will get back to you as soon as possible.', NULL, TRUE, '2025-06-06 14:00:00'),
(3, 1, 5, NULL, '/uploads/messages/bantay_my_yard.jpg', TRUE, '2025-06-07 09:00:00'),
(4, 1, 5, 'Here is a photo of my yard where Bantay would stay. It is fully fenced.', NULL, TRUE, '2025-06-07 09:05:00'),
(5, 1, 1, 'Thank you for the photo. The yard looks great! We will include it in your application file.', NULL, TRUE, '2025-06-07 11:00:00'),
(6, 1, 1, 'We will schedule a home visit soon to finalize the process.', NULL, FALSE, '2025-06-14 08:30:00'),

-- Thread 2 (animal report about aggressive dog in Bobon)
(7, 2, 5, 'I reported an aggressive dog near the Bobon elementary school. Have your teams been able to locate it?', NULL, TRUE, '2025-06-08 16:00:00'),
(8, 2, 1, 'Yes, we have received your report. A team has been dispatched to monitor the area.', NULL, TRUE, '2025-06-09 08:00:00'),
(9, 2, 1, NULL, '/uploads/messages/team_bobon_patrol.jpg', TRUE, '2025-06-09 08:05:00'),
(10, 2, 5, 'Thank you for the quick response. Please keep me updated on the situation.', NULL, FALSE, '2025-06-09 10:00:00');

-- =============================================================================
-- 11. notifications — at least 5, multiple types, mix of read/emailed
-- =============================================================================
INSERT INTO notifications (notification_id, recipient_id, type, linked_type, linked_id, message_text, is_read, is_emailed, emailed_at, created_at) VALUES
(1, 2, 'adoption_status', 'adoption_application', 3, 'Your adoption application for Mingming has been approved!', TRUE, TRUE, '2025-01-25 10:00:00', '2025-01-25 10:00:00'),
(2, 4, 'adoption_status', 'adoption_application', 5, 'Your adoption application for Rocky has been rejected. See details.', TRUE, TRUE, '2025-04-10 09:00:00', '2025-04-10 09:00:00'),
(3, 1, 'new_report', 'animal_report', 3, 'A new animal report has been submitted in Barangay Bobon (aggressive dog).', TRUE, FALSE, NULL, '2025-06-08 09:00:00'),
(4, 1, 'new_application', 'adoption_application', 4, 'Carlo Mendoza submitted a new adoption application for Bantay.', TRUE, FALSE, NULL, '2025-06-05 14:00:00'),
(5, 1, 'new_message', 'message_thread', 1, 'Carlo Mendoza sent a new message regarding his adoption application.', FALSE, FALSE, NULL, '2025-06-14 08:35:00'),
(6, 5, 'report_status', 'animal_report', 3, 'Your animal report in Barangay Bobon has been updated. A team is now monitoring the area.', FALSE, TRUE, '2025-06-09 08:00:00', '2025-06-09 08:00:00'),
(7, 2, 'new_community_listing', 'pet', 6, 'Your community pet listing for Chikoy has been received and is pending verification.', FALSE, FALSE, NULL, '2025-06-01 14:00:00');

-- =============================================================================
-- 12. notification_preferences — at least one per seeded user
-- =============================================================================
INSERT INTO notification_preferences (preference_id, user_id, notification_type, in_app_enabled, email_enabled) VALUES
(1, 1, 'adoption_status', TRUE, TRUE),
(2, 1, 'new_report', TRUE, TRUE),
(3, 1, 'new_message', TRUE, FALSE),
(4, 1, 'new_application', TRUE, TRUE),
(5, 2, 'adoption_status', TRUE, TRUE),
(6, 2, 'report_status', TRUE, TRUE),
(7, 2, 'new_report', TRUE, FALSE),
(8, 3, 'adoption_status', TRUE, TRUE),
(9, 3, 'report_status', TRUE, TRUE),
(10, 4, 'adoption_status', TRUE, TRUE),
(11, 5, 'adoption_status', TRUE, TRUE),
(12, 5, 'report_status', TRUE, TRUE),
(13, 5, 'new_message', TRUE, TRUE),
(14, 6, 'adoption_status', TRUE, TRUE),
(15, 6, 'report_status', TRUE, TRUE),
(16, 7, 'adoption_status', FALSE, FALSE),
(17, 7, 'new_report', TRUE, TRUE);

-- =============================================================================
-- 13. elearning_categories — 3 categories
-- =============================================================================
INSERT INTO elearning_categories (category_id, name, description, order_index) VALUES
(1, 'Dog Care', 'Everything you need to know about caring for dogs, from nutrition to behavior training.', 1),
(2, 'Cat Care', 'Learn about feline health, enrichment, and responsible cat ownership.', 2),
(3, 'Basic Training', 'Foundational training techniques for both dogs and cats.', 3);

-- =============================================================================
-- 14. elearning_modules — at least 2 per category, mix of draft/published
-- =============================================================================
INSERT INTO elearning_modules (module_id, category_id, title, description, content_body, video_url, cover_image_url, order_index, status, created_by_admin_id, created_at) VALUES
-- Dog Care (category 1) — 2 modules
(1, 1, 'Feeding Your Dog: Nutrition Basics', 'Learn about balanced diets, portion sizes, and safe vs. toxic foods for dogs.', 'Proper nutrition is the foundation of your dog''s health. Dogs need a balanced diet that includes proteins, carbohydrates, fats, vitamins, and minerals. Commercial dog food that meets AAFCO standards is generally recommended. Avoid feeding your dog chocolate, grapes, raisins, onions, garlic, and xylitol. Always provide fresh, clean water. Puppies need to eat 3-4 times per day, while adult dogs do well with 2 meals per day.', '/uploads/modules/dog_nutrition.mp4', '/uploads/modules/dog_nutrition_cover.jpg', 1, 'published', 1, '2025-01-05 08:00:00'),
(2, 1, 'Canine Body Language', 'Understand what your dog is trying to tell you through their posture and expressions.', 'Dogs communicate primarily through body language. A wagging tail does not always mean happiness — the position and speed matter. A relaxed dog has soft eyes, a slightly open mouth, and a loose body posture. Signs of stress include lip licking, yawning, tucked tail, and avoiding eye contact. A stiff body, hard stare, and raised hackles can indicate aggression. Learning to read these signals helps prevent bites and strengthens your bond.', NULL, '/uploads/modules/body_language_cover.jpg', 2, 'published', 1, '2025-01-10 09:00:00'),
-- Cat Care (category 2) — 2 modules
(3, 2, 'Litter Box Training for Cats', 'Everything you need to set up and maintain a clean litter box routine.', 'Cats are naturally clean animals and instinctively want to use a litter box. Provide one litter box per cat plus one extra. Place boxes in quiet, accessible locations away from food and water. Scoop daily and deep clean weekly. Most cats prefer unscented, clumping litter. Signs of litter box aversion include urinating outside the box — this can indicate a medical issue, so consult your vet.', NULL, '/uploads/modules/litterbox_cover.jpg', 1, 'published', 1, '2025-01-15 10:00:00'),
(4, 2, 'Cat Enrichment & Play', 'How to keep your indoor cat happy, active, and stimulated.', 'Indoor cats need environmental enrichment to prevent boredom and behavioral issues. Provide scratching posts, climbing trees, puzzle feeders, and interactive toys. Rotate toys weekly to maintain novelty. Window perches allow cats to watch birds and outdoor activity. Spend at least 10-15 minutes twice daily playing with your cat using wand toys or laser pointers. Catnip and silver vine can also provide enrichment.', '/uploads/modules/cat_enrichment.mp4', '/uploads/modules/cat_enrichment_cover.jpg', 2, 'published', 1, '2025-02-01 11:00:00'),
-- Basic Training (category 3) — 2 modules
(5, 3, 'House Training Your Puppy', 'Step-by-step guide to successfully house train your new puppy.', 'Start house training the moment your puppy comes home. Take them outside frequently: first thing in the morning, after meals, after naps, and after play. Choose a designated potty spot and use a consistent command like "go potty." Reward immediately with treats and praise. Never punish accidents — clean thoroughly with an enzymatic cleaner. Crate training can accelerate the process. Most puppies can be reliably house trained within 4-6 months.', NULL, '/uploads/modules/housetrain_cover.jpg', 1, 'published', 1, '2025-02-10 08:00:00'),
(6, 3, 'Clicker Training Fundamentals', 'Draft module: Introduction to positive reinforcement using clicker training.', 'Clicker training uses a small device that makes a clicking sound to mark desired behaviors. The click is followed by a treat. This method is effective for dogs, cats, and other animals. Start by "charging" the clicker: click then treat, repeat 10-15 times. Then shape simple behaviors like "sit" by clicking when the animal sits. Keep sessions short (5-10 minutes) and end on a positive note.', '/uploads/modules/clicker_training.mp4', '/uploads/modules/clicker_cover.jpg', 2, 'draft', 1, '2025-06-01 14:00:00');

-- =============================================================================
-- 15. module_progress — covering all 3 statuses across different residents
-- =============================================================================
INSERT INTO module_progress (progress_id, module_id, resident_id, status, started_at, completed_at) VALUES
(1, 1, 2, 'completed', '2025-02-01 10:00:00', '2025-02-03 14:00:00'),
(2, 2, 2, 'in_progress', '2025-06-10 09:00:00', NULL),
(3, 3, 3, 'completed', '2025-03-01 08:00:00', '2025-03-02 16:00:00'),
(4, 5, 5, 'in_progress', '2025-06-12 11:00:00', NULL),
(5, 1, 6, 'not_started', NULL, NULL),
(6, 4, 2, 'not_started', NULL, NULL);

-- =============================================================================
-- 16. report_exports — at least 2 sample entries
-- =============================================================================
INSERT INTO report_exports (export_id, requested_by_admin_id, export_type, format, date_range_start, date_range_end, generated_at) VALUES
(1, 1, 'adoption_trends', 'csv', '2025-01-01', '2025-06-30', '2025-07-01 08:00:00'),
(2, 1, 'geographic_distribution', 'pdf', '2025-01-01', '2025-06-30', '2025-07-01 08:30:00');
