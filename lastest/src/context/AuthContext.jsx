import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { clearSession, getStoredSession, saveSession } from '../services/session'
import { AuthContext } from './authContextValue'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const [isInitializing, setIsInitializing] = useState(() =>
    Boolean(getStoredSession()?.token),
  )

  useEffect(() => {
    const handleUnauthorized = () => setSession(null)

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  useEffect(() => {
    let active = true
    const stored = getStoredSession()

    if (!stored?.token) {
      return undefined
    }

    api
      .profile()
      .then((user) => {
        if (!active) return
        const next = { token: stored.token, user }
        saveSession(next)
        setSession(next)
      })
      .catch((error) => {
        if (!active) return

        if (error.status === 401) {
          clearSession()
          setSession(null)
        } else {
          setSession(stored)
        }
      })
      .finally(() => {
        if (active) setIsInitializing(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async ({ correo, password }) => {
    const data = await api.login({ correo, password })

    if (!data?.token) {
      throw new Error('El servidor no devolvió un token válido.')
    }

    const next = { token: data.token, user: data.usuario ?? null }
    saveSession(next)
    setSession(next)

    return next.user
  }, [])

  const register = useCallback(
    async (payload) => {
      await api.register(payload)
      return login({ correo: payload.correo, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isInitializing,
      login,
      register,
      logout,
    }),
    [session, isInitializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
