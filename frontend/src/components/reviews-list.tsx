import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  productId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: string;
}

async function getReviews(productId: string): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockReviews: Record<string, Review[]> = {
    "5901234123457": [
      {
        id: "rev1",
        productId: "5901234123457",
        userId: "user1",
        username: "MiłośnikPielęgnacji",
        rating: 5,
        content:
          "Ten żel do mycia jest niesamowity! Jest delikatny, ale skuteczny i nie pozbawia skóry wilgoci. Używam go rano i wieczorem, a moja skóra nigdy nie wyglądała lepiej.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "rev2",
        productId: "5901234123457",
        userId: "user2",
        username: "BlogerKosmetyczny22",
        userAvatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        content:
          "Bardzo dobry żel do mycia dla skóry wrażliwej. Używam go od miesiąca i zauważyłam mniej podrażnień. Polecam!",
        createdAt: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  };

  return mockReviews[productId] || [];
}

export function ReviewsList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Ładowanie recenzji...
      </div>
    );
  }

  if (!reviews || !reviews.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Brak recenzji. Bądź pierwszym, który oceni ten produkt!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={review.userAvatar} alt={review.username} />
              <AvatarFallback>
                {review.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-medium">{review.username}</div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: pl,
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm">{review.content}</p>
          <Separator />
        </div>
      ))}
    </div>
  );
}
