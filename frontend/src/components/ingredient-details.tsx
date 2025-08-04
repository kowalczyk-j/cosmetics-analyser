import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

interface Ingredient {
  id: string;
  inci_name: string;
  common_name: string;
  function: string;
  restrictions: string;
  action_description: string;
  order: number;
  safety_rating?: string;
  restriction_description?: string;
}

export function IngredientDetails({ ingredient }: { ingredient: Ingredient }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const parseRestrictions = (restrictionDescription?: string): string[] => {
    if (!restrictionDescription || restrictionDescription.trim() === "")
      return [];

    // split by semicolon - separator in the backend
    return restrictionDescription
      .split(";")
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

  const getSafetyColorClasses = (safetyRating?: string) => {
    switch (safetyRating) {
      case "harmful":
        return "text-red-700 border-l-4 border-red-500 pl-2";
      case "beneficial":
        return "text-green-700 border-l-4 border-green-500 pl-2";
      case "neutral":
      default:
        return "text-gray-700 border-l-4 border-gray-400 pl-2";
    }
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
            className={`font-medium text-left flex items-center hover:text-primary transition-colors ${getSafetyColorClasses(
              ingredient.safety_rating
            )}`}
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
              <span className="text-muted-foreground italic">Brak</span>
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
            {parseRestrictions(ingredient.restriction_description).length >
            0 ? (
              parseRestrictions(ingredient.restriction_description).map(
                (restriction, index) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="text-xs cursor-help"
                    title={restriction}
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
