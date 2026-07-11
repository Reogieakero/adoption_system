import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import { StatusType } from '../types/adoption.types';
import { AdoptionListRow, AdoptionDetailsRow } from '../utils/adoptionMapper';

const LIST_QUERY = `
  SELECT
    aa.id,
    aa.applicant_name,
    aa.applicant_email,
    aa.application_date,
    aa.status,
    aa.assigned_staff_name,
    an.name AS animal_name,
    an.photo_url AS animal_photo,
    an.species AS species
  FROM adoption_applications aa
  JOIN animals an ON an.id = aa.animal_id
  ORDER BY aa.application_date DESC, aa.id DESC
`;

const DETAILS_QUERY = `
  SELECT
    aa.id, aa.applicant_name, aa.applicant_email, aa.application_date, aa.status,
    aa.animal_id, an.name AS animal_name, an.species AS species, an.photo_url AS animal_photo,

    p.applicant_id, p.profile_photo_url, p.date_of_birth, p.age, p.sex, p.civil_status, p.nationality,
    p.mobile_number, p.alternate_contact_number,
    p.home_address, p.barangay, p.city_municipality, p.province, p.zip_code,
    p.gov_id_type, p.gov_id_number, p.gov_id_photo_url,
    p.occupation, p.employer, p.monthly_income_range,
    p.residence_type, p.home_ownership, p.household_members, p.children,
    p.has_existing_pets, p.existing_pets_count,
    p.why_adopt, p.owned_pet_before, p.primary_caregiver, p.hours_alone,
    p.can_provide_vet_care, p.household_in_favor, p.has_secure_area,
    p.preferred_contact_method, p.preferred_adoption_date,
    p.emergency_contact_name, p.emergency_contact_relationship, p.emergency_contact_number,

    d.government_id_url, d.proof_of_address_url, d.proof_of_income_url, d.other_documents
  FROM adoption_applications aa
  JOIN animals an ON an.id = aa.animal_id
  LEFT JOIN adoption_application_profiles p ON p.application_id = aa.id
  LEFT JOIN adoption_application_documents d ON d.application_id = aa.id
  WHERE aa.id = ?
`;

export const adoptionRepository = {
  async findAll(): Promise<AdoptionListRow[]> {
    const [rows] = await pool.query<AdoptionListRow[]>(LIST_QUERY);
    return rows;
  },

  async findDetailsById(id: string): Promise<AdoptionDetailsRow | undefined> {
    const [rows] = await pool.query<AdoptionDetailsRow[]>(DETAILS_QUERY, [id]);
    return rows[0];
  },

  async exists(id: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM adoption_applications WHERE id = ?',
      [id]
    );
    return rows.length > 0;
  },

  async updateStatus(id: string, status: StatusType): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE adoption_applications SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  },
};