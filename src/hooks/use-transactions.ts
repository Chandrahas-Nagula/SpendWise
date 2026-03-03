/**
 * useTransactions — Paginated transactions list with infinite scroll.
 *
 * Uses cursor-based pagination via Supabase range().
 * Supports pull-to-refresh and load-more.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import type {
  Expense,
  ExpenseFilters,
} from "../services/repositories/interfaces";

const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";
const PAGE_SIZE = 20;

export interface UseTransactionsReturn {
  transactions: (Expense & {
    categories?: { name: string; icon: string; color: string } | null;
  })[];
  isLoading: boolean;
  isRefreshing: boolean;
  fetchMore: () => void;
  refresh: () => void;
  hasMore: boolean;
  error: string | null;
}

export const useTransactions = (
  filters?: Pick<
    ExpenseFilters,
    "startDate" | "endDate" | "categoryId" | "type"
  >,
): UseTransactionsReturn => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);

  const fetchPage = useCallback(
    async (offset: number, isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (offset === 0) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await repo.getExpenses(userId, {
          ...filters,
          limit: PAGE_SIZE,
          offset,
        });

        if (isRefresh || offset === 0) {
          setTransactions(data);
        } else {
          setTransactions((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === PAGE_SIZE);
        offsetRef.current = offset + data.length;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to load transactions.";
        setError(msg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId, repo, filters],
  );

  // Initial load
  useEffect(() => {
    offsetRef.current = 0;
    fetchPage(0);
  }, [fetchPage]);

  const refresh = useCallback(() => {
    offsetRef.current = 0;
    fetchPage(0, true);
  }, [fetchPage]);

  const fetchMore = useCallback(() => {
    if (!hasMore || isLoading || isRefreshing) return;
    fetchPage(offsetRef.current);
  }, [hasMore, isLoading, isRefreshing, fetchPage]);

  return {
    transactions,
    isLoading,
    isRefreshing,
    fetchMore,
    refresh,
    hasMore,
    error,
  };
};
