import { Card } from "@/components/ui/card";
import { Achievement } from "@/types/rewards";
import * as Icons from "lucide-react";

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementUnlocked = ({ achievement, onClose }: AchievementUnlockedProps) => {
  const Icon = Icons[achievement.icon as keyof typeof Icons] as React.ElementType;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <Card className="p-8 max-w-md w-full text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Achievement Unlocked! 🎉</h2>
        <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
        <p className="text-muted-foreground mb-4">{achievement.description}</p>
        <p className="text-lg font-semibold text-purple-500">+{achievement.xpReward} XP</p>
      </Card>
    </div>
  );
};

export default AchievementUnlocked;
