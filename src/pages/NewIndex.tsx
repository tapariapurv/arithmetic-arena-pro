import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { useLessons, Lesson } from "@/hooks/useLessons";
import { supabase } from "@/integrations/supabase/client";
import { calculateStars, getLevelFromXP } from "@/utils/progression";
import Home from "@/components/Home";
import LevelMap from "@/components/LevelMap";
import QuizScreen from "@/components/QuizScreen";
import QuizResults from "@/components/QuizResults";
import Shop from "@/components/Shop";
import Profile from "@/components/Profile";
import Leaderboard from "@/components/Leaderboard";
import { toast } from "sonner";
import { Achievement } from "@/types/rewards";

type Screen = "home" | "levels" | "quiz" | "results" | "shop" | "profile" | "leaderboard";

const NewIndex = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userLoading, updateUserData } = useUserData();
  const { skills, loading: lessonsLoading } = useLessons();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quizResults, setQuizResults] = useState<{
    correctAnswers: number;
    totalQuestions: number;
    stars: number;
    xpEarned: number;
    coinsEarned: number;
  } | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  const handleStartLesson = (lesson: Lesson) => {
    if (!userData) return;
    
    if (userData.hearts <= 0) {
      toast.error("No hearts left! Buy more from the shop or wait for refill.");
      setCurrentScreen("shop");
      return;
    }

    if (!lesson.isUnlocked) {
      toast.error("Complete previous lessons to unlock this one!");
      return;
    }

    setCurrentLesson(lesson);
    setCurrentScreen("quiz");
  };

  const handleHeartLost = async () => {
    if (!userData) return;
    
    const newHearts = Math.max(0, userData.hearts - 1);
    await updateUserData({ hearts: newHearts });

    if (newHearts === 0) {
      toast.error("Out of hearts! Visit the shop to refill.");
    }
  };

  const handleQuizComplete = async (correctAnswers: number, totalQuestions: number) => {
    if (!userData || !currentLesson || !user) return;

    try {
      const stars = calculateStars(correctAnswers, totalQuestions);
      const accuracy = (correctAnswers / totalQuestions) * 100;
      const xpEarned = currentLesson.xpReward;
      const coinsEarned = currentLesson.coinsReward;

      // Save lesson attempt
      await supabase.from('lesson_attempts').insert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        score: correctAnswers,
        questions_correct: correctAnswers,
        questions_total: totalQuestions,
        accuracy,
        stars_earned: stars,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
      });

      // Update or create user progress
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', currentLesson.id)
        .single();

      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({
            is_completed: true,
            stars: Math.max(existingProgress.stars, stars),
            best_score: Math.max(existingProgress.best_score, correctAnswers),
            attempts: existingProgress.attempts + 1,
            last_practiced_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          skill_id: currentLesson.skillId,
          lesson_id: currentLesson.id,
          is_unlocked: true,
          is_completed: true,
          stars,
          best_score: correctAnswers,
          attempts: 1,
          last_practiced_at: new Date().toISOString(),
        });
      }

      // Update user profile
      const newXp = userData.xp + xpEarned;
      const newLevel = getLevelFromXP(newXp);
      await updateUserData({
        xp: newXp,
        level: newLevel,
        coins: userData.coins + coinsEarned,
        dailyXpEarned: userData.dailyXpEarned + xpEarned,
        totalXpEarned: userData.totalXpEarned + xpEarned,
        totalLessonsCompleted: userData.totalLessonsCompleted + 1,
      });

      setQuizResults({
        correctAnswers,
        totalQuestions,
        stars,
        xpEarned,
        coinsEarned,
      });
      setCurrentScreen("results");
      
      toast.success(`Great job! +${xpEarned} XP, +${coinsEarned} coins`);
    } catch (error: any) {
      console.error('Error completing quiz:', error);
      toast.error('Failed to save progress');
    }
  };

  const handlePurchase = async (itemId: string, price: number) => {
    if (!userData || !user) return;

    try {
      // Get power-up details
      const { data: powerUp } = await supabase
        .from('power_ups')
        .select('*')
        .eq('id', itemId)
        .single();

      if (!powerUp) {
        toast.error('Invalid item');
        return;
      }

      // Deduct coins
      const newCoins = userData.coins - price;
      if (newCoins < 0) {
        toast.error('Not enough coins!');
        return;
      }

      // Handle specific power-ups
      if (powerUp.type === 'heart-refill') {
        await updateUserData({
          coins: newCoins,
          hearts: userData.maxHearts,
        });
        toast.success('Hearts refilled!');
      } else {
        // Add power-up to inventory
        await supabase.from('user_power_ups').insert({
          user_id: user.id,
          power_up_id: itemId,
          quantity: 1,
          is_active: powerUp.type === 'streak-freeze',
        });

        await updateUserData({ coins: newCoins });
        toast.success(`Purchased ${powerUp.name}!`);
      }
    } catch (error: any) {
      console.error('Error purchasing item:', error);
      toast.error('Failed to complete purchase');
    }
  };

  // Show loading state
  if (authLoading || userLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  // Convert userData to UserProfile format for existing components
  const userProfile = {
    username: userData.username,
    xp: userData.xp,
    level: userData.level,
    hearts: userData.hearts,
    maxHearts: userData.maxHearts,
    coins: userData.coins,
    streak: userData.streakCount,
    lastPlayedDate: userData.lastActiveDate || new Date().toISOString(),
    dailyXpGoal: userData.dailyXpGoal,
    dailyXpEarned: userData.dailyXpEarned,
    totalXpEarned: userData.totalXpEarned,
    totalLevelsCompleted: userData.totalLessonsCompleted,
    createdAt: new Date().toISOString(),
  };

  // Convert Lesson to Level format for existing components
  const convertLessonToLevel = (lesson: Lesson) => {
    const skill = skills.find((s) => s.id === lesson.skillId);
    const operation = (skill?.operation || '+') as '+' | '-' | '×' | '÷';
    
    return {
      id: lesson.id,
      moduleId: lesson.skillId,
      title: lesson.name,
      description: lesson.description || '',
      operation,
      difficulty: lesson.difficulty as 'easy' | 'medium' | 'hard',
      questionsCount: lesson.questionsCount,
      xpReward: lesson.xpReward,
      coinsReward: lesson.coinsReward,
      unlocked: lesson.isUnlocked,
      completed: lesson.isCompleted,
      stars: lesson.stars,
    };
  };

  // Convert to the format LevelMap expects
  const levelProgress: Record<string, any> = {};
  skills.forEach((skill) => {
    skill.lessons.forEach((lesson) => {
      levelProgress[lesson.id] = {
        levelId: lesson.id,
        completed: lesson.isCompleted,
        stars: lesson.stars,
        bestScore: lesson.bestScore,
        attempts: lesson.attempts,
      };
    });
  });

  return (
    <>
      {currentScreen === "home" && (
        <Home user={userProfile} onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
      )}

      {currentScreen === "levels" && (
        <LevelMap
          levelProgress={levelProgress}
          onBack={() => setCurrentScreen("home")}
          onStartLevel={(level) => {
            const lesson = skills
              .flatMap((s) => s.lessons)
              .find((l) => l.id === level.id);
            if (lesson) handleStartLesson(lesson);
          }}
        />
      )}

      {currentScreen === "quiz" && currentLesson && (
        <QuizScreen
          level={convertLessonToLevel(currentLesson)}
          hearts={userData.hearts}
          onBack={() => setCurrentScreen("levels")}
          onHeartLost={handleHeartLost}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {currentScreen === "results" && currentLesson && quizResults && (
        <QuizResults
          level={convertLessonToLevel(currentLesson)}
          {...quizResults}
          onContinue={() => setCurrentScreen("levels")}
          onHome={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "shop" && (
        <Shop
          coins={userData.coins}
          onBack={() => setCurrentScreen("home")}
          onPurchase={handlePurchase}
        />
      )}

      {currentScreen === "profile" && (
        <Profile
          user={userProfile}
          achievements={[]}
          onBack={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "leaderboard" && (
        <Leaderboard onBack={() => setCurrentScreen("home")} />
      )}
    </>
  );
};

export default NewIndex;
