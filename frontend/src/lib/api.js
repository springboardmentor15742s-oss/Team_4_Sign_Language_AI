const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data.detail || data.message || 'Request failed'
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }
  return data
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
}
