import { useCallback, useEffect, useState } from 'react'

export function useFetch(request) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const run = async () => {
      try {
        const result = await request({ signal: controller.signal })
        if (!active) return
        setData(result)
        setError(null)
      } catch (err) {
        if (!active || err.name === 'AbortError') return
        setError(err)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    run()

    return () => {
      active = false
      controller.abort()
    }
  }, [request, reloadKey])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return { data, isLoading, error, refetch }
}
