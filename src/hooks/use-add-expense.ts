/**
 * useAddExpense — Hook encapsulating Add Expense logic.
 *
 * Gets user_id from useAuth(), calls SupabaseExpenseRepository.addExpense().
 * Manages isSubmitting, error, isSuccess state.
 *
 * After saving an expense, checks if the category's spending has reached
 * or exceeded the user's budget limit and fires an in-app Alert.
 */

import { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { useAuth } from "../stores/auth-provider";
import { useAchievementCheck } from "../stores/achievements-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import { formatINR } from "../utils/greeting";
import type {
  CreateExpenseInput,
  Expense,
} from "../services/repositories/interfaces";

export interface AddExpenseData {
  amount: number;
  type: "expense" | "income";
  categoryId: string;
  date: Date;
  description?: string;
  receiptUri?: string;
}

interface UseAddExpenseReturn {
  submitExpense: (data: AddExpenseData) => Promise<Expense | null>;
  isSubmitting: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const useAddExpense = (): UseAddExpenseReturn => {
  const { session } = useAuth();
  const { checkAchievements } = useAchievementCheck();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const submitExpense = useCallback(
    async (data: AddExpenseData): Promise<Expense | null> => {
      const userId = session?.user?.id;
      if (!userId) {
        setError("You must be signed in to add a transaction.");
        return null;
      }

      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      try {
        const input: CreateExpenseInput = {
          amount: data.amount,
          type: data.type,
          category_id: data.categoryId,
          date: data.date.toISOString().split("T")[0], // YYYY-MM-DD
          description: data.description || null,
          user_id: userId,
        };

        const expense = await repo.addExpense(input);
        setIsSuccess(true);

        // ── Achievement check (fire-and-forget, non-blocking) ───────
        checkAchievements().catch(() => {});

        // ── Budget overspend check (fire-and-forget, non-blocking) ──
        if (data.type === "expense" && data.categoryId) {
          repo
            .checkBudgetStatus(userId, data.categoryId)
            .then((alert) => {
              if (!alert || !alert.hasBudget) return;

              const pct = Math.round(alert.percentage);

              if (pct >= 100) {
                // 🔴 Exceeded
                Alert.alert(
                  `🚨 Budget Exceeded!`,
                  `${alert.categoryIcon} ${alert.categoryName}: You've spent ${formatINR(alert.spent)} of your ${formatINR(alert.limit)} budget (${pct}%).`,
                  [{ text: "Got it", style: "default" }],
                );
              } else if (pct >= 80) {
                // 🟡 Warning
                Alert.alert(
                  `⚠️ Budget Warning`,
                  `${alert.categoryIcon} ${alert.categoryName}: You've used ${pct}% of your ${formatINR(alert.limit)} budget (${formatINR(alert.spent)} spent).`,
                  [{ text: "OK", style: "default" }],
                );
              }
            })
            .catch(() => {
              // Silently ignore budget check failures
            });
        }

        return expense;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to save expense.";
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, repo],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return { submitExpense, isSubmitting, error, isSuccess, reset };
};
