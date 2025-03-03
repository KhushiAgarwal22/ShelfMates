"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { followUser, getFollowers, getFollowing, searchUsers, unfollowUser } from "@/lib/api"
import type { User } from "@/types"
import { Search, UserCheck, UserPlus, Users } from "lucide-react"

export default function ConnectPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchConnections = async () => {
      if (user?._id) {
        try {
          const [followersData, followingData] = await Promise.all([getFollowers(user._id), getFollowing(user._id)])
          setFollowers(followersData)
          setFollowing(followingData)
        } catch (error) {
          console.error("Failed to fetch connections:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchConnections()
    }
  }, [user])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchUsers(searchQuery)
      // Filter out the current user
      const filteredResults = results.filter((u) => u._id !== user?._id)
      setSearchResults(filteredResults)
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "There was an error searching for users.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId)

      // Update the UI
      const updatedUser = searchResults.find((u) => u._id === userId)
      if (updatedUser) {
        setFollowing((prev) => [...prev, updatedUser])
        toast({
          title: "Success",
          description: `You are now following ${updatedUser.name}`,
        })
      }
    } catch (error) {
      console.error("Failed to follow user:", error)
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "There was an error following this user.",
      })
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId)

      // Update the UI
      setFollowing((prev) => prev.filter((u) => u._id !== userId))
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      })
    } catch (error) {
      console.error("Failed to unfollow user:", error)
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "There was an error unfollowing this user.",
      })
    }
  }

  const isFollowing = (userId: string) => {
    return following.some((u) => u._id === userId)
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Connect with Readers</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for users by name or email"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((result) => (
                  <div key={result._id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-muted-foreground">{result.email}</p>
                      </div>
                    </div>
                    {isFollowing(result._id) ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnfollow(result._id)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Following
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleFollow(result._id)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="following">
        <TabsList className="mb-6">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="following">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
              ))}
            </div>
          ) : following.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {following.map((followedUser) => (
                <div key={followedUser._id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{followedUser.name}</p>
                      <p className="text-sm text-muted-foreground">{followedUser.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleUnfollow(followedUser._id)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Following
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">You are not following anyone yet. Search for users to follow.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="followers">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
              ))}
            </div>
          ) : followers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {followers.map((follower) => (
                <div key={follower._id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{follower.name}</p>
                      <p className="text-sm text-muted-foreground">{follower.email}</p>
                    </div>
                  </div>
                  {isFollowing(follower._id) ? (
                    <Button variant="outline" size="sm" onClick={() => handleUnfollow(follower._id)}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleFollow(follower._id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">You don't have any followers yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

