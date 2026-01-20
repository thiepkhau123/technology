const API_URL = 'http://localhost:4000/api'

export async function apiFetch(path, method = 'GET', body) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : null
  })

  return res.json()
}
