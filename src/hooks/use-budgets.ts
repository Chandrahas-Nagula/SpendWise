import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import type { BudgetWithCategory } from "../services/repositories/interfaces";

// Dev fallback user
const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

export interface BudgetsData {
  budgets: BudgetWithCategory[];
  progress: Record<string, number>; // Maps category_id to spent amount
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => void;
  saveBudget: (categoryId: string, amount: number) => Promise<void>;
}

export const useBudgets = (): BudgetsData => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;
  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgetsAndProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const [budgetsResult, spendingResult] = await Promise.all([
        repo.getBudgets(userId),
        repo.getCategorySpending(userId, year, month),
      ]);

      const progressMap: Record<string, number> = {};
      for (const stat of spendingResult) {
        progressMap[stat.category_id] = stat.spent;
      }

      setBudgets(budgetsResult);
      setProgress(progressMap);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load budgets.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [userId, repo]);

  const saveBudget = useCallback(
    async (categoryId: string, amount: number) => {
      setIsSaving(true);
      setError(null);
      try {
        await repo.upsertBudget(userId, categoryId, amount);
        await fetchBudgetsAndProgress(); // Refresh to get joined category data
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save budget.";
        setError(msg);
        throw new Error(msg); // Rethrow so UI can show alert
      } finally {
        setIsSaving(false);
      }
    },
    [userId, repo, fetchBudgetsAndProgress],
  );

  useEffect(() => {
    fetchBudgetsAndProgress();
  }, [fetchBudgetsAndProgress]);

  return {
    budgets,
    progress,
    isLoading,
    isSaving,
    error,
    refresh: fetchBudgetsAndProgress,
    saveBudget,
  };
};
