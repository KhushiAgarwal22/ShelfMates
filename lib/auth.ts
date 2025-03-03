import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getUserFromToken(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user) return null

    const { password, ...userData } = user
    return userData
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

