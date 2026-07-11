import { RowDataPacket } from 'mysql2/promise';
import { AdoptionApplication, ApplicationDetails, StatusType } from '../types/adoption.types';

export interface AdoptionListRow extends RowDataPacket {
  id: string;
  applicant_name: string;
  applicant_email: string;
  application_date: string | Date;
  status: StatusType;
  assigned_staff_name: string | null;
  animal_name: string;
  animal_photo: string;
  species: string;
}

export interface AdoptionDetailsRow extends RowDataPacket {
  id: string;
  applicant_name: string;
  applicant_email: string;
  application_date: string | Date;
  status: StatusType;
  animal_id: string;
  animal_name: string;
  species: string;
  animal_photo: string;

  applicant_id: string | null;
  profile_photo_url: string | null;
  date_of_birth: string | Date | null;
  age: number | null;
  sex: string | null;
  civil_status: string | null;
  nationality: string | null;

  mobile_number: string | null;
  alternate_contact_number: string | null;

  home_address: string | null;
  barangay: string | null;
  city_municipality: string | null;
  province: string | null;
  zip_code: string | null;

  gov_id_type: string | null;
  gov_id_number: string | null;
  gov_id_photo_url: string | null;

  occupation: string | null;
  employer: string | null;
  monthly_income_range: string | null;

  residence_type: 'House' | 'Apartment' | 'Condominium' | 'Others' | null;
  home_ownership: 'Owned' | 'Rented' | null;
  household_members: number | null;
  children: number | null;
  has_existing_pets: number | null;
  existing_pets_count: number | null;

  why_adopt: string | null;
  owned_pet_before: string | null;
  primary_caregiver: string | null;
  hours_alone: string | null;
  can_provide_vet_care: string | null;
  household_in_favor: string | null;
  has_secure_area: string | null;

  preferred_contact_method: string | null;
  preferred_adoption_date: string | Date | null;

  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_number: string | null;

  government_id_url: string | null;
  proof_of_address_url: string | null;
  proof_of_income_url: string | null;
  other_documents: string | null;
}

function toISODate(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

export function rowToAdoptionApplication(row: AdoptionListRow): AdoptionApplication {
  return {
    id: row.id,
    applicantName: row.applicant_name,
    applicantEmail: row.applicant_email,
    animalName: row.animal_name,
    animalPhoto: row.animal_photo,
    species: row.species,
    applicationDate: toISODate(row.application_date),
    status: row.status,
    assignedStaff: row.assigned_staff_name ?? undefined,
  };
}

export function rowToApplicationDetails(row: AdoptionDetailsRow): ApplicationDetails {
  let otherDocuments: string[] = [];
  if (row.other_documents) {
    try {
      const parsed =
        typeof row.other_documents === 'string' ? JSON.parse(row.other_documents) : row.other_documents;
      if (Array.isArray(parsed)) otherDocuments = parsed;
    } catch {
      otherDocuments = [];
    }
  }

  return {
    personal: {
      applicantId: row.applicant_id ?? '',
      fullName: row.applicant_name,
      profilePhoto: row.profile_photo_url ?? '',
      dateOfBirth: toISODate(row.date_of_birth),
      age: row.age ?? 0,
      sex: row.sex ?? '',
      civilStatus: row.civil_status ?? '',
      nationality: row.nationality ?? '',
    },
    contact: {
      email: row.applicant_email,
      mobileNumber: row.mobile_number ?? '',
      alternateContactNumber: row.alternate_contact_number ?? undefined,
    },
    address: {
      homeAddress: row.home_address ?? '',
      barangay: row.barangay ?? '',
      cityMunicipality: row.city_municipality ?? '',
      province: row.province ?? '',
      zipCode: row.zip_code ?? '',
    },
    identification: {
      govIdType: row.gov_id_type ?? '',
      govIdNumber: row.gov_id_number ?? undefined,
      govIdPhoto: row.gov_id_photo_url ?? '',
    },
    employment: {
      occupation: row.occupation ?? '',
      employer: row.employer ?? undefined,
      monthlyIncomeRange: row.monthly_income_range ?? undefined,
    },
    household: {
      residenceType: row.residence_type ?? 'House',
      homeOwnership: row.home_ownership ?? 'Owned',
      householdMembers: row.household_members ?? 0,
      children: row.children ?? 0,
      hasExistingPets: Boolean(row.has_existing_pets),
      existingPetsCount: row.existing_pets_count ?? 0,
    },
    questionnaire: {
      whyAdopt: row.why_adopt ?? '',
      ownedPetBefore: row.owned_pet_before ?? '',
      primaryCaregiver: row.primary_caregiver ?? '',
      hoursAlone: row.hours_alone ?? '',
      canProvideVetCare: row.can_provide_vet_care ?? '',
      householdInFavor: row.household_in_favor ?? '',
      hasSecureArea: row.has_secure_area ?? '',
    },
    documents: {
      governmentId: row.government_id_url ?? '',
      proofOfAddress: row.proof_of_address_url ?? '',
      proofOfIncome: row.proof_of_income_url ?? undefined,
      otherDocuments,
    },
    applicationInfo: {
      requestId: row.id,
      dateSubmitted: toISODate(row.application_date),
      status: row.status,
      preferredContactMethod: row.preferred_contact_method ?? '',
      preferredAdoptionDate: toISODate(row.preferred_adoption_date),
    },
    emergencyContact: {
      fullName: row.emergency_contact_name ?? '',
      relationship: row.emergency_contact_relationship ?? '',
      contactNumber: row.emergency_contact_number ?? '',
    },
  };
}