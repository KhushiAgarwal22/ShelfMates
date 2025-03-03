"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookCard } from "@/components/book-card"
import { GenreFilter } from "@/components/genre-filter"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllBooks } from "@/lib/api"
import type { Book } from "@/types"
import { Search } from "lucide-react"

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks()
        setBooks(data)
        setFilteredBooks(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch books:", error)
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    let result = books

    // Filter by genre
    if (selectedGenre !== "all") {
      result = result.filter((book) => book.genre.includes(selectedGenre))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
      )
    }

    setFilteredBooks(result)
  }, [selectedGenre, searchQuery, books])

  // Get unique genres from all books
  const genres = books.length ? ["all", ...new Set(books.flatMap((book) => book.genre))] : ["all"]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Explore Books</h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or author"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-[320px] animate-pulse rounded-lg bg-muted"></div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No books found matching your criteria</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="list">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                  onClick={() => router.push(`/books/${book._id}`)}
                >
                  <div className="h-16 w-12 overflow-hidden rounded bg-muted">
                    {book.coverImage && (
                      <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {book.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">{book.genre.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No books found matching your criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

