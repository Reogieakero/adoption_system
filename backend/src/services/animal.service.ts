import { AppError } from '../errors/AppError';
import { animalRepository } from '../repositories/animal.repository';
import { Animal, CreateAnimalInput, UpdateAnimalInput } from '../types/animal.types';
import { rowToAnimal } from '../utils/animalMapper';

const REQUIRED_CREATE_FIELDS: (keyof CreateAnimalInput)[] = [
  'id',
  'name',
  'species',
  'breed',
  'sex',
  'age',
  'size',
  'colorMarkings',
  'rescueStatus',
  'adoptionStatus',
  'healthStatus',
  'vaccinationStatus',
  'heartRate',
  'location',
  'dateAdded',
  'lastUpdated',
  'bio',
];

function validateCreateInput(input: CreateAnimalInput): void {
  for (const field of REQUIRED_CREATE_FIELDS) {
    const value = input[field];
    if (value === undefined || value === null || value === '') {
      throw new AppError(400, `Field "${field}" is required`);
    }
  }
}

export const animalService = {
  async listAnimals(): Promise<Animal[]> {
    const rows = await animalRepository.findAll();
    return rows.map(rowToAnimal);
  },

  async getAnimalById(id: string): Promise<Animal> {
    const row = await animalRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Animal not found');
    }
    return rowToAnimal(row);
  },

  async createAnimal(input: CreateAnimalInput): Promise<Animal> {
    validateCreateInput(input);

    const existing = await animalRepository.findById(input.id);
    if (existing) {
      throw new AppError(409, 'An animal with this ID already exists');
    }

    await animalRepository.create({ ...input, photo: input.photo ?? '' });
    return this.getAnimalById(input.id);
  },

  async updateAnimal(id: string, input: UpdateAnimalInput): Promise<Animal> {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Animal not found');
    }

    const updated = await animalRepository.update(id, input);
    if (!updated) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    return this.getAnimalById(id);
  },

  async deleteAnimal(id: string): Promise<void> {
    const deleted = await animalRepository.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Animal not found');
    }
  },

  async seedAnimals(animals: CreateAnimalInput[]): Promise<number> {
    for (const animal of animals) {
      validateCreateInput(animal);
      await animalRepository.upsert(animal);
    }
    return animals.length;
  },
};