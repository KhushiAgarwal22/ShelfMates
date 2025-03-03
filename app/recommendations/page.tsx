"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { BookCard } from "@/components/book-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFollowerRecommendations, getPersonalizedRecommendations } from "@/lib/api"
import type { Book } from "@/types"

export default function RecommendationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [followerRecs, setFollowerRecs] = useState<Book[]>([])
  const [personalRecs, setPersonalRecs] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user?._id) {
        try {
          const [followerData, personalData] = await Promise.all([
            getFollowerRecommendations(user._id),
            getPersonalizedRecommendations(user._id),
          ])
          setFollowerRecs(followerData)
          setPersonalRecs(personalData)
        } catch (error) {
          console.error("Failed to fetch recommendations:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchRecommendations()
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
      <h1 className="mb-8 text-3xl font-bold">Your Recommendations</h1>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Based on Your Reading</TabsTrigger>
          <TabsTrigger value="followers">Based on Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Books you might enjoy based on your reading history and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[320px] animate-pulse rounded-lg bg-muted"></div>
                  ))}
                </div>
              ) : personalRecs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {personalRecs.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">
                    Add more books to your reading list to get personalized recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Follower Recommendations</CardTitle>
              <CardDescription>Popular books among people you follow</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[320px] animate-pulse rounded-lg bg-muted"></div>
                  ))}
                </div>
              ) : followerRecs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {followerRecs.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">Follow more people to see what books they recommend</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

