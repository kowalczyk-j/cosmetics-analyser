import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, GripVertical } from "lucide-react";
import api from "@/api/api";

interface IngredientINCI {
  cosing_ref_no: number;
  inci_name: string;
  common_name?: string;
  function?: string;
  restrictions?: string;
}

interface SelectedIngredient {
  cosing_ref_no: number;
  inci_name: string;
  common_name?: string;
  function?: string;
  order: number;
}

interface IngredientSearchFormProps {
  selectedIngredients?: SelectedIngredient[];
  onIngredientsChange: (ingredients: SelectedIngredient[]) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function IngredientSearchForm({
  selectedIngredients = [], // default value
  onIngredientsChange,
  onValidationChange,
}: IngredientSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IngredientINCI[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    onValidationChange?.(selectedIngredients?.length > 0);
  }, [selectedIngredients, onValidationChange]);

  // debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchIngredients(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchIngredients = async (query: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/ingredients/?search=${query}`);

      const selectedIds = (selectedIngredients || []).map(
        (ing) => ing.cosing_ref_no
      );
      const filteredResults = response.data.filter(
        (ingredient: IngredientINCI) =>
          !selectedIds.includes(ingredient.cosing_ref_no)
      );

      // max 10 results
      setSearchResults(filteredResults.slice(0, 10));
    } catch (error) {
      console.error("Error searching ingredients:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = (ingredient: IngredientINCI) => {
    const newIngredient: SelectedIngredient = {
      cosing_ref_no: ingredient.cosing_ref_no,
      inci_name: ingredient.inci_name,
      common_name: ingredient.common_name,
      function: ingredient.function,
      order: (selectedIngredients?.length || 0) + 1,
    };

    onIngredientsChange([...selectedIngredients, newIngredient]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeIngredient = (cosing_ref_no: number) => {
    const updated = selectedIngredients
      .filter((ing) => ing.cosing_ref_no !== cosing_ref_no)
      .map((ing, index) => ({ ...ing, order: index + 1 }));

    onIngredientsChange(updated);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedItem === null) return;

    const newIngredients = [...selectedIngredients];
    const draggedIngredient = newIngredients[draggedItem];

    // delete dragged item
    newIngredients.splice(draggedItem, 1);

    // insert at new position
    newIngredients.splice(dropIndex, 0, draggedIngredient);

    // Reorder ingredients
    const reorderedIngredients = newIngredients.map((ing, index) => ({
      ...ing,
      order: index + 1,
    }));

    onIngredientsChange(reorderedIngredients);
    setDraggedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Wyszukaj składnik INCI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Wpisz nazwę składnika (np. aqua, glycerin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {loading && (
            <div className="mt-4 text-center py-4 text-muted-foreground">
              Wyszukiwanie...
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((ingredient) => (
                <div
                  key={ingredient.cosing_ref_no}
                  className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => addIngredient(ingredient)}
                >
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
                  <div className="text-xs text-muted-foreground ml-2">
                    Kliknij aby dodać
                  </div>
                </div>
              ))}
              {searchResults.length === 10 && (
                <div className="text-xs text-muted-foreground text-center py-2 border-t">
                  Pokazano 10 z możliwych wyników. Uściślij wyszukiwanie aby
                  zobaczyć więcej.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>
            Wybrane składniki ({selectedIngredients?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(selectedIngredients?.length || 0) === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Dodaj przynajmniej jeden składnik
            </p>
          ) : (
            <div className="space-y-2">
              {(selectedIngredients || []).map((ingredient, index) => (
                <div
                  key={ingredient.cosing_ref_no}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-move hover:bg-muted/50"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />

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

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeIngredient(ingredient.cosing_ref_no)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(selectedIngredients?.length || 0) === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          ⚠️ Dodaj przynajmniej jeden składnik aby przejść dalej
        </p>
      )}
    </div>
  );
}
