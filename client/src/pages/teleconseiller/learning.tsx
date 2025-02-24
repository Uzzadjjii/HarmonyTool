import { TeleconLayout } from "@/components/layout/teleconseiller-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Book, Gamepad2, Brain, Timer } from "lucide-react";
import { useState } from "react";
import { ScenarioCardGame } from "@/components/games/scenario-card-game";
import type { Scenario } from "@shared/schema";

export default function TeleconLearning() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user-progress"],
  });

  const { data: scenarios } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios"],
  });

  return (
    <TeleconLayout>
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Espace Formation</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{userProgress?.totalPoints || 0} points</span>
            </div>
            <Progress value={75} className="w-32" />
            <span className="text-sm text-muted-foreground">Niveau {userProgress?.level || 1}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Défis Complétés
              </CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.completedScenarios?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Badges Gagnés
              </CardTitle>
              <Trophy className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.badges?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temps de Formation
              </CardTitle>
              <Timer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Position Classement
              </CardTitle>
              <Brain className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#3</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="games" className="space-y-4">
          <TabsList>
            <TabsTrigger value="games">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Mini-Jeux
            </TabsTrigger>
            <TabsTrigger value="training">
              <Brain className="h-4 w-4 mr-2" />
              Formation
            </TabsTrigger>
            <TabsTrigger value="library">
              <Book className="h-4 w-4 mr-2" />
              Bibliothèque
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-4">
            {activeGame ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setActiveGame(null)}
                >
                  ← Retour aux jeux
                </Button>
                {activeGame === "scenarios" && <ScenarioCardGame />}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cas Clients</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Entraînez-vous à gérer différents scénarios client avec notre jeu de cartes interactif.
                    </p>
                    <Button onClick={() => setActiveGame("scenarios")}>
                      Commencer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Hebdomadaire</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Testez vos connaissances sur la mutuelle et gagnez des points bonus.
                    </p>
                    <Button onClick={() => setActiveGame("quiz")}>
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="training">
            <div className="grid grid-cols-2 gap-4">
              {/* Training content will be implemented next */}
            </div>
          </TabsContent>

          <TabsContent value="library">
            <div className="grid grid-cols-3 gap-4">
              {/* Library content will be implemented next */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeleconLayout>
  );
}