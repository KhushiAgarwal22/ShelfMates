import { NextResponse } from "next/server"
import { getBookById } from "@/lib/books"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const book = getBookById(params.id)

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ message: "Failed to fetch book" }, { status: 500 })
  }
}

