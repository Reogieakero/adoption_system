'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HealthAnimal } from '@/types';
import { fetchAnimalHealthDetail, fetchAnimalsHealth } from '@/services/health.api';

interface UseAnimalsHealthResult {
  animals: HealthAnimal[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setAnimals: React.Dispatch<React.SetStateAction<HealthAnimal[]>>;
}

export function useAnimalsHealth(): UseAnimalsHealthResult {
  const [animals, setAnimals] = useState<HealthAnimal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAnimalsHealth();
      setAnimals(data);
    } catch (err) {
      setAnimals([]);
      setError(err instanceof Error ? err.message : 'Failed to load animal health data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { animals, isLoading, error, refetch, setAnimals };
}

interface UseAnimalHealthDetailResult {
  animal: HealthAnimal | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnimalHealthDetail(id: string | null): UseAnimalHealthDetailResult {
  const [animal, setAnimal] = useState<HealthAnimal | null>(null);
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
      const data = await fetchAnimalHealthDetail(id);
      setAnimal(data);
    } catch (err) {
      setAnimal(null);
      setError(err instanceof Error ? err.message : 'Failed to load animal health history');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { animal, isLoading, error, refetch };
}
