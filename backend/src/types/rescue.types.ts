import { RowDataPacket } from 'mysql2/promise';

export type RescueStage = 'New Reports' | 'Verified Reports' | 'Rescue Operations';
export type PriorityType = 'Critical' | 'High' | 'Medium' | 'Low';

export interface TimelineStep {
  title: string;
  timestamp: string;
  active: boolean;
}

// Shape returned to the frontend — matches RescueCase in your Next.js types.ts exactly
export interface RescueCase {
  id: string;
  animalType: string;
  condition: string;
  location: string;
  reporter: string;
  priority: PriorityType;
  stage: RescueStage;
  reportedDate: string;
  imageUrl: string;
  coords: { lat: number; lon: number };
  status: string;
  species: string;
  breed: string;
  estimatedAge: string;
  sex: string;
  colorMarkings: string;
  size: string;
  injuries: string;
  temperament: string;
  collarTag: string;
  animalsInvolved: number;
  lastSeen: string;
  currentSituation: string;
  barangay: string;
  landmarks: string;
  contactNumber: string;
  email: string;
  reporterType: string;
  anonymous: string;
  assignedRescuer: string;
  rescueTeam: string;
  assignedDate: string;
  eta: string;
  dispatchTime: string;
  outcome: string;
  animalName: string;
  incidentDescription: string;
  additionalNotes: string;
  operationalStatus: string;
  verificationStatus: string;
  completionTime: string;
  internalNotes: string;
  evidenceFileName: string;
  timelineSteps: TimelineStep[];
}

// ---- Raw MySQL row shapes (snake_case, as returned by mysql2) ----

export interface RescueCaseRow extends RowDataPacket {
  id: string;
  animal_type: string;
  condition_description: string;
  location: string;
  reporter_name: string;
  priority: PriorityType;
  stage: RescueStage;
  reported_at: Date;
  image_url: string;
  latitude: string; // DECIMAL columns come back as strings from mysql2
  longitude: string;
  status: string;
  species: string;
  breed: string;
  estimated_age: string;
  sex: string;
  color_markings: string;
  size: string;
  injuries: string;
  temperament: string;
  collar_tag: string;
  animals_involved: number;
  last_seen_at: Date | null;
  current_situation: string;
  barangay: string;
  landmarks: string;
  contact_number: string;
  email: string;
  reporter_type: string;
  is_anonymous: number; // tinyint(1)
  assigned_rescuer: string | null;
  rescue_team: string | null;
  assigned_at: Date | null;
  eta: string | null;
  dispatch_time: Date | null;
  outcome: string | null;
  animal_name: string | null;
  incident_description: string;
  additional_notes: string | null;
  operational_status: string;
  verification_status: string;
  completion_time: string | null;
  internal_notes: string | null;
  evidence_file_name: string | null;
  linked_animal_id: string | null;
}

export interface RescueTimelineStepRow extends RowDataPacket {
  id: number;
  rescue_case_id: string;
  step_order: number;
  title: string;
  step_timestamp: string;
  is_active: number;
}

export interface UpdateRescueStageInput {
  stage: RescueStage;
}

export interface UpdateRescueStatusInput {
  status: string;
}

export interface AssignRescuerInput {
  assignedRescuer: string;
  rescueTeam: string;
  eta?: string;
}

export interface UpdateRescuePriorityInput {
  priority: PriorityType;
}

export interface UpdateRescueNotesInput {
  internalNotes: string;
}

export interface UpdateRescueLocationInput {
  latitude: number;
  longitude: number;
}