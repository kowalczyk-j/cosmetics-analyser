import { useState, useEffect } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import Toolbar from "@/components/Toolbar";
import { SkinSurvey } from "@/components/skin-survey";

function ConfirmEmailChangeModal({
  visible,
  newEmail,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  newEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p>
          Czy na pewno zmienić adres e-mail na: <strong>{newEmail}</strong>?
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button onClick={onConfirm}>Tak, zmień</Button>
        </div>
      </div>
    </div>
  );
}

export function UserAccount() {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    person?: {
      specialization: string;
      skin_type?: string;
      skin_problems?: string;
    };
    is_staff?: boolean;
    date_joined?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [skinType, setSkinType] = useState("normal");
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [showSkinSurvey, setShowSkinSurvey] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/users/me/");
      setUserData(response.data);
    } catch {
      setError("Nie udało się pobrać danych użytkownika.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEmail("");

    if (!newEmail.trim()) {
      setErrorEmail("Podaj nowy adres e-mail.");
      return;
    }

    setShowConfirmEmailModal(true);
  };

  const confirmEmailChange = async () => {
    try {
      const response = await api.patch("/api/users/change_email/", {
        new_email: newEmail,
      });
      alert(response.data.detail);
      setNewEmail("");
    } catch (err) {
      setErrorEmail("Nie udało się zmienić e-maila.");
    } finally {
      setShowConfirmEmailModal(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPass("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorPass("Wypełnij wszystkie pola.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorPass("Nowe hasła nie są identyczne.");
      return;
    }

    try {
      const response = await api.patch("/api/users/change_password/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      alert(response.data.detail);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorPass("Nie udało się zmienić hasła.");
    }
  };

  if (isLoading) {
    return <div>Ładowanie profilu...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!userData) {
    return <div>Brak danych użytkownika.</div>;
  }

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
        {/* First Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl sm:text-2xl">
                  Witaj, {userData.username}
                </CardTitle>
              </div>
              <Badge variant="secondary" className="mt-2">
                {userData.is_staff ? "Admin" : "Użytkownik"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  E-mail
                </p>
                <p className="text-lg font-semibold">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Data dołączenia
                </p>
                <p className="text-lg font-semibold">
                  {userData.date_joined
                    ? new Date(userData.date_joined).toLocaleDateString("pl-PL")
                    : "Brak danych"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={[]} className="space-y-4">
          {/* MOJA SKÓRA */}
          <AccordionItem value="skin">
            <AccordionTrigger className="text-lg font-semibold">
              Moja skóra
            </AccordionTrigger>
            <AccordionContent>
              {showSkinSurvey ? (
                <SkinSurvey
                  onComplete={() => {
                    setShowSkinSurvey(false);
                    fetchUserData();
                  }}
                />
              ) : (
                <Card>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 mt-4">
                      Uzupełnij informacje o swojej skórze, abyśmy mogli lepiej
                      dopasować produkty do Twoich potrzeb.
                    </p>

                    {userData?.person && (
                      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Twój obecny profil skóry:
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">
                              Typ skóry:
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {userData.person.skin_type || "Nie określono"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              Problemy skórne:
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {userData.person.skin_problems || "Brak"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowSkinSurvey(true)}
                        className="w-full"
                      >
                        {userData?.person?.skin_type
                          ? "Wypełnij ankietę ponownie"
                          : "Wypełnij ankietę o typie skóry"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Ankieta pomoże nam dokładnie określić Twój typ skóry i
                        problemy skórne na podstawie sprawdzonej metodologii
                        dermatologicznej.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* ULUBIONE PRODUKTY */}
          <AccordionItem value="favorites">
            <AccordionTrigger className="text-lg font-semibold">
              Ulubione produkty
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 mt-4">
                    Zarządzaj swoją listą ulubionych produktów
                  </p>
                  {favoriteProducts.length > 0 ? (
                    <>
                      <ul className="space-y-2 mt-4">
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
            </AccordionContent>
          </AccordionItem>

          {/* PROFIL */}
          <AccordionItem value="profile">
            <AccordionTrigger className="text-lg font-semibold">
              Ustawienia profilu
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 mt-4">
                    Zarządzaj swoimi danymi osobowymi i preferencjami
                  </p>
                  {/* Formularz zmiany e-maila */}
                  <div className="border p-4 rounded">
                    <form onSubmit={handleChangeEmail} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Nowy adres e-mail</Label>
                        <Input
                          id="new-email"
                          type="email"
                          placeholder="Wprowadź nowy adres e-mail"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                        {errorEmail && (
                          <p className="text-red-500 text-sm">{errorEmail}</p>
                        )}
                      </div>
                      <Button type="submit">Zmień e-mail</Button>
                    </form>
                  </div>

                  {/* Pop-up potwierdzenia zmiany e-maila */}
                  <ConfirmEmailChangeModal
                    visible={showConfirmEmailModal}
                    newEmail={newEmail}
                    onConfirm={confirmEmailChange}
                    onCancel={() => setShowConfirmEmailModal(false)}
                  />

                  {/* Formularz zmiany hasła */}
                  <div className="border p-4 rounded mt-4">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Aktualne hasło</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Wprowadź aktualne hasło"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nowe hasło</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Wprowadź nowe hasło"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errorPass && (
                          <p className="text-red-500 text-sm">{errorPass}</p>
                        )}
                      </div>
                      <Button type="submit">Zmień hasło</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Button className="h-auto py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Moje rutyny pielęgnacyjne</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-auto py-4 flex items-center justify-between"
          >
            <Link
              to="/"
              className="text-primary hover:underline visited:text-primary"
            >
              <div className="flex items-center">
                <Barcode className="w-5 h-5 mr-2" />
                <span>Skanuj nowy produkt</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
