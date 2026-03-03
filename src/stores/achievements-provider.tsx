/**
 * AchievementsProvider — Global context that wraps the app to provide
 * achievement checking and confetti celebration overlays.
 *
 * Usage: Wrap your navigator with <AchievementsProvider> and call
 * useAchievementCheck().checkAchievements() from any hook/screen.
 */

import React, { createContext, useContext, useCallback, useState } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { ALL_ACHIEVEMENTS, AchievementDef } from "../constants/achievements";
import { ConfettiCelebration } from "../components/ui/confetti-celebration";

const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

interface AchievementContextValue {
  checkAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextValue>({
  checkAchievements: async () => {},
});

export const useAchievementCheck = () => useContext(AchievementContext);

interface CelebrationState {
  icon: string;
  title: string;
  description: string;
}

// ── Simplified stat check (same logic as use-achievements) ──────────────────

async function quickCheck(userId: string): Promise<AchievementDef | null> {
  // Fetch saved badges
  const { data: saved } = await supabase
    .from("achievements")
    .select("badge_type")
    .eq("user_id", userId);

  const savedKeys = new Set((saved ?? []).map((a: any) => a.badge_type));

  // Fetch all expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, amount, type, category_id, date, description, created_at")
    .eq("user_id", userId);

  const { data: budgets } = await supabase
    .from("budgets")
    .select("id, category_id, amount")
    .eq("user_id", userId);

  const allExpenses = expenses ?? [];
  const allBudgets = budgets ?? [];
  const expenseOnly = allExpenses.filter((e) => e.type === "expense");
  const incomeOnly = allExpenses.filter((e) => e.type === "income");

  const stats: Record<string, any> = {
    expense_count: expenseOnly.length,
    income_count: incomeOnly.length,
    total_transactions: allExpenses.length,
    budget_count: allBudgets.length,
    unique_categories: new Set(allExpenses.map((e) => e.category_id)).size,
    max_expense:
      expenseOnly.length > 0
        ? Math.max(...expenseOnly.map((e) => Number(e.amount)))
        : 0,
    described_transactions: allExpenses.filter(
      (e) => e.description && e.description.trim().length > 0,
    ).length,
    has_midnight_log: allExpenses.some((e) => {
      const h = new Date(e.created_at).getHours();
      return h >= 0 && h < 5;
    }),
    has_early_log: allExpenses.some((e) => {
      const h = new Date(e.created_at).getHours();
      return h >= 5 && h < 7;
    }),
    weekend_logs: allExpenses.filter((e) => {
      const d = new Date(e.date).getDay();
      return d === 0 || d === 6;
    }).length,
    unlocked_count: savedKeys.size,
  };

  // Streak
  const dateSet = new Set(allExpenses.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().split("T")[0];
    if (dateSet.has(ds)) streak++;
    else if (i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  stats.streak = streak;

  // Savings
  const totInc = incomeOnly.reduce((s, e) => s + Number(e.amount), 0);
  const totExp = expenseOnly.reduce((s, e) => s + Number(e.amount), 0);
  stats.savings_amount = totInc - totExp;
  stats.savings_pct = totInc > 0 ? ((totInc - totExp) / totInc) * 100 : 0;

  // Budget compliance
  const now = new Date();
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  let underCount = 0;
  let allUnder = allBudgets.length > 0;
  for (const b of allBudgets) {
    const spent = expenseOnly
      .filter((e) => e.category_id === b.category_id && e.date >= startDate)
      .reduce((s, e) => s + Number(e.amount), 0);
    if (spent <= Number(b.amount)) underCount++;
    else allUnder = false;
  }
  stats.under_budget_categories = underCount;
  stats.all_under_budget = allUnder;

  // Profile
  const { data: profileData } = await supabase.auth.getUser();
  stats.has_profile_name = !!profileData?.user?.user_metadata?.full_name;

  // Evaluate all achievements
  for (const def of ALL_ACHIEVEMENTS) {
    if (savedKeys.has(def.key)) continue; // Already unlocked

    let unlocked = false;

    // Parse criteria
    const match = def.criteria.match(/^(\w+)\s*(>=|==)\s*(\d+)$/);
    if (match) {
      const [, field, op, valStr] = match;
      const val = Number(valStr);
      const sv = stats[field] ?? 0;
      if (op === ">=" && sv >= val) unlocked = true;
      if (op === "==" && sv === val) unlocked = true;
    }

    // Boolean criteria
    if (def.criteria === "has_profile_name" && stats.has_profile_name)
      unlocked = true;
    if (def.criteria === "all_under_budget" && stats.all_under_budget)
      unlocked = true;
    if (def.criteria === "has_midnight_log" && stats.has_midnight_log)
      unlocked = true;
    if (def.criteria === "has_early_log" && stats.has_early_log)
      unlocked = true;

    if (unlocked) {
      // Save to DB
      await supabase.from("achievements").upsert(
        {
          user_id: userId,
          badge_type: def.key,
          unlocked_at: new Date().toISOString(),
        },
        { onConflict: "user_id,badge_type" },
      );
      return def; // Return first newly unlocked
    }
  }

  return null;
}

// ── Provider ────────────────────────────────────────────────────────────────

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);

  const checkAchievements = useCallback(async () => {
    try {
      const newDef = await quickCheck(userId);
      if (newDef) {
        setCelebration({
          icon: newDef.icon,
          title: newDef.title,
          description: newDef.description,
        });
      }
    } catch {
      // Silently ignore
    }
  }, [userId]);

  const dismiss = useCallback(() => setCelebration(null), []);

  return (
    <AchievementContext.Provider value={{ checkAchievements }}>
      {children}
      {celebration && (
        <ConfettiCelebration
          icon={celebration.icon}
          title={celebration.title}
          description={celebration.description}
          onDismiss={dismiss}
        />
      )}
    </AchievementContext.Provider>
  );
};
