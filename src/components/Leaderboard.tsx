import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLeaderboard, clearLeaderboard } from "@/utils/leaderboard";
import { Trophy, Medal, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const entries = getLeaderboard();

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the leaderboard?")) {
      clearLeaderboard();
      toast.success("Leaderboard cleared!");
      onBack();
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-accent" />;
      case 1:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "hard":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {entries.length > 0 && (
            <Button variant="destructive" onClick={handleClear} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">Top 10 High Scores</p>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground mb-4">No scores yet!</p>
            <p className="text-muted-foreground">Complete a game to add your score to the leaderboard.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <Card
                key={`${entry.name}-${entry.date}-${index}`}
                className={`p-4 transition-all duration-300 hover:scale-[1.02] ${
                  index === 0 ? "border-accent shadow-lg" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getMedalIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>

                  <Badge className={`${getDifficultyColor(entry.difficulty)} capitalize`}>
                    {entry.difficulty}
                  </Badge>

                  <div className="text-right">
                    <p className="text-2xl font-bold">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
