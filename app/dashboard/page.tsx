"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile, getUserReadingList } from "@/lib/api"
import type { Book, User } from "@/types"
import { BookOpen, Edit, UserIcon } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [readingList, setReadingList] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id) {
        try {
          const [profileData, readingListData] = await Promise.all([
            getUserProfile(user._id),
            getUserReadingList(user._id),
          ])
          setProfile(profileData)
          setReadingList(readingListData)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <Edit className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>{profile?.name || user?.name}</CardTitle>
              <CardDescription>{profile?.email || user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reading List</span>
                <span className="text-sm font-bold text-primary">{readingList.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Following</span>
                <span className="text-sm font-bold text-primary">{profile?.following?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Followers</span>
                <span className="text-sm font-bold text-primary">{profile?.followers?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Reading Activity</CardTitle>
            <CardDescription>Manage your reading list and track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reading">
              <TabsList className="mb-4">
                <TabsTrigger value="reading">Reading List</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>
              <TabsContent value="reading">
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-[240px] animate-pulse rounded-lg bg-muted"></div>
                    ))}
                  </div>
                ) : readingList.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {readingList.map((book) => (
                      <BookCard key={book._id} book={book} compact />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Your reading list is empty. Start adding books from the explore page.
                    </p>
                    <Button onClick={() => router.push("/explore")}>Explore Books</Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed">
                <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">You haven't marked any books as completed yet.</p>
                </div>
              </TabsContent>
              <TabsContent value="wishlist">
                <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Your wishlist is empty. Add books you want to read later.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

