import { SupabaseClient } from "@supabase/supabase-js";
import type {
  IExpenseRepository,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  CreateCategoryInput,
  Category,
  ExpenseFilters,
  MonthlySummary,
  CategorySpending,
  Budget,
  BudgetWithCategory,
  AnalyticsData,
  BudgetAlert,
} from "./interfaces";

export class SupabaseExpenseRepository implements IExpenseRepository {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async getExpenses(
    userId: string,
    filters?: ExpenseFilters,
  ): Promise<Expense[]> {
    let query = this.supabase
      .from("expenses")
      .select("*, categories (name, icon, color)")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (filters?.startDate) {
      query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("date", filters.endDate);
    }
    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.limit) {
      const offset = filters.offset ?? 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data as Expense[];
  }

  async getRecurringExpenses(userId: string): Promise<Expense[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*, categories (name, icon, color)")
      .eq("user_id", userId)
      .eq("is_recurring", true)
      .order("date", { ascending: false });

    if (error) throw error;

    return data as Expense[];
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*, categories (name, icon, color)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Expense;
  }

  async addExpense(expense: CreateExpenseInput): Promise<Expense> {
    const { data, error } = await this.supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  }

  async updateExpense(
    id: string,
    updates: UpdateExpenseInput,
  ): Promise<Expense> {
    const { data, error } = await this.supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  }

  async deleteExpense(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // ── Computed Dashboard Queries ──────────────────────────────────────────

  async getMonthlySummary(
    userId: string,
    year: number,
    month: number,
  ): Promise<MonthlySummary> {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = this.lastDayOfMonth(year, month);

    const { data, error } = await this.supabase
      .from("expenses")
      .select("amount, type")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    const rows = (data ?? []) as { amount: number; type: string }[];

    let total_income = 0;
    let total_spent = 0;

    for (const row of rows) {
      if (row.type === "income") {
        total_income += Number(row.amount);
      } else {
        total_spent += Number(row.amount);
      }
    }

    const savings = total_income - total_spent;
    const savings_percentage =
      total_income > 0 ? Math.round((savings / total_income) * 100) : 0;

    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      total_income,
      total_spent,
      savings,
      savings_percentage,
    };
  }

  async getCategorySpending(
    userId: string,
    year: number,
    month: number,
  ): Promise<CategorySpending[]> {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = this.lastDayOfMonth(year, month);

    const { data, error } = await this.supabase
      .from("expenses")
      .select("amount, category_id, categories (name, icon, color)")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    // Group by category_id
    const map = new Map<string, CategorySpending>();

    for (const row of (data ?? []) as any[]) {
      const catId = row.category_id as string;
      if (!catId) continue;

      const existing = map.get(catId);
      const amt = Number(row.amount);

      if (existing) {
        existing.spent += amt;
      } else {
        const cat = row.categories as {
          name: string;
          icon: string;
          color: string;
        } | null;
        map.set(catId, {
          category_id: catId,
          name: cat?.name ?? "Uncategorized",
          icon: cat?.icon ?? "💰",
          color: cat?.color ?? "#9CA3AF",
          spent: amt,
        });
      }
    }

    // Sort descending by spent
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent);
  }

  // ── Budgets ─────────────────────────────────────────────────────────────

  async getBudgets(userId: string): Promise<BudgetWithCategory[]> {
    const { data, error } = await this.supabase
      .from("budgets")
      .select("*, categories (name, icon, color)")
      .eq("user_id", userId);

    if (error) throw error;
    return data as BudgetWithCategory[];
  }

  async upsertBudget(
    userId: string,
    categoryId: string,
    amount: number,
  ): Promise<Budget> {
    const { data, error } = await this.supabase
      .from("budgets")
      .upsert(
        { user_id: userId, category_id: categoryId, amount },
        { onConflict: "user_id, category_id" },
      )
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  // ── Analytics ───────────────────────────────────────────────────────────

  async getAnalytics(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AnalyticsData> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("amount, type, date, category_id, categories (name, icon, color)")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true }); // chronological for line chart

    if (error) throw error;

    let totalIncome = 0;
    let totalSpent = 0;
    const dateMap = new Map<string, number>(); // date -> daily spent
    const catMap = new Map<string, CategorySpending>();

    for (const row of (data ?? []) as any[]) {
      const amt = Number(row.amount);
      if (row.type === "income") {
        totalIncome += amt;
      } else {
        totalSpent += amt;

        // 1. Time series accumulation (group by date string)
        const dateStr = row.date as string;
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + amt);

        // 2. Category Pie Chart accumulation
        const catId = row.category_id as string;
        if (catId) {
          const existing = catMap.get(catId);
          if (existing) {
            existing.spent += amt;
          } else {
            const cat = row.categories;
            catMap.set(catId, {
              category_id: catId,
              name: cat?.name ?? "Uncategorized",
              icon: cat?.icon ?? "💰",
              color: cat?.color ?? "#9CA3AF",
              spent: amt,
            });
          }
        }
      }
    }

    // Convert daily map into chronological array for line chart
    const timeSeries = Array.from(dateMap.entries()).map(([date, value]) => ({
      date,
      value,
    }));

    // Convert category map into sorted array for pie chart
    const categoryBreakdown = Array.from(catMap.values()).sort(
      (a, b) => b.spent - a.spent,
    );

    return {
      timeSeries,
      categoryBreakdown,
      totalIncome,
      totalSpent,
    };
  }

  // ── Budget Alert Check ──────────────────────────────────────────────────

  async checkBudgetStatus(
    userId: string,
    categoryId: string,
  ): Promise<BudgetAlert | null> {
    // 1. Look up the budget for this category
    const { data: budgetData, error: budgetErr } = await this.supabase
      .from("budgets")
      .select("amount, categories (name, icon)")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .maybeSingle();

    if (budgetErr || !budgetData) return null; // No budget set

    const limit = Number(budgetData.amount);
    if (limit <= 0) return null;

    // 2. Sum this month's spending for the category
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = this.lastDayOfMonth(year, month);

    const { data: expenses, error: expErr } = await this.supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate);

    if (expErr) return null;

    const spent = (expenses ?? []).reduce(
      (sum: number, row: any) => sum + Number(row.amount),
      0,
    );

    const cat = budgetData.categories as any;
    return {
      hasBudget: true,
      limit,
      spent,
      percentage: (spent / limit) * 100,
      categoryName: cat?.name ?? "Unknown",
      categoryIcon: cat?.icon ?? "💰",
    };
  }

  async getDistinctDates(userId: string): Promise<string[]> {
    // Supabase JS doesn't have a distinct query without RPC, so we fetch dates and dedup
    const { data, error } = await this.supabase
      .from("expenses")
      .select("date")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    if (!data) return [];

    const unique = new Set(data.map((r) => r.date));
    return Array.from(unique);
  }

  // ── Category Methods ───────────────────────────────────────────────────

  async getUserCategories(userId: string): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order("name", { ascending: true });

    if (error) throw error;
    return data as Category[];
  }

  async addCategory(category: CreateCategoryInput): Promise<Category> {
    const { data, error } = await this.supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private lastDayOfMonth(year: number, month: number): string {
    const d = new Date(year, month, 0); // day 0 of next month = last day
    return d.toISOString().split("T")[0];
  }
}
