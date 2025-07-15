import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IngredientDetails } from "@/components/ingredient-details";

interface Ingredient {
  id: string;
  name: string;
  function: string;
  concerns?: string[];
  safetyRating?: number;
  description?: string;
}

interface Composition {
  productId: string;
  ingredients: Ingredient[];
}

// Mock implementation of getComposition
async function getComposition(productId: string): Promise<Composition> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockCompositions: Record<string, Composition> = {
    "5901234123457": {
      productId: "5901234123457",
      ingredients: [
        {
          id: "ing1",
          name: "Aqua/Woda",
          function: "Rozpuszczalnik",
          safetyRating: 10,
          description:
            "Podstawowy składnik większości kosmetyków. Służy jako rozpuszczalnik dla innych składników. Całkowicie bezpieczny dla skóry.",
        },
        {
          id: "ing2",
          name: "Gliceryna",
          function: "Humektant, Rozpuszczalnik",
          safetyRating: 9,
          description:
            "Naturalny składnik nawilżający, który przyciąga wodę do skóry. Pomaga utrzymać odpowiedni poziom nawilżenia i wzmacnia barierę skórną. Uznawany za jeden z najbezpieczniejszych składników w kosmetykach.",
        },
        {
          id: "ing3",
          name: "Alkohol Cetearylowy",
          function: "Emulgator, Emolient",
          safetyRating: 7,
          description:
            "Tłusty alkohol używany jako emulgator i czynnik zwiększający lepkość. Pomaga stabilizować formułę i nadaje jej kremową konsystencję. Mimo nazwy zawierającej słowo 'alkohol', nie wysusza skóry.",
        },
        {
          id: "ing4",
          name: "Fenoksyetanol",
          function: "Konserwant",
          safetyRating: 4,
          concerns: ["Podrażnienie", "Alergie"],
          description:
            "Syntetyczny konserwant używany do przedłużania trwałości produktów kosmetycznych. W wyższych stężeniach może powodować podrażnienia u osób z wrażliwą skórą. Dopuszczony do użytku w stężeniu do 1%.",
        },
      ],
    },
  };

  const composition = mockCompositions[productId];

  if (!composition) {
    return { productId, ingredients: [] };
  }

  return composition;
}

export function CompositionList({ productId }: { productId: string }) {
  const [composition, setComposition] = useState<Composition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComposition() {
      try {
        const data = await getComposition(productId);
        setComposition(data);
      } catch (error) {
        console.error("Error fetching composition data:", error);
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

  if (!composition || !composition.ingredients.length) {
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
        Międzynarodowym Nazewnictwem Składników Kosmetycznych (INCI). Kliknij na
        nazwę składnika, aby zobaczyć więcej informacji.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Składnik</TableHead>
            <TableHead>Funkcja</TableHead>
            <TableHead>Zastrzeżenia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {composition.ingredients.map((ingredient) => (
            <IngredientDetails key={ingredient.id} ingredient={ingredient} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
