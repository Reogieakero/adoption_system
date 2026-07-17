'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Animal } from '@/app/admin/health/types';
import { fetchAnimalHealthDetail, fetchAnimalsHealth } from '@/services/health.api';

interface UseAnimalsHealthResult {
  animals: Animal[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
}

export function useAnimalsHealth(): UseAnimalsHealthResult {
  const [animals, setAnimals] = useState<Animal[]>([]);
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
  animal: Animal | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches the full health record (including history) for a single animal.
 * Pass null to skip fetching (e.g. when no detail view is open).
 */
export function useAnimalHealthDetail(id: string | null): UseAnimalHealthDetailResult {
  const [animal, setAnimal] = useState<Animal | null>(null);
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

