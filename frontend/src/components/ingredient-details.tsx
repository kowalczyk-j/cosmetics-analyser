"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

interface Ingredient {
  id: string;
  name: string;
  function: string;
  concerns?: string[];
  safetyRating?: number;
  description?: string;
}

export function IngredientDetails({ ingredient }: { ingredient: Ingredient }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function getIngredientColor(rating?: number): string {
    if (!rating) return "";
    if (rating >= 8) return "text-green-600";
    if (rating >= 5) return "text-amber-600";
    return "text-red-600";
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`font-medium text-left flex items-center ${getIngredientColor(
              ingredient.safetyRating
            )}`}
          >
            <span>{ingredient.name}</span>
            {isExpanded ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </button>
        </TableCell>
        <TableCell>{ingredient.function}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {ingredient.concerns?.map((concern, index) => (
              <Badge key={index} variant="outline">
                {concern}
              </Badge>
            )) || <span className="text-muted-foreground">Brak</span>}
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={3} className="p-4">
            <div className="text-sm">
              <p className="mb-2">
                <strong>Opis:</strong>
              </p>
              <p>
                {ingredient.description ||
                  "Brak szczegółowego opisu dla tego składnika."}
              </p>
              {/* {ingredient.safetyRating && (
                <p className="mt-2">
                  <strong>Ocena bezpieczeństwa:</strong>
                  <span className={`ml-2 ${getIngredientColor(ingredient.safetyRating)}`}>
                    {ingredient.safetyRating}/10
                  </span>
                </p>
              )} */}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
