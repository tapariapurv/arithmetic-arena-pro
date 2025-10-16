import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Flame, Trophy, Coins, Target } from "lucide-react";
import { UserProfile } from "@/types/user";
import { getXPProgress } from "@/utils/progression";

interface HomeProps {
  user: UserProfile;
  onNavigate: (screen: string) => void;
}

const Home = ({ user, onNavigate }: HomeProps) => {
  const xpProgress = getXPProgress(user.xp);
  const dailyGoalProgress = (user.dailyXpEarned / user.dailyXpGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Math Master
            </h1>
            <p className="text-muted-foreground">Welcome back, {user.username}!</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate("profile")}>
            Profile
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate("shop")}>
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-semibold">{user.hearts}/{user.maxHearts}</span>
            </div>
            <p className="text-xs text-muted-foreground">Hearts</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Flame className="w-5 h-5" />
              <span className="font-semibold">{user.streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate("shop")}>
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Coins className="w-5 h-5" />
              <span className="font-semibold">{user.coins}</span>
            </div>
            <p className="text-xs text-muted-foreground">Coins</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 cursor-pointer hover:scale-105 transition-transform" onClick={() => onNavigate("leaderboard")}>
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Lv {user.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">Level</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">{user.dailyXpEarned}/{user.dailyXpGoal}</span>
            </div>
            <p className="text-xs text-muted-foreground">Daily Goal</p>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {user.level}</span>
            <span className="text-sm text-muted-foreground">{xpProgress.current}/{xpProgress.needed} XP</span>
          </div>
          <Progress value={xpProgress.percentage} className="h-3 bg-muted" />
        </Card>

        {/* Daily Goal */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Daily Goal
          </h3>
          <Progress value={dailyGoalProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {user.dailyXpEarned >= user.dailyXpGoal 
              ? "🎉 Daily goal completed!" 
              : `${user.dailyXpGoal - user.dailyXpEarned} XP to go!`}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            size="lg" 
            className="h-20 text-xl"
            onClick={() => onNavigate("levels")}
          >
            Start Learning
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 text-xl gap-2"
            onClick={() => onNavigate("shop")}
          >
            <Coins className="w-6 h-6" />
            Shop
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 text-xl gap-2"
            onClick={() => onNavigate("leaderboard")}
          >
            <Trophy className="w-6 h-6" />
            Leaderboard
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 text-xl gap-2"
            onClick={() => onNavigate("achievements")}
          >
            <Trophy className="w-6 h-6" />
            Achievements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
