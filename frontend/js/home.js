import { supabase } from './supabase.js'

const authArea = document.getElementById('auth-area')

async function loadUser() {
  const { data: { session } } = await supabase.auth.getSession()

  // CHƯA LOGIN
  if (!session) {
    authArea.innerHTML = `
      <a href="/login.html" class="px-4 py-2 bg-blue-600 text-white rounded">Login</a>
      <a href="/register.html" class="px-4 py-2 border border-blue-600 text-blue-600 rounded">Register</a>
    `
    return
  }

  // ĐÃ LOGIN
  const user = session.user

  let html = `
    <span class="text-gray-700">👋 ${user.email}</span>
    <button id="logout" class="text-red-600">Logout</button>
  `

  // kiểm tra role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    html += `<a href="/admin.html" class="ml-3 text-blue-600">Admin</a>`
  }

  authArea.innerHTML = html

  document.getElementById('logout').onclick = async () => {
    await supabase.auth.signOut()
    location.reload()
  }
}

loadUser()
