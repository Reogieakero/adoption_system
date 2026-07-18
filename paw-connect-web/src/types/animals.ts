export type AnimalSpecies = 'Dog' | 'Cat';
export type AnimalSex = 'Male' | 'Female';
export type AnimalSize = 'Small' | 'Medium' | 'Large';
export type RescueStatus = 'Reported' | 'Rescued' | 'In Shelter';
export type AnimalAdoptionStatus = 'Available' | 'Pending' | 'Adopted' | 'Unavailable';
export type HealthStatus = 'Healthy' | 'Under Treatment' | 'Recovering' | 'Critical';
export type VaccinationStatus = 'Vaccinated' | 'Not Fully Vaccinated';

export type Model3dStatus = 'none' | 'pending' | 'ready' | 'failed';

export interface Animal {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  age: string;
  size: AnimalSize;
  colorMarkings: string;
  rescueStatus: RescueStatus;
  adoptionStatus: AnimalAdoptionStatus;
  healthStatus: HealthStatus;
  vaccinationStatus: VaccinationStatus;
  heartRate: string;
  location: string;
  dateRescued: string;
  dateAdded: string;
  lastUpdated: string;
  bio: string;
  photo: string;
  model3dUrl: string | null;
  model3dStatus: Model3dStatus;
}
