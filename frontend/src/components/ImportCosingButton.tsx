import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";
import api from "@/api/api";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function ImportCosingButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading || !isAdmin) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/api/import_cosing/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Plik COSING został zaimportowany do bazy danych.");
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("Brak uprawnień administratora do importu pliku COSING.");
      } else {
        alert("Błąd podczas importu pliku COSING.");
      }
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="ml-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" /> Importuj COSING
      </Button>
    </>
  );
}
