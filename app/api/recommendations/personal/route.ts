import { NextResponse } from "next/server"
import { getAllBooks } from "@/lib/books"
import { getUserFromToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get user's reading list and ratings
    const userData = await db.collection("users").findOne({ _id: user._id })
    const readingList = userData?.readingList || []

    // Get all books
    const allBooks = getAllBooks()

    // Filter out books already in reading list
    const unreadBooks = allBooks.filter((book) => !readingList.includes(book._id))

    // Get user's preferred genres based on reading list
    const readBooks = allBooks.filter((book) => readingList.includes(book._id))
    const genrePreferences = new Map()

    readBooks.forEach((book) => {
      book.genre.forEach((genre) => {
        genrePreferences.set(genre, (genrePreferences.get(genre) || 0) + 1)
      })
    })

    // Sort unread books by matching genres and rating
    const recommendations = unreadBooks
      .map((book) => ({
        ...book,
        score: book.genre.reduce((score, genre) => score + (genrePreferences.get(genre) || 0), 0) + book.rating / 5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score, ...book }) => book)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json({ message: "Failed to get recommendations" }, { status: 500 })
  }
}

