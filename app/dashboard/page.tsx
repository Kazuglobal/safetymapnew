import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import CultureBridgeDashboard from "@/components/dashboard/culture-bridge-dashboard"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile from the existing profiles table
  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error || !userProfile) {
    // If user profile doesn't exist, redirect to setup
    redirect("/profile-setup")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CultureBridgeDashboard user={userProfile} />
    </div>
  )
}
