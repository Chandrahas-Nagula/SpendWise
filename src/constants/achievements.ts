/**
 * Achievement definitions — SpendWise
 *
 * 42 total achievements across 7 categories,
 * each with a unique key, display info, and unlock criteria.
 */

export interface AchievementDef {
  key: string;
  icon: string;
  title: string;
  description: string;
  category:
    | "getting_started"
    | "consistency"
    | "savings"
    | "budgeting"
    | "analytics"
    | "social"
    | "mastery";
  /** Function name in the checker — mapped at runtime */
  criteria: string;
}

// ── Getting Started (6) ─────────────────────────────────────────────────────
const GETTING_STARTED: AchievementDef[] = [
  {
    key: "first_expense",
    icon: "🎯",
    title: "First Step",
    description: "Log your very first expense",
    category: "getting_started",
    criteria: "expense_count >= 1",
  },
  {
    key: "first_income",
    icon: "💵",
    title: "Money In",
    description: "Record your first income",
    category: "getting_started",
    criteria: "income_count >= 1",
  },
  {
    key: "first_budget",
    icon: "📋",
    title: "Budget Planner",
    description: "Set up your first budget",
    category: "getting_started",
    criteria: "budget_count >= 1",
  },
  {
    key: "profile_complete",
    icon: "👤",
    title: "Identity Set",
    description: "Complete your profile details",
    category: "getting_started",
    criteria: "has_profile_name",
  },
  {
    key: "five_categories",
    icon: "📂",
    title: "Diversified",
    description: "Use 5 different categories",
    category: "getting_started",
    criteria: "unique_categories >= 5",
  },
  {
    key: "ten_transactions",
    icon: "📝",
    title: "Getting Serious",
    description: "Log 10 transactions total",
    category: "getting_started",
    criteria: "total_transactions >= 10",
  },
];

// ── Consistency (6) ─────────────────────────────────────────────────────────
const CONSISTENCY: AchievementDef[] = [
  {
    key: "streak_3",
    icon: "🔥",
    title: "3-Day Streak",
    description: "Log expenses 3 days in a row",
    category: "consistency",
    criteria: "streak >= 3",
  },
  {
    key: "streak_7",
    icon: "🔥",
    title: "Week Warrior",
    description: "Log expenses 7 days in a row",
    category: "consistency",
    criteria: "streak >= 7",
  },
  {
    key: "streak_14",
    icon: "⚡",
    title: "Two-Week Titan",
    description: "Log expenses 14 days straight",
    category: "consistency",
    criteria: "streak >= 14",
  },
  {
    key: "streak_30",
    icon: "🏆",
    title: "Monthly Master",
    description: "Log expenses every day for a month",
    category: "consistency",
    criteria: "streak >= 30",
  },
  {
    key: "streak_60",
    icon: "💎",
    title: "Diamond Streak",
    description: "60-day logging streak",
    category: "consistency",
    criteria: "streak >= 60",
  },
  {
    key: "streak_100",
    icon: "👑",
    title: "Century Streak",
    description: "100-day unbroken streak!",
    category: "consistency",
    criteria: "streak >= 100",
  },
];

// ── Savings (5) ─────────────────────────────────────────────────────────────
const SAVINGS: AchievementDef[] = [
  {
    key: "save_10pct",
    icon: "🐷",
    title: "Piggy Starter",
    description: "Save 10% of income in a month",
    category: "savings",
    criteria: "savings_pct >= 10",
  },
  {
    key: "save_20pct",
    icon: "💰",
    title: "Smart Saver",
    description: "Save 20% of income in a month",
    category: "savings",
    criteria: "savings_pct >= 20",
  },
  {
    key: "save_50pct",
    icon: "🏦",
    title: "Half Keeper",
    description: "Save 50% of income in a month",
    category: "savings",
    criteria: "savings_pct >= 50",
  },
  {
    key: "save_10k",
    icon: "📈",
    title: "₹10K Saved",
    description: "Save ₹10,000 in a single month",
    category: "savings",
    criteria: "savings_amount >= 10000",
  },
  {
    key: "save_50k",
    icon: "🚀",
    title: "₹50K Milestone",
    description: "Save ₹50,000 in a single month",
    category: "savings",
    criteria: "savings_amount >= 50000",
  },
];

// ── Budgeting (5) ───────────────────────────────────────────────────────────
const BUDGETING: AchievementDef[] = [
  {
    key: "budget_3",
    icon: "📊",
    title: "Triple Budget",
    description: "Set budgets for 3 categories",
    category: "budgeting",
    criteria: "budget_count >= 3",
  },
  {
    key: "budget_5",
    icon: "🎯",
    title: "Five-Star Planner",
    description: "Set budgets for 5 categories",
    category: "budgeting",
    criteria: "budget_count >= 5",
  },
  {
    key: "under_budget_1",
    icon: "✅",
    title: "On Track",
    description: "Stay under budget in 1 category",
    category: "budgeting",
    criteria: "under_budget_categories >= 1",
  },
  {
    key: "under_budget_all",
    icon: "🛡️",
    title: "Budget Guardian",
    description: "Stay under all budgets for a month",
    category: "budgeting",
    criteria: "all_under_budget",
  },
  {
    key: "budget_streak_3",
    icon: "🌟",
    title: "3-Month Discipline",
    description: "Stay under budget 3 months running",
    category: "budgeting",
    criteria: "budget_streak_months >= 3",
  },
];

