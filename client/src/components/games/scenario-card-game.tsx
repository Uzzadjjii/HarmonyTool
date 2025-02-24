import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Scenario } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Timer, Trophy } from "lucide-react";

export function ScenarioCardGame() {
  const { toast } = useToast();
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: scenarios } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios"],
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ scenarioId, answer }: { scenarioId: number; answer: number }) => {
      const res = await apiRequest("POST", `/api/scenarios/${scenarioId}/answer`, { answer });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.correct ? "Bonne réponse !" : "Mauvaise réponse",
        description: `Vous avez gagné ${data.points} points`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
    },
  });

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      toast({
        title: "Temps écoulé !",
        description: "Vous devez répondre plus rapidement.",
        variant: "destructive",
      });
    }
  }, [isPlaying, timeLeft, toast]);

  const startNewGame = () => {
    if (scenarios && scenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      setCurrentScenario(scenarios[randomIndex]);
      setTimeLeft(60);
      setIsPlaying(true);
    }
  };

  const handleAnswer = (choiceIndex: number) => {
    if (!currentScenario) return;
    
    submitAnswerMutation.mutate({
      scenarioId: currentScenario.id,
      answer: choiceIndex,
    });
    setIsPlaying(false);
  };

  if (!scenarios) {
    return <div>Chargement des scénarios...</div>;
  }

  return (
    <div className="space-y-4">
      {!isPlaying ? (
        <Button onClick={startNewGame}>
          Commencer une nouvelle partie
        </Button>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{currentScenario?.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span>{timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentScenario?.description}</p>
            
            <div className="grid gap-2">
              {currentScenario?.choices.map((choice: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-4 px-6"
                  onClick={() => handleAnswer(index)}
                >
                  {choice}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{currentScenario?.points} points à gagner</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
