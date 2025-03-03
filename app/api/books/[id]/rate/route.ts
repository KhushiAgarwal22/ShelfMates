import { NextResponse } from "next/server"
import { updateBookRating } from "@/lib/books"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { rating } = await request.json()

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Invalid rating" }, { status: 400 })
    }

    const updatedBook = updateBookRating(params.id, user._id, rating)

    if (!updatedBook) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Error rating book:", error)
    return NextResponse.json({ message: "Failed to rate book" }, { status: 500 })
  }
}

