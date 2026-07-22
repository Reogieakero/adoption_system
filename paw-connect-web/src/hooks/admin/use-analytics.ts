'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchAnalyticsOverview, AnalyticsOverview } from '@/services/analytics.api'

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const overview = await fetchAnalyticsOverview()
      setData(overview)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, refetch: load }
}
