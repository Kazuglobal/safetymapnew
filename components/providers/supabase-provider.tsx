'use client'

import React, { createContext, useContext, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

// ↓↓↓ ここに追加 ↓↓↓
console.log('⛳️ URL =', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('⛳️ KEY =', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
// ↑↑↑ ここに追加 ↑↑↑

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  )

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (!context) throw new Error('useSupabase must be used inside SupabaseProvider')
  return context
}
