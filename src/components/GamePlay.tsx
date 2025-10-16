import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Difficulty, GameStats, Question } from "@/types/game";
import { generateQuestion, checkAnswer } from "@/utils/gameLogic";
import { Trophy, Flame, Timer, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface GamePlayProps {
  difficulty: Difficulty;
  onBack: () => void;
  onGameEnd: (stats: GameStats) => void;
}

const TIMER_DURATION = 30;
const TOTAL_QUESTIONS = 10;

const GamePlay = ({ difficulty, onBack, onGameEnd }: GamePlayProps) => {
  const [question, setQuestion] = useState<Question>(generateQuestion(difficulty));
  const [userAnswer, setUserAnswer] = useState("");
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    bonusPoints: 0,
  });
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !isAnswerLocked) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswerLocked]);

  const handleTimeUp = () => {
    setIsAnswerLocked(true);
    setFeedback("incorrect");
    toast.error("Time's up! Try to be faster next time.");
    
    const newStats = {
      ...stats,
      totalQuestions: stats.totalQuestions + 1,
      streak: 0,
    };
    setStats(newStats);
    
    setTimeout(() => {
      if (newStats.totalQuestions >= TOTAL_QUESTIONS) {
        onGameEnd(newStats);
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim() || isAnswerLocked) return;

    const isCorrect = checkAnswer(parseInt(userAnswer), question.answer);
    setIsAnswerLocked(true);
    setFeedback(isCorrect ? "correct" : "incorrect");

    const bonusEarned = timeLeft >= 20 ? 1 : 0;
    const newStreak = isCorrect ? stats.streak + 1 : 0;
    const newScore = isCorrect ? stats.score + 1 + bonusEarned : stats.score;

    const newStats: GameStats = {
      score: newScore,
      streak: newStreak,
      bestStreak: Math.max(stats.bestStreak, newStreak),
      totalQuestions: stats.totalQuestions + 1,
      correctAnswers: isCorrect ? stats.correctAnswers + 1 : stats.correctAnswers,
      bonusPoints: bonusEarned > 0 ? stats.bonusPoints + 1 : stats.bonusPoints,
    };

    setStats(newStats);

    if (isCorrect) {
      toast.success(
        bonusEarned > 0 ? "Correct! +1 Bonus for speed! 🎉" : "Correct! Well done! ✅"
      );
    } else {
      toast.error(`Incorrect! The answer was ${question.answer}`);
    }

    setTimeout(() => {
      if (newStats.totalQuestions >= TOTAL_QUESTIONS) {
        onGameEnd(newStats);
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion(difficulty));
    setUserAnswer("");
    setTimeLeft(TIMER_DURATION);
    setFeedback(null);
    setIsAnswerLocked(false);
  };

  const handleRestart = () => {
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      bonusPoints: 0,
    });
    nextQuestion();
  };

  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft <= 5 ? "bg-destructive" : timeLeft <= 10 ? "bg-accent" : "bg-success";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-center gap-2 text-primary mb-1">
              <Trophy className="w-5 h-5" />
              <p className="text-sm font-medium">Score</p>
            </div>
            <p className="text-3xl font-bold">{stats.score}</p>
          </Card>
          
          <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-center gap-2 text-accent mb-1">
              <Flame className="w-5 h-5" />
              <p className="text-sm font-medium">Streak</p>
            </div>
            <p className="text-3xl font-bold">{stats.streak}</p>
          </Card>

          <Card className="p-4 text-center bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center justify-center gap-2 text-secondary mb-1">
              <Timer className="w-5 h-5" />
              <p className="text-sm font-medium">Progress</p>
            </div>
            <p className="text-3xl font-bold">{stats.totalQuestions}/{TOTAL_QUESTIONS}</p>
          </Card>
        </div>

        {/* Timer */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Time Remaining</span>
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse-glow" : ""}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress value={timerPercentage} className={`h-2 ${timerColor}`} />
          {timeLeft >= 20 && !isAnswerLocked && (
            <p className="text-xs text-success mt-2 text-center">⚡ Answer now for bonus point!</p>
          )}
        </Card>

        {/* Question Card */}
        <Card
          className={`p-12 mb-6 text-center transition-all duration-300 ${
            feedback === "correct"
              ? "bg-gradient-to-br from-success/20 to-success/5 border-success animate-bounce-in"
              : feedback === "incorrect"
              ? "bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive animate-shake"
              : ""
          }`}
        >
          <div className="text-7xl font-bold mb-8 tracking-wider">
            {question.num1} {question.operation} {question.num2}
          </div>

          <div className="flex items-center gap-4 max-w-md mx-auto">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your answer"
              className="text-3xl h-16 text-center"
              disabled={isAnswerLocked}
              autoFocus
            />
          </div>

          {feedback && (
            <div className={`mt-6 text-xl font-semibold ${
              feedback === "correct" ? "text-success" : "text-destructive"
            }`}>
              {feedback === "correct" ? "✅ Correct!" : `❌ Wrong! Answer: ${question.answer}`}
            </div>
          )}
        </Card>

        {/* Action Button */}
        {!isAnswerLocked ? (
          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={() => {
              if (stats.totalQuestions >= TOTAL_QUESTIONS) {
                onGameEnd(stats);
              } else {
                nextQuestion();
              }
            }}
          >
            {stats.totalQuestions >= TOTAL_QUESTIONS ? "View Results" : "Next Question →"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GamePlay;
