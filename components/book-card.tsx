"use client"

import { useRouter } from "next/navigation"
import type { Book } from "@/types"
import { BookOpen, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BookCardProps {
  book: Book
  compact?: boolean
}

export function BookCard({ book, compact = false }: BookCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/books/${book._id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="cursor-pointer" onClick={handleClick}>
        <div className={`relative ${compact ? "h-40" : "h-56"} overflow-hidden bg-muted`}>
          {book.coverImage ? (
            <img
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          )}
          <div className="absolute right-2 top-2 flex items-center rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
            <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{book.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <h3 className={`font-semibold line-clamp-1 ${compact ? "text-sm" : "text-base"}`}>{book.title}</h3>
          <p className={`text-muted-foreground line-clamp-1 ${compact ? "text-xs" : "text-sm"}`}>{book.author}</p>
          {!compact && (
            <div className="mt-2 flex flex-wrap gap-1">
              {book.genre.slice(0, 2).map((genre) => (
                <span key={genre} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {genre}
                </span>
              ))}
              {book.genre.length > 2 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">+{book.genre.length - 2}</span>
              )}
            </div>
          )}
        </CardContent>
        {!compact && (
          <CardFooter className="flex justify-end p-4 pt-0">
            <Button variant="ghost" size="sm" onClick={handleClick}>
              View Details
            </Button>
          </CardFooter>
        )}
      </div>
    </Card>
  )
}

