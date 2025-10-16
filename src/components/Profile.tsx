import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Star, Flame, Target, Award } from "lucide-react";
import { UserProfile } from "@/types/user";
import { Achievement } from "@/types/rewards";
import { getXPProgress } from "@/utils/progression";
import * as Icons from "lucide-react";

interface ProfileProps {
  user: UserProfile;
  achievements: Achievement[];
  onBack: () => void;
}

const Profile = ({ user, achievements, onBack }: ProfileProps) => {
  const xpProgress = getXPProgress(user.xp);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="p-8 mb-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <Trophy className="w-5 h-5" />
            <span>Level {user.level}</span>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>XP Progress</span>
              <span>{xpProgress.current}/{xpProgress.needed}</span>
            </div>
            <Progress value={xpProgress.percentage} className="h-3" />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{user.streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{user.totalXpEarned}</p>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{user.totalLevelsCompleted}</p>
            <p className="text-sm text-muted-foreground">Levels Done</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = Icons[achievement.icon as keyof typeof Icons] as React.ElementType;
              
              return (
                <Card
                  key={achievement.id}
                  className={`p-4 ${achievement.unlocked ? 'bg-gradient-to-br from-primary/10 to-primary/5' : 'opacity-60'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-primary to-secondary' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-2"
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.unlocked ? '✅ Unlocked' : `${achievement.progress}/${achievement.target}`}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
