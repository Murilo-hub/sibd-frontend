/**
 * services/authService.js
 * Chamadas de autenticação: login, registro, logout, refresh e perfil.
 */
import api from './api'

export const authService = {
  /** Login → salva tokens e retorna dados do usuário */
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('sibd_token',         data.access_token)
    localStorage.setItem('sibd_refresh_token', data.refresh_token)
    return data
  },

  /** Registro de novo usuário (não faz login automático) */
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  },

  /** Retorna dados do usuário logado */
  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },

  /** Renova o access token usando o refresh token salvo */
  async refresh() {
    const refresh_token = localStorage.getItem('sibd_refresh_token')
    if (!refresh_token) throw new Error('Sem refresh token')
    const { data } = await api.post('/auth/refresh', { refresh_token })
    localStorage.setItem('sibd_token',         data.access_token)
    localStorage.setItem('sibd_refresh_token', data.refresh_token)
    return data
  },

  /** Logout local — remove tokens */
  logout() {
    localStorage.removeItem('sibd_token')
    localStorage.removeItem('sibd_refresh_token')
    window.location.href = '/login'
  },

  /** Verifica se há token salvo */
  isAuthenticated() {
    return !!localStorage.getItem('sibd_token')
  },
}

