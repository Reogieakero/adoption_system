import { createServiceClient, buildFormData } from '@/lib/api-client';
import type { Pet, PetFormData } from '@/types';

export type UpdatePetPayload = Partial<Omit<Pet, 'pet_id'>>;

const { request } = createServiceClient('/api/admin/pets');

export async function fetchPets(): Promise<Pet[]> {
  const data = await request<{ success: true; pets: Pet[] }>('');
  return data.pets;
}

export async function fetchPetById(id: number): Promise<Pet> {
  const data = await request<{ success: true; pet: Pet }>(`/${encodeURIComponent(id)}`);
  return data.pet;
}

export async function createPet(
  payload: PetFormData,
  photoFile: File | null = null
): Promise<Pet> {
  const data = await request<{ success: true; pet: Pet }>('', {
    method: 'POST',
    body: buildFormData(payload as unknown as Record<string, unknown>, 'photo', photoFile),
  });
  return data.pet;
}

export async function updatePet(
  id: number,
  payload: UpdatePetPayload,
  photoFile: File | null = null
): Promise<Pet> {
  const data = await request<{ success: true; pet: Pet }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildFormData(payload as unknown as Record<string, unknown>, 'photo', photoFile),
    }
  );
  return data.pet;
}

export async function deletePet(id: number): Promise<void> {
  await request<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
