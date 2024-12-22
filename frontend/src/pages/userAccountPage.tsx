import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Barcode,
  ChevronRight,
  Droplet,
  FlaskRoundIcon as Flask,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import Toolbar from "@/components/Toolbar";

export function UserAccount() {
  const [email, setEmail] = useState("user@example.com");
  const [skinType, setSkinType] = useState("normal");
  const [skinConcerns, setSkinConcerns] = useState([]);

  const favoriteProducts = [
    {
      id: 1,
      name: "Nawilżający krem do twarzy",
      brand: "NaturaCare",
      type: "cream",
    },
    {
      id: 2,
      name: "Serum z witaminą C",
      brand: "BeautyEssence",
      type: "serum",
    },
    {
      id: 3,
      name: "Delikatny żel do mycia twarzy",
      brand: "SoftSkin",
      type: "cleanser",
    },
    { id: 4, name: "Tonik bezalkoholowy", brand: "PureSkin", type: "toner" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toolbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Witaj, JanKowalski</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  Zwykły użytkownik
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  E-mail
                </p>
                <p className="text-lg font-semibold">{email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data dołączenia
                </p>
                <p className="text-lg font-semibold">01.01.2023</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Zarządzaj swoimi danymi osobowymi i preferencjami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="email">
                  <AccordionTrigger>Zmień adres e-mail</AccordionTrigger>
                  <AccordionContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Nowy adres e-mail</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="Wprowadź nowy adres e-mail"
                        />
                      </div>
                      <Button type="submit">Zmień e-mail</Button>
                    </form>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="password">
                  <AccordionTrigger>Zmień hasło</AccordionTrigger>
                  <AccordionContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Aktualne hasło</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Wprowadź aktualne hasło"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nowe hasło</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Wprowadź nowe hasło"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Potwierdź nowe hasło
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Potwierdź nowe hasło"
                        />
                      </div>
                      <Button type="submit">Zmień hasło</Button>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moja skóra</CardTitle>
              <CardDescription>
                Zaktualizuj informacje o swojej skórze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skin-type">Typ skóry</Label>
                  <Select value={skinType} onValueChange={setSkinType}>
                    <SelectTrigger id="skin-type">
                      <SelectValue placeholder="Wybierz typ skóry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normalna</SelectItem>
                      <SelectItem value="dry">Sucha</SelectItem>
                      <SelectItem value="oily">Tłusta</SelectItem>
                      <SelectItem value="combination">Mieszana</SelectItem>
                      <SelectItem value="sensitive">Wrażliwa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Problemy skórne</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Trądzik",
                      "Zmarszczki",
                      "Przebarwienia",
                      "Zaczerwienienia",
                      "Suchość",
                    ].map((concern) => (
                      <Button
                        key={concern}
                        variant={
                          skinConcerns.includes(concern) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSkinConcerns((prev) =>
                            prev.includes(concern)
                              ? prev.filter((c) => c !== concern)
                              : [...prev, concern]
                          )
                        }
                      >
                        {concern}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button type="submit">Zapisz zmiany</Button>
              </form>
              <div className="mt-4">
                <Link
                  to="/skin-survey"
                  className="text-primary hover:underline"
                >
                  Nie znasz się na tym? Wypełnij ankietę i pomóż nam wybrać za
                  ciebie
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ulubione produkty</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteProducts.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {favoriteProducts.slice(0, 3).map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {product.type === "cream" && (
                            <Droplet className="w-4 h-4 mr-2" />
                          )}
                          {product.type === "serum" && (
                            <Flask className="w-4 h-4 mr-2" />
                          )}
                          {product.type === "cleanser" && (
                            <Waves className="w-4 h-4 mr-2" />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Link
                      to="/favorite-products"
                      className="text-primary hover:underline"
                    >
                      Zobacz pełną listę ulubionych produktów
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Nie masz jeszcze ulubionych produktów.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button className="h-auto py-4 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Moje rutyny pielęgnacyjne</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Barcode className="w-5 h-5 mr-2" />
                <span>Skanuj nowy produkt</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
