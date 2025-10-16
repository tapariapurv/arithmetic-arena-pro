import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft } from "lucide-react";
import { Level } from "@/types/progression";
import { Question } from "@/types/game";
import { generateQuestion, checkAnswer } from "@/utils/gameLogic";
import { cn } from "@/lib/utils";

interface QuizScreenProps {
  level: Level;
  hearts: number;
  onBack: () => void;
  onHeartLost: () => void;
  onQuizComplete: (correctAnswers: number, totalQuestions: number) => void;
}

const QuizScreen = ({ level, hearts, onBack, onHeartLost, onQuizComplete }: QuizScreenProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(generateQuestion(level.difficulty));
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isMultipleChoice] = useState(Math.random() > 0.5);
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const newQuestion = generateQuestion(level.difficulty);
    setQuestion(newQuestion);
    
    if (isMultipleChoice) {
      const correctAnswer = newQuestion.answer;
      const wrongAnswers = [
        correctAnswer + Math.floor(Math.random() * 10) - 5,
        correctAnswer + Math.floor(Math.random() * 10) - 5,
        correctAnswer + Math.floor(Math.random() * 10) - 5,
      ].filter(a => a !== correctAnswer && a > 0);
      
      const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
        .sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  };

  const handleSubmit = () => {
    const answer = isMultipleChoice ? selectedOption : parseInt(userAnswer);
    if (answer === null || isNaN(answer)) return;

    const isCorrect = checkAnswer(answer, question.answer);
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      onHeartLost();
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= level.questionsCount) {
        onQuizComplete(correctAnswers + (isCorrect ? 1 : 0), level.questionsCount);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer("");
        setSelectedOption(null);
        setFeedback(null);
        generateNewQuestion();
      }
    }, 1500);
  };

  const progress = ((currentQuestionIndex + 1) / level.questionsCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "w-6 h-6",
                  i < hearts ? "text-red-500 fill-red-500" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{level.title}</span>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1}/{level.questionsCount}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Question */}
        <Card
          className={cn(
            "p-12 mb-6 text-center transition-all duration-300",
            feedback === "correct" && "bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500",
            feedback === "incorrect" && "bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500"
          )}
        >
          <div className="text-6xl font-bold mb-8">
            {question.num1} {question.operation} {question.num2} = ?
          </div>

          {isMultipleChoice ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {options.map((option, index) => (
                <Button
                  key={index}
                  size="lg"
                  variant={selectedOption === option ? "default" : "outline"}
                  className="h-20 text-3xl"
                  onClick={() => setSelectedOption(option)}
                  disabled={feedback !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your answer"
              className="text-3xl h-16 text-center max-w-md mx-auto"
              disabled={feedback !== null}
              autoFocus
            />
          )}

          {feedback && (
            <div className={cn(
              "mt-6 text-xl font-semibold",
              feedback === "correct" ? "text-green-600" : "text-red-600"
            )}>
              {feedback === "correct" ? "✅ Correct!" : `❌ Wrong! Answer: ${question.answer}`}
            </div>
          )}
        </Card>

        {/* Submit Button */}
        {!feedback && (
          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleSubmit}
            disabled={isMultipleChoice ? selectedOption === null : !userAnswer.trim()}
          >
            Check Answer
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
