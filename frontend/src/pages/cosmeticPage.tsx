import { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CosmeticDetails } from "@/components/cosmetic-details";
import { CompositionList } from "@/components/composition-list";
import { ReviewsList } from "@/components/reviews-list";
import { ReviewForm } from "@/components/review-form";
import { ExpertOpinions } from "@/components/expert-opinions";
import Toolbar from "@/components/Toolbar";

export function CosmeticPage() {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) {
    return <div>Nie podano identyfikatora produktu.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toolbar />
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<CosmeticDetailsSkeleton />}>
              <CosmeticDetails productId={productId} />
            </Suspense>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span>Średnia Ocena</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                  <RatingsSummary productId={productId} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="composition" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="composition">Skład</TabsTrigger>
            <TabsTrigger value="expert-opinions">Ocena Ekspertów</TabsTrigger>
            <TabsTrigger value="reviews">Recenzje</TabsTrigger>
            <TabsTrigger value="add-review">Dodaj Recenzję</TabsTrigger>
          </TabsList>
          <TabsContent value="composition" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skład (INCI)</CardTitle>
                <CardDescription>
                  Pełna lista składników i szczegóły kompozycji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <CompositionList productId={productId} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expert-opinions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Opinie Ekspertów</CardTitle>
                <CardDescription>
                  Profesjonalne opinie dermatologów i kosmetologów
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <ExpertOpinions productId={productId} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recenzje Użytkowników</CardTitle>
                <CardDescription>
                  Zobacz co inni myślą o tym produkcie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ReviewsListSkeleton />}>
                  <ReviewsList productId={productId} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add-review" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Napisz Recenzję</CardTitle>
                <CardDescription>
                  Podziel się swoim doświadczeniem z tym produktem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm productId={productId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CosmeticDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

function ReviewsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
    </div>
  );
}

function RatingsSummary({ productId }: { productId: string }) {
  const [ratingData, setRatingData] = useState<{
    rating: number;
    totalReviews: number;
    expertOpinions: number;
    cleanIndex: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatings() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const mockRatings: Record<
          string,
          {
            rating: number;
            totalReviews: number;
            expertOpinions: number;
            cleanIndex: number;
          }
        > = {
          "5901234123457": {
            rating: 4.5,
            totalReviews: 27,
            expertOpinions: 3,
            cleanIndex: 92,
          },
          "2": {
            rating: 4.2,
            totalReviews: 42,
            expertOpinions: 5,
            cleanIndex: 85,
          },
          "3": {
            rating: 4.8,
            totalReviews: 35,
            expertOpinions: 4,
            cleanIndex: 97,
          },
        };

        const data = mockRatings[productId] || {
          rating: 0,
          totalReviews: 0,
          expertOpinions: 0,
          cleanIndex: 0,
        };

        setRatingData(data);
      } catch (error) {
        console.error("Error fetching ratings data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ratingData) {
    return <div>Nie znaleziono danych o ocenach.</div>;
  }

  const { rating, totalReviews, expertOpinions, cleanIndex } = ratingData;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-5xl font-bold mb-2">{rating}</div>
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < Math.floor(rating)) {
            return (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            );
          } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            return (
              <StarHalf key={i} className="h-5 w-5 fill-primary text-primary" />
            );
          } else {
            return <Star key={i} className="h-5 w-5 text-muted-foreground" />;
          }
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        Na podstawie {totalReviews} recenzji
      </div>
      <div className="text-sm text-muted-foreground">
        W tym {expertOpinions} opinii ekspertów
      </div>

      <div className="mt-4 pt-4 border-t w-full">
        <div className="text-sm font-medium mb-2">Wskaźnik Clean</div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${cleanIndex}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{cleanIndex}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Procent składników korzystnych dla skóry
        </p>
      </div>
    </div>
  );
}
