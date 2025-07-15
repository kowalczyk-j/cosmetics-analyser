import { useEffect, useState } from "react";
import { ExternalLink, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/api/api";

interface Cosmetic {
  product_name: string;
  manufacturer: string;
  category: string;
  barcode: string;
  purchase_link?: string;
  description: string;
}

async function getCosmeticDetails(productId: string): Promise<Cosmetic> {
  try {
    const response = await api.get(`/api/cosmetics/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cosmetic details:", error);
    throw new Error("Nie udało się pobrać szczegółów kosmetyku.");
  }
}

export function CosmeticDetails({ productId }: { productId: string }) {
  const [cosmetic, setCosmetic] = useState<Cosmetic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCosmetic() {
      try {
        const data = await getCosmeticDetails(productId);
        setCosmetic(data);
      } catch (error) {
        setError("Nie udało się załadować szczegółów kosmetyku.");
      } finally {
        setLoading(false);
      }
    }

    fetchCosmetic();
  }, [productId]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!cosmetic) {
    return <div>Nie znaleziono szczegółów kosmetyku.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{cosmetic.product_name}</CardTitle>
        <CardDescription>{cosmetic.manufacturer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Kategoria
            </h3>
            <p>{cosmetic.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Kod Kreskowy
            </h3>
            <p>{cosmetic.barcode}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Opis
          </h3>
          <p className="text-sm">{cosmetic.description}</p>
        </div>
      </CardContent>
      {cosmetic.purchase_link && (
        <CardFooter>
          <Button asChild className="w-full">
            <a
              href={cosmetic.purchase_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kup Teraz <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" className="ml-2">
            Dodaj do ulubionych
            <Heart className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
