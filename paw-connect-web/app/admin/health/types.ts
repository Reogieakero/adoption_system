export type HealthStatus = "Healthy" | "Under Treatment" | "Critical"
export type VaccinationStatus = "Vaccinated" | "Due" | "Not Vaccinated"
export type DropdownName = "species" | "health" | "vaccine" | null

export interface HistoryEntry {
  date: string
  event: string
  notes: string
}

export interface Animal {
  id: number
  tag: string
  name: string
  species: string
  breed: string
  photo: string
  heartRate: number
  vaccinationStatus: VaccinationStatus
  healthStatus: HealthStatus
  history: HistoryEntry[]
}
