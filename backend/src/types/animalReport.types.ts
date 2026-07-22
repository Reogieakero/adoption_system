export type ReportSpecies = 'dog' | 'cat' | 'unknown';
export type ReportStatus = 'submitted' | 'in_progress' | 'dispatched' | 'resolved';

export interface AnimalReport {
  report_id: number;
  resident_id: number;
  species: ReportSpecies;
  condition_description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  location_area: string | null;
  contact_preference: string | null;
  status: ReportStatus;
  resolution_notes: string | null;
  is_synced: boolean;
  is_valid_for_heatmap: boolean;
  submitted_at: string;
  resolved_at: string | null;
  updated_at: string;
}

export interface AnimalReportRow extends AnimalReport {
  resident_name?: string;
  resident_email?: string;
}

export interface CreateAnimalReportInput {
  resident_id: number;
  species: ReportSpecies;
  condition_description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  location_area?: string | null;
  contact_preference?: string | null;
  is_valid_for_heatmap?: boolean;
}

export interface UpdateAnimalReportInput {
  status?: ReportStatus;
  resolution_notes?: string | null;
  resolved_at?: string | null;
}
