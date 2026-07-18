'use client';

import React from 'react';
import { useAnimals } from '@/hooks/admin/use-animals';
import { createAnimal } from '@/services/animals.api';
import AnimalForm, { type AnimalFormData } from '../components/animal-form';
import type { Animal } from '@/types';

function generateNextAnimalId(existingAnimals: Animal[]): string {
  const year = new Date().getFullYear();
  const prefix = `ANM-${year}-`;
  const usedNumbers = existingAnimals
    .map((a) => a.id)
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n));
  const next = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

export default function NewAnimalPage() {
  const { animals, refetch } = useAnimals();

  const handleSave = async (data: AnimalFormData, photoFile: File | null) => {
    const animal: Animal = {
      ...data,
      model3dUrl: null,
      model3dStatus: 'none',
      species: data.species as Animal['species'],
      sex: data.sex as Animal['sex'],
      size: data.size as Animal['size'],
      rescueStatus: data.rescueStatus as Animal['rescueStatus'],
      adoptionStatus: data.adoptionStatus as Animal['adoptionStatus'],
      healthStatus: data.healthStatus as Animal['healthStatus'],
      vaccinationStatus: data.vaccinationStatus as Animal['vaccinationStatus'],
    };
    await createAnimal(animal, photoFile);
    await refetch();
  };

  const initialData: AnimalFormData = {
    ...{
      id: generateNextAnimalId(animals),
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
    },
  };

  return <AnimalForm initialData={null} onSave={handleSave} isNew={true} title="Add New Animal" />;
}
