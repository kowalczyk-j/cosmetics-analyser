import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IngredientDetails } from "./ingredient-details";
import api from "@/api/api";

interface CompositionItem {
  id: number;
  order_in_composition: number;
  cosmetic: string; // barcode
  ingredient: {
    cosing_ref_no: number;
    inci_name: string;
    common_name?: string;
    action_description?: string;
    function?: string;
    restrictions?: string;
  };
}

export function CompositionList({ productId }: { productId: string }) {
  const [composition, setComposition] = useState<CompositionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComposition = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/cosmetic_compositions/?cosmetic=${productId}`
        );
        console.log("Composition data:", response.data);
        console.log("First item:", response.data[0]);

        const sortedComposition = response.data.sort(
          (a: CompositionItem, b: CompositionItem) =>
            a.order_in_composition - b.order_in_composition
        );

        setComposition(sortedComposition);
      } catch (error) {
        console.error("Error fetching composition:", error);
        setComposition([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchComposition();
    }
  }, [productId]);

  if (loading) {
    return <div className="text-center py-4">Ładowanie składników...</div>;
  }

  if (composition.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nie udało się załadować składu kosmetyku.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Składnik (INCI)</TableHead>
            <TableHead>Nazwa Popularna</TableHead>
            <TableHead>Funkcja</TableHead>
            <TableHead>Zastrzeżenia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {composition
            .map((item) => {
              if (!item || !item.ingredient) {
                console.warn("Invalid composition item:", item);
                return null;
              }

              return (
                <IngredientDetails
                  key={item.id}
                  ingredient={{
                    id:
                      item.ingredient.cosing_ref_no?.toString() ||
                      item.id?.toString() ||
                      "unknown",
                    inci_name: item.ingredient.inci_name || "Nieznany składnik",
                    common_name: item.ingredient.common_name || "",
                    function: item.ingredient.function || "",
                    restrictions: item.ingredient.restrictions || "",
                    action_description:
                      item.ingredient.action_description || "",
                    order: item.order_in_composition || 0,
                  }}
                />
              );
            })
            .filter(Boolean)}
        </TableBody>
      </Table>
    </div>
  );
}
