<div align="center">

# 💰 SpendWise

### A Production-Grade React Native Expense Tracker

**AI insights • Gamification • Real-time sync • 2024–2025 UI trends**

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=for-the-badge&logo=android&logoColor=white)](https://reactnative.dev)

</div>

---

## 📸 Screenshots

> Screenshots from the live app running on Android. The app supports both **light** and **dark themes** with glassmorphism effects throughout.

### 🔐 Authentication Flow

|   Onboarding   |     Login      |    Sign Up     |
| :------------: | :------------: | :------------: |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

### 🏠 Core Experience

|   Dashboard    |  Add Expense   |  Transactions  |
| :------------: | :------------: | :------------: |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

### 📊 Analytics & Insights

| Analytics (Pie Chart) | Analytics (Bar Chart) | Budget Overview |
| :-------------------: | :-------------------: | :-------------: |
|    _(screenshot)_     |    _(screenshot)_     | _(screenshot)_  |

### 🏆 Gamification & Profile

|  Achievements  |    Profile     |    Settings    |
| :------------: | :------------: | :------------: |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

### 🔧 Management Screens

|   Categories   | Recurring Transactions | Export Reports |
| :------------: | :--------------------: | :------------: |
| _(screenshot)_ |     _(screenshot)_     | _(screenshot)_ |

---

## ✨ Features

### 💳 Transaction Management

- Real-time expense & income tracking with category breakdown
- Bottom-sheet powered quick entry with amount validation
- Date picker, description, and receipt photo attachment
- Transaction editing and deletion with swipe gestures
- Advanced filtering (by date range, category, amount, type)
- Recurring transaction tracking

### 📊 Analytics & Budgeting

- Interactive **pie charts** for category-wise spending distribution
- **Bar charts** for monthly spending trends with comparisons
- Monthly and per-category **budget management** with progress bars
- Real-time budget utilization tracking with visual indicators
- CSV/JSON export functionality via native sharing

### 🏆 Gamification System

- **42 unlockable achievements** across 6 categories
- XP-based leveling system (Level 1 → 50)
- Daily login streaks with streak tracking
- Confetti celebrations on achievement unlocks
- Achievement categories: Saver, Tracker, Streaker, Budgeter, Explorer, Master

### 🎨 Premium UI/UX

- **Glassmorphism** cards with blur effects and transparency
- Fully themed **dark mode** (OLED-optimized blacks)
- Smooth micro-animations via React Native Reanimated
- Skeleton shimmer loading states
- Haptic feedback on key interactions
- Custom gradient FAB and animated bottom tabs

### 🔐 Security & Auth

- Email/password authentication via Supabase Auth
- JWT-based session management with auto-refresh
- Row-Level Security (RLS) — users can only access their own data
- Secure environment variable configuration

### 📱 Additional Features

- Custom category creation and management (with emoji + color picker)
- Receipt photo capture (camera) and gallery upload
- Profile editing with avatar support
- Notification preferences management
- Multi-device real-time sync via Supabase Realtime

---

## 🛠 Tech Stack

| Layer             | Technology                                           |
| :---------------- | :--------------------------------------------------- |
| **Framework**     | React Native 0.81 (Expo SDK 54)                      |
| **Language**      | TypeScript 5.9 (strict mode)                         |
| **Navigation**    | React Navigation 7.x (Native Stack + Bottom Tabs)    |
| **Animations**    | React Native Reanimated 4.x                          |
| **Charts**        | React Native Gifted Charts                           |
| **Gestures**      | React Native Gesture Handler 2.x                     |
| **Backend**       | Supabase (PostgreSQL + Auth + Realtime + Storage)    |
| **State**         | React Context + Custom Hooks (Repository Pattern)    |
| **Forms**         | React Hook Form + Zod validation                     |
| **UI Components** | Custom Glassmorphic Design System                    |
| **Storage**       | AsyncStorage (session) + Supabase Storage (receipts) |

---

## 🏗 Architecture

SpendWise follows a **clean vertical-slice architecture** with the **Repository Pattern** for data access. This ensures the UI layer is completely decoupled from the backend implementation.

### Design Principles

- **Repository Pattern** — All database operations go through typed repository interfaces. Swap Supabase for any backend without touching UI code.
- **Custom Hooks** — Business logic encapsulated in reusable hooks (`useTransactions`, `useBudgets`, `useDashboardData`, etc.)
- **Provider Pattern** — Auth state, theme, and sheet controllers managed via React Context providers
- **Type Safety** — End-to-end TypeScript with auto-generated Supabase database types

### Folder Structure

```
src/
├── app/                    # Expo Router entry point
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
│   ├── budget/             #   Budget cards & progress bars
│   ├── charts/             #   Chart wrappers (Pie, Bar)
│   ├── expense/            #   Add expense sheet, category picker, receipt
│   ├── gamification/       #   Achievement cards, XP indicators
│   ├── home/               #   Dashboard widgets (summary, greeting)
│   └── ui/                 #   Design system (glassmorphic card, skeleton, FAB)
├── constants/              # Design tokens, routes, colors, sizes
├── hooks/                  # Custom hooks (useTransactions, useBudgets, etc.)
├── navigation/             # Stack & tab navigator definitions
├── providers/              # Context providers (AddExpenseSheet)
├── screens/                # Screen components
│   ├── auth/               #   Login, Signup, Onboarding, Splash
│   ├── main/               #   Dashboard, Transactions, Analytics, Settings...
│   └── modals/             #   Filters, Receipt Scanner, Export
├── services/               # Data layer
│   ├── repositories/       #   Repository interfaces + Supabase implementations
│   └── supabase/           #   Supabase client configuration
├── stores/                 # Auth provider, theme store, gamification store
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions (formatting, date helpers)
```

---

## 🗄 Database Structure

SpendWise uses **Supabase (PostgreSQL)** with Row-Level Security enabled on all tables.

### Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────────┐
│     profiles     │       │     transactions     │
├─────────────────┤       ├──────────────────────┤
│ id (PK, FK auth)│──┐    │ id (PK, uuid)        │
│ full_name       │  │    │ user_id (FK profiles)│
│ avatar_url      │  ├───>│ amount               │
│ created_at      │  │    │ type (expense/income) │
│ updated_at      │  │    │ category_id           │
└─────────────────┘  │    │ category_name         │
                     │    │ description           │
                     │    │ receipt_url            │
                     │    │ is_recurring           │
                     │    │ date                   │
                     │    │ created_at             │
                     │    └──────────────────────┘
                     │
                     │    ┌──────────────────────┐
                     │    │      budgets          │
                     ├───>├──────────────────────┤
                     │    │ id (PK, uuid)        │
                     │    │ user_id (FK profiles)│
                     │    │ category_id           │
                     │    │ category_name         │
                     │    │ limit_amount          │
                     │    │ month (YYYY-MM)       │
                     │    │ created_at            │
                     │    └──────────────────────┘
                     │
                     │    ┌──────────────────────┐
                     │    │   user_categories     │
                     └───>├──────────────────────┤
                          │ id (PK, uuid)        │
                          │ user_id (FK profiles)│
                          │ name                  │
                          │ icon (emoji)          │
                          │ color (hex)           │
                          │ type (expense/income) │
                          │ created_at            │
                          └──────────────────────┘
```

### Security Model

- **Row-Level Security (RLS)** is enabled on all tables
- Each policy restricts CRUD operations to `auth.uid() = user_id`
- Users can **only** read, create, update, and delete their own data
- The `profiles` table auto-populates on signup via a database trigger

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Android Studio with an emulator **OR** a physical device with [Expo Go](https://expo.dev/client)
- A [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Chandrahas-Nagula/SpendWise.git
cd SpendWise

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example .env
# Open .env and fill in your Supabase project URL and anon key

# 4. Start the development server
npx expo start

# 5. Run on Android (requires emulator or connected device)
npx expo run:android
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations to create the required tables (see Database Structure above)
3. Enable **Row-Level Security** on all tables
4. Copy your **Project URL** and **Anon Key** from Settings → API
5. Paste them into your `.env` file

---

## 📁 Key Files

| File                                | Purpose                            |
| :---------------------------------- | :--------------------------------- |
| `src/services/supabase/client.ts`   | Supabase client initialization     |
| `src/services/repositories/`        | Repository pattern implementations |
| `src/stores/auth-provider.tsx`      | Authentication state management    |
| `src/stores/gamification-store.ts`  | XP, levels, achievements engine    |
| `src/navigation/root-navigator.tsx` | App navigation structure           |
| `src/constants/colors.ts`           | Design system color tokens         |
| `src/constants/sizes.ts`            | Spacing, typography, radius tokens |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Chandrahas Nagula](https://github.com/Chandrahas-Nagula)**

</div>
