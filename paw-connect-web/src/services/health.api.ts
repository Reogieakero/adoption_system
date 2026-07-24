import { createServiceClient } from '@/lib/api-client';
import type { HealthRecord, UpdateHealthRecordPayload, CreateHealthRecordPayload, HealthAnimal, HealthHistoryEntry } from '@/types';

const { request } = createServiceClient('/api/admin/health');

function deriveHealthStatus(record: HealthRecord): string {
  const bpm = record.heart_rate_bpm;
  if (bpm == null) return 'Healthy';
  if (bpm > 140) return 'Critical';
  if (bpm > 100) return 'Under Treatment';
  if (bpm > 80) return 'Recovering';
  return 'Healthy';
}

const HISTORY_LINE_RE = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\] (\d+) bpm - (.+?): (.+)$/;

function parseHistoryLine(line: string, index: number): HealthHistoryEntry {
  const m = line.match(HISTORY_LINE_RE);
  if (m) {
    return { date: m[1], bpm: Number(m[2]), event: m[3], notes: m[4] };
  }
  return { date: '', event: `Event ${index + 1}`, notes: line };
}

function recordToHealthAnimal(record: HealthRecord): HealthAnimal {
  return {
    id: String(record.pet_id),
    tag: record.pet_species,
    name: record.pet_name,
    species: record.pet_species,
    breed: record.pet_breed_type,
    photo: record.pet_photo_url ?? '',
    heartRate: record.heart_rate_bpm ?? 0,
    healthStatus: record.health_status ?? deriveHealthStatus(record),
    vaccinationStatus: record.vaccination_status ?? 'Unknown',
    history: record.medical_history
      ? record.medical_history.split('\n').filter(Boolean).map((line, i) => parseHistoryLine(line, i))
      : [],
  };
}

export async function fetchHealthRecords(): Promise<HealthRecord[]> {
  const data = await request<{ success: true; records: HealthRecord[] }>('');
  return data.records;
}

export async function fetchAnimalsHealth(): Promise<HealthAnimal[]> {
  const records = await fetchHealthRecords();
  return records.map(recordToHealthAnimal);
}

export async function fetchHealthRecordByPetId(petId: number): Promise<HealthRecord> {
  const data = await request<{ success: true; record: HealthRecord }>(
    `/${encodeURIComponent(petId)}`
  );
  return data.record;
}

export async function fetchAnimalHealthDetail(id: string): Promise<HealthAnimal> {
  const record = await fetchHealthRecordByPetId(Number(id));
  return recordToHealthAnimal(record);
}

export async function upsertHealthRecord(
  petId: number,
  payload: CreateHealthRecordPayload
): Promise<HealthRecord> {
  const data = await request<{ success: true; record: HealthRecord }>(
    `/${encodeURIComponent(petId)}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  return data.record;
}

export async function updateHealthRecord(
  petId: number,
  payload: UpdateHealthRecordPayload
): Promise<HealthRecord> {
  const data = await request<{ success: true; record: HealthRecord }>(
    `/${encodeURIComponent(petId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
  return data.record;
}
