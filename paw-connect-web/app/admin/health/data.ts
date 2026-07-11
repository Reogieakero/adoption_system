import { Animal } from './types'

// Added history mockup data to each animal for demonstration
export const animalsHealthData: Animal[] = [
  {
    id: 1,
    tag: "ANM-2026-001",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
    heartRate: 85,
    vaccinationStatus: "Vaccinated",
    healthStatus: "Healthy",
    history: [
      { date: "2026-05-12", event: "Routine Checkup", notes: "Normal vitals, healthy weight." },
      { date: "2026-02-10", event: "Rabies Booster", notes: "Administered successfully." }
    ]
  },
  {
    id: 2,
    tag: "ANM-2026-002",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    heartRate: 140,
    vaccinationStatus: "Due",
    healthStatus: "Under Treatment",
    history: [
      { date: "2026-07-01", event: "Ear Infection Treatment", notes: "Prescribed topical drops for 7 days." }
    ]
  },
  {
    id: 3,
    tag: "ANM-2026-003",
    name: "Rocky",
    species: "Dog",
    breed: "German Shepherd",
    photo: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=400",
    heartRate: 58,
    vaccinationStatus: "Not Vaccinated",
    healthStatus: "Critical",
    history: [
      { date: "2026-07-10", event: "Emergency Admission", notes: "Lethargic, abnormally low resting heart rate monitored closely." }
    ]
  },
  {
    id: 4,
    tag: "ANM-2026-004",
    name: "Bella",
    species: "Rabbit",
    breed: "Angora",
    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400",
    heartRate: 210,
    vaccinationStatus: "Vaccinated",
    healthStatus: "Healthy",
    history: []
  },
  {
    id: 5,
    tag: "ANM-2026-005",
    name: "Oliver",
    species: "Cat",
    breed: "British Shorthair",
    photo: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400",
    heartRate: 132,
    vaccinationStatus: "Vaccinated",
    healthStatus: "Healthy",
    history: []
  },
  {
    id: 6,
    tag: "ANM-2026-006",
    name: "Daisy",
    species: "Dog",
    breed: "Pomeranian",
    photo: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&q=80&w=400",
    heartRate: 98,
    vaccinationStatus: "Vaccinated",
    healthStatus: "Healthy",
    history: []
  }
]
