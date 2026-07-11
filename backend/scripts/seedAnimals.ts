import 'dotenv/config';
import { MOCK_ANIMALS } from '../../paw-connect-web/app/admin/animals/animalsData';
import pool from '../src/config/db';
import { animalService } from '../src/services/animal.service';
import { CreateAnimalInput } from '../src/types/animal.types';

function toSeedInput(animal: (typeof MOCK_ANIMALS)[number]): CreateAnimalInput {
  return {
    id: animal.id,
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    age: animal.age,
    size: animal.size,
    colorMarkings: animal.colorMarkings,
    rescueStatus: animal.rescueStatus,
    adoptionStatus: animal.adoptionStatus,
    healthStatus: animal.healthStatus,
    vaccinationStatus: animal.vaccinationStatus,
    heartRate: animal.heartRate,
    location: animal.location,
    dateRescued: animal.dateRescued,
    dateAdded: animal.dateAdded,
    lastUpdated: animal.lastUpdated,
    bio: animal.bio,
    photo: animal.photo,
  };
}

async function main(): Promise<void> {
  const animals = MOCK_ANIMALS.map(toSeedInput);
  const count = await animalService.seedAnimals(animals);
  console.log(`Seeded ${count} animals into the database.`);
  await pool.end();
}

main().catch((err: unknown) => {
  console.error('Seed failed:', err);
  // process.exit(1);
});
