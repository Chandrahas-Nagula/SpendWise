/**
 * Mock Data — SpendWise Dashboard (Slice 1 UI Phase)
 *
 * All data is hardcoded for UI development.
 * Will be replaced with real Supabase queries in Slice 1 backend wiring.
 */

import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "../../constants/categories";
import type {
  TransactionType,
  CategoryDefinition,
} from "../../constants/categories";

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

export interface MockUser {
  readonly name: string;
  readonly email: string;
  readonly level: number;
  readonly xp_points: number;
  readonly streak_days: number;
  readonly avatar_url: string | null;
}

export interface MockMonthlySummary {
  readonly month: string;
  readonly total_budget: number;
  readonly total_spent: number;
  readonly total_income: number;
  readonly days_remaining: number;
  readonly savings: number;
  readonly savings_percentage: number;
}

export interface MockCategorySpending {
  readonly category: CategoryDefinition;
  readonly spent: number;
  readonly budget: number;
  readonly percentage: number;
}

export interface MockTransaction {
  readonly id: string;
  readonly amount: number;
  readonly category: CategoryDefinition;
  readonly description: string;
  readonly date: string;
  readonly type: TransactionType;
}

export interface MockAiInsight {
  readonly message: string;
  readonly type: "positive" | "warning" | "negative";
}

export interface MockGamification {
  readonly streak: number;
  readonly level: number;
  readonly xp: number;
  readonly xp_to_next_level: number;
  readonly recent_achievement: string;
}

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

const findExpenseCat = (id: string): CategoryDefinition =>
  DEFAULT_EXPENSE_CATEGORIES.find((c) => c.id === id) ??
  DEFAULT_EXPENSE_CATEGORIES[0];

const findIncomeCat = (id: string): CategoryDefinition =>
  DEFAULT_INCOME_CATEGORIES.find((c) => c.id === id) ??
  DEFAULT_INCOME_CATEGORIES[0];

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// ---------------------------------------------------------------------------
//  1. MOCK_USER
// ---------------------------------------------------------------------------

export const MOCK_USER: MockUser = {
  name: "Chandrahas",
  email: "chandrahas@example.com",
  level: 5,
  xp_points: 450,
  streak_days: 15,
  avatar_url: null,
};

// ---------------------------------------------------------------------------
//  2. MOCK_MONTHLY_SUMMARY
// ---------------------------------------------------------------------------

export const MOCK_MONTHLY_SUMMARY: MockMonthlySummary = {
  month: "February 2026",
  total_budget: 50000,
  total_spent: 47500,
  total_income: 50000,
  days_remaining: 6,
  savings: 2500,
  savings_percentage: 5,
};

// ---------------------------------------------------------------------------
//  3. MOCK_CATEGORY_SPENDING (6 categories)
// ---------------------------------------------------------------------------

export const MOCK_CATEGORY_SPENDING: readonly MockCategorySpending[] = [
  {
    category: findExpenseCat("food-dining"),
    spent: 18000,
    budget: 20000,
    percentage: 40,
  },
  {
    category: findExpenseCat("transport"),
    spent: 6750,
    budget: 8000,
    percentage: 15,
  },
  {
    category: findExpenseCat("bills-utilities"),
    spent: 9500,
    budget: 10000,
    percentage: 20,
  },
  {
    category: findExpenseCat("entertainment"),
    spent: 4500,
    budget: 5000,
    percentage: 10,
  },
  {
    category: findExpenseCat("shopping"),
    spent: 4500,
    budget: 5000,
    percentage: 10,
  },
  {
    category: findExpenseCat("health"),
    spent: 4250,
    budget: 5000,
    percentage: 9.4,
  },
] as const;

// ---------------------------------------------------------------------------
//  4. MOCK_RECENT_TRANSACTIONS (8 entries)
// ---------------------------------------------------------------------------

export const MOCK_RECENT_TRANSACTIONS: readonly MockTransaction[] = [
  {
    id: "txn-001",
    amount: 450,
    category: findExpenseCat("food-dining"),
    description: "Lunch at Biryani Blues",
    date: daysAgo(0),
    type: "expense",
  },
  {
    id: "txn-002",
    amount: 180,
    category: findExpenseCat("transport"),
    description: "Uber to Office",
    date: daysAgo(0),
    type: "expense",
  },
  {
    id: "txn-003",
    amount: 50000,
    category: findIncomeCat("salary"),
    description: "February Salary",
    date: daysAgo(1),
    type: "income",
  },
  {
    id: "txn-004",
    amount: 2500,
    category: findExpenseCat("bills-utilities"),
    description: "Electricity Bill",
    date: daysAgo(1),
    type: "expense",
  },
  {
    id: "txn-005",
    amount: 899,
    category: findExpenseCat("entertainment"),
    description: "Netflix Subscription",
    date: daysAgo(1),
    type: "expense",
  },
  {
    id: "txn-006",
    amount: 1200,
    category: findExpenseCat("shopping"),
    description: "Amazon - Headphones",
    date: daysAgo(2),
    type: "expense",
  },
  {
    id: "txn-007",
    amount: 350,
    category: findExpenseCat("food-dining"),
    description: "Swiggy - Dinner",
    date: daysAgo(2),
    type: "expense",
  },
  {
    id: "txn-008",
    amount: 750,
    category: findExpenseCat("health"),
    description: "Apollo Pharmacy",
    date: daysAgo(2),
    type: "expense",
  },
] as const;

// ---------------------------------------------------------------------------
//  5. MOCK_AI_INSIGHT
// ---------------------------------------------------------------------------

export const MOCK_AI_INSIGHTS: MockAiInsight[] = [
  {
    message:
      "You're on track to save ₹2,500 this month! 🎉\nTip: Reduce dining on weekends to boost savings by ₹1,200 more.",
    type: "positive",
  },
  {
    message:
      "⚠️ Your transport spending is 40% higher than last month.\nConsider carpooling or using public transit to save ₹800.",
    type: "warning",
  },
  {
    message:
      "Great news! You've cut entertainment costs by 25% 🎯\nKeep it up — you could save ₹3,000 by month end.",
    type: "positive",
  },
];

// ---------------------------------------------------------------------------
//  6. MOCK_GAMIFICATION
// ---------------------------------------------------------------------------

export const MOCK_GAMIFICATION: MockGamification = {
  streak: 15,
  level: 5,
  xp: 450,
  xp_to_next_level: 500,
  recent_achievement: "Budget Master 🏆",
};
