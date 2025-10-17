import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState<'parent' | 'child'>('parent');

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(signInEmail, signInPassword);
    setLoading(false);
    if (!error) {
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.length < 3) {
      return;
    }
    setLoading(true);
    await signUp(signUpEmail, signUpPassword, username, accountType);
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-md p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Math Master
          </h1>
          <p className="text-muted-foreground">Start your math learning journey!</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="signin-password" className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="username" className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={20}
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-password" className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <Label className="mb-2 block">Account Type</Label>
                <RadioGroup value={accountType} onValueChange={(value) => setAccountType(value as 'parent' | 'child')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parent" id="parent" />
                    <Label htmlFor="parent">Parent Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="child" id="child" />
                    <Label htmlFor="child">Child Account</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;