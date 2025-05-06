// lib/supabase-server.ts
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

/**
 * Next.js 15 では cookies() が Promise になったため
 * 必ず「await cookies()」してから createServerComponentClient に渡します。
 */
export const createServerClient = async () => {
  const cookieStore = await cookies()

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })
}
