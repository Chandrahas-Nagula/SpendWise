/**
 * Default Expense & Income Categories — SpendWise
 *
 * Each category has a unique ID, display name, emoji icon,
 * hex color (light mode), and transaction type.
 *
 * Usage: import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES,
 *                  ALL_DEFAULT_CATEGORIES } from '@/constants/categories';
 */

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

/** Transaction type discriminator */
export type TransactionType = 'expense' | 'income';

/** Shape of a single category constant */
export interface CategoryDefinition {
  /** Unique slug used as a stable ID (matches DB seed) */
  readonly id: string;
  /** User-facing display name */
  readonly name: string;
  /** Emoji icon */
  readonly icon: string;
  /** Hex color (light mode reference — dark mode boosted via Colors) */
  readonly color: string;
  /** Whether this is an expense or income category */
  readonly type: TransactionType;
  /** Index into Colors.CATEGORY_COLORS array */
  readonly colorIndex: number;
}

// ---------------------------------------------------------------------------
//  Default Expense Categories (12)
// ---------------------------------------------------------------------------

export const DEFAULT_EXPENSE_CATEGORIES: readonly CategoryDefinition[] = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍔',
    color: '#FF6B6B',
    type: 'expense',
    colorIndex: 0,
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense',
    colorIndex: 1,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#45B7D1',
    type: 'expense',
    colorIndex: 2,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#96CEB4',
    type: 'expense',
    colorIndex: 3,
  },
  {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#FECA57',
    type: 'expense',
    colorIndex: 4,
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    color: '#FF9FF3',
    type: 'expense',
    colorIndex: 5,
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#54A0FF',
    type: 'expense',
    colorIndex: 6,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#5F27CD',
    type: 'expense',
    colorIndex: 7,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    color: '#01A3A4',
    type: 'expense',
    colorIndex: 8,
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '💅',
    color: '#F368E0',
    type: 'expense',
    colorIndex: 9,
  },
  {
    id: 'rent-housing',
    name: 'Rent / Housing',
    icon: '🏠',
    color: '#EE5A24',
    type: 'expense',
    colorIndex: 10,
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: '📈',
    color: '#6C5CE7',
    type: 'expense',
    colorIndex: 11,
  },
] as const;

// ---------------------------------------------------------------------------
//  Default Income Categories (6)
// ---------------------------------------------------------------------------

export const DEFAULT_INCOME_CATEGORIES: readonly CategoryDefinition[] = [
  {
    id: 'salary',
    name: 'Salary',
    icon: '💰',
    color: '#10B981',
    type: 'income',
    colorIndex: 0,
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: '#3B82F6',
    type: 'income',
    colorIndex: 1,
  },
  {
    id: 'investment-income',
    name: 'Investment Income',
    icon: '📊',
    color: '#8B5CF6',
    type: 'income',
    colorIndex: 2,
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: '🎁',
    color: '#EC4899',
    type: 'income',
    colorIndex: 3,
  },
  {
    id: 'refunds',
    name: 'Refunds',
    icon: '🔄',
    color: '#14B8A6',
    type: 'income',
    colorIndex: 4,
  },
  {
    id: 'other-income',
    name: 'Other',
    icon: '💵',
    color: '#F59E0B',
    type: 'income',
    colorIndex: 5,
  },
] as const;

// ---------------------------------------------------------------------------
//  Combined list
// ---------------------------------------------------------------------------

export const ALL_DEFAULT_CATEGORIES: readonly CategoryDefinition[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
] as const;

// ---------------------------------------------------------------------------
//  Payment Methods
// ---------------------------------------------------------------------------

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';

export interface PaymentMethodDefinition {
  readonly id: PaymentMethod;
  readonly name: string;
  readonly icon: string;
}

export const PAYMENT_METHODS: readonly PaymentMethodDefinition[] = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'card', name: 'Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'other', name: 'Other', icon: '💱' },
] as const;

// ---------------------------------------------------------------------------
//  Currency (India-first)
// ---------------------------------------------------------------------------

export const DEFAULT_CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN',
} as const;
