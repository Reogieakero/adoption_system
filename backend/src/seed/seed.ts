import bcrypt from 'bcrypt';
import pool from '../config/db';

const BARANGAYS = [
  'Badas', 'Bobon', 'Central', 'Dawan', 'Dahican',
  'Don Enrique Lopez', 'Don Martin Marundan', 'Don Salvador Lopez Sr.',
  'Sainz', 'Tagabakid',
];

function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function matiCoords() {
  return {
    latitude: Number(randBetween(6.86, 7.02).toFixed(6)),
    longitude: Number(randBetween(126.15, 126.28).toFixed(6)),
  };
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function toSqlDate(d: Date): string {
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ── Seed routines ──────────────────────────────────────────────────────────

async function truncateAll() {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'report_exports', 'module_progress', 'elearning_modules', 'elearning_categories',
    'notification_preferences', 'notifications', 'messages', 'message_threads',
    'animal_reports', 'adoption_applications', 'health_records', 'pet_3d_assets',
    'pet_photos', 'email_verification_codes', 'pets', 'users',
  ];
  for (const t of tables) {
    await pool.query(`TRUNCATE TABLE ${t}`);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✔ Truncated existing rows');
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const users = [
    { full_name: 'Maria Concepcion Santos', email: 'admin@matirescue.ph', role: 'admin', auth_provider: 'local', email_verified: true, status: 'active', phone_number: '09171230001' },
    { full_name: 'Ana Dela Cruz', email: 'ana.delacruz@gmail.com', role: 'resident', auth_provider: 'local', email_verified: true, status: 'active', phone_number: '09171230002' },
    { full_name: 'Ramil Bacus', email: 'ramil.bacus@gmail.com', role: 'resident', auth_provider: 'local', email_verified: true, status: 'active', phone_number: '09171230003' },
    { full_name: 'Liza Fernandez', email: 'liza.fernandez@yahoo.com', role: 'resident', auth_provider: 'local', email_verified: false, status: 'pending_verification', phone_number: '09171230004' },
    { full_name: 'Carlo Mendoza', email: 'carlo.mendoza@gmail.com', role: 'resident', auth_provider: 'google', email_verified: true, status: 'active', google_id: 'google_uid_abc123', phone_number: '09171230005' },
    { full_name: 'Jennifer Reyes', email: 'jennifer.reyes@gmail.com', role: 'resident', auth_provider: 'google', email_verified: true, status: 'active', google_id: 'google_uid_def456', phone_number: '09171230006' },
    { full_name: 'Pedro Lim', email: 'pedro.lim@yahoo.com', role: 'resident', auth_provider: 'local', email_verified: true, status: 'suspended', phone_number: '09171230007' },
  ];

  const ids: number[] = [];
  for (const u of users) {
    const [result]: any = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, auth_provider, google_id, email_verified, role, status, phone_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.full_name, u.email,
        u.auth_provider === 'local' ? passwordHash : null,
        u.auth_provider, u.google_id ?? null,
        u.email_verified, u.role, u.status, u.phone_number ?? null,
      ]
    );
    ids.push(result.insertId);
  }
  console.log(`✔ Seeded ${users.length} users`);
  return ids;
}

async function seedEmailVerificationCodes(userIds: number[]) {
  await pool.query(
    `INSERT INTO email_verification_codes (user_id, code, purpose, expires_at, is_used)
     VALUES (?, ?, 'registration', ?, ?)`,
    [userIds[3], '48291', toSqlDate(daysAgo(-7)), false]
  );
  await pool.query(
    `INSERT INTO email_verification_codes (user_id, code, purpose, expires_at, is_used)
     VALUES (?, ?, 'password_reset', ?, ?)`,
    [userIds[2], '71563', toSqlDate(daysAgo(-83)), true]
  );
  console.log('✔ Seeded 2 email verification codes');
}

