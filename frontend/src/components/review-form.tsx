import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isLoggedIn = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Wymagane uwierzytelnienie",
        description: "Zaloguj się, aby dodać recenzję",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Wymagana ocena",
        description: "Wybierz ocenę przed wysłaniem",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Wymagana treść recenzji",
        description: "Napisz swoją recenzję przed wysłaniem",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // this would use your api.ts to post data
      // await api.post('/api/reviews', {
      //   productId,
      //   rating,
      //   content
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Recenzja wysłana",
        description: "Dziękujemy za podzielenie się swoim doświadczeniem!",
      });

      // Reset form
      setRating(0);
      setContent("");
    } catch (error) {
      toast({
        title: "Błąd podczas wysyłania recenzji",
        description: "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-4">
        <p className="mb-4 text-muted-foreground">
          Musisz być zalogowany, aby dodać recenzję.
        </p>
        <Button>Zaloguj się</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Twoja Ocena</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  (hoveredRating ? i < hoveredRating : i < rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span className="sr-only">{i + 1} gwiazdek</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review-content" className="block text-sm font-medium">
          Twoja Recenzja
        </label>
        <Textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Podziel się swoim doświadczeniem z tym produktem..."
          rows={5}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Wysyłanie..." : "Wyślij Recenzję"}
      </Button>
    </form>
  );
}
