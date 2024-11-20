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

export function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Here you would typically call an API to authenticate the user
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("User logged in:", { email });
      navigate("/dashboard"); // Redirect to dashboard or home page after successful login
    } catch (err) {
      setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.");
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
              Wprowadź swój adres e-mail i hasło, aby kontynuować.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adres e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
