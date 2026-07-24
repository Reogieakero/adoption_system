import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { CreatePetInput, UpdatePetInput } from '../types/pet.types';
import { PetRow, PetPhotoRow, Pet3dAssetRow } from '../utils/petMapper';

export const petRepository = {
  async findAll(): Promise<PetRow[]> {
    const [rows] = await pool.query<PetRow[]>(
      `SELECT p.*, COALESCE(hr.health_status, 'Healthy') AS health_status
       FROM pets p
       LEFT JOIN health_records hr ON hr.pet_id = p.pet_id
       WHERE p.deleted_at IS NULL
       ORDER BY p.created_at DESC, p.name ASC`
    );
    return rows;
  },

  async findById(id: number): Promise<PetRow | undefined> {
    const [rows] = await pool.query<PetRow[]>(
      `SELECT p.*, COALESCE(hr.health_status, 'Healthy') AS health_status
       FROM pets p
       LEFT JOIN health_records hr ON hr.pet_id = p.pet_id
       WHERE p.pet_id = ?`,
      [id]
    );
    return rows[0];
  },

  async create(input: CreatePetInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO pets (source_type, posted_by_user_id, species, breed_type, breed_detail, name, age_estimate, sex, description, status, rejection_reason, location_area, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.source_type,
        input.posted_by_user_id ?? null,
        input.species,
        input.breed_type,
        input.breed_detail ?? null,
        input.name,
        input.age_estimate ?? null,
        input.sex,
        input.description ?? null,
        input.status,
        input.rejection_reason ?? null,
        input.location_area ?? null,
        input.created_by_user_id,
      ]
    );
    return result.insertId;
  },

  async update(id: number, input: UpdatePetInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const setField = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (input.source_type !== undefined) setField('source_type', input.source_type);
    if (input.posted_by_user_id !== undefined) setField('posted_by_user_id', input.posted_by_user_id);
    if (input.species !== undefined) setField('species', input.species);
    if (input.breed_type !== undefined) setField('breed_type', input.breed_type);
    if (input.breed_detail !== undefined) setField('breed_detail', input.breed_detail);
    if (input.name !== undefined) setField('name', input.name);
    if (input.age_estimate !== undefined) setField('age_estimate', input.age_estimate);
    if (input.sex !== undefined) setField('sex', input.sex);
    if (input.description !== undefined) setField('description', input.description);
    if (input.status !== undefined) setField('status', input.status);
    if (input.rejection_reason !== undefined) setField('rejection_reason', input.rejection_reason);
    if (input.location_area !== undefined) setField('location_area', input.location_area);
    if (input.updated_by_user_id !== undefined) setField('updated_by_user_id', input.updated_by_user_id);

    if (fields.length === 0) return true;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE pets SET ${fields.join(', ')} WHERE pet_id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  },

  async softDelete(id: number, deletedByUserId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE pets SET deleted_at = NOW(), deleted_by_user_id = ? WHERE pet_id = ?',
      [deletedByUserId, id]
    );
    return result.affectedRows > 0;
  },

  async findPhotosByPetId(petId: number): Promise<PetPhotoRow[]> {
    const [rows] = await pool.query<PetPhotoRow[]>(
      'SELECT * FROM pet_photos WHERE pet_id = ? ORDER BY is_primary DESC, uploaded_at ASC',
      [petId]
    );
    return rows;
  },

  async findPrimaryPhotoByPetId(petId: number): Promise<PetPhotoRow | undefined> {
    const [rows] = await pool.query<PetPhotoRow[]>(
      'SELECT * FROM pet_photos WHERE pet_id = ? AND is_primary = 1 LIMIT 1',
      [petId]
    );
    return rows[0];
  },

  async find3dAssetByPetId(petId: number): Promise<Pet3dAssetRow | undefined> {
    const [rows] = await pool.query<Pet3dAssetRow[]>(
      'SELECT * FROM pet_3d_assets WHERE pet_id = ? LIMIT 1',
      [petId]
    );
    return rows[0];
  },

  async updateModel3dAsset(petId: number, assetUrl: string, assetType: 'model_3d' | '360_view'): Promise<void> {
    await pool.query(
      `INSERT INTO pet_3d_assets (pet_id, asset_url, asset_type)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE asset_url = VALUES(asset_url), asset_type = VALUES(asset_type)`,
      [petId, assetUrl, assetType]
    );
  },
};
