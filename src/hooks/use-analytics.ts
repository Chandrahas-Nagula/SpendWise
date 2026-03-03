import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../stores/auth-provider";
import { supabase } from "../services/supabase/client";
import { SupabaseExpenseRepository } from "../services/repositories/supabase-expense-repository";
import type { AnalyticsData } from "../services/repositories/interfaces";

// Dev fallback user
const DEV_USER_ID = "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

export type Timeframe = "month" | "quarter" | "year";

export interface AnalyticsHookData {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  refresh: () => void;
}

function getDateRange(timeframe: Timeframe): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let startDate: Date;
  let endDate: Date = new Date(year, month + 1, 0); // Last day of current month

  if (timeframe === "month") {
    startDate = new Date(year, month, 1);
  } else if (timeframe === "quarter") {
    // Current month and previous 2 months
    startDate = new Date(year, month - 2, 1);
  } else {
    // "year" = Current month and previous 11 months
    startDate = new Date(year, month - 11, 1);
  }

  // Format to YYYY-MM-DD
  const format = (d: Date) => d.toISOString().split("T")[0];

  return { start: format(startDate), end: format(endDate) };
}

export const useAnalytics = (): AnalyticsHookData => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? DEV_USER_ID;
  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { start, end } = getDateRange(timeframe);

    try {
      const result = await repo.getAnalytics(userId, start, end);
      setData(result);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load analytics.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [userId, repo, timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    timeframe,
    setTimeframe,
    refresh: fetchAnalytics,
  };
};
