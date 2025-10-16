import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Difficulty, GameStats } from "@/types/game";
import { addLeaderboardEntry } from "@/utils/leaderboard";
import { Trophy, Target, Flame, Zap, Home } from "lucide-react";
import { toast } from "sonner";

interface GameResultsProps {
  stats: GameStats;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onShowLeaderboard: () => void;
}

const GameResults = ({ stats, difficulty, onPlayAgain, onBackToMenu, onShowLeaderboard }: GameResultsProps) => {
  const [playerName, setPlayerName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

  const handleSaveScore = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    addLeaderboardEntry({
      name: playerName.trim(),
      score: stats.score,
      date: new Date().toISOString(),
      difficulty,
    });

    setNameSaved(true);
    toast.success("Score saved to leaderboard! 🎉");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-2xl animate-scale-in">
        <Card className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-bounce-in">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Game Complete!</h1>
            <p className="text-xl text-muted-foreground capitalize">{difficulty} Mode</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Trophy className="w-5 h-5" />
                <p className="text-sm font-medium">Final Score</p>
              </div>
              <p className="text-4xl font-bold">{stats.score}</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <Flame className="w-5 h-5" />
                <p className="text-sm font-medium">Best Streak</p>
              </div>
              <p className="text-4xl font-bold">{stats.bestStreak}</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-success/5">
              <div className="flex items-center justify-center gap-2 text-success mb-2">
                <Target className="w-5 h-5" />
                <p className="text-sm font-medium">Accuracy</p>
              </div>
              <p className="text-4xl font-bold">{accuracy}%</p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-center justify-center gap-2 text-secondary mb-2">
                <Zap className="w-5 h-5" />
                <p className="text-sm font-medium">Bonus Points</p>
              </div>
              <p className="text-4xl font-bold">{stats.bonusPoints}</p>
            </Card>
          </div>

          {!nameSaved ? (
            <div className="space-y-4 mb-6">
              <p className="text-center font-medium">Save your score to the leaderboard!</p>
              <div className="flex gap-2">
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  onKeyPress={(e) => e.key === "Enter" && handleSaveScore()}
                  maxLength={20}
                />
                <Button onClick={handleSaveScore}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="text-center mb-6">
              <p className="text-success font-medium mb-2">✅ Score saved!</p>
              <Button variant="outline" onClick={onShowLeaderboard} className="gap-2">
                <Trophy className="w-4 h-4" />
                View Leaderboard
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" onClick={onPlayAgain}>
              Play Again
            </Button>
            <Button size="lg" variant="outline" onClick={onBackToMenu} className="gap-2">
              <Home className="w-4 h-4" />
              Main Menu
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameResults;
