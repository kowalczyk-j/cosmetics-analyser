import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  User,
  Barcode,
  AlignLeft,
  Tag,
  User2,
  Sparkles,
  Scissors,
} from "lucide-react";

interface CosmeticData {
  product_name: string;
  manufacturer: string;
  barcode: string;
  description: string;
  category: string;
}

interface CosmeticBasicInfoFormProps {
  data: CosmeticData;
  onChange: (data: CosmeticData) => void;
}

const categoryGroups = {
  Twarz: [
    "Oczyszczanie i demakijaż twarzy",
    "Kremy do twarzy",
    "Kremy z filtrem UV",
    "Kremy pod oczy",
    "Serum, maście i olejki do twarzy",
    "Peelingi do twarzy",
    "Maseczki na twarz",
    "Balsamy do ust",
    "Wody termalne i mgiełki",
    "Kosmetyki do rzęs i brwi",
  ],
  Ciało: [
    "Żele do ciała i produkty do kąpieli",
    "Balsamy i kremy do ciała",
    "Dezodoranty i antyperspiranty",
    "Pielęgnacja dłoni i stóp",
    "Peelingi do ciała",
    "Kosmetyki do depilacji",
    "Higiena intymna",
    "Samoopalacze i produkty do opalania",
  ],
  Włosy: [
    "Szampony",
    "Odżywki, olejki i maski do włosów",
    "Wcierki i peelingi do włosów",
    "Kosmetyki do golenia",
    "Stylizacja włosów",
    "Koloryzacja włosów",
  ],
};

const categoryIcons = {
  Twarz: User2,
  Ciało: Sparkles,
  Włosy: Scissors,
};

export function CosmeticBasicInfoForm({
  data,
  onChange,
}: CosmeticBasicInfoFormProps) {
  const handleInputChange = (field: keyof CosmeticData, value: string) => {
    if (typeof value !== "string") {
      console.warn("Invalid value type for field:", field, value);
      return;
    }

    onChange({
      ...data,
      [field]: value,
    });
  };

  const formatBarcode = (value: string) => {
    // limited to 13 non digits
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 13);
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="product_name" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Nazwa produktu *{" "}
            </Label>
            <Input
              id="product_name"
              placeholder="np. Krem nawilżający do twarzy"
              value={data.product_name}
              onChange={(e) =>
                handleInputChange("product_name", e.target.value.slice(0, 100))
              }
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              {data.product_name.length}/100 znaków
            </p>
          </div>

          {/* Manufacturer */}
          <div className="space-y-2">
            <Label htmlFor="manufacturer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Producent *{" "}
            </Label>
            <Input
              id="manufacturer"
              placeholder="np. L'Oréal Paris"
              value={data.manufacturer}
              onChange={(e) =>
                handleInputChange("manufacturer", e.target.value.slice(0, 50))
              }
              maxLength={50}
              required
            />
            <p className="text-xs text-muted-foreground">
              {data.manufacturer.length}/50 znaków
            </p>
          </div>

          {/* Barcode */}
          <div className="space-y-2">
            <Label htmlFor="barcode" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              Kod kreskowy *
            </Label>
            <Input
              id="barcode"
              placeholder="1234567890123"
              value={data.barcode}
              onChange={(e) =>
                handleInputChange("barcode", formatBarcode(e.target.value))
              }
              maxLength={13}
              required
            />
            <p className="text-xs text-muted-foreground">13-cyfrowy kod EAN</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Kategoria *
            </Label>
            <Select
              value={data.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent className="max-w-[400px]">
                {Object.entries(categoryGroups).map(
                  ([groupName, subcategories]) => {
                    const IconComponent =
                      categoryIcons[groupName as keyof typeof categoryIcons];

                    return (
                      <div key={groupName}>
                        {/* Group header with icon */}
                        <div className="font-semibold text-sm text-foreground px-3 py-2 bg-muted/80 flex items-center gap-2 border-b">
                          <IconComponent className="h-4 w-4" />
                          {groupName}
                        </div>

                        {/* Categories in this group */}
                        {subcategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="pl-6"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </div>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4" />
            Opis produktu{" "}
          </Label>
          <Textarea
            id="description"
            placeholder="Opcjonalny opis produktu, znajduje się na opakowaniu, podany przez producenta..."
            value={data.description}
            onChange={(e) =>
              handleInputChange("description", e.target.value.slice(0, 500))
            }
            maxLength={500}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {data.description.length}/500 znaków
          </p>
        </div>

        {/* Purchase link info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              💡 <span className="font-medium">Uzupełnij poprawnie</span>{" "}
              wszystkie wymagane pola, aby móc przejść dalej.
            </p>
            <p>
              🔗 <span className="font-medium">Link zakupowy</span> zostanie
              wygenerowany automatycznie na podstawie nazwy produktu.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
