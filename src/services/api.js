/**
 * services/api.js
 * Cliente HTTP base para comunicação com o backend FastAPI.
 *
 * Em desenvolvimento: proxy do Vite redireciona /api → localhost:8000
 * Em produção (Netlify): proxy do netlify.toml redireciona /api → Railway
 */
import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Injeta JWT em toda requisição ─────────────────────────────── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sibd_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Tenta refresh automático em 401 ──────────────────────────── */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Se 401 e ainda não tentamos refresh nesta requisição
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = localStorage.getItem('sibd_refresh_token')

      // Sem refresh token → vai para login
      if (!refreshToken) {
        localStorage.removeItem('sibd_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Outra requisição já está renovando — coloca na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
        localStorage.setItem('sibd_token',         data.access_token)
        localStorage.setItem('sibd_refresh_token', data.refresh_token)
        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
        processQueue(null, data.access_token)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('sibd_token')
        localStorage.removeItem('sibd_refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

