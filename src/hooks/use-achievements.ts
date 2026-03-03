/**
 * useAchievements — Fetches real user stats from Supabase and evaluates
 * which achievements are unlocked. Also exposes a method to mark newly
 * unlocked achievements and trigger a confetti celebration.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { ALL_ACHIEVEMENTS, AchievementDef } from "../constants/achievements";

const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

export interface AchievementStatus extends AchievementDef {
  unlocked: boolean;
  unlockedAt?: string;
}

export interface NewlyUnlocked {
  achievement: AchievementDef;
}

export interface AchievementsHookData {
  achievements: AchievementStatus[];
  unlockedCount: number;
  totalCount: number;
  isLoading: boolean;
  /** Newly unlocked achievements that should trigger confetti */
  newlyUnlocked: NewlyUnlocked | null;
  /** Dismiss the confetti popup */
  dismissCelebration: () => void;
  /** Re-evaluate all achievements (call after important actions) */
  checkAchievements: () => Promise<void>;
}

// ── Stat fetching from Supabase ─────────────────────────────────────────────

interface UserStats {
  expense_count: number;
  income_count: number;
  total_transactions: number;
  budget_count: number;
  unique_categories: number;
  streak: number;
  savings_pct: number;
  savings_amount: number;
  under_budget_categories: number;
  all_under_budget: boolean;
  max_expense: number;
  has_profile_name: boolean;
  described_transactions: number;
  has_midnight_log: boolean;
  has_early_log: boolean;
  weekend_logs: number;
  unlocked_count: number;
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0);
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

  // Parallel queries
  const [expensesRes, incomesRes, budgetsRes, profileRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("id, amount, type, category_id, date, description, created_at")
      .eq("user_id", userId),
    supabase
      .from("expenses")
      .select("id, amount")
      .eq("user_id", userId)
      .eq("type", "income"),
    supabase
      .from("budgets")
      .select("id, category_id, amount")
      .eq("user_id", userId),
    supabase.auth.getUser(),
  ]);

  const expenses = expensesRes.data ?? [];
  const incomes = incomesRes.data ?? [];
  const budgets = budgetsRes.data ?? [];
  const profile = profileRes.data?.user;

  // Compute stats
  const expenseOnly = expenses.filter((e) => e.type === "expense");
  const incomeOnly = expenses.filter((e) => e.type === "income");

  const totalIncome = incomeOnly.reduce((s, e) => s + Number(e.amount), 0);
  const totalExpense = expenseOnly.reduce((s, e) => s + Number(e.amount), 0);
  const savings = totalIncome - totalExpense;
  const savingsPct = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  const uniqueCategories = new Set(expenses.map((e) => e.category_id)).size;

  // Streak: count consecutive days backwards from today
  const dateSet = new Set(expenses.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split("T")[0];
    if (dateSet.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break; // Allow today to be missing (still building today's streak)
    }
    d.setDate(d.getDate() - 1);
  }

  // Budget compliance
  let underBudgetCount = 0;
  let allUnder = budgets.length > 0;
  for (const b of budgets) {
    const catSpent = expenseOnly
      .filter(
        (e) =>
          e.category_id === b.category_id &&
          e.date >= startDate &&
          e.date <= endDate,
      )
      .reduce((s, e) => s + Number(e.amount), 0);
    if (catSpent <= Number(b.amount)) {
      underBudgetCount++;
    } else {
      allUnder = false;
    }
  }

  const maxExpense =
    expenseOnly.length > 0
      ? Math.max(...expenseOnly.map((e) => Number(e.amount)))
      : 0;

  const describedTransactions = expenses.filter(
    (e) => e.description && e.description.trim().length > 0,
  ).length;

  // Time-based achievements
  const hasMidnightLog = expenses.some((e) => {
    const hour = new Date(e.created_at).getHours();
    return hour >= 0 && hour < 5;
  });
  const hasEarlyLog = expenses.some((e) => {
    const hour = new Date(e.created_at).getHours();
    return hour >= 5 && hour < 7;
  });

  const weekendLogs = expenses.filter((e) => {
    const day = new Date(e.date).getDay();
    return day === 0 || day === 6;
  }).length;

  // Unlocked count (fetched later in evaluate)
  return {
    expense_count: expenseOnly.length,
    income_count: incomeOnly.length,
    total_transactions: expenses.length,
    budget_count: budgets.length,
    unique_categories: uniqueCategories,
    streak,
    savings_pct: savingsPct,
    savings_amount: savings,
    under_budget_categories: underBudgetCount,
    all_under_budget: allUnder,
    max_expense: maxExpense,
    has_profile_name: !!profile?.user_metadata?.full_name,
    described_transactions: describedTransactions,
    has_midnight_log: hasMidnightLog,
    has_early_log: hasEarlyLog,
    weekend_logs: weekendLogs,
    unlocked_count: 0, // Filled in after evaluation
  };
}

