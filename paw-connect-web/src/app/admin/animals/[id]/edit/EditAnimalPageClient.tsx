'use client';

import React from 'react';
import { useAnimal } from '@/hooks/admin/use-animals';
import { updateAnimal, type UpdateAnimalPayload } from '@/services/animals.api';
import AnimalForm, { type AnimalFormData } from '../../components/animal-form';
import NotFound from '../components/NotFound';

function toPayload(data: AnimalFormData): UpdateAnimalPayload {
  return {
    name: data.name,
    species: data.species as UpdateAnimalPayload['species'],
    breed: data.breed,
    sex: data.sex as UpdateAnimalPayload['sex'],
    age: data.age,
    size: data.size as UpdateAnimalPayload['size'],
    colorMarkings: data.colorMarkings,
    rescueStatus: data.rescueStatus as UpdateAnimalPayload['rescueStatus'],
    adoptionStatus: data.adoptionStatus as UpdateAnimalPayload['adoptionStatus'],
    healthStatus: data.healthStatus as UpdateAnimalPayload['healthStatus'],
    vaccinationStatus: data.vaccinationStatus as UpdateAnimalPayload['vaccinationStatus'],
    heartRate: data.heartRate,
    location: data.location,
    dateRescued: data.dateRescued,
    dateAdded: data.dateAdded,
    bio: data.bio,
    photo: data.photo,
  };
}

export default function EditAnimalPageClient({ id }: { id: string }) {
  const { animal, isLoading, error, refetch } = useAnimal(id);

  if (isLoading) return <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading animal record...</p>;
  if (error) return <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }} role="alert">{error}</p>;
  if (!animal) return <NotFound id={id} backHref="/admin/animals" />;

  const handleSave = async (data: AnimalFormData, _photoFile: File | null) => {
    await updateAnimal(animal.id, toPayload(data));
    await refetch();
  };

  const initialData: AnimalFormData = {
    id: animal.id,
    name: animal.name,
    species: animal.species,
    breed: animal.breed,
    sex: animal.sex,
    age: animal.age,
    size: (animal as any).size || 'Medium',
    colorMarkings: (animal as any).colorMarkings || '',
    rescueStatus: (animal as any).rescueStatus || 'In Shelter',
    adoptionStatus: animal.adoptionStatus,
    healthStatus: animal.healthStatus,
    vaccinationStatus: (animal as any).vaccinationStatus || 'Vaccinated',
    heartRate: (animal as any).heartRate || '',
    location: (animal as any).location || '',
    dateRescued: (animal as any).dateRescued || '',
    dateAdded: (animal as any).dateAdded || '',
    lastUpdated: (animal as any).lastUpdated || '',
    bio: animal.bio || '',
    photo: animal.photo || '',
  };

  return <AnimalForm initialData={initialData} onSave={handleSave} isNew={false} title={`Edit ${animal.name}`} />;
}
