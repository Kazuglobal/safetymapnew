import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ProfileSetupForm from "@/components/auth/profile-setup-form"

export default async function ProfileSetupPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get existing profile if any
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">
              Let's set up your profile for Culture Bridge Program 2025
            </p>
          </div>
          <ProfileSetupForm user={user} existingProfile={profile} />
        </div>
      </div>
    </div>
  )
}