"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Rating } from "@/components/rating"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { addToReadingList, getBookById, rateBook, removeFromReadingList } from "@/lib/api"
import type { Book } from "@/types"
import { BookOpen, Bookmark, BookmarkCheck, Star } from "lucide-react"

export default function BookPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user, isAuthenticated } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInReadingList, setIsInReadingList] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id)
        setBook(data)

        // Check if book is in user's reading list
        if (user && data.readingList?.includes(user._id)) {
          setIsInReadingList(true)
        }

        // Check if user has rated this book
        if (user && data.userRatings) {
          const rating = data.userRatings.find((r) => r.userId === user._id)
          if (rating) {
            setUserRating(rating.rating)
          }
        }
      } catch (error) {
        console.error("Failed to fetch book:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load book details.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [id, user, toast])

  const handleAddToReadingList = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add books to your reading list.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      await addToReadingList(id)
      setIsInReadingList(true)
      toast({
        title: "Success",
        description: "Book added to your reading list.",
      })
    } catch (error) {
      console.error("Failed to add book to reading list:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add book to your reading list.",
      })
    }
  }

  const handleRemoveFromReadingList = async () => {
    try {
      await removeFromReadingList(id)
      setIsInReadingList(false)
      toast({
        title: "Success",
        description: "Book removed from your reading list.",
      })
    } catch (error) {
      console.error("Failed to remove book from reading list:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove book from your reading list.",
      })
    }
  }

  const handleRateBook = async (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to rate books.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      await rateBook(id, rating)
      setUserRating(rating)

      // Update the book's average rating
      if (book) {
        const updatedBook = { ...book }
        // Simple calculation for UI update, the actual calculation happens on the server
        const totalRatings = (book.userRatings?.length || 0) + (userRating === 0 ? 1 : 0)
        const ratingSum = book.rating * (book.userRatings?.length || 0) - (userRating || 0) + rating
        updatedBook.rating = ratingSum / totalRatings
        setBook(updatedBook)
      }

      toast({
        title: "Success",
        description: "Your rating has been saved.",
      })
    } catch (error) {
      console.error("Failed to rate book:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your rating.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="animate-pulse text-xl">Loading book details...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold">Book Not Found</h2>
          <p className="mb-6 text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/explore")}>Explore Books</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center md:col-span-1">
          <div className="mb-4 h-80 w-56 overflow-hidden rounded-lg bg-muted shadow-md">
            {book.coverImage ? (
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <BookOpen className="h-16 w-16 text-primary" />
              </div>
            )}
          </div>

          <div className="mt-4 flex w-56 flex-col gap-2">
            {isInReadingList ? (
              <Button variant="outline" onClick={handleRemoveFromReadingList}>
                <BookmarkCheck className="mr-2 h-4 w-4" />
                In Your Reading List
              </Button>
            ) : (
              <Button onClick={handleAddToReadingList}>
                <Bookmark className="mr-2 h-4 w-4" />
                Add to Reading List
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
          <p className="mb-4 text-xl text-muted-foreground">by {book.author}</p>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center">
              <Star className="mr-1 h-5 w-5 fill-primary text-primary" />
              <span className="font-medium">{book.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-muted-foreground">({book.userRatings?.length || 0} ratings)</span>
            </div>
            <div className="flex items-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {book.genre.join(", ")}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{book.description || "No description available."}</p>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Your Rating</h2>
            <Rating value={userRating} onValueChange={handleRateBook} />
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="mb-4 text-xl font-semibold">Book Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-muted-foreground">{book.publishedDate || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Pages</p>
                <p className="text-muted-foreground">{book.pages || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">ISBN</p>
                <p className="text-muted-foreground">{book.isbn || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Publisher</p>
                <p className="text-muted-foreground">{book.publisher || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

