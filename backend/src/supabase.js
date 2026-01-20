import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()   // 🔥 PHẢI Ở TRÊN CÙNG

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL')
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)
