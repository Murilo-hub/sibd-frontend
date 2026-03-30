/**
 * hooks/useAuth.js
 * Hook de autenticação — login, registro, logout.
 */
import { useState, useCallback } from 'react'
import { authService } from '../services/authService'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      await authService.login(email, password)
      return true
    } catch (err) {
      setError(err.response?.data?.detail ?? 'E-mail ou senha inválidos.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      await authService.register(name, email, password)
      return true
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Erro ao criar conta. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    login,
    register,
    logout: authService.logout,
    isAuthenticated: authService.isAuthenticated(),
    loading,
    error,
  }
}