// ── Analytics (4) ───────────────────────────────────────────────────────────
const ANALYTICS: AchievementDef[] = [
  {
    key: "view_analytics_1",
    icon: "👀",
    title: "Data Curious",
    description: "View analytics for the first time",
    category: "analytics",
    criteria: "analytics_views >= 1",
  },
  {
    key: "view_analytics_10",
    icon: "📉",
    title: "Data Analyst",
    description: "View analytics 10 times",
    category: "analytics",
    criteria: "analytics_views >= 10",
  },
  {
    key: "compare_months",
    icon: "📅",
    title: "Time Traveler",
    description: "Compare spending across months",
    category: "analytics",
    criteria: "months_compared >= 2",
  },
  {
    key: "export_data",
    icon: "📤",
    title: "Data Explorer",
    description: "Export your transaction data",
    category: "analytics",
    criteria: "has_exported",
  },
];

// ── Transaction Milestones (8) ──────────────────────────────────────────────
const MILESTONES: AchievementDef[] = [
  {
    key: "tx_25",
    icon: "📋",
    title: "Quarter Century",
    description: "Log 25 transactions",
    category: "mastery",
    criteria: "total_transactions >= 25",
  },
  {
    key: "tx_50",
    icon: "🎖️",
    title: "Half Hundred",
    description: "Log 50 transactions",
    category: "mastery",
    criteria: "total_transactions >= 50",
  },
  {
    key: "tx_100",
    icon: "💯",
    title: "Centurion",
    description: "Log 100 transactions",
    category: "mastery",
    criteria: "total_transactions >= 100",
  },
  {
    key: "tx_250",
    icon: "🏅",
    title: "Tracking Pro",
    description: "Log 250 transactions",
    category: "mastery",
    criteria: "total_transactions >= 250",
  },
  {
    key: "tx_500",
    icon: "⭐",
    title: "Finance Guru",
    description: "Log 500 transactions",
    category: "mastery",
    criteria: "total_transactions >= 500",
  },
  {
    key: "tx_1000",
    icon: "🌟",
    title: "Legendary Logger",
    description: "Log 1,000 transactions",
    category: "mastery",
    criteria: "total_transactions >= 1000",
  },
  {
    key: "all_categories",
    icon: "🌈",
    title: "Rainbow Spender",
    description: "Use all expense categories",
    category: "mastery",
    criteria: "unique_categories >= 11",
  },
  {
    key: "big_expense",
    icon: "💸",
    title: "Big Spender",
    description: "Log an expense over ₹10,000",
    category: "mastery",
    criteria: "max_expense >= 10000",
  },
];

// ── Social / Fun (8) ────────────────────────────────────────────────────────
const SOCIAL: AchievementDef[] = [
  {
    key: "night_owl",
    icon: "🦉",
    title: "Night Owl",
    description: "Log an expense after midnight",
    category: "social",
    criteria: "has_midnight_log",
  },
  {
    key: "early_bird",
    icon: "🐦",
    title: "Early Bird",
    description: "Log an expense before 7 AM",
    category: "social",
    criteria: "has_early_log",
  },
  {
    key: "weekend_warrior",
    icon: "🎮",
    title: "Weekend Warrior",
    description: "Log expenses on 10 weekends",
    category: "social",
    criteria: "weekend_logs >= 10",
  },
  {
    key: "no_spend_day",
    icon: "🧘",
    title: "Zen Spender",
    description: "Go a full day without spending",
    category: "social",
    criteria: "no_spend_days >= 1",
  },
  {
    key: "no_spend_week",
    icon: "🏝️",
    title: "Spending Detox",
    description: "Go 7 days without an expense",
    category: "social",
    criteria: "no_spend_days >= 7",
  },
  {
    key: "describe_all",
    icon: "✍️",
    title: "Storyteller",
    description: "Add descriptions to 20 transactions",
    category: "social",
    criteria: "described_transactions >= 20",
  },
  {
    key: "month_complete",
    icon: "📅",
    title: "Full Month",
    description: "Log at least one expense every day of a month",
    category: "social",
    criteria: "complete_month",
  },
  {
    key: "spendwise_pro",
    icon: "🎓",
    title: "SpendWise Pro",
    description: "Unlock 30 achievements",
    category: "social",
    criteria: "unlocked_count >= 30",
  },
];

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  ...GETTING_STARTED,
  ...CONSISTENCY,
  ...SAVINGS,
  ...BUDGETING,
  ...ANALYTICS,
  ...MILESTONES,
  ...SOCIAL,
];

export const ACHIEVEMENT_CATEGORIES = [
  { key: "getting_started", label: "Getting Started", icon: "🚀" },
  { key: "consistency", label: "Consistency", icon: "🔥" },
  { key: "savings", label: "Savings", icon: "💰" },
  { key: "budgeting", label: "Budgeting", icon: "📊" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "mastery", label: "Milestones", icon: "🏅" },
  { key: "social", label: "Fun & Social", icon: "🎮" },
] as const;
