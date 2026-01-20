import { supabaseAdmin } from '../supabase.js'

export function requireRole(role) {
  return async (req, res, next) => {
    const userId = req.user.id

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) return res.status(500).json(error)
    if (data.role !== role)
      return res.status(403).json({ message: 'Forbidden' })

    next()
  }
}
