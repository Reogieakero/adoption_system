'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Pet } from '@/types';
import { fetchPetById, fetchPets } from '@/services/animals.api';

interface UseAnimalsResult {
  animals: Pet[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnimals(): UseAnimalsResult {
  const [animals, setAnimals] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPets();
      setAnimals(data);
    } catch (err) {
      setAnimals([]);
      setError(err instanceof Error ? err.message : 'Failed to load animals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { animals, isLoading, error, refetch };
}

interface UseAnimalResult {
  animal: Pet | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnimal(id: string | null): UseAnimalResult {
  const [animal, setAnimal] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setAnimal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const numericId = Number(id);
      const data = await fetchPetById(numericId);
      setAnimal(data);
    } catch (err) {
      setAnimal(null);
      setError(err instanceof Error ? err.message : 'Failed to load animal');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { animal, isLoading, error, refetch };
}
