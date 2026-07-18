'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RescueCase } from '@/types';
import { fetchRescueDetails, fetchRescues } from '@/services/rescues.api';

interface UseRescuesResult {
  cases: RescueCase[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setCases: React.Dispatch<React.SetStateAction<RescueCase[]>>;
}

export function useRescues(): UseRescuesResult {
  const [cases, setCases] = useState<RescueCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRescues();
      setCases(data);
    } catch (err) {
      setCases([]);
      setError(err instanceof Error ? err.message : 'Failed to load rescue cases');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { cases, isLoading, error, refetch, setCases };
}

interface UseRescueDetailsResult {
  details: RescueCase | null;
  isLoading: boolean;
  error: string | null;
}

export function useRescueDetails(id: string | null): UseRescueDetailsResult {
  const [details, setDetails] = useState<RescueCase | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDetails(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchRescueDetails(id)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setDetails(null);
          setError(err instanceof Error ? err.message : 'Failed to load rescue case details');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { details, isLoading, error };
}
