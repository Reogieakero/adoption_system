export type RescueStage = 'New Reports' | 'Verified Reports' | 'Rescue Operations';

export interface RescueCase {
  id: string;
  animalType: string;
  condition: string;
  location: string;
  reporter: string;
  priority: string;
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
  timelineSteps: { title: string; timestamp: string; active: boolean }[];
}

export interface WorkflowAction {
  id: string;
  label: string;
}

