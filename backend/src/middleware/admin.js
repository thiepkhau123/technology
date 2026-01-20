import { supabase } from '../supabase.js'

export async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'No token' })
  }

  const { data: userData, error } = await supabase.auth.getUser(token)

  if (error) {
    return res.status(401).json(error)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' })
  }

  req.user = userData.user
  next()
}
