export type HealthStatus = "Healthy" | "Under Treatment" | "Recovering" | "Critical"
export type VaccinationStatus = "Vaccinated" | "Not Fully Vaccinated" | "Due" | "Not Vaccinated"
export type DropdownName = "species" | "health" | "vaccine" | null

export interface HistoryEntry {
  date: string
  event: string
  notes: string
}

export interface Animal {
  id: string
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