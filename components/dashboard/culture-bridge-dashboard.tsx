"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, MessageCircle, User, Users, Target, BookOpen, Globe } from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import Link from "next/link"

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  email: string
  role: string | null
  created_at: string | null
  updated_at: string | null
}

interface CultureBridgeDashboardProps {
  user: Profile
}

export default function CultureBridgeDashboard({ user }: CultureBridgeDashboardProps) {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize dashboard
    setLoading(false)
  }, [user.id])

  const displayName = user.display_name || user.full_name || "User"
  const isAdmin = user.role === "admin"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Culture Bridge Program 2025! 🌍
        </h1>
        <p className="text-gray-600 mt-2">
          Hello {displayName}, ready to connect cultures and build bridges?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Days</div>
            <p className="text-xs text-muted-foreground">
              July 28-31, 2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? "Admin" : "Participant"}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Program coordinator" : "Cultural exchange participant"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Ready to start your journey
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">
              Program begins soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Program Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Culture Bridge Program 2025</CardTitle>
                <CardDescription>4-day international cultural exchange program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-medium">Cultural Introduction</h4>
                      <p className="text-sm text-gray-600">Meet your international partner and share your culture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-medium">Language Exchange</h4>
                      <p className="text-sm text-gray-600">Practice English conversation and communication skills</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">3</div>
                    <div>
                      <h4 className="font-medium">Global Issues</h4>
                      <p className="text-sm text-gray-600">Research and discuss world challenges together</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">4</div>
                    <div>
                      <h4 className="font-medium">Final Presentation</h4>
                      <p className="text-sm text-gray-600">Present your learnings and achievements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with these essential tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/profile-setup">
                      <User className="w-4 h-4 mr-2" />
                      Complete Your Profile
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/resources">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Resources
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/groups">
                      <Users className="w-4 h-4 mr-2" />
                      View Groups
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/chat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chatting
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activities</CardTitle>
              <CardDescription>Track your progress through the 4-day program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(day => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-gray-600">Day {day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {day === 1 && "Cultural Introduction & Goal Setting"}
                        {day === 2 && "Language Practice & Exchange"}
                        {day === 3 && "Global Issues Research"}
                        {day === 4 && "Final Presentation & Reflection"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {day === 1 && "Meet your partner and share your cultural background"}
                        {day === 2 && "Practice English conversation and communication"}
                        {day === 3 && "Collaborate on global challenge research"}
                        {day === 4 && "Present your journey and achievements"}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Upcoming
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>Materials to help you succeed in the program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                  <h4 className="font-medium mb-2">Cultural Exchange Guide</h4>
                  <p className="text-sm text-gray-600 mb-3">Tips for meaningful cross-cultural communication</p>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                  <h4 className="font-medium mb-2">English Conversation Phrases</h4>
                  <p className="text-sm text-gray-600 mb-3">Common phrases for international communication</p>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                  <h4 className="font-medium mb-2">Presentation Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Structure for your final presentation</p>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                  <h4 className="font-medium mb-2">Global Issues Research</h4>
                  <p className="text-sm text-gray-600 mb-3">Framework for researching world challenges</p>
                  <Button size="sm" variant="outline">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your program information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <p className="text-gray-900">{displayName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <p className="text-gray-900">{user.role || "Participant"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                  </p>
                </div>
                <Button asChild>
                  <Link href="/profile-setup">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}