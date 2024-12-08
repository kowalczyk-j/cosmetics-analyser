import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import Toolbar from "./Toolbar";
import api from "@/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export function LoginPageComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/api/token/", {
        username,
        password,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      console.log("User logged in:", { username });
      navigate("/profile");
    } catch (err) {
      console.error("Error during login:", err);
      setError("Nieprawidłowa nazwa użytkownika lub hasło. Spróbuj ponownie.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Toolbar />
      <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex items-center justify-center">
            <CardTitle className="text-2xl font-bold">Zaloguj się</CardTitle>
            <CardDescription>
              Wprowadź swoją nazwę użytkownika i hasło, aby kontynuować.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nazwa użytkownika</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Twoja nazwa użytkownika"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full flex justify-center items-center"
              >
                Zaloguj się
              </Button>
              <div className="text-sm text-center">
                <p className="text-muted-foreground">
                  Nie masz jeszcze konta?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Zarejestruj się
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
