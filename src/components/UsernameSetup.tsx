import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

interface UsernameSetupProps {
  onComplete: (username: string) => void;
}

const UsernameSetup = ({ onComplete }: UsernameSetupProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (!username.trim()) {
      toast.error("Please enter a username!");
      return;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters!");
      return;
    }
    onComplete(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="p-8 md:p-12 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Math Master
          </h1>
          <p className="text-muted-foreground">
            Start your math learning journey!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Choose your username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              maxLength={20}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <Button size="lg" className="w-full" onClick={handleSubmit}>
            Start Learning!
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🎯 Complete levels to earn XP</p>
          <p>🔥 Build your daily streak</p>
          <p>🏆 Unlock achievements</p>
        </div>
      </Card>
    </div>
  );
};

export default UsernameSetup;
