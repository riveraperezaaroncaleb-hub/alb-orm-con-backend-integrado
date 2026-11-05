const TOKEN_KEY = 'inventario_token'
const USER_KEY = 'inventario_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredSession() {
  const token = getToken()
  if (!token) return null

  const rawUser = localStorage.getItem(USER_KEY)
  let user = null

  if (rawUser) {
    try {
      user = JSON.parse(rawUser)
    } catch {
      user = null
    }
  }

  return { token, user }
}

export function saveSession({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
