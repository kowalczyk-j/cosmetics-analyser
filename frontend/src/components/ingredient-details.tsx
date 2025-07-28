import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

interface Ingredient {
  id: string;
  inci_name: string;
  common_name?: string;
  function?: string;
  restrictions?: string;
  action_description?: string;
  order: number;
}

export function IngredientDetails({ ingredient }: { ingredient: Ingredient }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const parseRestrictions = (restrictions?: string): string[] => {
    if (!restrictions || restrictions.trim() === "") return [];
    return restrictions
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  };

  const parseFunctions = (functions?: string): string[] => {
    if (!functions || functions.trim() === "") return [];
    return functions
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  };

  const getTooltipText = (text: string): string => {
    const tooltips: { [key: string]: string } = {
      abrasive: "Składnik łączący fazę wodną i olejową w kremach",
      moisturizer: "Składnik nawilżający skórę i zapobiegający utracie wody",
    };

    const lowerText = text.toLowerCase();
    for (const [key, value] of Object.entries(tooltips)) {
      if (lowerText.includes(key)) {
        return value;
      }
    }
    return `Więcej informacji o: ${text}`;
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-medium text-left flex items-center hover:text-primary"
          >
            <span className="mr-2 text-xs text-muted-foreground font-normal">
              {ingredient.order}.
            </span>
            <span>{ingredient.inci_name}</span>
            {isExpanded ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </button>
        </TableCell>
        <TableCell>
          <span className="text-sm">
            {ingredient.common_name || (
              <span className="text-muted-foreground italic">
                Brak nazwy popularnej
              </span>
            )}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {parseFunctions(ingredient.function).length > 0 ? (
              parseFunctions(ingredient.function).map((func, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-help"
                  title={getTooltipText(func)}
                >
                  {func}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">Nieznana</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {parseRestrictions(ingredient.restrictions).length > 0 ? (
              parseRestrictions(ingredient.restrictions).map(
                (restriction, index) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="text-xs cursor-help"
                    title={getTooltipText(restriction)}
                  >
                    {restriction}
                  </Badge>
                )
              )
            ) : (
              <span className="text-muted-foreground text-sm">Brak</span>
            )}
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={4} className="p-4">
            <div className="text-sm">
              <div>
                <strong>Opis działania:</strong>
              </div>
              <p className="mt-2 text-muted-foreground">
                {ingredient.action_description ||
                  "Brak szczegółowego opisu działania dla tego składnika."}
              </p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
