/**
 * seed.ts
 * -------
 * Seeds the database with realistic sample data for every table touched by
 * the repositories in this project (animals, rescue_cases + timeline steps,
 * adoption_applications + profiles/documents, animal_health_history,
 * learning_modules, notifications, users).
 *
 * Run with:  npx ts-node src/seed/seed.ts
 * (adjust the import path below to match where `pool` actually lives in
 * your project — it mirrors the same '../config/db' import used by every
 * repository file you shared)
 */
import bcrypt from 'bcrypt';
import pool from '../config/db';

// ── Mati City geofence (matches heatmap.repository.ts) ─────────────────────
// south: 6.75, north: 7.15, west: 126.05, east: 126.40
const BARANGAYS = [
  'Badas',
  'Bobon',
  'Central',
  'Dawan',
  'Dahican',
  'Don Enrique Lopez',
  'Don Martin Marundan',
  'Don Salvador Lopez Sr.',
  'Sainz',
  'Tagabakid',
];

function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function matiCoords() {
  // stay comfortably inside the bounds, clustered near the city core
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

// ── Static reference data ───────────────────────────────────────────────────

const USERS = [
  {
    first_name: 'Maria',
    last_name: 'Santos',
    email: 'maria.santos@matirescue.ph',
    role: 'Admin',
    status: 'Active',
  },
  {
    first_name: 'Jonas',
    last_name: 'Villareal',
    email: 'jonas.villareal@matirescue.ph',
    role: 'Staff',
    status: 'Active',
  },
  {
    first_name: 'Ana',
    last_name: 'Dela Cruz',
    email: 'ana.delacruz@gmail.com',
    role: 'Citizen',
    status: 'Active',
  },
  {
    first_name: 'Ramil',
    last_name: 'Bacus',
    email: 'ramil.bacus@gmail.com',
    role: 'Citizen',
    status: 'Active',
  },
  {
    first_name: 'Liza',
    last_name: 'Fernandez',
    email: 'liza.fernandez@yahoo.com',
    role: 'Citizen',
    status: 'Pending',
  },
];

const ANIMALS = [
  {
    id: 'ANM-0001',
    name: 'Bantay',
    species: 'Dog',
    breed: 'Aspin (Asong Pinoy)',
    sex: 'Male',
    age: '2 years',
    size: 'Medium',
    color_markings: 'Brown with white chest patch',
    rescue_status: 'Rescued',
    adoption_status: 'Available',
    health_status: 'Healthy',
    vaccination_status: 'Fully Vaccinated',
    heart_rate: '90 bpm',
    heart_rate_bpm: 90,
    location: 'Barangay Dahican, Mati City',
    date_rescued: daysAgo(60),
    date_added: daysAgo(58),
    last_updated: daysAgo(3),
    bio: 'Found wandering near Dahican Beach, friendly and food-motivated.',
    photo_url: '/uploads/animals/bantay.jpg',
  },
  {
    id: 'ANM-0002',
    name: 'Mingming',
    species: 'Cat',
    breed: 'Puspin (Pusang Pinoy)',
    sex: 'Female',
    age: '1 year',
    size: 'Small',
    color_markings: 'Gray tabby',
    rescue_status: 'Rescued',
    adoption_status: 'Adopted',
    health_status: 'Healthy',
    vaccination_status: 'Fully Vaccinated',
    heart_rate: '150 bpm',
    heart_rate_bpm: 150,
    location: 'Barangay Central, Mati City',
    date_rescued: daysAgo(120),
    date_added: daysAgo(118),
    last_updated: daysAgo(10),
    bio: 'Rescued as a stray kitten behind the Mati public market.',
    photo_url: '/uploads/animals/mingming.jpg',
  },
  {
    id: 'ANM-0003',
    name: 'Duke',
    species: 'Dog',
    breed: 'Shih Tzu Mix',
    sex: 'Male',
    age: '4 years',
    size: 'Small',
    color_markings: 'White and tan',
    rescue_status: 'Under Care',
    adoption_status: 'Not Available',
    health_status: 'Under Treatment',
    vaccination_status: 'Partial',
    heart_rate: '100 bpm',
    heart_rate_bpm: 100,
    location: 'Barangay Badas, Mati City',
    date_rescued: daysAgo(14),
    date_added: daysAgo(14),
    last_updated: daysAgo(1),
    bio: 'Surrendered by owner who could no longer care for him; recovering from mange.',
    photo_url: '/uploads/animals/duke.jpg',
  },
  {
    id: 'ANM-0004',
    name: 'Luna',
    species: 'Cat',
    breed: 'Puspin (Pusang Pinoy)',
    sex: 'Female',
    age: '3 years',
    size: 'Small',
    color_markings: 'Black with white paws',
    rescue_status: 'Rescued',
    adoption_status: 'Adopted',
    health_status: 'Healthy',
    vaccination_status: 'Fully Vaccinated',
    heart_rate: '140 bpm',
    heart_rate_bpm: 140,
    location: 'Barangay Sainz, Mati City',
    date_rescued: daysAgo(200),
    date_added: daysAgo(198),
    last_updated: daysAgo(30),
    bio: 'Calm, affectionate cat rescued from a flooded sitio.',
    photo_url: '/uploads/animals/luna.jpg',
  },
  {
    id: 'ANM-0005',
    name: 'Rocky',
    species: 'Dog',
    breed: 'Aspin (Asong Pinoy)',
    sex: 'Male',
    age: '5 years',
    size: 'Large',
    color_markings: 'Black and tan',
    rescue_status: 'Rescued',
    adoption_status: 'Available',
    health_status: 'Healthy',
    vaccination_status: 'Fully Vaccinated',
    heart_rate: '85 bpm',
    heart_rate_bpm: 85,
    location: 'Barangay Tagabakid, Mati City',
    date_rescued: daysAgo(45),
    date_added: daysAgo(44),
    last_updated: daysAgo(5),
    bio: 'Loyal former stray who guarded a sari-sari store before rescue.',
    photo_url: '/uploads/animals/rocky.jpg',
  },
  {
    id: 'ANM-0006',
    name: 'Chikoy',
    species: 'Dog',
    breed: 'Aspin Puppy Mix',
    sex: 'Male',
    age: '4 months',
    size: 'Small',
    color_markings: 'Brindle',
    rescue_status: 'Under Care',
    adoption_status: 'Not Available',
    health_status: 'Recovering',
    vaccination_status: 'Not Vaccinated',
    heart_rate: '120 bpm',
    heart_rate_bpm: 120,
    location: 'Barangay Don Salvador Lopez Sr., Mati City',
    date_rescued: daysAgo(7),
    date_added: daysAgo(7),
    last_updated: daysAgo(1),
    bio: 'Part of a litter found abandoned near a construction site.',
    photo_url: '/uploads/animals/chikoy.jpg',
  },
];

const LEARNING_MODULES = [
  {
    id: 'LM-0001',
    title: 'Basic First Aid for Rescued Animals',
    description: 'A short course covering wound care, stabilization, and safe handling.',
    category: 'Animal Care',
    difficulty: 'Beginner',
    duration: '25 mins',
    status: 'Published',
    objectives: 'Identify injuries; apply basic first aid; know when to escalate to a vet.',
    content: 'Full lesson content on triage and first aid for street animals...',
    video_url: '/uploads/modules/first-aid.mp4',
    pdf_url: '/uploads/modules/first-aid.pdf',
    views: 342,
    completion_rate: '68%',
    image_url: '/uploads/modules/first-aid-cover.jpg',
    date_added: daysAgo(180),
    last_updated: daysAgo(20),
  },
  {
    id: 'LM-0002',
    title: 'Responsible Pet Ownership',
    description: 'What new adopters need to know before bringing a rescued pet home.',
    category: 'Adoption',
    difficulty: 'Beginner',
    duration: '15 mins',
    status: 'Published',
    objectives: 'Understand feeding, vaccination schedules, and home preparation.',
    content: 'Full lesson content on preparing a home for a newly adopted animal...',
    video_url: '/uploads/modules/pet-ownership.mp4',
    pdf_url: '/uploads/modules/pet-ownership.pdf',
    views: 210,
    completion_rate: '75%',
    image_url: '/uploads/modules/pet-ownership-cover.jpg',
    date_added: daysAgo(150),
    last_updated: daysAgo(40),
  },
  {
    id: 'LM-0003',
    title: 'Recognizing Animal Cruelty & How to Report',
    description: 'Guidance for residents of Mati City on spotting and reporting abuse.',
    category: 'Advocacy',
    difficulty: 'Intermediate',
    duration: '20 mins',
    status: 'Published',
    objectives: 'Recognize signs of neglect/abuse; know the correct reporting channel.',
    content: 'Full lesson content on animal welfare laws and reporting procedures...',
    video_url: '',
    pdf_url: '/uploads/modules/reporting-guide.pdf',
    views: 98,
    completion_rate: '54%',
    image_url: '/uploads/modules/reporting-cover.jpg',
    date_added: daysAgo(90),
    last_updated: daysAgo(90),
  },
];

// ── Main seed routine ────────────────────────────────────────────────────

async function truncateAll() {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'notifications',
    'adoption_application_documents',
    'adoption_application_profiles',
    'adoption_applications',
    'animal_health_history',
    'rescue_case_timeline_steps',
    'rescue_cases',
    'learning_modules',
    'animals',
    'users',
  ];
  for (const t of tables) {
    await pool.query(`TRUNCATE TABLE ${t}`);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✔ Truncated existing rows');
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const ids: number[] = [];
  for (const u of USERS) {
    const [result]: any = await pool.query(
      `INSERT INTO users
        (first_name, last_name, email, password_hash, provider, is_verified, role, status, agreed_terms, agreed_terms_at)
       VALUES (?, ?, ?, ?, 'local', TRUE, ?, ?, TRUE, NOW())`,
      [u.first_name, u.last_name, u.email, passwordHash, u.role, u.status]
    );
    ids.push(result.insertId);
  }
  console.log(`✔ Seeded ${USERS.length} users`);
  return ids;
}

async function seedAnimals() {
  for (const a of ANIMALS) {
    await pool.query(
      `INSERT INTO animals (
        id, name, species, breed, sex, age, size, color_markings,
        rescue_status, adoption_status, health_status, vaccination_status,
        heart_rate, heart_rate_bpm, location, date_rescued, date_added, last_updated,
        bio, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.id,
        a.name,
        a.species,
        a.breed,
        a.sex,
        a.age,
        a.size,
        a.color_markings,
        a.rescue_status,
        a.adoption_status,
        a.health_status,
        a.vaccination_status,
        a.heart_rate,
        a.heart_rate_bpm,
        a.location,
        toSqlDate(a.date_rescued),
        toSqlDate(a.date_added),
        toSqlDate(a.last_updated),
        a.bio,
        a.photo_url,
      ]
    );
  }
  console.log(`✔ Seeded ${ANIMALS.length} animals`);
}

async function seedAnimalHealthHistory() {
  const entries = [
    { animal_id: 'ANM-0001', event_date: daysAgo(58), event_title: 'Initial Checkup', notes: 'No parasites found, dewormed.' },
    { animal_id: 'ANM-0001', event_date: daysAgo(45), event_title: 'Vaccination', notes: 'First round of core vaccines administered.' },
    { animal_id: 'ANM-0002', event_date: daysAgo(115), event_title: 'Spay Surgery', notes: 'Successful spay, recovered within a week.' },
    { animal_id: 'ANM-0003', event_date: daysAgo(14), event_title: 'Mange Diagnosis', notes: 'Started on medicated baths and oral treatment.' },
    { animal_id: 'ANM-0003', event_date: daysAgo(3), event_title: 'Follow-up Checkup', notes: 'Skin condition improving, continue treatment.' },
    { animal_id: 'ANM-0005', event_date: daysAgo(44), event_title: 'Initial Checkup', notes: 'Healthy overall, minor tick infestation treated.' },
    { animal_id: 'ANM-0006', event_date: daysAgo(7), event_title: 'Intake Exam', notes: 'Underweight, started on nutrition plan.' },
  ];
  for (const e of entries) {
    await pool.query(
      `INSERT INTO animal_health_history (animal_id, event_date, event_title, notes) VALUES (?, ?, ?, ?)`,
      [e.animal_id, toSqlDate(e.event_date), e.event_title, e.notes]
    );
  }
  console.log(`✔ Seeded ${entries.length} animal health history entries`);
}

async function seedRescueCases() {
  const cases = [
    {
      id: 'RC-0001',
      linked_animal_id: 'ANM-0001',
      animal_type: 'Dog',
      priority: 'High',
      status: 'Resolved',
      stage: 'Completed',
      barangay: 'Dahican',
      reported_at: daysAgo(61),
      assigned_rescuer: 'Jonas Villareal',
      rescue_team: 'Team Alpha',
      eta: '30 mins',
      internal_notes: 'Handled smoothly, animal was cooperative.',
    },
    {
      id: 'RC-0002',
      linked_animal_id: 'ANM-0002',
      animal_type: 'Cat',
      priority: 'Medium',
      status: 'Resolved',
      stage: 'Completed',
      barangay: 'Central',
      reported_at: daysAgo(121),
      assigned_rescuer: 'Jonas Villareal',
      rescue_team: 'Team Alpha',
      eta: '20 mins',
      internal_notes: 'Kitten found alone, no mother cat located nearby.',
    },
    {
      id: 'RC-0003',
      linked_animal_id: 'ANM-0003',
      animal_type: 'Dog',
      priority: 'Critical',
      status: 'In Progress',
      stage: 'Under Treatment',
      barangay: 'Badas',
      reported_at: daysAgo(15),
      assigned_rescuer: 'Maria Santos',
      rescue_team: 'Team Bravo',
      eta: '15 mins',
      internal_notes: 'Severe mange on arrival, isolated from other animals.',
    },
    {
      id: 'RC-0004',
      linked_animal_id: 'ANM-0004',
      animal_type: 'Cat',
      priority: 'Low',
      status: 'Resolved',
      stage: 'Completed',
      barangay: 'Sainz',
      reported_at: daysAgo(201),
      assigned_rescuer: 'Jonas Villareal',
      rescue_team: 'Team Alpha',
      eta: '25 mins',
      internal_notes: 'Rescued during flooding response operation.',
    },
    {
      id: 'RC-0005',
      linked_animal_id: 'ANM-0005',
      animal_type: 'Dog',
      priority: 'Medium',
      status: 'Resolved',
      stage: 'Completed',
      barangay: 'Tagabakid',
      reported_at: daysAgo(46),
      assigned_rescuer: 'Maria Santos',
      rescue_team: 'Team Bravo',
      eta: '20 mins',
      internal_notes: 'Owner unreachable, animal was clearly a long-term stray.',
    },
    {
      id: 'RC-0006',
      linked_animal_id: 'ANM-0006',
      animal_type: 'Dog',
      priority: 'Critical',
      status: 'In Progress',
      stage: 'Under Treatment',
      barangay: 'Don Salvador Lopez Sr.',
      reported_at: daysAgo(8),
      assigned_rescuer: 'Jonas Villareal',
      rescue_team: 'Team Bravo',
      eta: '10 mins',
      internal_notes: 'Litter of 4 puppies found, only 1 currently in shelter.',
    },
    {
      id: 'RC-0007',
      linked_animal_id: null,
      animal_type: 'Dog',
      priority: 'High',
      status: 'Pending',
      stage: 'Reported',
      barangay: 'Bobon',
      reported_at: daysAgo(1),
      assigned_rescuer: null,
      rescue_team: null,
      eta: null,
      internal_notes: 'Awaiting team assignment.',
    },
  ];

  for (const c of cases) {
    const { latitude, longitude } = matiCoords();
    await pool.query(
      `INSERT INTO rescue_cases (
        id, latitude, longitude, priority, status, stage, barangay, animal_type,
        reported_at, assigned_rescuer, rescue_team, eta, assigned_at, internal_notes, linked_animal_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        latitude,
        longitude,
        c.priority,
        c.status,
        c.stage,
        c.barangay,
        c.animal_type,
        toSqlDate(c.reported_at),
        c.assigned_rescuer,
        c.rescue_team,
        c.eta,
        c.assigned_rescuer ? toSqlDate(c.reported_at) : null,
        c.internal_notes,
        c.linked_animal_id,
      ]
    );
  }
  console.log(`✔ Seeded ${cases.length} rescue cases`);
  return cases;
}

async function seedRescueTimelineSteps(cases: { id: string; reported_at: Date }[]) {
  const stepTemplates = [
    'Report Received',
    'Team Dispatched',
    'Animal Secured',
    'Under Veterinary Care',
    'Case Closed',
  ];

  let totalSteps = 0;
  for (const c of cases) {
    const stepCount = 2 + Math.floor(Math.random() * (stepTemplates.length - 1));
    for (let i = 0; i < stepCount; i++) {
      await pool.query(
        `INSERT INTO rescue_case_timeline_steps (rescue_case_id, step_order, title, step_timestamp, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [
          c.id,
          i + 1,
          stepTemplates[i],
          toSqlDate(daysAgo(Math.max(0, (cases.length - i)))),
          i === stepCount - 1,
        ]
      );
      totalSteps++;
    }
  }
  console.log(`✔ Seeded ${totalSteps} rescue timeline steps`);
}

async function seedAdoptions() {
  const applications = [
    {
      id: 'ADP-0001',
      applicant_name: 'Ana Dela Cruz',
      applicant_email: 'ana.delacruz@gmail.com',
      application_date: daysAgo(100),
      status: 'Approved',
      assigned_staff_name: 'Maria Santos',
      animal_id: 'ANM-0002',
    },
    {
      id: 'ADP-0002',
      applicant_name: 'Ramil Bacus',
      applicant_email: 'ramil.bacus@gmail.com',
      application_date: daysAgo(180),
      status: 'Approved',
      assigned_staff_name: 'Jonas Villareal',
      animal_id: 'ANM-0004',
    },
    {
      id: 'ADP-0003',
      applicant_name: 'Liza Fernandez',
      applicant_email: 'liza.fernandez@yahoo.com',
      application_date: daysAgo(5),
      status: 'Pending',
      assigned_staff_name: null,
      animal_id: 'ANM-0001',
    },
    {
      id: 'ADP-0004',
      applicant_name: 'Carlo Mendoza',
      applicant_email: 'carlo.mendoza@gmail.com',
      application_date: daysAgo(2),
      status: 'Under Review',
      assigned_staff_name: 'Maria Santos',
      animal_id: 'ANM-0005',
    },
  ];

  for (const app of applications) {
    await pool.query(
      `INSERT INTO adoption_applications
        (id, applicant_name, applicant_email, application_date, status, assigned_staff_name, animal_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        app.id,
        app.applicant_name,
        app.applicant_email,
        toSqlDate(app.application_date),
        app.status,
        app.assigned_staff_name,
        app.animal_id,
      ]
    );

    // Profile (one per application)
    await pool.query(
      `INSERT INTO adoption_application_profiles (
        application_id, applicant_id, profile_photo_url, date_of_birth, age, sex, civil_status, nationality,
        mobile_number, alternate_contact_number,
        home_address, barangay, city_municipality, province, zip_code,
        gov_id_type, gov_id_number, gov_id_photo_url,
        occupation, employer, monthly_income_range,
        residence_type, home_ownership, household_members, children,
        has_existing_pets, existing_pets_count,
        why_adopt, owned_pet_before, primary_caregiver, hours_alone,
        can_provide_vet_care, household_in_favor, has_secure_area,
        preferred_contact_method, preferred_adoption_date,
        emergency_contact_name, emergency_contact_relationship, emergency_contact_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        app.id,
        `APL-${app.id}`,
        `/uploads/profiles/${app.id.toLowerCase()}.jpg`,
        '1992-05-14',
        32,
        'Female',
        'Single',
        'Filipino',
        '09171234567',
        '09209876543',
        '123 Rizal St.',
        'Central',
        'Mati City',
        'Davao Oriental',
        '8200',
        'PhilID',
        'PSN-1234-5678-9012',
        '/uploads/gov-ids/' + app.id.toLowerCase() + '.jpg',
        'Teacher',
        'Mati City National High School',
        'PHP 20,000 - 30,000',
        'House',
        'Owned',
        4,
        1,
        true,
        1,
        'I want to give a rescued animal a loving, permanent home.',
        true,
        'Applicant',
        '2-4 hours',
        true,
        true,
        true,
        'Mobile Number',
        toSqlDate(daysAgo(-14)),
        'Josefina Dela Cruz',
        'Mother',
        '09181234567',
      ]
    );

    // Documents (one per application)
    await pool.query(
      `INSERT INTO adoption_application_documents
        (application_id, government_id_url, proof_of_address_url, proof_of_income_url, other_documents)
       VALUES (?, ?, ?, ?, ?)`,
      [
        app.id,
        `/uploads/docs/${app.id.toLowerCase()}-gov-id.pdf`,
        `/uploads/docs/${app.id.toLowerCase()}-address.pdf`,
        `/uploads/docs/${app.id.toLowerCase()}-income.pdf`,
        null,
      ]
    );
  }
  console.log(`✔ Seeded ${applications.length} adoption applications (with profiles + documents)`);
}

async function seedLearningModules() {
  for (const m of LEARNING_MODULES) {
    await pool.query(
      `INSERT INTO learning_modules (
        id, title, description, category, difficulty, duration, status,
        objectives, content, video_url, pdf_url, views, completion_rate,
        image_url, date_added, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.title,
        m.description,
        m.category,
        m.difficulty,
        m.duration,
        m.status,
        m.objectives,
        m.content,
        m.video_url,
        m.pdf_url,
        m.views,
        m.completion_rate,
        m.image_url,
        toSqlDate(m.date_added),
        toSqlDate(m.last_updated),
      ]
    );
  }
  console.log(`✔ Seeded ${LEARNING_MODULES.length} learning modules`);
}

async function seedNotifications() {
  const notifications = [
    {
      type: 'rescue',
      title: 'New Rescue Report',
      message: 'A new rescue case was reported in Barangay Bobon.',
      entity_type: 'rescue_case',
      entity_id: 'RC-0007',
      priority: 'high',
      link: '/rescue/RC-0007',
    },
    {
      type: 'adoption',
      title: 'New Adoption Application',
      message: 'Carlo Mendoza applied to adopt Rocky.',
      entity_type: 'adoption_application',
      entity_id: 'ADP-0004',
      priority: 'normal',
      link: '/adoptions/ADP-0004',
    },
    {
      type: 'health',
      title: 'Follow-up Checkup Logged',
      message: "Duke's skin condition is improving after treatment.",
      entity_type: 'animal',
      entity_id: 'ANM-0003',
      priority: 'normal',
      link: '/health/ANM-0003',
    },
    {
      type: 'system',
      title: 'Weekly Summary Ready',
      message: 'Your weekly operations summary is ready to view.',
      entity_type: null,
      entity_id: null,
      priority: 'low',
      link: '/dashboard',
    },
  ];

  for (const n of notifications) {
    await pool.query(
      `INSERT INTO notifications (type, title, message, entity_type, entity_id, priority, created_by, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [n.type, n.title, n.message, n.entity_type, n.entity_id, n.priority, 'System', n.link]
    );
  }
  console.log(`✔ Seeded ${notifications.length} notifications`);
}

async function main() {
  try {
    console.log('🌱 Starting seed...');
    await truncateAll();
    await seedUsers();
    await seedAnimals();
    await seedAnimalHealthHistory();
    const cases = await seedRescueCases();
    await seedRescueTimelineSteps(cases as any);
    await seedAdoptions();
    await seedLearningModules();
    await seedNotifications();
    console.log('✅ Seeding complete.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();