/**
 * Repository Interfaces
 * These define the contract for data operations, allowing us to swap
 * backend implementations without changing UI code.
 */

// We'll import our Supabase types to map them to frontend interfaces
import type { Database } from "../../types/supabase";

// Map Supabase Row types to cleaner frontend interface names
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Budget = Database["public"]["Tables"]["budgets"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];

// Input types for creation (omit generated fields like id and created_at)
export type CreateExpenseInput =
  Database["public"]["Tables"]["expenses"]["Insert"];
export type UpdateExpenseInput =
  Database["public"]["Tables"]["expenses"]["Update"];

export type CreateCategoryInput =
  Database["public"]["Tables"]["categories"]["Insert"];
export type CreateBudgetInput =
  Database["public"]["Tables"]["budgets"]["Insert"];

/**
 * Filter options for querying expenses
 */
export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: "expense" | "income";
  limit?: number;
  offset?: number;
}

/**
 * Computed monthly summary (totals from expense rows)
 */
export interface MonthlySummary {
  month: string; // "YYYY-MM"
  total_income: number;
  total_spent: number;
  savings: number;
  savings_percentage: number;
}

/**
 * Computed spending per category for a given month
 */
export interface CategorySpending {
  category_id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
}

export interface BudgetWithCategory extends Budget {
  categories: {
    name: string;
    icon: string;
    color: string;
  } | null;
}

export interface AnalyticsData {
  timeSeries: { date: string; value: number }[];
  categoryBreakdown: CategorySpending[];
  totalIncome: number;
  totalSpent: number;
}

/**
 * Result of a budget check after adding an expense
 */
export interface BudgetAlert {
  /** Whether a budget exists for this category */
  hasBudget: boolean;
  /** Budget limit amount */
  limit: number;
  /** Current total spent for this category this month (including the new expense) */
  spent: number;
  /** Percentage used (0-∞) */
  percentage: number;
  /** Category display info */
  categoryName: string;
  categoryIcon: string;
}

export interface IExpenseRepository {
  /**
   * Fetch expenses for a user, optionally filtered
   */
  getExpenses(userId: string, filters?: ExpenseFilters): Promise<Expense[]>;

  /**
   * Fetch recurring expenses for the user.
   */
  getRecurringExpenses(userId: string): Promise<Expense[]>;

  /**
   * Fetch a single expense by ID
   */
  getExpenseById(id: string): Promise<Expense | null>;

  /**
   * Add a new expense
   */
  addExpense(expense: CreateExpenseInput): Promise<Expense>;

  /**
   * Update an existing expense
   */
  updateExpense(id: string, updates: UpdateExpenseInput): Promise<Expense>;

  /**
   * Delete an expense
   */
  deleteExpense(id: string): Promise<void>;

  /**
   * Get a computed monthly summary (total income, spent, savings)
   */
  getMonthlySummary(
    userId: string,
    year: number,
    month: number,
  ): Promise<MonthlySummary>;

  /**
   * Get spending grouped by category for a given month (expenses only)
   */
  getCategorySpending(
    userId: string,
    year: number,
    month: number,
  ): Promise<CategorySpending[]>;

  /**
   * Fetch all budgets for a user
   */
  getBudgets(userId: string): Promise<BudgetWithCategory[]>;

  /**
   * Create or update a budget limit
   */
  upsertBudget(
    userId: string,
    categoryId: string,
    amount: number,
  ): Promise<Budget>;

  /**
   * Fetch analytics data for charts
   */
  getAnalytics(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<AnalyticsData>;

  /**
   * Check if a category's spending has reached/exceeded its budget
   * after adding an expense. Returns null if no budget is set.
   */
  checkBudgetStatus(
    userId: string,
    categoryId: string,
  ): Promise<BudgetAlert | null>;

  /**
   * Get distinct dates where the user has logged expenses or income,
   * used for calculating the streak.
   */
  getDistinctDates(userId: string): Promise<string[]>;

  /**
   * Fetch all categories (default ones + user's custom ones)
   */
  getUserCategories(userId: string): Promise<Category[]>;

  /**
   * Add a custom category
   */
  addCategory(category: CreateCategoryInput): Promise<Category>;

  /**
   * Delete a custom category
   */
  deleteCategory(id: string): Promise<void>;
}
