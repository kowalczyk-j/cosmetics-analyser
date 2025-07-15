import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Award, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ExpertOpinion {
  id: string;
  productId: string;
  expertName: string;
  expertTitle: string;
  expertAvatar?: string;
  rating: number;
  content: string;
  recommendation: string;
  skinTypes: string[];
  createdAt: string;
}

async function getExpertOpinions(productId: string): Promise<ExpertOpinion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockExpertOpinions: Record<string, ExpertOpinion[]> = {
    "5901234123457": [
      {
        id: "exp1",
        productId: "5901234123457",
        expertName: "Dr Anna Kowalska",
        expertTitle: "Dermatolog, Specjalista Medycyny Estetycznej",
        expertAvatar: "/placeholder.svg?height=60&width=60",
        rating: 5,
        content:
          "Ten żel do mycia twarzy zawiera ceramidy, które są kluczowe dla utrzymania bariery skórnej. Formuła jest delikatna i niepowodująca podrażnień, co czyni ją idealną dla pacjentów z atopowym zapaleniem skóry, trądzikiem różowatym lub po zabiegach dermatologicznych.",
        recommendation: "Szczególnie polecam dla skóry wrażliwej i reaktywnej.",
        skinTypes: ["Wrażliwa", "Sucha", "Normalna", "Mieszana"],
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ],
  };

  return mockExpertOpinions[productId] || [];
}

export function ExpertOpinions({ productId }: { productId: string }) {
  const [expertOpinions, setExpertOpinions] = useState<ExpertOpinion[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpertOpinions() {
      try {
        const data = await getExpertOpinions(productId);
        setExpertOpinions(data);
      } catch (error) {
        console.error("Error fetching expert opinions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpertOpinions();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Ładowanie opinii ekspertów...
      </div>
    );
  }

  if (!expertOpinions || !expertOpinions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Brak opinii ekspertów dla tego produktu.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {expertOpinions.map((opinion) => (
        <Card key={opinion.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage
                  src={opinion.expertAvatar}
                  alt={opinion.expertName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {opinion.expertName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {opinion.expertName}
                      <Award className="h-4 w-4 text-primary" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {opinion.expertTitle}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < opinion.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm">{opinion.content}</p>

                  <div>
                    <p className="text-sm font-medium mb-1">Rekomendacja:</p>
                    <p className="text-sm italic">{opinion.recommendation}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">
                      Odpowiedni dla typów skóry:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {opinion.skinTypes.map((type, index) => (
                        <Badge key={index} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Opinia dodana{" "}
                    {formatDistanceToNow(new Date(opinion.createdAt), {
                      addSuffix: true,
                      locale: pl,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
