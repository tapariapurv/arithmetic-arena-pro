-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('parent', 'child', 'admin');
CREATE TYPE account_type AS ENUM ('parent', 'child');
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
CREATE TYPE challenge_status AS ENUM ('pending', 'active', 'completed', 'expired');
CREATE TYPE league_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

-- ============================================
-- PROFILES & USER MANAGEMENT
-- ============================================

-- Main profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  account_type account_type NOT NULL DEFAULT 'parent',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 0,
  hearts INTEGER NOT NULL DEFAULT 5,
  max_hearts INTEGER NOT NULL DEFAULT 5,
  streak_count INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  daily_xp_goal INTEGER NOT NULL DEFAULT 20,
  daily_xp_earned INTEGER NOT NULL DEFAULT 0,
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  total_lessons_completed INTEGER NOT NULL DEFAULT 0,
  theme_preference TEXT DEFAULT 'light',
  sound_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User roles table (separate from profiles for security)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Parent-child relationships
CREATE TABLE parent_child_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, child_id),
  CHECK (parent_id != child_id)
);

-- ============================================
-- SKILLS & PROGRESSION
-- ============================================

-- Skills/modules definition
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  operation TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  parent_skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lessons within skills
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  questions_count INTEGER NOT NULL DEFAULT 10,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  coins_reward INTEGER NOT NULL DEFAULT 5,
  min_accuracy_for_stars JSONB DEFAULT '{"1": 50, "2": 70, "3": 90}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User progress per skill
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  best_score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  mastery_score DECIMAL(5,2) DEFAULT 0.0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_id, lesson_id)
);

-- Detailed lesson attempts
CREATE TABLE lesson_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  time_spent INTEGER, -- seconds
  questions_correct INTEGER NOT NULL,
  questions_total INTEGER NOT NULL,
  stars_earned INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  coins_earned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS & REWARDS
-- ============================================

-- Achievement definitions
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  target INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  coin_reward INTEGER NOT NULL DEFAULT 25,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Chest definitions
CREATE TABLE chests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL,
  icon TEXT NOT NULL,
  rewards JSONB NOT NULL, -- array of {type, amount, name}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User chests (earned/opened)
CREATE TABLE user_chests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  chest_id UUID REFERENCES chests(id) ON DELETE CASCADE NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMPTZ
);

-- Power-ups definitions
CREATE TABLE power_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  type TEXT NOT NULL, -- streak_freeze, xp_boost, heart_refill, etc.
  duration_minutes INTEGER, -- null for instant use
  effect_multiplier DECIMAL(5,2) DEFAULT 1.0,
  coin_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User power-ups inventory
CREATE TABLE user_power_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  power_up_id UUID REFERENCES power_ups(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, power_up_id, is_active, activated_at)
);

-- ============================================
-- SOCIAL FEATURES
-- ============================================

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status friendship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  CHECK (user_id != friend_id),
  UNIQUE(user_id, friend_id)
);

-- Friend challenges
CREATE TABLE friend_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenged_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  status challenge_status DEFAULT 'pending',
  challenger_score INTEGER,
  challenged_score INTEGER,
  winner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- LEADERBOARDS & LEAGUES
-- ============================================

-- Weekly leaderboard entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Leagues
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tier league_tier NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  max_members INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, week_start)
);

-- League memberships
CREATE TABLE league_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  promoted BOOLEAN DEFAULT FALSE,
  demoted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, league_id)
);

-- ============================================
-- QUESTS & GOALS
-- ============================================

-- Weekly quest definitions
CREATE TABLE weekly_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria JSONB NOT NULL, -- {type: 'lessons_completed', target: 5}
  xp_reward INTEGER NOT NULL,
  coin_reward INTEGER NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User quest progress
CREATE TABLE user_quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES weekly_quests(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- ============================================
-- SETTINGS & PRIVACY
-- ============================================

-- User settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  show_in_leaderboard BOOLEAN DEFAULT TRUE,
  allow_friend_requests BOOLEAN DEFAULT TRUE,
  profile_visibility TEXT DEFAULT 'public', -- public, friends, private
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_parent_child_parent ON parent_child_links(parent_id);
CREATE INDEX idx_parent_child_child ON parent_child_links(child_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_skill ON user_progress(skill_id);
CREATE INDEX idx_lesson_attempts_user ON lesson_attempts(user_id);
CREATE INDEX idx_lesson_attempts_lesson ON lesson_attempts(lesson_id);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
CREATE INDEX idx_leaderboard_week ON leaderboard_entries(week_start, week_end);
CREATE INDEX idx_league_memberships_league ON league_memberships(league_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::account_type, 'parent')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chests ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_power_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Helper function for role checking
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Parent-child link policies
CREATE POLICY "Parents can view their children" ON parent_child_links FOR SELECT
  USING (auth.uid() = parent_id OR auth.uid() = child_id);
CREATE POLICY "Parents can create child links" ON parent_child_links FOR INSERT
  WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can delete child links" ON parent_child_links FOR DELETE
  USING (auth.uid() = parent_id);

-- Skills and lessons (public read)
CREATE POLICY "Everyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Everyone can view lessons" ON lessons FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Parents can view children progress" ON user_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM parent_child_links
    WHERE parent_id = auth.uid() AND child_id = user_progress.user_id
  ));
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Lesson attempts policies
CREATE POLICY "Users can view own attempts" ON lesson_attempts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON lesson_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Achievement policies
CREATE POLICY "Everyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can view own achievement progress" ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievement progress" ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own achievement progress" ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Chest policies
CREATE POLICY "Everyone can view chests" ON chests FOR SELECT USING (true);
CREATE POLICY "Users can view own chests" ON user_chests FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chests" ON user_chests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chests" ON user_chests FOR UPDATE
  USING (auth.uid() = user_id);

-- Power-up policies
CREATE POLICY "Everyone can view power-ups" ON power_ups FOR SELECT USING (true);
CREATE POLICY "Users can view own power-ups" ON user_power_ups FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own power-ups" ON user_power_ups FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own power-ups" ON user_power_ups FOR UPDATE
  USING (auth.uid() = user_id);

-- Friendship policies
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friendships" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Challenge policies
CREATE POLICY "Users can view own challenges" ON friend_challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "Users can create challenges" ON friend_challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can update challenges they're part of" ON friend_challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Leaderboard policies
CREATE POLICY "Everyone can view leaderboards" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert own leaderboard entries" ON leaderboard_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard entries" ON leaderboard_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- League policies
CREATE POLICY "Everyone can view leagues" ON leagues FOR SELECT USING (true);
CREATE POLICY "Everyone can view league memberships" ON league_memberships FOR SELECT USING (true);
CREATE POLICY "Users can insert own league membership" ON league_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own league membership" ON league_memberships FOR UPDATE
  USING (auth.uid() = user_id);

-- Quest policies
CREATE POLICY "Everyone can view quests" ON weekly_quests FOR SELECT USING (true);
CREATE POLICY "Users can view own quest progress" ON user_quest_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON user_quest_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON user_quest_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);