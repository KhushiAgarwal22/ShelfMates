"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface RatingProps {
  value: number
  onValueChange: (value: number) => void
  max?: number
}

export function Rating({ value = 0, onValueChange, max = 5 }: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, i) => {
        const ratingValue = i + 1
        return (
          <button
            type="button"
            key={i}
            className="cursor-pointer p-1"
            onClick={() => onValueChange(ratingValue)}
            onMouseEnter={() => setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(0)}
          >
            <Star
              className={`h-6 w-6 ${
                ratingValue <= (hoverValue || value) ? "fill-primary text-primary" : "text-muted-foreground"
              } transition-colors`}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `Your rating: ${value}/${max}` : "Rate this book"}
      </span>
    </div>
  )
}

