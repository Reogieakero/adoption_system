import { RescueCase, RescueCaseRow, RescueTimelineStepRow } from '../types/rescue.types';
import { formatDateTime } from './dateHelpers';

export function rowToRescueCase(row: RescueCaseRow, timeline: RescueTimelineStepRow[]): RescueCase {
  const isAnonymous = Boolean(row.is_anonymous);

  return {
    id: row.id,
    animalType: row.animal_type,
    condition: row.condition_description,
    location: row.location,
    reporter: row.reporter_name,
    priority: row.priority,
    stage: row.stage,
    reportedDate: formatDateTime(row.reported_at) ?? '',
    imageUrl: row.image_url,
    coords: { lat: Number(row.latitude), lon: Number(row.longitude) },
    status: row.status,
    species: row.species,
    breed: row.breed,
    estimatedAge: row.estimated_age,
    sex: row.sex,
    colorMarkings: row.color_markings,
    size: row.size,
    injuries: row.injuries,
    temperament: row.temperament,
    collarTag: row.collar_tag,
    animalsInvolved: row.animals_involved,
    lastSeen: formatDateTime(row.last_seen_at) ?? 'Unknown',
    currentSituation: row.current_situation,
    barangay: row.barangay,
    landmarks: row.landmarks,
    contactNumber: isAnonymous ? 'Withheld by Reporter' : row.contact_number,
    email: isAnonymous ? 'Withheld by Reporter' : row.email,
    reporterType: row.reporter_type,
    anonymous: isAnonymous ? 'Yes' : 'No',
    assignedRescuer: row.assigned_rescuer ?? 'Pending Assignment',
    rescueTeam: row.rescue_team ?? 'Pending Assignment',
    assignedDate: formatDateTime(row.assigned_at) ?? 'Not Yet Assigned',
    eta: row.eta ?? 'Not Yet Calculated',
    dispatchTime: formatDateTime(row.dispatch_time) ?? 'Not Yet Dispatched',
    outcome: row.outcome ?? 'Pending',
    animalName: row.animal_name ?? 'Unknown / Unassigned',
    incidentDescription: row.incident_description,
    additionalNotes: row.additional_notes ?? 'N/A',
    operationalStatus: row.operational_status,
    verificationStatus: row.verification_status,
    completionTime: row.completion_time ?? '--:--',
    internalNotes: row.internal_notes ?? '',
    evidenceFileName: row.evidence_file_name ?? '',
    timelineSteps: [...timeline]
      .sort((a, b) => a.step_order - b.step_order)
      .map((step) => ({
        title: step.title,
        timestamp: step.step_timestamp,
        active: Boolean(step.is_active),
      })),
  };
}