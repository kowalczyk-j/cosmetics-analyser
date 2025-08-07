import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/api";

const SKIN_TYPE_QUESTIONS = [
  {
    code: "A1",
    question: "Moja twarz błyszczy się w ciągu dnia bez makijażu.",
    skinTypes: ["Tłusta"],
  },
  {
    code: "A2",
    question: "Czuję tłustą/lepką warstwę pod opuszkami palców.",
    skinTypes: ["Tłusta"],
  },
  {
    code: "A3",
    question: "Makijaż 'spływa' mi szybciej niż znajomym.",
    skinTypes: ["Tłusta"],
  },
  {
    code: "A4",
    question: "Widzę wyraźnie powiększone pory na policzkach lub nosie.",
    skinTypes: ["Tłusta", "Mieszana"],
  },
  {
    code: "A5",
    question: "Po oczyszczeniu skóra szybko znów się świeci.",
    skinTypes: ["Tłusta"],
  },
  {
    code: "B1",
    question: "Skóra bywa ściągnięta lub szorstka, zwłaszcza po myciu.",
    skinTypes: ["Sucha"],
  },
  {
    code: "B2",
    question: "Łuszczy mi się naskórek (np. na skrzydełkach nosa, czole).",
    skinTypes: ["Sucha"],
  },
  {
    code: "B3",
    question:
      "Krem wchłania się błyskawicznie i wciąż czuję potrzebę dokładania.",
    skinTypes: ["Sucha"],
  },
  {
    code: "B4",
    question: "Czuję dyskomfort lub pieczenie po kontakcie z wodą.",
    skinTypes: ["Sucha", "Wrażliwa"],
  },
  {
    code: "C1",
    question:
      "Strefa T (czoło, nos, broda) błyszczy się, policzki są raczej matowe.",
    skinTypes: ["Mieszana"],
  },
  {
    code: "C2",
    question: "Posiadam jednocześnie miejsca tłuste i bardzo suche.",
    skinTypes: ["Mieszana"],
  },
  {
    code: "C3",
    question: "Muszę używać różnych kremów na różne partie twarzy.",
    skinTypes: ["Mieszana"],
  },
  {
    code: "D1",
    question: "Rzadko mam niedoskonałości i brak uczucia ściągnięcia.",
    skinTypes: ["Normalna"],
  },
  {
    code: "D2",
    question: "Skóra ma jednolity koloryt i miękką, gładką powierzchnię.",
    skinTypes: ["Normalna"],
  },
  {
    code: "D3",
    question: "Nie zauważam nadmiernego błysku ani suchości.",
    skinTypes: ["Normalna"],
  },
  {
    code: "E1",
    question:
      "Skóra łatwo czerwieni się przy dotyku, zmianie temperatury lub po nowych kosmetykach.",
    skinTypes: ["Wrażliwa"],
  },
  {
    code: "E2",
    question: "Często piecze lub swędzi po aplikacji produktów.",
    skinTypes: ["Wrażliwa"],
  },
  {
    code: "E3",
    question: "Mam skłonność do rumienia lub teleangiektazji (pajączków).",
    skinTypes: ["Wrażliwa"],
  },
];

const SKIN_PROBLEMS = [
  {
    code: "P1",
    name: "Trądzik",
    question: "Mam widoczne krosty, grudki lub stany zapalne.",
  },
  {
    code: "P2",
    name: "Zaskórniki",
    question: "Widzę czarne kropki/białe grudki w porach.",
  },
  {
    code: "P3",
    name: "Rozszerzone pory",
    question: "Pory są na tyle duże, że widzę je w lustrze z 20 cm.",
  },
  {
    code: "P4",
    name: "Przebarwienia",
    question: "Mam ciemniejsze plamy/ślady posłoneczne lub potrądzikowe.",
  },
  {
    code: "P5",
    name: "Utrata jędrności",
    question: "Skóra wydaje się mniej napięta, 'opadają' kontury.",
  },
  {
    code: "P6",
    name: "Zmarszczki",
    question: "Widać linie mimiczne, zmarszczki lub 'kurze łapki'.",
  },
  {
    code: "P7",
    name: "Podrażnienia/rumień",
    question: "Łatwo pojawia się zaczerwienienie lub pieczenie.",
  },
  {
    code: "P8",
    name: "AZS/egzema/łuszczyca",
    question: "Lekarz zdiagnozował lub dostrzegam objawy tych schorzeń.",
  },
  {
    code: "P9",
    name: "Cera naczynkowa",
    question: "Dostrzegam popękane naczynka/pajączki.",
  },
  {
    code: "P10",
    name: "Cienie/opuchnięcia pod oczami",
    question: "Mam wyraźne sine/brązowe cienie lub obrzęk.",
  },
];

interface SurveyAnswers {
  [questionCode: string]: number;
}

interface ProblemAnswers {
  [problemCode: string]: boolean;
}

