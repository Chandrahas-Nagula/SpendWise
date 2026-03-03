/**
 * useDashboardData — Fetches all live data for the Home Dashboard.
 *
 * Combines three parallel Supabase queries:
 *  1. Monthly summary (income, spent, savings)
 *  2. Category spending (grouped, sorted desc)
 *  3. Recent transactions (latest 5)
 *
 * Falls back to a dev user UUID if no auth session exists.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import type {
  Expense,
  MonthlySummary,
  CategorySpending,
} from "../services/repositories/interfaces";

// Dev fallback user (chandrahasnagula@gmail.com)
const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

export interface DashboardData {
  summary: MonthlySummary | null;
  categorySpending: CategorySpending[];
  recentTransactions: (Expense & {
    categories?: { name: string; icon: string; color: string } | null;
  })[];
  userName: string;
  streak: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useDashboardData = (): DashboardData => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;
  const userName =
    session?.user?.user_metadata?.full_name ??
    session?.user?.email?.split("@")[0] ??
    "Chandrahas";

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    [],
  );
  const [recentTransactions, setRecentTransactions] = useState<Expense[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 1-indexed

      const [summaryResult, categoryResult, txnResult, datesResult] =
        await Promise.all([
          repo.getMonthlySummary(userId, year, month),
          repo.getCategorySpending(userId, year, month),
          repo.getExpenses(userId, { limit: 5 }),
          repo.getDistinctDates(userId),
        ]);

      setSummary(summaryResult);
      setCategorySpending(categoryResult);
      setRecentTransactions(txnResult);

      // Compute streak
      const dateSet = new Set(datesResult);
      let currentStreak = 0;
      const d = new Date();
      for (let i = 0; i < 365; i++) {
        const ds = d.toISOString().split("T")[0];
        if (dateSet.has(ds)) currentStreak++;
        else if (i > 0) break; // If i=0 (today) is missing, we might still have a streak ending yesterday. Check tomorrow logic if needed, but for simplicity: if missing today, check yesterday, break on first miss after yesterday. Let's do simple:
        // Actually, if they haven't logged today, the streak shouldn't break until tomorrow.
        // Let's adjust:
        if (!dateSet.has(ds)) {
          if (i === 0) continue; // It's okay to miss today
          break; // But missing any other day breaks it
        }
        d.setDate(d.getDate() - 1);
      }
      // Re-eval streak counting accurately:
      let compStreak = 0;
      const d2 = new Date();
      // Check today
      const today = d2.toISOString().split("T")[0];
      const hasToday = dateSet.has(today);
      if (hasToday) compStreak++;
      d2.setDate(d2.getDate() - 1); // Move to yesterday
      for (let i = 0; i < 365; i++) {
        const ds = d2.toISOString().split("T")[0];
        if (dateSet.has(ds)) compStreak++;
        else break;
        d2.setDate(d2.getDate() - 1);
      }
      setStreak(compStreak);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load dashboard data.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [userId, repo]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    summary,
    categorySpending,
    recentTransactions,
    userName,
    streak,
    isLoading,
    error,
    refresh: fetchAll,
  };
};
