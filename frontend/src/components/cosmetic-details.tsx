import { useEffect, useState } from "react";
import {
  ExternalLink,
  Heart,
  Edit,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface Cosmetic {
  product_name: string;
  manufacturer: string;
  category: string;
  barcode: string;
  purchase_link?: string;
  description: string;
  is_verified: boolean;
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
  const [verifying, setVerifying] = useState(false);
  const { isAdmin } = useIsAdmin();

  const handleVerify = async () => {
    if (!cosmetic) return;

    setVerifying(true);
    try {
      await api.patch(`/api/cosmetics/${productId}/verify/`);
      setCosmetic({ ...cosmetic, is_verified: true });
    } catch (error) {
      console.error("Error verifying cosmetic:", error);
      setError("Nie udało się zweryfikować kosmetyku.");
    } finally {
      setVerifying(false);
    }
  };

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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-2xl">
                {cosmetic.product_name}
              </CardTitle>
              <Badge
                variant={cosmetic.is_verified ? "default" : "secondary"}
                className={
                  cosmetic.is_verified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {cosmetic.is_verified ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Zweryfikowany
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Niezweryfikowany
                  </>
                )}
              </Badge>
            </div>
            <CardDescription>{cosmetic.manufacturer}</CardDescription>
          </div>
          <div className="flex gap-2">
            {isAdmin && !cosmetic.is_verified && (
              <Button
                variant="default"
                size="sm"
                onClick={handleVerify}
                disabled={verifying}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {verifying ? "Weryfikuję..." : "Zweryfikuj"}
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/cosmetics/${productId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edytuj
                </Link>
              </Button>
            )}
          </div>
        </div>
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
