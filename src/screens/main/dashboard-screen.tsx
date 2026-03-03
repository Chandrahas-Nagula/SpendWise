/**
 * DashboardScreen — Home Screen (Slice 1 UI Phase)
 *
 * 9-section ScrollView dashboard with mock data:
 * 1. Header bar (greeting + settings)
 * 2. Hero budget card (glassmorphic)
 * 3. Quick actions (3 pill buttons)
 * 4. AI insight card (dismissible)
 * 5. Spending by category (top 4)
 * 6. Income vs Expense bar chart
 * 7. Recent transactions (5 cards)
 * 8. Gamification strip
 * 9. Bottom padding
 *
 * + Mesh gradient background + FAB
 * + Staggered entrance animations via Reanimated
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAddExpenseSheet } from "../../providers/add-expense-provider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../hooks/use-theme";
import {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LAYOUT,
  TOUCH_TARGET,
  ANIMATION,
} from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { Navigators, Routes } from "../../constants/routes";
import {
  getTimeGreeting,
  getFormattedDate,
  formatINR,
} from "../../utils/greeting";

// ── Data ──────────────────────────────────────────────────────────────────
import { useDashboardData } from "../../hooks/use-dashboard-data";

// ── Components ────────────────────────────────────────────────────────────
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { BudgetProgressBar } from "../../components/budget/budget-progress-bar";
import {
  TransactionCard,
  type Transaction,
} from "../../components/expense/transaction-card";
import { AiInsightCard } from "../../components/home/ai-insight-card";
import { CategorySpendingRow } from "../../components/home/category-spending-row";
import { GamificationStrip } from "../../components/home/gamification-strip";

// ── Mock Data (AI not wired yet) ────────────────────────────────────────────
import { MOCK_AI_INSIGHTS } from "../../services/mock/mock-data";

// ── Real achievements data ──────────────────────────────────────────────────
import { useAchievements } from "../../hooks/use-achievements";

// ---------------------------------------------------------------------------
//  Animated Section Wrapper
// ---------------------------------------------------------------------------

interface AnimatedSectionProps {
  delay: number;
  duration?: number;
  children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  delay,
  duration = 400,
  children,
}) => (
  <Animated.View
    entering={FadeInUp.delay(delay).duration(duration).damping(20).springify()}
    style={styles.animatedSection}
  >
    {children}
  </Animated.View>
);

// ---------------------------------------------------------------------------
//  Pressable Quick Action Button
// ---------------------------------------------------------------------------

interface QuickActionProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QuickActionButton: React.FC<QuickActionProps> = ({
  icon,
  label,
  onPress,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(ANIMATION.PRESS_SCALE, ANIMATION.SPRING_PRESS);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, ANIMATION.SPRING_PRESS);
  }, [scale]);

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.quickAction,
        { backgroundColor: colors.SURFACE_1, borderColor: colors.BORDER },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
        <Text
          style={[styles.quickActionLabel, { color: colors.TEXT_PRIMARY }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

// ---------------------------------------------------------------------------
//  FAB (Floating Action Button)
// ---------------------------------------------------------------------------

const FAB: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, ANIMATION.SPRING_PRESS);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, ANIMATION.SPRING_PRESS);
  }, [scale]);

  return (
    <Animated.View
      entering={FadeIn.delay(1000).duration(400).springify()}
      style={styles.fabWrapper}
    >
      <AnimatedPressable
        style={[animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityLabel="Add new expense"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={["#3B82F6", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
//  Section Header (title + View All link)
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
        {title}
      </Text>
      {onViewAll && (
        <Pressable
          onPress={onViewAll}
          accessibilityLabel={`View all ${title}`}
          accessibilityRole="button"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={[styles.viewAllText, { color: BRAND.PRIMARY_START }]}>
            View All →
          </Text>
        </Pressable>
      )}
    </View>
  );
};

// ===========================================================================
//  MAIN DASHBOARD SCREEN
// ===========================================================================

function getNiceScale(value: number, sections: number) {
  if (value <= 0) return { max: 100, step: 25 };
  const targetMax = value * 1.05; // 5% headroom
  const rawStep = targetMax / sections;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normStep = rawStep / mag;

  let niceStep;
  if (normStep <= 1) niceStep = 1;
  else if (normStep <= 2) niceStep = 2;
  else if (normStep <= 2.5) niceStep = 2.5;
  else if (normStep <= 5) niceStep = 5;
  else niceStep = 10;

  const step = niceStep * mag;
  return { max: step * sections, step };
}

export const DashboardScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { open: openAddExpense } = useAddExpenseSheet();

  // ── Live Data from Supabase ─────────────────────────────────────────
  const {
    summary,
    categorySpending,
    recentTransactions,
    userName,
    streak: actualStreak,
    isLoading,
    error,
    refresh,
  } = useDashboardData();

  const totalIncome = summary?.total_income ?? 0;
  const totalSpent = summary?.total_spent ?? 0;
  const savings = summary?.savings ?? 0;
  const savingsPct = summary?.savings_percentage ?? 0;

  // Budget percentage (how much of income is spent)
  const budgetPct =
    totalIncome > 0 ? Math.round((totalSpent / totalIncome) * 100) : 0;

  const topCategories = categorySpending.slice(0, 4);
  const recentTxns = recentTransactions.slice(0, 5);

  // ── Real achievements data ──────────────────────────────────────────
  const { unlockedCount: achieveUnlocked, totalCount: achieveTotal } =
    useAchievements();

  // Compute streak from achievements hook stats + real backend streak
  const gamificationData = useMemo(() => {
    return {
      streak: actualStreak,
      unlockedCount: achieveUnlocked,
      totalCount: achieveTotal,
    };
  }, [achieveUnlocked, achieveTotal, actualStreak]);

  // ── Chart data ──────────────────────────────────────────────────────
  const { max: chartMax, step: chartStep } = getNiceScale(
    Math.max(totalIncome, totalSpent),
    4,
  );

  const chartData = useMemo(
    () => [
      {
        value: totalIncome,
        label: "Income",
        frontColor: colors.SEMANTIC.SUCCESS,
        topLabelComponent: () => (
          <Text
            style={[styles.chartTopLabel, { color: colors.SEMANTIC.SUCCESS }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatINR(Math.round(totalIncome))}
          </Text>
        ),
      },
      {
        value: totalSpent,
        label: "Expenses",
        frontColor: colors.SEMANTIC.ERROR,
        topLabelComponent: () => (
          <Text
            style={[styles.chartTopLabel, { color: colors.SEMANTIC.ERROR }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatINR(Math.round(totalSpent))}
          </Text>
        ),
      },
    ],
    [totalIncome, totalSpent, colors],
  );

  // ── Handlers (placeholders — no nav yet) ────────────────────────────
  const handleAddExpense = useCallback(() => {
    openAddExpense();
  }, [openAddExpense]);

  const navigation = useNavigation<NavigationProp<any>>();

  const handleAnalytics = useCallback(() => {
    navigation.navigate(Navigators.ANALYTICS_STACK, {
      screen: Routes.ANALYTICS,
    });
  }, [navigation]);

  const handleBudgets = useCallback(() => {
    navigation.navigate(Navigators.HOME_STACK, {
      screen: Routes.BUDGET_DETAIL,
    });
  }, [navigation]);

  const handleViewAllCategories = useCallback(() => {
    navigation.navigate(Navigators.ANALYTICS_STACK, {
      screen: Routes.ANALYTICS,
    });
  }, [navigation]);

  const handleViewAllTransactions = useCallback(() => {
    navigation.navigate(Navigators.TRANSACTIONS_STACK, {
      screen: Routes.TRANSACTIONS_LIST,
    });
  }, [navigation]);

  const handleAchievements = useCallback(() => {
    navigation.navigate(Navigators.PROFILE_STACK, {
      screen: Routes.ACHIEVEMENTS,
    });
  }, [navigation]);

  const handleTransactionPress = useCallback(
    (txn: Transaction) => {
      navigation.navigate(Routes.TRANSACTION_DETAIL as any, {
        transactionId: txn.id,
      });
    },
    [navigation],
  );

  // ── Background ──────────────────────────────────────────────────────
  const bgBase = isDark ? "#000000" : "#F0F4FF";

  return (
    <View style={[styles.root, { backgroundColor: bgBase }]}>
      {/* ── Mesh gradient background (radial accents) ───────────────── */}
      <View style={styles.meshGradientContainer} pointerEvents="none">
        <View
          style={[
            styles.meshBlobTopRight,
            {
              backgroundColor: isDark
                ? "rgba(59, 130, 246, 0.08)"
                : "rgba(59, 130, 246, 0.06)",
            },
          ]}
        />
        <View
          style={[
            styles.meshBlobBottomLeft,
            {
              backgroundColor: isDark
                ? "rgba(168, 85, 247, 0.07)"
                : "rgba(168, 85, 247, 0.05)",
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — TOP HEADER BAR
        ═══════════════════════════════════════════════════════════════ */}
        <Animated.View
          entering={FadeIn.delay(0).duration(400)}
          style={{ marginBottom: SPACING.LG }}
        >
          <View style={styles.headerBar}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.greeting, { color: colors.TEXT_PRIMARY }]}>
                {getTimeGreeting(userName)}
              </Text>
              <Text style={[styles.dateText, { color: colors.TEXT_SECONDARY }]}>
                {getFormattedDate()}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate(Navigators.PROFILE_STACK, {
                  screen: Routes.SETTINGS,
                })
              }
              style={[
                styles.settingsButton,
                { backgroundColor: colors.SURFACE_1 },
              ]}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — HERO BUDGET CARD
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={100} duration={500}>
          <GlassmorphicCard style={styles.heroCard}>
            <Text style={[styles.heroLabel, { color: colors.TEXT_TERTIARY }]}>
              Monthly Budget
            </Text>
            <View style={styles.heroAmountRow}>
              <Text style={[styles.heroAmount, { color: colors.TEXT_PRIMARY }]}>
                {formatINR(totalSpent)}
              </Text>
              <Text
                style={[
                  styles.heroAmountTotal,
                  { color: colors.TEXT_TERTIARY },
                ]}
              >
                {" "}
                / {formatINR(totalIncome)}
              </Text>
            </View>

            {/* Animated progress bar */}
            <View style={styles.heroProgressContainer}>
              <BudgetProgressBar
                percentage={budgetPct}
                delay={300}
                height={10}
              />
            </View>

            <Text
              style={[styles.heroSubtext, { color: colors.TEXT_SECONDARY }]}
            >
              {formatINR(savings)} saved ({savingsPct}%)
            </Text>

            {/* Income vs Expense row */}
            <View style={styles.heroBottomRow}>
              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatArrow,
                    { color: colors.SEMANTIC.SUCCESS },
                  ]}
                >
                  ↑
                </Text>
                <View>
                  <Text
                    style={[
                      styles.heroStatLabel,
                      { color: colors.TEXT_TERTIARY },
                    ]}
                  >
                    Income
                  </Text>
                  <Text
                    style={[
                      styles.heroStatValue,
                      { color: colors.SEMANTIC.SUCCESS },
                    ]}
                  >
                    {formatINR(totalIncome)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.heroDivider,
                  { backgroundColor: colors.DIVIDER },
                ]}
              />

              <View style={styles.heroStatItem}>
                <Text
                  style={[
                    styles.heroStatArrow,
                    { color: colors.SEMANTIC.ERROR },
                  ]}
                >
                  ↓
                </Text>
                <View>
                  <Text
                    style={[
                      styles.heroStatLabel,
                      { color: colors.TEXT_TERTIARY },
                    ]}
                  >
                    Expenses
                  </Text>
                  <Text
                    style={[
                      styles.heroStatValue,
                      { color: colors.SEMANTIC.ERROR },
                    ]}
                  >
                    {formatINR(totalSpent)}
                  </Text>
                </View>
              </View>
            </View>
          </GlassmorphicCard>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — QUICK ACTIONS
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={200} duration={400}>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              icon="💸"
              label="Add Expense"
              onPress={handleAddExpense}
            />
            <QuickActionButton
              icon="📊"
              label="Analytics"
              onPress={handleAnalytics}
            />
            <QuickActionButton
              icon="🎯"
              label="Budgets"
              onPress={handleBudgets}
            />
          </View>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — AI INSIGHT CARD
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={300} duration={400}>
          <AiInsightCard insights={MOCK_AI_INSIGHTS} />
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — SPENDING BY CATEGORY
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={400} duration={400}>
          <SectionHeader
            title="This Month"
            onViewAll={handleViewAllCategories}
          />
          {topCategories.map((cat, index) => (
            <CategorySpendingRow
              key={cat.category_id}
              name={cat.name}
              icon={cat.icon}
              color={cat.color}
              spent={cat.spent}
              percentage={
                totalSpent > 0 ? Math.round((cat.spent / totalSpent) * 100) : 0
              }
              animDelay={400 + index * 80}
            />
          ))}
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — INCOME vs EXPENSE MINI CHART
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={600} duration={600}>
          <SectionHeader title="Income vs Expenses" />
          <View
            style={[
              styles.chartContainer,
              { backgroundColor: colors.SURFACE_1 },
            ]}
          >
            <BarChart
              data={chartData}
              maxValue={chartMax}
              stepValue={chartStep}
              barWidth={40}
              spacing={50}
              initialSpacing={40}
              endSpacing={40}
              roundedTop
              noOfSections={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              yAxisTextStyle={{
                color: colors.TEXT_TERTIARY,
                fontSize: FONT_SIZE.XS,
              }}
              xAxisLabelTextStyle={{
                color: colors.TEXT_SECONDARY,
                fontSize: FONT_SIZE.XS,
                fontWeight: FONT_WEIGHT.MEDIUM,
              }}
              isAnimated={Platform.OS === "ios"}
              animationDuration={800}
              height={180}
              barBorderRadius={8}
              frontColor={colors.BORDER}
              disablePress
              width={240}
            />
          </View>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7 — RECENT TRANSACTIONS
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={700} duration={400}>
          <SectionHeader
            title="Recent Transactions"
            onViewAll={handleViewAllTransactions}
          />
          <View
            style={[
              styles.transactionsContainer,
              { backgroundColor: colors.SURFACE_1 },
            ]}
          >
            {recentTxns.map((txn, index) => (
              <React.Fragment key={txn.id}>
                <Animated.View
                  entering={FadeIn.delay(700 + index * 60).duration(300)}
                >
                  <TransactionCard
                    transaction={txn}
                    onPress={handleTransactionPress}
                  />
                </Animated.View>
                {index < recentTxns.length - 1 && (
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: colors.DIVIDER },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 8 — GAMIFICATION STRIP
        ═══════════════════════════════════════════════════════════════ */}
        <AnimatedSection delay={900} duration={400}>
          <GamificationStrip
            data={gamificationData}
            onPress={handleAchievements}
          />
        </AnimatedSection>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 9 — BOTTOM PADDING (above floating tab bar)
        ═══════════════════════════════════════════════════════════════ */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* ── FAB ──────────────────────────────────────────────────────── */}
      <FAB onPress={handleAddExpense} />
    </View>
  );
};

// ===========================================================================
//  STYLES
// ===========================================================================

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Mesh Gradient Background ─────────────────────────────────────────
  meshGradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  meshBlobTopRight: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  meshBlobBottomLeft: {
    position: "absolute",
    bottom: -60,
    left: -80,
    width: 350,
    height: 350,
    borderRadius: 175,
  },

  // ── Scroll ───────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: LAYOUT.SCREEN_PADDING_H,
    paddingTop: Platform.OS === "web" ? SPACING.XXL : 60,
    paddingBottom: 120,
  },

  // ── Section 1: Header ────────────────────────────────────────────────
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextGroup: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XXXS,
  },
  dateText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.REGULAR,
  },
  settingsButton: {
    width: TOUCH_TARGET.MIN,
    height: TOUCH_TARGET.MIN,
    borderRadius: RADIUS.MD,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsIcon: {
    fontSize: FONT_SIZE.XL,
  },

  // ── Section 2: Hero Budget Card ──────────────────────────────────────
  heroCard: {
    // override padding from GlassmorphicCard
  },
  heroLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.XS,
  },
  heroAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: SPACING.SM,
  },
  heroAmount: {
    fontSize: FONT_SIZE.HERO,
    fontWeight: FONT_WEIGHT.EXTRABOLD,
  },
  heroAmountTotal: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  heroProgressContainer: {
    marginBottom: SPACING.SM,
  },
  heroSubtext: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.MD,
  },
  heroBottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  heroStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.XS,
  },
  heroStatArrow: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  heroStatLabel: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  heroStatValue: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  heroDivider: {
    width: 1,
    height: 36,
  },

  // ── Section 3: Quick Actions ─────────────────────────────────────────
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.SM,
  },
  quickAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.XS,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    borderWidth: 1,
    minHeight: TOUCH_TARGET.MIN,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.XS,
  },
  quickActionIcon: {
    fontSize: FONT_SIZE.MD,
  },
  quickActionLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textAlign: "center",
  },

  // ── Section headers ──────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  viewAllText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },

  // ── Section 6: Chart ─────────────────────────────────────────────────
  chartContainer: {
    borderRadius: RADIUS.LG,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
    alignItems: "center",
    minHeight: 250,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTopLabel: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XXXS,
    width: 60,
    textAlign: "center",
    marginLeft: -5,
  },

  // ── Section 7: Transactions ──────────────────────────────────────────
  transactionsContainer: {
    borderRadius: RADIUS.LG,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  separator: {
    height: 1,
    marginHorizontal: SPACING.XXXS,
  },

  // ── Section 9: Bottom Padding ────────────────────────────────────────
  bottomPadding: {
    height: 100,
  },

  // ── AnimatedSection margin ──────────────────────────────────────────
  animatedSection: {
    marginBottom: SPACING.LG,
  },

  // ── FAB ──────────────────────────────────────────────────────────────
  fabWrapper: {
    position: "absolute",
    bottom: LAYOUT.FAB_BOTTOM_OFFSET,
    right: LAYOUT.FAB_RIGHT_OFFSET,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.BOLD,
    color: "#FFFFFF",
    marginTop: -2,
  },
});
