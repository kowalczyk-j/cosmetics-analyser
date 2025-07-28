import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IngredientDetails } from "@/components/ingredient-details";
import api from "@/api/api";

interface IngredientINCI {
  cosing_ref_no: number;
  inci_name: string;
  common_name?: string;
  action_description?: string;
  function?: string;
  restrictions?: string;
}

interface CosmeticComposition {
  id: number;
  order_in_composition: number;
  ingredient: IngredientINCI;
}

// API call to fetch composition
async function getComposition(
  productId: string
): Promise<CosmeticComposition[]> {
  try {
    const response = await api.get(
      `/api/cosmetic_compositions/?cosmetic=${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching composition:", error);
    throw new Error("Nie udało się pobrać składu kosmetyku.");
  }
}
export function CompositionList({ productId }: { productId: string }) {
  const [composition, setComposition] = useState<CosmeticComposition[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComposition() {
      try {
        const data = await getComposition(productId);
        setComposition(data);
      } catch (error) {
        console.error("Error fetching composition data:", error);
        setError("Nie udało się załadować składu kosmetyku.");
      } finally {
        setLoading(false);
      }
    }

    fetchComposition();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Ładowanie danych o składzie...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!composition || composition.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Brak danych o składzie dla tego produktu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Ta lista pokazuje wszystkie składniki w tym produkcie zgodnie z
        Międzynarodowym Nazewnictwem Składników Kosmetycznych (INCI). Składniki
        są ułożone w kolejności od najwyższego do najniższego stężenia. Kliknij
        na nazwę składnika, aby zobaczyć więcej informacji.
      </p>

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
          {composition.map((item) => (
            <IngredientDetails
              key={item.id}
              ingredient={{
                id: item.id.toString(),
                inci_name: item.ingredient.inci_name,
                common_name: item.ingredient.common_name,
                function: item.ingredient.function || "",
                restrictions: item.ingredient.restrictions,
                action_description: item.ingredient.action_description,
                order: item.order_in_composition,
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