async function seedPets(userIds: number[]) {
  const adminId = userIds[0];
  const pets = [
    { source_type: 'shelter', species: 'dog', breed_type: 'aspin', breed_detail: null, name: 'Bantay', age_estimate: '2 years', sex: 'male', description: 'Friendly brown dog found wandering near Dahican Beach.', status: 'available', location_area: 'Barangay Dahican' },
    { source_type: 'shelter', species: 'cat', breed_type: 'puspin', breed_detail: null, name: 'Mingming', age_estimate: '1 year', sex: 'female', description: 'Gray tabby cat rescued as a stray kitten.', status: 'adopted', location_area: 'Barangay Central' },
    { source_type: 'shelter', species: 'dog', breed_type: 'other', breed_detail: 'Shih Tzu Mix', name: 'Duke', age_estimate: '4 years', sex: 'male', description: 'Surrendered by owner. Recovering from mange.', status: 'pending', location_area: 'Barangay Badas' },
    { source_type: 'shelter', species: 'cat', breed_type: 'puspin', breed_detail: null, name: 'Luna', age_estimate: '3 years', sex: 'female', description: 'Calm, affectionate cat rescued from a flooded sitio.', status: 'adopted', location_area: 'Barangay Sainz' },
    { source_type: 'shelter', species: 'dog', breed_type: 'aspin', breed_detail: null, name: 'Rocky', age_estimate: '5 years', sex: 'male', description: 'Loyal former stray who guarded a sari-sari store.', status: 'available', location_area: 'Barangay Tagabakid' },
    { source_type: 'community', species: 'dog', breed_type: 'aspin', breed_detail: 'Aspin Puppy Mix', name: 'Chikoy', age_estimate: '4 months', sex: 'male', description: 'Brindle-coated puppy from a litter found near a construction site.', status: 'pending_verification', location_area: 'Barangay Don Enrique Lopez' },
    { source_type: 'shelter', species: 'cat', breed_type: 'puspin', breed_detail: null, name: 'Mochi', age_estimate: '8 months', sex: 'female', description: 'White and orange calico.', status: 'rejected', rejection_reason: 'Pre-existing medical condition requiring ongoing expensive treatment.', location_area: 'Barangay Central' },
    { source_type: 'community', species: 'dog', breed_type: 'other', breed_detail: 'Golden Retriever', name: 'Max', age_estimate: '3 years', sex: 'male', description: 'Friendly golden retriever found wandering near Dahican Beach.', status: 'available', location_area: 'Barangay Dahican' },
  ];

  const petIds: number[] = [];
  for (const p of pets) {
    const [result]: any = await pool.query(
      `INSERT INTO pets (source_type, posted_by_user_id, species, breed_type, breed_detail, name, age_estimate, sex, description, status, rejection_reason, location_area, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.source_type,
        p.source_type === 'community' ? userIds[1] : null,
        p.species, p.breed_type, p.breed_detail, p.name,
        p.age_estimate, p.sex, p.description, p.status,
        p.rejection_reason ?? null, p.location_area,
        p.source_type === 'community' ? userIds[1] : adminId,
      ]
    );
    petIds.push(result.insertId);
  }
  console.log(`✔ Seeded ${pets.length} pets`);
  return petIds;
}

async function seedPetPhotos(petIds: number[]) {
  let count = 0;
  for (let i = 0; i < petIds.length; i++) {
    const numPhotos = i === 3 ? 1 : (i === 2 ? 3 : 2);
    for (let j = 1; j <= numPhotos; j++) {
      await pool.query(
        `INSERT INTO pet_photos (pet_id, file_url, is_primary) VALUES (?, ?, ?)`,
        [petIds[i], `/uploads/pets/pet_${petIds[i]}_${j}.jpg`, j === 1]
      );
      count++;
    }
  }
  console.log(`✔ Seeded ${count} pet photos`);
}

async function seedPet3dAssets(petIds: number[]) {
  await pool.query(
    `INSERT INTO pet_3d_assets (pet_id, asset_url, asset_type) VALUES (?, ?, 'model_3d')`,
    [petIds[0], '/uploads/models/3d-bantay.glb']
  );
  console.log('✔ Seeded 1 pet 3D asset');
}

async function seedHealthRecords(petIds: number[], userIds: number[]) {
  for (let i = 0; i < petIds.length; i++) {
    await pool.query(
      `INSERT INTO health_records (pet_id, medical_history, vaccination_status, heart_rate_bpm, created_by_user_id, last_updated_by)
       VALUES (?, ?, ?, NULL, ?, ?)`,
      [
        petIds[i],
        `Medical history for pet ${petIds[i]}. Routine checkups completed.`,
        i % 2 === 0 ? 'Core vaccines complete' : 'Vaccination pending',
        userIds[0], userIds[0],
      ]
    );
  }
  console.log(`✔ Seeded ${petIds.length} health records`);
}

async function seedAdoptionApplications(petIds: number[], userIds: number[]) {
  const apps = [
    { pet_id: petIds[3], resident_id: userIds[2], status: 'approved', submitted_at: daysAgo(170), decided_at: daysAgo(165) },
    { pet_id: petIds[3], resident_id: userIds[1], status: 'pet_unavailable', rejection_reason: 'Another application was approved for this pet first.', submitted_at: daysAgo(168), decided_at: daysAgo(165) },
    { pet_id: petIds[1], resident_id: userIds[1], status: 'approved', submitted_at: daysAgo(180), decided_at: daysAgo(175) },
    { pet_id: petIds[0], resident_id: userIds[4], status: 'pending_review', submitted_at: daysAgo(45) },
    { pet_id: petIds[4], resident_id: userIds[3], status: 'rejected', rejection_reason: 'Application incomplete.', submitted_at: daysAgo(110), decided_at: daysAgo(100) },
    { pet_id: petIds[7], resident_id: userIds[5], status: 'pending_review', submitted_at: daysAgo(40) },
  ];

  for (const app of apps) {
    const decidedBy = (app.status === 'approved' || app.status === 'rejected' || app.status === 'pet_unavailable') ? userIds[0] : null;
    await pool.query(
      `INSERT INTO adoption_applications (pet_id, resident_id, status, rejection_reason, submitted_at, decided_at, decided_by_admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        app.pet_id, app.resident_id, app.status,
        app.rejection_reason ?? null,
        toSqlDate(app.submitted_at),
        app.decided_at ? toSqlDate(app.decided_at) : null,
        decidedBy,
      ]
    );
  }
  console.log(`✔ Seeded ${apps.length} adoption applications`);
}

