import type { Book, User } from "@/types"

// Base URL for API
const API_BASE_URL = "/api"

// Helper function for API requests
async function apiRequest<T>(endpoint: string, method = "GET", data?: any): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }

  return response.json()
}

// Auth API
export async function loginUser(email: string, password: string): Promise<User> {
  // For demo purposes, we'll simulate a successful login
  // In a real app, this would call the actual API
  return apiRequest<User>("/auth/login", "POST", { email, password })
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  return apiRequest<User>("/auth/register", "POST", { name, email, password })
}

export async function logoutUser(): Promise<void> {
  return apiRequest<void>("/auth/logout", "POST")
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me")
}

// Books API
export async function getAllBooks(): Promise<Book[]> {
  return apiRequest<Book[]>("/books")
}

export async function getBookById(id: string): Promise<Book> {
  return apiRequest<Book>(`/books/${id}`)
}

export async function addToReadingList(bookId: string): Promise<void> {
  return apiRequest<void>(`/books/${bookId}/reading-list`, "POST")
}

export async function removeFromReadingList(bookId: string): Promise<void> {
  return apiRequest<void>(`/books/${bookId}/reading-list`, "DELETE")
}

export async function rateBook(bookId: string, rating: number): Promise<void> {
  return apiRequest<void>(`/books/${bookId}/rate`, "POST", { rating })
}

// User API
export async function getUserProfile(userId: string): Promise<User> {
  return apiRequest<User>(`/users/${userId}`)
}

export async function getUserReadingList(userId: string): Promise<Book[]> {
  return apiRequest<Book[]>(`/users/${userId}/reading-list`)
}

export async function searchUsers(query: string): Promise<User[]> {
  return apiRequest<User[]>(`/users/search?q=${encodeURIComponent(query)}`)
}

export async function followUser(userId: string): Promise<void> {
  return apiRequest<void>(`/users/${userId}/follow`, "POST")
}

export async function unfollowUser(userId: string): Promise<void> {
  return apiRequest<void>(`/users/${userId}/follow`, "DELETE")
}

export async function getFollowers(userId: string): Promise<User[]> {
  return apiRequest<User[]>(`/users/${userId}/followers`)
}

export async function getFollowing(userId: string): Promise<User[]> {
  return apiRequest<User[]>(`/users/${userId}/following`)
}

// Recommendations API
export async function getPersonalizedRecommendations(userId: string): Promise<Book[]> {
  return apiRequest<Book[]>(`/recommendations/personal`)
}

export async function getFollowerRecommendations(userId: string): Promise<Book[]> {
  return apiRequest<Book[]>(`/recommendations/followers`)
}

