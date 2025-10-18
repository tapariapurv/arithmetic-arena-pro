import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lesson {
  id: string;
  skillId: string;
  name: string;
  description: string | null;
  difficulty: string;
  questionsCount: number;
  xpReward: number;
  coinsReward: number;
  orderIndex: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  operation: string;
  orderIndex: number;
  lessons: Lesson[];
}

export const useLessons = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLessonsAndProgress();
    }
  }, [user]);

  const loadLessonsAndProgress = async () => {
    if (!user) return;

    try {
      // Fetch skills with lessons
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*, lessons(*)')
        .eq('is_active', true)
        .order('order_index');

      if (skillsError) throw skillsError;

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Create a map of progress by lesson_id
      const progressMap = new Map(
        progressData?.map((p) => [p.lesson_id, p]) || []
      );

      // Combine skills, lessons, and progress
      const combinedSkills: Skill[] = skillsData?.map((skill) => {
        const sortedLessons = (skill.lessons || []).sort(
          (a: any, b: any) => a.order_index - b.order_index
        );

        const lessons: Lesson[] = sortedLessons.map((lesson: any, index: number) => {
          const progress = progressMap.get(lesson.id);
          const isFirstLesson = index === 0;
          const previousLesson = index > 0 ? sortedLessons[index - 1] : null;
          const previousProgress = previousLesson ? progressMap.get(previousLesson.id) : null;
          
          // First lesson is always unlocked, others unlock when previous is completed
          const isUnlocked = isFirstLesson || (previousProgress?.is_completed ?? false);

          return {
            id: lesson.id,
            skillId: skill.id,
            name: lesson.name,
            description: lesson.description,
            difficulty: lesson.difficulty,
            questionsCount: lesson.questions_count,
            xpReward: lesson.xp_reward,
            coinsReward: lesson.coins_reward,
            orderIndex: lesson.order_index,
            isUnlocked,
            isCompleted: progress?.is_completed ?? false,
            stars: progress?.stars ?? 0,
            bestScore: progress?.best_score ?? 0,
            attempts: progress?.attempts ?? 0,
          };
        });

        return {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          icon: skill.icon,
          color: skill.color,
          operation: skill.operation,
          orderIndex: skill.order_index,
          lessons,
        };
      }) || [];

      setSkills(combinedSkills);
    } catch (error: any) {
      console.error('Error loading lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  return { skills, loading, refreshLessons: loadLessonsAndProgress };
};
