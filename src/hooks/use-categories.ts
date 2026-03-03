import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import type { Category } from "../services/repositories/interfaces";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "../constants/categories";

export const useCategories = () => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";
  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await repo.getUserCategories(userId);
      setCategories(data);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, repo]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const expenseCategories = useMemo(() => {
    const expenses = categories.filter((c) => c.type === "expense");
    return expenses.length > 0 ? expenses : DEFAULT_EXPENSE_CATEGORIES;
  }, [categories]);

  const incomeCategories = useMemo(() => {
    const incomes = categories.filter((c) => c.type === "income");
    return incomes.length > 0 ? incomes : DEFAULT_INCOME_CATEGORIES;
  }, [categories]);

  return {
    categories,
    expenseCategories,
    incomeCategories,
    isLoading,
    refresh: fetchCategories,
    repo,
    userId,
  };
};
