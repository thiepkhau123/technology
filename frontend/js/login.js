async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()

  if (data.access_token) {
    localStorage.setItem('token', data.access_token)

    // Lưu user + role
    localStorage.setItem('user', JSON.stringify({
      email: data.user.email,
      role: data.user.user_metadata?.role || 'user'
    }))

    window.location.href = '/index.html'
  } else {
    alert('Login failed')
  }
}