export function SkinSurvey({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState<"skin-type" | "problems" | "results">(
    "skin-type"
  );
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [problemAnswers, setProblemAnswers] = useState<ProblemAnswers>({});
  const [results, setResults] = useState<{
    skinType: string;
    problems: string[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSurveyAnswer = (code: string, value: number) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [code]: value,
    }));
  };

  const handleProblemAnswer = (code: string, checked: boolean) => {
    setProblemAnswers((prev) => ({
      ...prev,
      [code]: checked,
    }));
  };

  const calculateSkinType = (): string => {
    const scores = {
      Tłusta: 0,
      Sucha: 0,
      Mieszana: 0,
      Normalna: 0,
      Wrażliwa: 0,
    };

    // Calculate points for each skin type
    SKIN_TYPE_QUESTIONS.forEach((q) => {
      const answer = surveyAnswers[q.code] || 0;
      q.skinTypes.forEach((type) => {
        scores[type as keyof typeof scores] += answer;
      });
    });

    // Find the type with the highest score (min. 8 pts)
    const sortedTypes = Object.entries(scores)
      .filter(([_, score]) => score >= 8)
      .sort(([, a], [, b]) => b - a);

    if (sortedTypes.length === 0) {
      return "Normalna"; // Default to Normal if no type meets the criteria
    }

    const [firstType, firstScore] = sortedTypes[0];

    // Check for sensitivity rule
    if (sortedTypes.length >= 2) {
      const [secondType, secondScore] = sortedTypes[1];
      if (firstScore - secondScore <= 2 && secondType === "Wrażliwa") {
        return `${firstType} - Wrażliwa`;
      }
    }

    // Check for multiple types with the same score
    const priority = ["Mieszana", "Tłusta", "Sucha", "Normalna", "Wrażliwa"];
    const equalScores = sortedTypes.filter(
      ([_, score]) => score === firstScore
    );

    if (equalScores.length > 1) {
      for (const type of priority) {
        if (equalScores.some(([t]) => t === type)) {
          return type;
        }
      }
    }

    return firstType;
  };

  const getSelectedProblems = (): string[] => {
    return SKIN_PROBLEMS.filter((p) => problemAnswers[p.code]).map(
      (p) => p.name
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const skinType = calculateSkinType();
      const problems = getSelectedProblems();

      // Send results to the backend
      await api.patch("/api/users/update_skin_profile/", {
        skin_type: skinType,
        skin_problems: problems,
      });

      setResults({ skinType, problems });
      setStep("results");

      toast({
        title: "Ankieta completed!",
        description: "Twój profil skóry został zaktualizowany.",
      });

      onComplete?.();
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać wyników ankiety.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Complete = () => {
    return SKIN_TYPE_QUESTIONS.every(
      (q) => surveyAnswers[q.code] !== undefined
    );
  };

  if (step === "skin-type") {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ankieta typu skóry - Krok 1/2</CardTitle>
          <p className="text-muted-foreground">
            Oceń każde stwierdzenie w skali 1-5, gdzie:
            <br />
            <strong>1 = zdecydowanie nie</strong>,{" "}
            <strong>5 = zdecydowanie tak</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {SKIN_TYPE_QUESTIONS.map((q, index) => (
            <div key={q.code} className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
                <p className="flex-1">{q.question}</p>
              </div>
              <div className="flex gap-2 ml-16">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={
                      surveyAnswers[q.code] === value ? "default" : "outline"
                    }
                    size="sm"
                    className="w-10 h-10"
                    onClick={() => handleSurveyAnswer(q.code, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setStep("problems")}
              disabled={!isStep1Complete()}
            >
              Dalej - Problemy skórne
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "problems") {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ankieta typu skóry - Krok 2/2</CardTitle>
          <p className="text-muted-foreground">
            Zaznacz problemy skórne, które Cię dotyczą:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {SKIN_PROBLEMS.map((p, index) => (
            <div key={p.code} className="flex items-start space-x-3">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="text-xs min-w-[24px] h-5 flex items-center justify-center"
                >
                  {index + 1}
                </Badge>
                <Checkbox
                  id={p.code}
                  checked={problemAnswers[p.code] || false}
                  onCheckedChange={(checked) =>
                    handleProblemAnswer(p.code, checked as boolean)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={p.code} className="text-base font-medium">
                  {p.name}
                </Label>
                <p className="text-sm text-muted-foreground">{p.question}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep("skin-type")}>
              Wróć
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zakończ ankietę"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results step
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Wyniki ankiety</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Twój typ skóry:</h3>
          <Badge variant="default" className="text-lg p-2">
            {results?.skinType}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Zidentyfikowane problemy:</h3>
          <div className="flex flex-wrap gap-2">
            {results?.problems && results.problems.length > 0 ? (
              results.problems.map((problem) => (
                <Badge key={problem} variant="secondary">
                  {problem}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">
                Brak zidentyfikowanych problemów
              </span>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={onComplete} className="w-full">
            Przejdź do profilu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
