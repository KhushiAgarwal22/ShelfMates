import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface GenreFilterProps {
  genres: string[]
  selectedGenre: string
  onSelectGenre: (genre: string) => void
}

export function GenreFilter({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 p-1">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectGenre(genre)}
            className="capitalize"
          >
            {genre === "all" ? "All Genres" : genre}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

