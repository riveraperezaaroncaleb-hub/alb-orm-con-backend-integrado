import { API_BASE_URL } from '../config'

export class ApiError extends Error {
  constructor(message, status = 0, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
      0,
    )
  }

  if (response.status === 204) {
    return null
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // respuestas sin cuerpo JSON: se conserva null
  }

  if (!response.ok) {
    throw new ApiError(
      data?.mensaje ?? `El servidor respondió con el estado ${response.status}.`,
      response.status,
      data?.errores ?? [],
    )
  }

  return data
}

export const api = {
  list(resource, options = {}) {
    return request(`/${resource}`, options)
  },
  create(resource, payload) {
    return request(`/${resource}`, { method: 'POST', body: payload })
  },
  update(resource, id, payload) {
    return request(`/${resource}/${id}`, { method: 'PUT', body: payload })
  },
  remove(resource, id) {
    return request(`/${resource}/${id}`, { method: 'DELETE' })
  },
}
