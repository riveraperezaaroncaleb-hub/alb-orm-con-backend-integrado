import { useCallback, useMemo } from 'react'
import { api } from '../services/api'
import { useFetch } from './useFetch'

export function useCollection(resource) {
  const request = useCallback((options) => api.list(resource, options), [resource])
  const { data, isLoading, error, refetch } = useFetch(request)
  const items = useMemo(() => data ?? [], [data])

  return { items, isLoading, error, refetch }
}
