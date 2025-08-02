import { useState, Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  List,
  Eye,
} from "lucide-react";
import Toolbar from "@/components/Toolbar";
import { CosmeticBasicInfoForm } from "../components/CosmeticBasicInfoForm";
import { IngredientSearchForm } from "../components/IngredientSearchForm";
import { CosmeticPreview } from "../components/CosmeticPreview";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import api from "@/api/api";

interface CosmeticData {
  product_name: string;
  manufacturer: string;
  barcode: string;
  description: string;
  category: string;
  is_verified?: boolean;
}

interface SelectedIngredient {
  cosing_ref_no: number;
  inci_name: string;
  common_name?: string;
  function?: string;
  order: number;
}

const STEPS = [
  {
    id: 1,
    title: "Podstawowe dane",
    description: "Edytuj informacje o kosmetyku",
    icon: Package,
  },
  {
    id: 2,
    title: "Lista składników",
    description: "Edytuj składniki INCI kosmetyku",
    icon: List,
  },
  { id: 3, title: "Podsumowanie", description: "Sprawdź i zapisz", icon: Eye },
];

export function EditCosmeticPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [cosmeticData, setCosmeticData] = useState<CosmeticData>({
    product_name: "",
    manufacturer: "",
    barcode: "",
    description: "",
    category: "",
  });
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    const loadCosmeticData = async () => {
      if (!productId) return;

      try {
        setInitialLoading(true);

        const cosmeticResponse = await api.get(`/api/cosmetics/${productId}`);
        setCosmeticData(cosmeticResponse.data);

        const compositionResponse = await api.get(
          `/api/cosmetics/${productId}/composition/`
        );

        const ingredients = compositionResponse.data.map(
          (item: any, index: number) => ({
            cosing_ref_no: item.ingredient.cosing_ref_no,
            inci_name: item.ingredient.inci_name,
            common_name: item.ingredient.common_name,
            function: item.ingredient.function,
            order: item.order_in_composition || index + 1,
          })
        );

        setSelectedIngredients(ingredients);
      } catch (error) {
        console.error("Error loading cosmetic data:", error);
        alert("Nie udało się załadować danych kosmetyku.");
        navigate("/");
      } finally {
        setInitialLoading(false);
      }
    };

    loadCosmeticData();
  }, [productId, navigate]);

  const handleCosmeticDataChange = (newData: CosmeticData) => {
    console.log("Updating cosmetic data:", newData);
    setCosmeticData(newData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          cosmeticData.product_name &&
          cosmeticData.manufacturer &&
          cosmeticData.barcode.length === 13 &&
          cosmeticData.category
        );
      case 2:
        return selectedIngredients.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!isStepValid() || !productId) return;

    setLoading(true);
    try {
      // update cosmetic data
      await api.put(`/api/cosmetics/${productId}/`, cosmeticData);

      // delete old ingredients
      await api.delete(`/api/cosmetics/${productId}/composition/`);

      // add new ingredients
      const compositionData = selectedIngredients.map((ingredient) => ({
        cosmetic: cosmeticData.barcode,
        ingredient: ingredient.cosing_ref_no,
        order_in_composition: ingredient.order,
      }));

      for (const composition of compositionData) {
        await api.post("/api/cosmetic_compositions/", composition);
      }

      // navigate to the updated cosmetic page
      navigate(`/cosmetics/${cosmeticData.barcode}`);
    } catch (error: any) {
      console.error("Error saving cosmetic:", error);

      // handle validation errors
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessage = "Wystąpiły błędy walidacji:\n\n";

        if (errors.product_name) {
          errorMessage += `• Nazwa produktu: ${errors.product_name[0]}\n`;
        }
        if (errors.manufacturer) {
          errorMessage += `• Producent: ${errors.manufacturer[0]}\n`;
        }
        if (errors.barcode) {
          errorMessage += `• Kod kreskowy: ${errors.barcode[0]}\n`;
        }
        if (errors.description) {
          errorMessage += `• Opis: ${errors.description[0]}\n`;
        }
        if (errors.category) {
          errorMessage += `• Kategoria: ${errors.category[0]}\n`;
        }
        if (errors.error) {
          errorMessage += `• ${errors.error}\n`;
        }

        alert(errorMessage);
      } else {
        alert(
          "Wystąpił błąd podczas zapisywania kosmetyku. Sprawdź czy wszystkie dane są prawidłowe."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CosmeticBasicInfoForm
            data={cosmeticData}
            onChange={handleCosmeticDataChange}
          />
        );
      case 2:
        return (
          <IngredientSearchForm
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
            onValidationChange={() => {}} // Walidacja jest już obsługiwana w isStepValid
          />
        );
      case 3:
        return (
          <CosmeticPreview
            cosmeticData={cosmeticData}
            ingredients={selectedIngredients}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (adminLoading || initialLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Toolbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Ładowanie...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toolbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edytuj kosmetyk</h1>
          <p className="text-muted-foreground">
            Edytuj dane kosmetyku i składniki INCI
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id === currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        step.id === currentStep
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-4 ${
                      step.id < currentStep ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Poprzedni
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Następny
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!isStepValid() || loading}>
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