async function seedAnimalReports(userIds: number[]) {
  const reports = [
    { resident_id: userIds[1], species: 'dog', condition: 'Stray dog with visible limp on left hind leg.', lat: 6.948056, lng: 126.275833, area: 'Barangay Dahican', status: 'resolved', resolved_at: daysAgo(200), valid_for_heatmap: true },
    { resident_id: userIds[2], species: 'cat', condition: 'Kitten stuck in a drainage pipe.', lat: 6.950000, lng: 126.216667, area: 'Barangay Central', status: 'resolved', resolved_at: daysAgo(160), valid_for_heatmap: true },
    { resident_id: userIds[4], species: 'dog', condition: 'Aggressive stray dog roaming near the elementary school.', lat: 6.899722, lng: 126.168889, area: 'Barangay Bobon', status: 'in_progress', resolved_at: null, valid_for_heatmap: true },
    { resident_id: userIds[5], species: 'cat', condition: 'Litter of 4 kittens abandoned behind the public market.', lat: 6.952778, lng: 126.218333, area: 'Barangay Central', status: 'submitted', resolved_at: null, valid_for_heatmap: true },
    { resident_id: userIds[1], species: 'unknown', condition: 'Possible injured animal spotted along the highway.', lat: 6.867500, lng: 126.226389, area: 'Barangay Don Martin Marundan', status: 'resolved', resolved_at: daysAgo(60), valid_for_heatmap: false },
  ];

  for (const r of reports) {
    await pool.query(
      `INSERT INTO animal_reports (resident_id, species, condition_description, photo_url, latitude, longitude, location_area, status, is_valid_for_heatmap, resolved_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.resident_id, r.species, r.condition,
        `/uploads/reports/report_${r.species}.jpg`,
        r.lat, r.lng, r.area, r.status,
        r.valid_for_heatmap,
        r.resolved_at ? toSqlDate(r.resolved_at) : null,
      ]
    );
  }
  console.log(`✔ Seeded ${reports.length} animal reports`);
}

async function seedSeed() {
  console.log('✅ Seeding complete. Run the SQL seed file (database/seed.sql) for comprehensive data, or use this TS seed for minimal data.');
}

async function main() {
  try {
    console.log('🌱 Starting seed...');
    await truncateAll();
    const userIds = await seedUsers();
    await seedEmailVerificationCodes(userIds);
    const petIds = await seedPets(userIds);
    await seedPetPhotos(petIds);
    await seedPet3dAssets(petIds);
    await seedHealthRecords(petIds, userIds);
    await seedAdoptionApplications(petIds, userIds);
    await seedAnimalReports(userIds);
    await seedSeed();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
