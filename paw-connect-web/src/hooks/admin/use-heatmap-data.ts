'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchHeatmapData, HeatmapData } from '@/services/heatmap.api';

interface UseHeatmapDataResult {
  data: HeatmapData;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EMPTY_DATA: HeatmapData = { rescuePoints: [], adoptionPoints: [] };

export function useHeatmapData(): UseHeatmapDataResult {
  const [data, setData] = useState<HeatmapData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchHeatmapData();
      setData(result);
    } catch (err) {
      setData(EMPTY_DATA);
      setError(err instanceof Error ? err.message : 'Failed to load heatmap data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

