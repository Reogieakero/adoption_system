'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdoptionApplication, ApplicationDetails } from '@/app/admin/adoptions/types';
import { fetchAdoptionDetails, fetchAdoptions } from '@/services/adoptions.api';

interface UseAdoptionsResult {
  applications: AdoptionApplication[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setApplications: React.Dispatch<React.SetStateAction<AdoptionApplication[]>>;
}

export function useAdoptions(): UseAdoptionsResult {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdoptions();
      setApplications(data);
    } catch (err) {
      setApplications([]);
      setError(err instanceof Error ? err.message : 'Failed to load adoption applications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { applications, isLoading, error, refetch, setApplications };
}

interface UseAdoptionDetailsResult {
  details: ApplicationDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function useAdoptionDetails(id: string | null): UseAdoptionDetailsResult {
  const [details, setDetails] = useState<ApplicationDetails | null>(null);
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

    fetchAdoptionDetails(id)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setDetails(null);
          setError(err instanceof Error ? err.message : 'Failed to load application details');
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

