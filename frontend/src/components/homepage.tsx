import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Barcode,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Search,
  Upload,
  CirclePlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Toolbar from "./Toolbar";
import api from "@/api";
import BarcodeScannerComponent from "./barcodescanner";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Modal from "@/components/ui/modal";

interface Cosmetic {
  id: number;
  product_name: string;
  manufacturer: string;
  barcode: string;
  description: string;
  category: string;
  purchase_link?: string;
}

const HeaderSection = () => {
  return (
    <div className="text-center py-4 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Twój personalny{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
          asystent kosmetyczny
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mt-4">
        Sprawdź składniki, wybieraj świadomie i ciesz się bezpiecznymi
        produktami z Clean.
      </p>
    </div>
  );
};

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Zeskanuj lub wyszukaj",
      description:
        "Zeskanuj kod kreskowy, wgraj jego zdjęcie lub wyszukaj nazwę produktu kosmetycznego",
      icon: <Barcode className="w-16 h-16 mb-4" />,
      bgImage: "/carousel_slide_1.jpg?height=400&width=800",
    },
    {
      title: "Poznaj składniki",
      description:
        "Zobacz szczegółowe informacje o składnikach INCI w Twoim produkcie",
      icon: <Search className="w-16 h-16 mb-4" />,
      bgImage: "/carousel_slide_2.jpg?height=400&width=800",
    },
    {
      title: "Oceń bezpieczeństwo",
      description:
        "Poznaj potencjalne korzyści i zagrożenia związane ze składnikami",
      icon: <Info className="w-16 h-16 mb-4" />,
      bgImage: "/carousel_slide_3.jpg?height=400&width=800",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div className="overflow-hidden h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
                    {slide.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{slide.title}</h3>
                  <p className="text-lg">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Cosmetic[]>([]);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [cosmeticInfo, setCosmeticInfo] = useState<Cosmetic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get<Cosmetic[]>("/cosmetics/", {
        params: { query: searchQuery },
      });
      setSearchResults(response.data);
      console.log("Search results:", response.data);
    } catch (error) {
      console.error("Error fetching cosmetics:", error);
      alert("Wystąpił błąd podczas wyszukiwania kosmetyków.");
    }
  };

  const fetchCosmeticInfo = async (barcode: string) => {
    try {
      const response = await api.get<Cosmetic[]>("api/cosmetics/", {
        params: { barcode },
      });
      if (response.data.length > 0) {
        setCosmeticInfo(response.data[0]);
      } else {
        setCosmeticInfo(null);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching cosmetic info:", error);
      setCosmeticInfo(null);
      setIsModalOpen(true);
    }
  };

  const handleBarcodeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Konwersja obrazu na obiekt URL
      const fileUrl = URL.createObjectURL(file);
      const codeReader = new BrowserMultiFormatReader();

      // Przetwarzanie obrazu kodu kreskowego
      const result = await codeReader.decodeFromImageUrl(fileUrl);
      console.log("Barcode result:", result.getText());

      setScannedBarcode(result.getText());
      fetchCosmeticInfo(result.getText());
    } catch (error) {
      console.error("Error decoding barcode:", error);
      setScannedBarcode(null);
      setCosmeticInfo(null);
      setIsModalOpen(true);
    }
  };

  const handleScan = (result: string) => {
    console.log("Scanned barcode:", result);
    setScannedBarcode(result);
    fetchCosmeticInfo(result);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Toolbar />
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <HeaderSection />
        <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-6">
          <Carousel />
          <h2 className="text-3xl font-bold text-center">
            Sprawdź swój kosmetyk
          </h2>
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <Tabs defaultValue="scan" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger
                    value="scan"
                    className="data-[state=active]:bg-background"
                  >
                    Skanuj kod kreskowy
                  </TabsTrigger>
                  <TabsTrigger
                    value="search"
                    className="data-[state=active]:bg-background"
                  >
                    Wyszukaj nazwę
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="scan" className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <BarcodeScannerComponent onScan={handleScan} />
                    <div className="relative w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="barcode-upload"
                        onChange={handleBarcodeUpload}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          document.getElementById("barcode-upload")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" /> Wgraj zdjęcie kodu
                        kreskowego
                      </Button>
                    </div>
                    <p className="text-center text-muted-foreground">
                      Zeskanuj kod kreskowy dowolnego produktu kosmetycznego lub
                      wgraj jego zdjęcie, aby dowiedzieć się więcej o jego
                      składnikach INCI.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="search">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Wpisz nazwę kosmetyku"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Szukaj
                      </Button>
                    </div>
                    <p className="text-center text-muted-foreground">
                      Wpisz nazwę produktu kosmetycznego, aby znaleźć informacje
                      o jego składnikach INCI.
                    </p>
                  </form>
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="font-semibold">Wyniki wyszukiwania:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {searchResults.map((cosmetic) => (
                          <Card key={cosmetic.id} className="p-2">
                            <h4 className="font-medium">
                              {cosmetic.product_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {cosmetic.manufacturer}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <Link
                      to="/add-cosmetic"
                      className="text-primary hover:underline"
                    >
                      Twojego kosmetyku nie ma w bazie? Dodaj go tutaj
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center max-w-2xl">
            <h3 className="text-2xl font-semibold mb-4">Dlaczego Clean.?</h3>
            <ul className="text-left space-y-4">
              <li className="flex items-start">
                <Info className="h-6 w-6 mr-2 text-primary flex-shrink-0" />
                <span>
                  Dostęp do obszernej bazy danych składników INCI i ich wpływu
                  na skórę
                </span>
              </li>
              <li className="flex items-start">
                <Heart className="h-6 w-6 mr-2 text-primary flex-shrink-0" />
                <span>
                  Personalizowane rekomendacje oparte na Twoim typie skóry i
                  preferencjach
                </span>
              </li>
              <li className="flex items-start">
                <Calendar className="h-6 w-6 mr-2 text-primary flex-shrink-0" />
                <span>Twórz i śledź swoje codzienne rutyny pielęgnacyjne</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-muted mt-auto">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Clean. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          cosmeticInfo ? "Informacje o produkcie" : "Nie znaleziono produktu"
        }
        footerButtonLabel={cosmeticInfo ? "Sprawdź skład" : "Dodaj produkt"}
        onFooterButtonClick={() => setIsModalOpen(false)}
        footerButtonIcon={cosmeticInfo ? <Search /> : <CirclePlus />}
      >
        {cosmeticInfo ? (
          <div>
            <p>
              <strong>Nazwa produktu:</strong> {cosmeticInfo.product_name}
            </p>
            <p>
              <strong>Producent:</strong> {cosmeticInfo.manufacturer}
            </p>
            <p>
              <strong>Kategoria:</strong> {cosmeticInfo.category}
            </p>
          </div>
        ) : scannedBarcode ? (
          <>
            <p>Zeskanowano kod kreskowy: {scannedBarcode}</p>
            <p>
              Sprawdź wykryty przez nas kod. Jeśli jest on poprawny, możesz
              wspomóc naszą społeczność, dodając kosmetyk do bazy.
            </p>
          </>
        ) : (
          <p>
            Nie rozpoznano kodu kreskowego. Spróbuj ponownie lub dodaj kosmetyk
            do naszej bazy, wpisując kod kreskowy ręcznie.
          </p>
        )}
      </Modal>
    </div>
  );
}
