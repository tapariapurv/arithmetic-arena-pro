import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/types/game";
import { Trophy, Zap, Flame } from "lucide-react";

interface LevelSelectionProps {
  onSelectLevel: (level: Difficulty) => void;
  onShowLeaderboard: () => void;
}

const LevelSelection = ({ onSelectLevel, onShowLeaderboard }: LevelSelectionProps) => {
  const levels = [
    {
      difficulty: "easy" as Difficulty,
      title: "Easy",
      description: "Numbers 1-10",
      icon: Zap,
      gradient: "from-success to-success-glow",
      iconColor: "text-success",
    },
    {
      difficulty: "medium" as Difficulty,
      title: "Medium",
      description: "Numbers 1-50",
      icon: Flame,
      gradient: "from-accent to-orange-400",
      iconColor: "text-accent",
    },
    {
      difficulty: "hard" as Difficulty,
      title: "Hard",
      description: "Numbers 1-100",
      icon: Trophy,
      gradient: "from-primary to-secondary",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Math Master
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your challenge level and start practicing!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {levels.map((level) => {
            const Icon = level.icon;
            return (
              <Card
                key={level.difficulty}
                className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50"
                onClick={() => onSelectLevel(level.difficulty)}
              >
                <div className="text-center space-y-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{level.title}</h2>
                    <p className="text-muted-foreground">{level.description}</p>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel(level.difficulty);
                    }}
                  >
                    Start Practice
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onShowLeaderboard}
            className="gap-2"
          >
            <Trophy className="w-5 h-5" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
