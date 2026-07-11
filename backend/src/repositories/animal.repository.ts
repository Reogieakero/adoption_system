import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { CreateAnimalInput, UpdateAnimalInput } from '../types/animal.types';
import {
  AnimalRow,
  parseDisplayDate,
  parseHeartRateBpm,
} from '../utils/animalMapper';

function buildInsertValues(input: CreateAnimalInput) {
  return [
    input.id,
    input.name,
    input.species,
    input.breed,
    input.sex,
    input.age,
    input.size,
    input.colorMarkings,
    input.rescueStatus,
    input.adoptionStatus,
    input.healthStatus,
    input.vaccinationStatus,
    input.heartRate,
    parseHeartRateBpm(input.heartRate),
    input.location,
    input.dateRescued ? parseDisplayDate(input.dateRescued) : null,
    parseDisplayDate(input.dateAdded),
    parseDisplayDate(input.lastUpdated),
    input.bio,
    input.photo,
  ];
}

export const animalRepository = {
  async findAll(): Promise<AnimalRow[]> {
    const [rows] = await pool.query<AnimalRow[]>(
      'SELECT * FROM animals ORDER BY date_added DESC, name ASC'
    );
    return rows;
  },

  async findById(id: string): Promise<AnimalRow | undefined> {
    const [rows] = await pool.query<AnimalRow[]>('SELECT * FROM animals WHERE id = ?', [id]);
    return rows[0];
  },

  async create(input: CreateAnimalInput): Promise<void> {
    await pool.query(
      `INSERT INTO animals (
        id, name, species, breed, sex, age, size, color_markings,
        rescue_status, adoption_status, health_status, vaccination_status,
        heart_rate, heart_rate_bpm, location, date_rescued, date_added, last_updated,
        bio, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      buildInsertValues(input)
    );
  },

  async upsert(input: CreateAnimalInput): Promise<void> {
    await pool.query(
      `INSERT INTO animals (
        id, name, species, breed, sex, age, size, color_markings,
        rescue_status, adoption_status, health_status, vaccination_status,
        heart_rate, heart_rate_bpm, location, date_rescued, date_added, last_updated,
        bio, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        species = VALUES(species),
        breed = VALUES(breed),
        sex = VALUES(sex),
        age = VALUES(age),
        size = VALUES(size),
        color_markings = VALUES(color_markings),
        rescue_status = VALUES(rescue_status),
        adoption_status = VALUES(adoption_status),
        health_status = VALUES(health_status),
        vaccination_status = VALUES(vaccination_status),
        heart_rate = VALUES(heart_rate),
        heart_rate_bpm = VALUES(heart_rate_bpm),
        location = VALUES(location),
        date_rescued = VALUES(date_rescued),
        date_added = VALUES(date_added),
        last_updated = VALUES(last_updated),
        bio = VALUES(bio),
        photo_url = VALUES(photo_url)`,
      buildInsertValues(input)
    );
  },

  async update(id: string, input: UpdateAnimalInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const setField = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (input.name !== undefined) setField('name', input.name);
    if (input.species !== undefined) setField('species', input.species);
    if (input.breed !== undefined) setField('breed', input.breed);
    if (input.sex !== undefined) setField('sex', input.sex);
    if (input.age !== undefined) setField('age', input.age);
    if (input.size !== undefined) setField('size', input.size);
    if (input.colorMarkings !== undefined) setField('color_markings', input.colorMarkings);
    if (input.rescueStatus !== undefined) setField('rescue_status', input.rescueStatus);
    if (input.adoptionStatus !== undefined) setField('adoption_status', input.adoptionStatus);
    if (input.healthStatus !== undefined) setField('health_status', input.healthStatus);
    if (input.vaccinationStatus !== undefined) {
      setField('vaccination_status', input.vaccinationStatus);
    }
    if (input.heartRate !== undefined) {
      setField('heart_rate', input.heartRate);
      setField('heart_rate_bpm', parseHeartRateBpm(input.heartRate));
    }
    if (input.location !== undefined) setField('location', input.location);
    if (input.dateRescued !== undefined) {
      setField('date_rescued', input.dateRescued ? parseDisplayDate(input.dateRescued) : null);
    }
    if (input.dateAdded !== undefined) {
      setField('date_added', parseDisplayDate(input.dateAdded));
    }
    if (input.lastUpdated !== undefined) {
      setField('last_updated', parseDisplayDate(input.lastUpdated));
    }
    if (input.bio !== undefined) setField('bio', input.bio);
    if (input.photo !== undefined) setField('photo_url', input.photo);

    if (fields.length === 0) return true;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE animals SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM animals WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
