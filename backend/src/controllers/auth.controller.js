import { supabase } from '../supabase.js'

export async function register(req, res) {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return res.status(400).json(error)
  res.json(data)
}

export async function login(req, res) {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(400).json(error)
  res.json(data)
}
