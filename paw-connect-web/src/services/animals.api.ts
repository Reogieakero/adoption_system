import { createServiceClient, buildFormData } from '@/lib/api-client';
import type { Animal } from '@/types';

export type UpdateAnimalPayload = Partial<Omit<Animal, 'id'>>;
export type CreateAnimalPayload = Animal;

const { request } = createServiceClient('/api/admin/animals');

export async function fetchAnimals(): Promise<Animal[]> {
  const data = await request<{ success: true; animals: Animal[] }>('');
  return data.animals;
}

export async function fetchAnimalById(id: string): Promise<Animal> {
  const data = await request<{ success: true; animal: Animal }>(`/${encodeURIComponent(id)}`);
  return data.animal;
}

export async function createAnimal(
  payload: CreateAnimalPayload,
  photoFile: File | null = null
): Promise<Animal> {
  const data = await request<{ success: true; animal: Animal }>('', {
    method: 'POST',
    body: buildFormData(payload as unknown as Record<string, unknown>, 'photo', photoFile),
  });
  return data.animal;
}

export async function updateAnimal(
  id: string,
  payload: UpdateAnimalPayload,
  photoFile: File | null = null
): Promise<Animal> {
  const data = await request<{ success: true; animal: Animal }>(
    `/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: buildFormData(payload as unknown as Record<string, unknown>, 'photo', photoFile),
    }
  );
  return data.animal;
}

export async function deleteAnimal(id: string): Promise<void> {
  await request<{ success: true; message: string }>(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
