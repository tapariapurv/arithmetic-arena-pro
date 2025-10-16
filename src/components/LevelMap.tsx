import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock, Star, Trophy } from "lucide-react";
import { Module, Level, LevelProgress } from "@/types/progression";
import { MODULES } from "@/utils/progression";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface LevelMapProps {
  levelProgress: Record<string, LevelProgress>;
  onBack: () => void;
  onStartLevel: (level: Level) => void;
}

const LevelMap = ({ levelProgress, onBack, onStartLevel }: LevelMapProps) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const isLevelUnlocked = (level: Level, index: number): boolean => {
    if (index === 0) return true;
    const previousLevel = selectedModule?.levels[index - 1];
    if (!previousLevel) return false;
    const prevProgress = levelProgress[previousLevel.id];
    return prevProgress?.completed || false;
  };

  const getCompletedLevelsInModule = (module: Module): number => {
    return module.levels.filter(level => levelProgress[level.id]?.completed).length;
  };

  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={onBack} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Path
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((module) => {
              const Icon = Icons[module.icon as keyof typeof Icons] as React.ElementType;
              const completed = getCompletedLevelsInModule(module);
              const total = module.levels.length;
              const progress = (completed / total) * 100;

              return (
                <Card
                  key={module.id}
                  className="p-6 cursor-pointer hover:scale-105 transition-all hover:shadow-xl"
                  onClick={() => setSelectedModule(module)}
                >
                  <div className={cn("w-16 h-16 rounded-full bg-gradient-to-br mb-4 flex items-center justify-center", module.color)}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{completed}/{total} completed</span>
                      <span className="text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const ModuleIcon = Icons[selectedModule.icon as keyof typeof Icons] as React.ElementType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => setSelectedModule(null)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Button>

        <div className="text-center mb-8">
          <div className={cn("w-20 h-20 rounded-full bg-gradient-to-br mx-auto mb-4 flex items-center justify-center", selectedModule.color)}>
            <ModuleIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{selectedModule.title}</h1>
        </div>

        <div className="space-y-4">
          {selectedModule.levels.map((level, index) => {
            const unlocked = isLevelUnlocked(level, index);
            const progress = levelProgress[level.id];
            const stars = progress?.stars || 0;

            return (
              <Card
                key={level.id}
                className={cn(
                  "p-6 transition-all",
                  unlocked ? "cursor-pointer hover:scale-102 hover:shadow-lg" : "opacity-60"
                )}
                onClick={() => unlocked && onStartLevel(level)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      unlocked ? "bg-gradient-to-br from-primary to-secondary" : "bg-muted"
                    )}>
                      {unlocked ? (
                        progress?.completed ? (
                          <Trophy className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{level.title}</h3>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {progress?.completed && (
                      <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-5 h-5",
                              s <= stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      +{level.xpReward} XP · +{level.coinsReward} coins
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelMap;
