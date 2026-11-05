import axios from 'axios'
import apiClient from './apiClient'

export class ApiError extends Error {
  constructor(message, status = 0, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function normalizeError(error) {
  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    const canceled = new Error('Solicitud cancelada')
    canceled.name = 'AbortError'
    return canceled
  }

  if (error.response) {
    const data = error.response.data
    return new ApiError(
      data?.mensaje ?? `El servidor respondió con el estado ${error.response.status}.`,
      error.response.status,
      data?.errores ?? [],
    )
  }

  return new ApiError(
    'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
    0,
  )
}

async function request(config) {
  try {
    const response = await apiClient.request(config)

    if (response.status === 204) {
      return null
    }

    return response.data ?? null
  } catch (error) {
    throw normalizeError(error)
  }
}

export const api = {
  list(resource, options = {}) {
    return request({
      url: `/${resource}`,
      method: 'GET',
      signal: options.signal,
    })
  },
  create(resource, payload) {
    return request({ url: `/${resource}`, method: 'POST', data: payload })
  },
  update(resource, id, payload) {
    return request({ url: `/${resource}/${id}`, method: 'PUT', data: payload })
  },
  remove(resource, id) {
    return request({ url: `/${resource}/${id}`, method: 'DELETE' })
  },
  login(credentials) {
    return request({ url: '/auth/login', method: 'POST', data: credentials })
  },
  register(payload) {
    return request({ url: '/auth/register', method: 'POST', data: payload })
  },
  profile() {
    return request({ url: '/auth/perfil', method: 'GET' })
  },
  assistantStatus() {
    return request({ url: '/asistente/estado', method: 'GET' })
  },
  assistantChat(messages) {
    return request({
      url: '/asistente/chat',
      method: 'POST',
      data: { messages },
    })
  },
}
