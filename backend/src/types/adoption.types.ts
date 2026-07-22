export type AdoptionStatus = 'pending_review' | 'approved' | 'rejected' | 'pet_unavailable';

export interface AdoptionApplication {
  application_id: number;
  pet_id: number;
  resident_id: number;
  status: AdoptionStatus;
  rejection_reason: string | null;
  reason_for_adopting: string | null;
  living_situation: string | null;
  has_other_pets: boolean | null;
  household_members_count: number | null;
  additional_notes: string | null;
  submitted_at: string;
  decided_at: string | null;
  decided_by_admin_id: number | null;
  handover_confirmed_at: string | null;
  updated_at: string;
}

export interface AdoptionApplicationWithDetails extends AdoptionApplication {
  pet_name: string;
  pet_species: string;
  pet_photo_url: string | null;
  resident_name: string;
  resident_email: string;
}

export interface UpdateApplicationStatusInput {
  status: AdoptionStatus;
  rejection_reason?: string | null;
}

export interface CreateAdoptionApplicationInput {
  pet_id: number;
  resident_id: number;
  reason_for_adopting?: string | null;
  living_situation?: string | null;
  has_other_pets?: boolean | null;
  household_members_count?: number | null;
  additional_notes?: string | null;
}
