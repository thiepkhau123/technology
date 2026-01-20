import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  'https://vagtpvxlsrzhwkjyvquq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZ3Rwdnhsc3J6aHdranl2cXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NjU3OTMsImV4cCI6MjA4NDA0MTc5M30.u5A6Cj_4siiiQOa5DyM84PvSA2da4LbCG-mGXCzae30'
)
