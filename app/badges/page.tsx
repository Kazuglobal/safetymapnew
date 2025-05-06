// app/badges/page.tsx
import { createServerClient } from "../lib/supabase-server"; 
import { Database } from '../lib/database.types'; // ← 相対パスに変更

type UserBadgesRow = Database['public']['Tables']['user_badges']['Row']

export default async function BadgePage({
  session,
}: {
  session: { user: { id: string } }
}) {
  const userId = session.user.id as UserBadgesRow['user_id']

  const { data: ownedRows, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  const ownedIds = new Set(ownedRows.map((r) => r.badge_id))

  /** 本来は ownedIds を使ってバッジ一覧を描画する */
  return (
    <div>
      <h1>My Badges</h1>
      <p>You own {ownedIds.size} badges.</p>
    </div>
  )
}
