import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// This client is ready for storage. Just add the env variables.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
