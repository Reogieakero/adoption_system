'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchAnalyticsOverview, AnalyticsOverview } from '@/services/analytics.api'

export function useAnalytics(dateRange?: string, species?: string) {
  const [data, setData] = useState<AnalyticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const overview = await fetchAnalyticsOverview(dateRange, species)
      setData(overview)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, species])

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, refetch: load }
}
