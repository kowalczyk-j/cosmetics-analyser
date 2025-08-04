import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Minus, HelpCircle } from "lucide-react";
import api from "@/api/api";

interface CleanScoreData {
  harmful: number;
  neutral: number;
  beneficial: number;
  total: number;
  score: number;
}

interface CompositionItem {
  ingredient: {
    safety_rating?: string;
  };
}

export function CleanScore({ productId }: { productId: string }) {
  const [cleanData, setCleanData] = useState<CleanScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComposition = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/cosmetics/${productId}/composition/`
        );

        const composition: CompositionItem[] = response.data;

        let harmful = 0;
        let neutral = 0;
        let beneficial = 0;

        composition.forEach((item) => {
          const rating = item.ingredient.safety_rating || "neutral";
          switch (rating) {
            case "harmful":
              harmful++;
              break;
            case "beneficial":
              beneficial++;
              break;
            case "neutral":
            default:
              neutral++;
              break;
          }
        });

        const total = harmful + neutral + beneficial;
        const totalPoints = neutral * 1 + beneficial * 2;
        const maxPossiblePoints = total * 2;
        const score =
          total > 0 ? Math.round((totalPoints / maxPossiblePoints) * 100) : 0;

        setCleanData({
          harmful,
          neutral,
          beneficial,
          total,
          score,
        });
      } catch (error) {
        console.error("Error fetching composition for clean score:", error);
        setCleanData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComposition();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Clean Score
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                <strong>Metodologia:</strong> Składniki neutralne = 1 pkt,
                korzystne = 2 pkt, szkodliwe = 0 pkt. Wynik to procent
                uzyskanych punktów z maksymalnych możliwych.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Ładowanie...</div>
        </CardContent>
      </Card>
    );
  }

  if (!cleanData || cleanData.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Clean Score
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                <strong>Metodologia:</strong> Składniki neutralne = 1 pkt,
                korzystne = 2 pkt, szkodliwe = 0 pkt. Wynik to procent
                uzyskanych punktów z maksymalnych możliwych.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Brak danych o składnikach</div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Bardzo dobry";
    if (score >= 60) return "Dobry";
    if (score >= 40) return "Średni";
    return "Wymaga uwagi";
  };

  // percentages for each category in progress bar
  const harmfulPercent = (cleanData.harmful / cleanData.total) * 100;
  const neutralPercent = (cleanData.neutral / cleanData.total) * 100;
  const beneficialPercent = (cleanData.beneficial / cleanData.total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Clean Score
          <div className="relative group">
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
              <strong>Metodologia:</strong> Składniki neutralne = 1 pkt,
              korzystne = 2 pkt, szkodliwe = 0 pkt. Wynik to procent uzyskanych
              punktów z maksymalnych możliwych.
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div
            className={`text-4xl font-bold ${getScoreColor(cleanData.score)}`}
          >
            {cleanData.score}%
          </div>
          <div className="text-sm text-muted-foreground">
            {getScoreLabel(cleanData.score)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Proporcje składników:</div>
          <div className="flex h-4 rounded-full overflow-hidden border">
            {cleanData.harmful > 0 && (
              <div
                className="bg-red-500"
                style={{ width: `${harmfulPercent}%` }}
                title={`Szkodliwe: ${
                  cleanData.harmful
                } (${harmfulPercent.toFixed(1)}%)`}
              />
            )}
            {cleanData.neutral > 0 && (
              <div
                className="bg-gray-400"
                style={{ width: `${neutralPercent}%` }}
                title={`Neutralne: ${
                  cleanData.neutral
                } (${neutralPercent.toFixed(1)}%)`}
              />
            )}
            {cleanData.beneficial > 0 && (
              <div
                className="bg-green-500"
                style={{ width: `${beneficialPercent}%` }}
                title={`Korzystne: ${
                  cleanData.beneficial
                } (${beneficialPercent.toFixed(1)}%)`}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>Szkodliwe: {cleanData.harmful}</span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="w-3 h-3 text-gray-400" />
            <span>Neutralne: {cleanData.neutral}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Korzystne: {cleanData.beneficial}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
