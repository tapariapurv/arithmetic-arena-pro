import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { Level, LevelProgress } from "@/types/progression";
import { Achievement, PowerUp } from "@/types/rewards";
import { storage } from "@/utils/storage";
import { MODULES, calculateStars, getLevelFromXP } from "@/utils/progression";
import { INITIAL_ACHIEVEMENTS, checkAchievements } from "@/utils/achievements";
import { MAX_HEARTS } from "@/utils/hearts";
import UsernameSetup from "@/components/UsernameSetup";
import Home from "@/components/Home";
import LevelMap from "@/components/LevelMap";
import QuizScreen from "@/components/QuizScreen";
import QuizResults from "@/components/QuizResults";
import Shop from "@/components/Shop";
import Profile from "@/components/Profile";
import Leaderboard from "@/components/Leaderboard";
import AchievementUnlocked from "@/components/AchievementUnlocked";
import { toast } from "sonner";

type Screen = "username" | "home" | "levels" | "quiz" | "results" | "shop" | "profile" | "leaderboard" | "achievements";

const NewIndex = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("username");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [levelProgress, setLevelProgress] = useState<Record<string, LevelProgress>>({});
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [quizResults, setQuizResults] = useState<{
    correctAnswers: number;
    totalQuestions: number;
    stars: number;
    xpEarned: number;
    coinsEarned: number;
  } | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const savedUser = storage.getUserProfile();
    const savedProgress = storage.getLevelProgress();
    const savedAchievements = storage.getAchievements();
    const savedPowerUps = storage.getPowerUps();

    if (savedUser) {
      // Check if it's a new day
      const today = new Date().toDateString();
      const lastPlayed = new Date(savedUser.lastPlayedDate).toDateString();
      
      if (today !== lastPlayed) {
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastPlayed).getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          savedUser.streak += 1;
        } else if (daysDiff > 1) {
          // Missed days - reset streak (unless has streak freeze)
          const hasStreakFreeze = savedPowerUps.some(p => p.id === "streak-freeze" && p.active);
          if (!hasStreakFreeze) {
            savedUser.streak = 0;
          }
        }
        
        savedUser.lastPlayedDate = new Date().toISOString();
        savedUser.dailyXpEarned = 0;
        storage.saveUserProfile(savedUser);
      }

      setUser(savedUser);
      setCurrentScreen("home");
    }

    if (savedProgress) setLevelProgress(savedProgress);
    if (savedAchievements.length > 0) setAchievements(savedAchievements);
    if (savedPowerUps.length > 0) setPowerUps(savedPowerUps);
  }, []);

  const handleUsernameComplete = (username: string) => {
    const newUser: UserProfile = {
      username,
      xp: 0,
      level: 1,
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      coins: 100, // Starting coins
      streak: 1,
      lastPlayedDate: new Date().toISOString(),
      dailyXpGoal: 50,
      dailyXpEarned: 0,
      totalXpEarned: 0,
      totalLevelsCompleted: 0,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    storage.saveUserProfile(newUser);
    storage.saveAchievements(INITIAL_ACHIEVEMENTS);
    setCurrentScreen("home");
    toast.success(`Welcome, ${username}! 🎉`);
  };

  const handleStartLevel = (level: Level) => {
    if (!user) return;
    
    if (user.hearts <= 0) {
      toast.error("No hearts left! Buy more from the shop or wait for refill.");
      setCurrentScreen("shop");
      return;
    }

    setCurrentLevel(level);
    setCurrentScreen("quiz");
  };

  const handleHeartLost = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      hearts: Math.max(0, user.hearts - 1),
    };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);

    if (updatedUser.hearts === 0) {
      toast.error("Out of hearts! Visit the shop to refill.");
    }
  };

  const handleQuizComplete = (correctAnswers: number, totalQuestions: number) => {
    if (!user || !currentLevel) return;

    const stars = calculateStars(correctAnswers, totalQuestions);
    const xpEarned = currentLevel.xpReward;
    const coinsEarned = currentLevel.coinsReward;

    // Update user
    const updatedUser = {
      ...user,
      xp: user.xp + xpEarned,
      level: getLevelFromXP(user.xp + xpEarned),
      coins: user.coins + coinsEarned,
      dailyXpEarned: user.dailyXpEarned + xpEarned,
      totalXpEarned: user.totalXpEarned + xpEarned,
      totalLevelsCompleted: user.totalLevelsCompleted + 1,
    };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);

    // Update level progress
    const updatedProgress = {
      ...levelProgress,
      [currentLevel.id]: {
        levelId: currentLevel.id,
        completed: true,
        stars,
        bestScore: correctAnswers,
        attempts: (levelProgress[currentLevel.id]?.attempts || 0) + 1,
      },
    };
    setLevelProgress(updatedProgress);
    storage.saveLevelProgress(updatedProgress);

    // Check achievements
    const updatedAchievements = checkAchievements(achievements, {
      levelsCompleted: updatedUser.totalLevelsCompleted,
      streak: updatedUser.streak,
      totalXP: updatedUser.totalXpEarned,
      stars,
    });

    const newlyUnlocked = updatedAchievements.find(
      (a, index) => a.unlocked && !achievements[index].unlocked
    );

    if (newlyUnlocked) {
      setNewAchievement(newlyUnlocked);
      updatedUser.xp += newlyUnlocked.xpReward;
      updatedUser.totalXpEarned += newlyUnlocked.xpReward;
      setUser(updatedUser);
      storage.saveUserProfile(updatedUser);
    }

    setAchievements(updatedAchievements);
    storage.saveAchievements(updatedAchievements);

    setQuizResults({
      correctAnswers,
      totalQuestions,
      stars,
      xpEarned,
      coinsEarned,
    });
    setCurrentScreen("results");
  };

  const handlePurchase = (itemId: string, price: number) => {
    if (!user) return;

    const updatedUser = { ...user, coins: user.coins - price };

    switch (itemId) {
      case "refill-hearts":
        updatedUser.hearts = MAX_HEARTS;
        break;
      case "streak-freeze":
        setPowerUps([...powerUps, {
          id: "streak-freeze",
          name: "Streak Freeze",
          description: "Active",
          icon: "Snowflake",
          active: true,
        }]);
        break;
      // Add other power-ups as needed
    }

    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);
  };

  const getAllLeaderboardEntries = () => {
    // In a real app, this would fetch from a backend
    // For now, just return current user
    return user ? [{
      username: user.username,
      xp: user.totalXpEarned,
      level: user.level,
      streak: user.streak,
    }] : [];
  };

  if (!user) {
    return <UsernameSetup onComplete={handleUsernameComplete} />;
  }

  return (
    <>
      {currentScreen === "home" && (
        <Home user={user} onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
      )}

      {currentScreen === "levels" && (
        <LevelMap
          levelProgress={levelProgress}
          onBack={() => setCurrentScreen("home")}
          onStartLevel={handleStartLevel}
        />
      )}

      {currentScreen === "quiz" && currentLevel && (
        <QuizScreen
          level={currentLevel}
          hearts={user.hearts}
          onBack={() => setCurrentScreen("levels")}
          onHeartLost={handleHeartLost}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {currentScreen === "results" && currentLevel && quizResults && (
        <QuizResults
          level={currentLevel}
          {...quizResults}
          onContinue={() => setCurrentScreen("levels")}
          onHome={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "shop" && (
        <Shop
          coins={user.coins}
          onBack={() => setCurrentScreen("home")}
          onPurchase={handlePurchase}
        />
      )}

      {currentScreen === "profile" && (
        <Profile
          user={user}
          achievements={achievements}
          onBack={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "achievements" && (
        <Profile
          user={user}
          achievements={achievements}
          onBack={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "leaderboard" && (
        <Leaderboard
          onBack={() => setCurrentScreen("home")}
        />
      )}

      {newAchievement && (
        <AchievementUnlocked
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </>
  );
};

export default NewIndex;
