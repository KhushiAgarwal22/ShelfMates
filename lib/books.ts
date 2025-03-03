import fs from "fs"
import path from "path"
import type { Book } from "@/types"

const booksPath = path.join(process.cwd(), "data", "books.json")

export function getAllBooks(): Book[] {
  try {
    const fileContents = fs.readFileSync(booksPath, "utf8")
    const data = JSON.parse(fileContents)
    return data.books
  } catch (error) {
    console.error("Error reading books:", error)
    return []
  }
}

export function getBookById(id: string): Book | null {
  try {
    const books = getAllBooks()
    return books.find((book) => book._id === id) || null
  } catch (error) {
    console.error("Error getting book by id:", error)
    return null
  }
}

export function updateBookRating(bookId: string, userId: string, rating: number): Book | null {
  try {
    const books = getAllBooks()
    const bookIndex = books.findIndex((book) => book._id === bookId)

    if (bookIndex === -1) return null

    const book = books[bookIndex]

    // Initialize userRatings if it doesn't exist
    if (!book.userRatings) {
      book.userRatings = []
    }

    // Find existing rating
    const ratingIndex = book.userRatings.findIndex((r) => r.userId === userId)

    if (ratingIndex === -1) {
      // Add new rating
      book.userRatings.push({ userId, rating })
    } else {
      // Update existing rating
      book.userRatings[ratingIndex].rating = rating
    }

    // Calculate new average rating
    const totalRating = book.userRatings.reduce((sum, r) => sum + r.rating, 0)
    book.rating = totalRating / book.userRatings.length

    // Update books.json
    const data = { books }
    fs.writeFileSync(booksPath, JSON.stringify(data, null, 2))

    return book
  } catch (error) {
    console.error("Error updating book rating:", error)
    return null
  }
}

