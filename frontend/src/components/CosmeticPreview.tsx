import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  User,
  Barcode,
  Tag,
  Link as LinkIcon,
  List,
} from "lucide-react";

interface CosmeticData {
  product_name: string;
  manufacturer: string;
  barcode: string;
  description: string;
  category: string;
}

interface SelectedIngredient {
  cosing_ref_no: number;
  inci_name: string;
  common_name?: string;
  function?: string;
  order: number;
}

interface CosmeticPreviewProps {
  cosmeticData: CosmeticData;
  ingredients: SelectedIngredient[];
}

export function CosmeticPreview({
  cosmeticData,
  ingredients,
}: CosmeticPreviewProps) {
  const generatePurchaseLink = (productName: string) => {
    const searchTerm = productName
      .toLowerCase()
      .replace(/\s+/g, "+")
      .replace(/[^a-z0-9+ąćęłńóśźż]/g, "");
    return `https://www.ceneo.pl/;szukaj-${searchTerm}`;
  };

  const purchaseLink = generatePurchaseLink(cosmeticData.product_name);

  return (
    <div className="space-y-6">
      {/* Cosmetic Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informacje o produkcie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Nazwa produktu</p>
                <p className="font-medium">{cosmeticData.product_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Producent</p>
                <p className="font-medium">{cosmeticData.manufacturer}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Barcode className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Kod kreskowy</p>
                <p className="font-mono font-medium">{cosmeticData.barcode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Kategoria</p>
                <Badge variant="outline">{cosmeticData.category}</Badge>
              </div>
            </div>
          </div>

          {cosmeticData.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Opis</p>
                <p className="text-sm">{cosmeticData.description}</p>
              </div>
            </>
          )}

          <Separator />
          <div className="flex items-center gap-3">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                Link zakupowy (auto-generowany)
              </p>
              <a
                href={purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {purchaseLink}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Składniki INCI ({ingredients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ingredients.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Brak składników
            </p>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.cosing_ref_no}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                    {ingredient.order}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{ingredient.inci_name}</p>
                    {ingredient.common_name && (
                      <p className="text-sm text-muted-foreground">
                        {ingredient.common_name}
                      </p>
                    )}
                    {ingredient.function && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {ingredient.function}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Gotowe do zapisania!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Sprawdź jeszcze raz wszystkie dane. Po zapisaniu kosmetyk zostanie
              dodany do bazy danych i będzie dostępny dla wszystkich
              użytkowników.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
