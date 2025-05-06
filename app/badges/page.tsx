// app/badges/page.tsx
import { createServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

type UserBadgesRow = Database['public']['Tables']['user_badges']['Row'];

export default async function BadgePage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore); // cookie から supabase client を生成

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return <div>Please log in to view your badges.</div>;
  }

  const userId = session.user.id as UserBadgesRow['user_id'];

  const { data: ownedRows, error } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const ownedIds = new Set(ownedRows.map((r) => r.badge_id));

  return (
    <div>
      <h1>My Badges</h1>
      <p>You own {ownedIds.size} badges.</p>
    </div>
  );
}
