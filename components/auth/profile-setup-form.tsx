"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSupabase } from "@/components/providers/supabase-provider"
import { toast } from "sonner"

interface User {
  id: string
  email?: string
}

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  email: string
  role: string | null
  created_at: string | null
  updated_at: string | null
}

interface ProfileSetupFormProps {
  user: User
  existingProfile?: Profile | null
}

export default function ProfileSetupForm({ user, existingProfile }: ProfileSetupFormProps) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: existingProfile?.full_name || "",
    display_name: existingProfile?.display_name || "",
    role: existingProfile?.role || "student"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const profileData = {
        id: user.id,
        email: user.email || "",
        full_name: formData.full_name,
        display_name: formData.display_name,
        role: formData.role,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(profileData)

      if (error) {
        throw error
      }

      toast.success("Profile updated successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email || ""}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          type="text"
          value={formData.display_name}
          onChange={(e) => handleChange("display_name", e.target.value)}
          placeholder="How you'd like to be called (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role in Program *</Label>
        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student (Japanese High School)</SelectItem>
            <SelectItem value="international_student">International Student</SelectItem>
            <SelectItem value="admin">Program Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : existingProfile ? "Update Profile" : "Complete Setup"}
        </Button>
      </div>

      {existingProfile && (
        <div className="text-center">
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")}>
            Skip for now
          </Button>
        </div>
      )}
    </form>
  )
}