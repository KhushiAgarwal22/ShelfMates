import Link from "next/link"
import { BookOpen, BookmarkPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col items-center justify-center space-y-8 py-12 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to <span className="text-primary">Shelfmates</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Discover your next favorite book with personalized recommendations based on your reading history and friends.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild size="lg">
            <Link href="/explore">Explore Books</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <BookOpen className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Discover Books</h3>
              <p className="text-center text-muted-foreground">
                Explore a vast collection of books across different genres and find your next great read.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <BookmarkPlus className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Track Your Reading</h3>
              <p className="text-center text-muted-foreground">
                Keep track of books you've read, want to read, and rate them to get better recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Connect with Friends</h3>
              <p className="text-center text-muted-foreground">
                Follow other readers, see what they're reading, and get recommendations based on their favorites.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

