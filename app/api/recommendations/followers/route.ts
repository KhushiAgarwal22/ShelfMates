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

    // Get user's following list
    const userData = await db.collection("users").findOne({ _id: user._id })
    const following = userData?.following || []

    // Get reading lists of followed users
    const followedUsers = await db
      .collection("users")
      .find({ _id: { $in: following } })
      .toArray()

    const followedReadingLists = followedUsers.flatMap((user) => user.readingList || [])

    // Count book occurrences in followed users' reading lists
    const bookCount = new Map()
    followedReadingLists.forEach((bookId) => {
      bookCount.set(bookId, (bookCount.get(bookId) || 0) + 1)
    })

    // Get all books and filter/sort based on popularity among followed users
    const allBooks = getAllBooks()
    const recommendations = allBooks
      .filter((book) => bookCount.has(book._id))
      .sort((a, b) => (bookCount.get(b._id) || 0) - (bookCount.get(a._id) || 0))
      .slice(0, 10)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error getting follower recommendations:", error)
    return NextResponse.json({ message: "Failed to get recommendations" }, { status: 500 })
  }
}

