import { useState } from "react";
import { Difficulty, GameStats } from "@/types/game";
import LevelSelection from "@/components/LevelSelection";
import GamePlay from "@/components/GamePlay";
import GameResults from "@/components/GameResults";
import Leaderboard from "@/components/Leaderboard";

type Screen = "menu" | "game" | "results" | "leaderboard";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  const handleSelectLevel = (level: Difficulty) => {
    setSelectedDifficulty(level);
    setCurrentScreen("game");
  };

  const handleGameEnd = (stats: GameStats) => {
    setGameStats(stats);
    setCurrentScreen("results");
  };

  const handlePlayAgain = () => {
    setCurrentScreen("game");
  };

  const handleBackToMenu = () => {
    setCurrentScreen("menu");
    setGameStats(null);
  };

  const handleShowLeaderboard = () => {
    setCurrentScreen("leaderboard");
  };

  return (
    <>
      {currentScreen === "menu" && (
        <LevelSelection
          onSelectLevel={handleSelectLevel}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}

      {currentScreen === "game" && (
        <GamePlay
          difficulty={selectedDifficulty}
          onBack={handleBackToMenu}
          onGameEnd={handleGameEnd}
        />
      )}

      {currentScreen === "results" && gameStats && (
        <GameResults
          stats={gameStats}
          difficulty={selectedDifficulty}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}

      {currentScreen === "leaderboard" && (
        <Leaderboard onBack={handleBackToMenu} />
      )}
    </>
  );
};

export default Index;
