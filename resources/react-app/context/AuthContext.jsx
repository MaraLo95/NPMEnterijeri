import { createContext, useContext, useEffect, useCallback } from 'react'
import { refreshAuthToken } from '../config/api'

const AuthContext = createContext()

const REFRESH_INTERVAL_MS = 25 * 60 * 1000 // 25 min

export function AuthProvider({ children }) {
  const refreshAndSync = useCallback(async () => {
    const newToken = await refreshAuthToken()
    if (newToken) {
      window.dispatchEvent(new CustomEvent('auth:dataSync'))
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const isAdmin = localStorage.getItem('npm_admin_auth')
    if (!token || !isAdmin) return

    const interval = setInterval(refreshAndSync, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refreshAndSync])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return
      const token = localStorage.getItem('auth_token')
      const isAdmin = localStorage.getItem('npm_admin_auth')
      if (!token || !isAdmin) return
      refreshAndSync()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [refreshAndSync])

  useEffect(() => {
    const handleSessionExpired = () => {
      window.location.href = '/admin/login'
    }
    window.addEventListener('auth:sessionExpired', handleSessionExpired)
    return () => window.removeEventListener('auth:sessionExpired', handleSessionExpired)
  }, [])

  return (
    <AuthContext.Provider value={{ refreshAndSync }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx || {}
}
