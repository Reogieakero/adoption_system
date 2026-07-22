'use client';

import React from 'react';
import { useAnimals } from '@/hooks/admin/use-animals';
import { createPet } from '@/services/animals.api';
import AnimalForm, { type AnimalFormData } from '../components/animal-form';
import type { Pet } from '@/types';

export default function NewAnimalPage() {
  const { animals, refetch } = useAnimals();

  const handleSave = async (data: AnimalFormData, photoFile: File | null) => {
    const species = data.species.toLowerCase() as Pet['species'];
    const sex = data.sex.toLowerCase() as Pet['sex'];
    const status = data.adoptionStatus.toLowerCase() as Pet['status'];
    const breedType = (data.breed === 'Aspin' || data.breed?.toLowerCase().includes('aspin')) ? 'aspin' :
      (data.breed === 'Puspin' || data.breed?.toLowerCase().includes('puspin')) ? 'puspin' : 'other' as Pet['breed_type'];

    await createPet({
      source_type: 'shelter',
      species,
      breed_type: breedType,
      breed_detail: data.breed || null,
      name: data.name,
      age_estimate: data.age || null,
      sex,
      description: data.bio || null,
      status,
      location_area: data.location || null,
    }, photoFile);
    await refetch();
  };

  const initialData: AnimalFormData = {
    id: '',
    name: '',
    species: 'Dog',
    breed: '',
    sex: 'Male',
    age: '',
    size: 'Small',
    colorMarkings: '',
    rescueStatus: 'Reported',
    adoptionStatus: 'Available',
    healthStatus: 'Healthy',
    vaccinationStatus: 'Vaccinated',
    heartRate: '',
    location: '',
    dateRescued: '',
    dateAdded: '',
    lastUpdated: '',
    bio: '',
    photo: '',
  };

  return <AnimalForm initialData={null} onSave={handleSave} isNew={true} title="Add New Animal" />;
}