// ── Criteria evaluator ──────────────────────────────────────────────────────

function evaluate(criteria: string, stats: UserStats): boolean {
  // Parse simple criteria like "expense_count >= 1"
  const match = criteria.match(/^(\w+)\s*(>=|==)\s*(\d+)$/);
  if (match) {
    const [, field, op, valStr] = match;
    const val = Number(valStr);
    const statVal = (stats as any)[field] ?? 0;
    if (op === ">=") return statVal >= val;
    if (op === "==") return statVal === val;
  }

  // Boolean criteria
  if (criteria === "has_profile_name") return stats.has_profile_name;
  if (criteria === "all_under_budget") return stats.all_under_budget;
  if (criteria === "has_midnight_log") return stats.has_midnight_log;
  if (criteria === "has_early_log") return stats.has_early_log;
  if (criteria === "has_exported") return false; // Tracked separately
  if (criteria === "complete_month") return false; // Complex check, future
  if (criteria === "budget_streak_months >= 3") return false; // Future

  return false;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export const useAchievements = (): AchievementsHookData => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;

  const [achievements, setAchievements] = useState<AchievementStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<NewlyUnlocked | null>(
    null,
  );
  const previouslyUnlockedRef = useRef<Set<string>>(new Set());

  const checkAchievements = useCallback(async () => {
    setIsLoading(true);
    try {
      const stats = await fetchUserStats(userId);

      // Get previously saved unlocked keys from Supabase
      const { data: savedAchievements } = await supabase
        .from("achievements")
        .select("badge_type")
        .eq("user_id", userId);

      const savedKeys = new Set(
        (savedAchievements ?? []).map((a: any) => a.badge_type),
      );

      const evaluated: AchievementStatus[] = ALL_ACHIEVEMENTS.map((def) => {
        const wasSaved = savedKeys.has(def.key);
        const nowUnlocked =
          wasSaved ||
          evaluate(def.criteria, { ...stats, unlocked_count: savedKeys.size });
        return {
          ...def,
          unlocked: nowUnlocked,
        };
      });

      // Check for newly unlocked (not previously known)
      const currentUnlockedKeys = new Set(
        evaluated.filter((a) => a.unlocked).map((a) => a.key),
      );

      // Find achievements that are newly unlocked since last check
      let firstNew: AchievementDef | null = null;
      for (const a of evaluated) {
        if (
          a.unlocked &&
          !previouslyUnlockedRef.current.has(a.key) &&
          !savedKeys.has(a.key)
        ) {
          firstNew = a;

          // Save to Supabase
          await supabase
            .from("achievements")
            .upsert(
              {
                user_id: userId,
                badge_type: a.key,
                unlocked_at: new Date().toISOString(),
              },
              { onConflict: "user_id,badge_type" },
            )
            .select();

          break; // Show one at a time
        }
      }

      previouslyUnlockedRef.current = currentUnlockedKeys;

      // Re-evaluate with updated unlocked_count
      const totalUnlocked = evaluated.filter((a) => a.unlocked).length;
      const updatedStats = { ...stats, unlocked_count: totalUnlocked };

      // Re-check the "spendwise_pro" achievement
      const final = evaluated.map((a) => {
        if (a.key === "spendwise_pro") {
          return { ...a, unlocked: totalUnlocked >= 30 };
        }
        return a;
      });

      setAchievements(final);

      if (firstNew) {
        setNewlyUnlocked({ achievement: firstNew });
      }
    } catch (err) {
      console.error("Achievement check failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const dismissCelebration = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return {
    achievements,
    unlockedCount,
    totalCount: ALL_ACHIEVEMENTS.length,
    isLoading,
    newlyUnlocked,
    dismissCelebration,
    checkAchievements,
  };
};
