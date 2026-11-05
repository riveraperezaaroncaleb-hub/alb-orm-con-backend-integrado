import axios from 'axios'
import { API_BASE_URL } from '../config'
import { clearSession, getToken } from './session'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isAuthRequest =
      url.includes('/auth/login') || url.includes('/auth/register')

    if (status === 401 && !isAuthRequest) {
      clearSession()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    return Promise.reject(error)
  },
)

export default apiClient
