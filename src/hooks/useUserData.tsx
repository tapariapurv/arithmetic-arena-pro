import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserData {
  id: string;
  username: string;
  displayName: string | null;
  xp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  coins: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string | null;
  dailyXpGoal: number;
  dailyXpEarned: number;
  totalXpEarned: number;
  totalLessonsCompleted: number;
  accountType: 'parent' | 'child';
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        // Check if it's a new day and update streak
        const today = new Date().toDateString();
        const lastActive = profile.last_active_date ? new Date(profile.last_active_date).toDateString() : null;

        if (lastActive && today !== lastActive) {
          const daysDiff = Math.floor(
            (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
          );

          let newStreak = profile.streak_count;
          
          if (daysDiff === 1) {
            // Consecutive day
            newStreak += 1;
          } else if (daysDiff > 1) {
            // Check for streak freeze power-up
            const { data: powerUps } = await supabase
              .from('user_power_ups')
              .select('*, power_ups(*)')
              .eq('user_id', user.id)
              .eq('is_active', true);

            const hasStreakFreeze = powerUps?.some(
              (p) => p.power_ups?.type === 'streak-freeze'
            );

            if (!hasStreakFreeze) {
              newStreak = 0;
            }
          }

          // Update profile with new streak and reset daily XP
          await supabase
            .from('profiles')
            .update({
              streak_count: newStreak,
              longest_streak: Math.max(profile.longest_streak, newStreak),
              last_active_date: new Date().toISOString().split('T')[0],
              daily_xp_earned: 0,
            })
            .eq('id', user.id);

          profile.streak_count = newStreak;
          profile.longest_streak = Math.max(profile.longest_streak, newStreak);
          profile.daily_xp_earned = 0;
        }

        setUserData({
          id: profile.id,
          username: profile.username,
          displayName: profile.display_name,
          xp: profile.xp,
          level: profile.level,
          hearts: profile.hearts,
          maxHearts: profile.max_hearts,
          coins: profile.coins,
          streakCount: profile.streak_count,
          longestStreak: profile.longest_streak,
          lastActiveDate: profile.last_active_date,
          dailyXpGoal: profile.daily_xp_goal,
          dailyXpEarned: profile.daily_xp_earned,
          totalXpEarned: profile.total_xp_earned,
          totalLessonsCompleted: profile.total_lessons_completed,
          accountType: profile.account_type as 'parent' | 'child',
        });
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!user || !userData) return;

    try {
      const dbUpdates: any = {};
      
      if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.hearts !== undefined) dbUpdates.hearts = updates.hearts;
      if (updates.coins !== undefined) dbUpdates.coins = updates.coins;
      if (updates.streakCount !== undefined) dbUpdates.streak_count = updates.streakCount;
      if (updates.dailyXpEarned !== undefined) dbUpdates.daily_xp_earned = updates.dailyXpEarned;
      if (updates.totalXpEarned !== undefined) dbUpdates.total_xp_earned = updates.totalXpEarned;
      if (updates.totalLessonsCompleted !== undefined) dbUpdates.total_lessons_completed = updates.totalLessonsCompleted;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) throw error;

      setUserData({ ...userData, ...updates });
    } catch (error: any) {
      console.error('Error updating user data:', error);
      toast.error('Failed to update user data');
    }
  };

  return { userData, loading, updateUserData, refreshUserData: loadUserData };
};
