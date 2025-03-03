export interface User {
  _id: string
  name: string
  email: string
  followers?: string[]
  following?: string[]
  readingList?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Book {
  _id: string
  title: string
  author: string
  description?: string
  genre: string[]
  coverImage?: string
  rating: number
  publishedDate?: string
  pages?: number
  isbn?: string
  publisher?: string
  readingList?: string[]
  userRatings?: {
    userId: string
    rating: number
  }[]
}

