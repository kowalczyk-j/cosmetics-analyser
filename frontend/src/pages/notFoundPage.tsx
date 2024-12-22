import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">
        Oops! Nie znaleziono tej strony.
      </p>
      <Button onClick={() => navigate("/")} size="lg">
        Strona główna
      </Button>
    </div>
  );
}
