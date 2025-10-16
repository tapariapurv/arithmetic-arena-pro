import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Home, ArrowRight } from "lucide-react";
import { Level } from "@/types/progression";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  level: Level;
  correctAnswers: number;
  totalQuestions: number;
  stars: number;
  xpEarned: number;
  coinsEarned: number;
  onContinue: () => void;
  onHome: () => void;
}

const QuizResults = ({
  level,
  correctAnswers,
  totalQuestions,
  stars,
  xpEarned,
  coinsEarned,
  onContinue,
  onHome,
}: QuizResultsProps) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="p-8 md:p-12 max-w-2xl w-full animate-scale-in">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-bounce-in">
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-2">Level Complete!</h1>
          <p className="text-xl text-muted-foreground mb-6">{level.title}</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={cn(
                  "w-12 h-12 transition-all",
                  s <= stars 
                    ? "text-yellow-500 fill-yellow-500 animate-bounce-in" 
                    : "text-gray-300"
                )}
                style={{ animationDelay: `${s * 0.2}s` }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <p className="text-3xl font-bold">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <p className="text-3xl font-bold text-purple-500">+{xpEarned}</p>
              <p className="text-sm text-muted-foreground">XP</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
              <p className="text-3xl font-bold text-yellow-600">+{coinsEarned}</p>
              <p className="text-sm text-muted-foreground">Coins</p>
            </Card>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" onClick={onContinue} className="gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onHome} className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizResults;
