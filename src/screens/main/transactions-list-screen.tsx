/**
 * TransactionsListScreen — Full paginated transaction history.
 *
 * FlatList with:
 *  - Pull-to-refresh
 *  - Infinite scroll
 *  - TransactionCard rows
 *  - FAB to add new expense
 *  - Empty state illustration
 *  - Header with month summary chips
 */

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../../hooks/use-theme";
import { useTransactions } from "../../hooks/use-transactions";
import { useAddExpenseSheet } from "../../providers/add-expense-provider";
import {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LAYOUT,
} from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { Routes } from "../../constants/routes";
import { formatINR } from "../../utils/greeting";
import {
  TransactionCard,
  type Transaction,
} from "../../components/expense/transaction-card";
import { Skeleton } from "../../components/ui/skeleton";
import type { FilterState } from "../modals/filter-panel-screen";

// ── FAB (same as dashboard) ──────────────────────────────────────────────

const FAB: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <Pressable
    style={styles.fab}
    onPress={onPress}
    accessibilityLabel="Add Transaction"
    accessibilityRole="button"
  >
    <Text style={styles.fabIcon}>+</Text>
  </Pressable>
);

// ── Empty State ──────────────────────────────────────────────────────────

const EmptyState: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>
        No transactions yet
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.TEXT_TERTIARY }]}>
        Tap the + button to add your first expense or income
      </Text>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────────────────────────

export const TransactionsListScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { open: openAddExpense } = useAddExpenseSheet();
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    categoryId: null,
    startDate: null,
    endDate: null,
  });

  const {
    transactions,
    isLoading,
    isRefreshing,
    fetchMore,
    refresh,
    hasMore,
    error,
  } = useTransactions(
    useMemo(
      () => ({
        type: filters.type === "all" ? undefined : filters.type,
        categoryId: filters.categoryId ?? undefined,
        startDate: filters.startDate ?? undefined,
        endDate: filters.endDate ?? undefined,
      }),
      [filters.type, filters.categoryId, filters.startDate, filters.endDate],
    ),
  );

  const navigation = useNavigation();

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.categoryId !== null ||
    filters.startDate !== null;

  const handleOpenFilters = useCallback(() => {
    (navigation as any).navigate(Routes.FILTER_PANEL, {
      current: filters,
      onApply: (f: FilterState) => setFilters(f),
    });
  }, [navigation, filters]);

  const handleTransactionPress = useCallback(
    (txn: Transaction) => {
      (navigation as any).navigate(Routes.TRANSACTION_DETAIL, {
        transactionId: txn.id,
      });
    },
    [navigation],
  );

  // ── Computed totals ──────────────────────────────────────────────────
  const { totalIncome, totalExpenses } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const txn of transactions) {
      if (txn.type === "income") {
        inc += Number(txn.amount);
      } else {
        exp += Number(txn.amount);
      }
    }
    return { totalIncome: inc, totalExpenses: exp };
  }, [transactions]);

  const renderItem = useCallback(
    ({ item, index }: { item: Transaction; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 40).duration(250)}>
        <TransactionCard transaction={item} onPress={handleTransactionPress} />
      </Animated.View>
    ),
    [handleTransactionPress],
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.TEXT_TERTIARY} size="small" />
      </View>
    );
  }, [hasMore, colors]);

  const renderSeparator = useCallback(
    () => (
      <View style={[styles.separator, { backgroundColor: colors.DIVIDER }]} />
    ),
    [colors],
  );

  if (isLoading && transactions.length === 0) {
    return (
      <View
        style={[styles.root, { backgroundColor: isDark ? "#000" : "#F0F4FF" }]}
      >
        <View style={[styles.headerContainer, { paddingTop: 60 }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.screenTitle, { color: colors.TEXT_PRIMARY }]}>
              Transactions
            </Text>
          </View>
        </View>
        <View style={styles.listContent}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: SPACING.MD,
                  paddingHorizontal: SPACING.MD,
                }}
              >
                <Skeleton
                  width={48}
                  height={48}
                  borderRadius={24}
                  style={{ marginRight: SPACING.MD }}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <Skeleton width="60%" height={16} />
                  <Skeleton width="40%" height={14} />
                </View>
                <Skeleton width={80} height={20} />
              </View>
            ))}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.root, { backgroundColor: isDark ? "#000" : "#F0F4FF" }]}
    >
      {/* ── Header Summary ────────────────────────────────────────── */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitle, { color: colors.TEXT_PRIMARY }]}>
            Transactions
          </Text>
          <Pressable
            onPress={handleOpenFilters}
            style={[
              styles.filterBtn,
              {
                backgroundColor: hasActiveFilters
                  ? BRAND.PRIMARY_START
                  : isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Text
              style={[
                styles.filterBtnText,
                { color: hasActiveFilters ? "#FFF" : colors.TEXT_PRIMARY },
              ]}
            >
              🔍 {hasActiveFilters ? "Filtered" : "Filter"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.chipRow}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor: isDark
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(16,185,129,0.08)",
              },
            ]}
          >
            <Text
              style={[styles.chipLabel, { color: colors.SEMANTIC.SUCCESS }]}
            >
              ↑ {formatINR(totalIncome)}
            </Text>
          </View>
          <View
            style={[
              styles.chip,
              {
                backgroundColor: isDark
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(239,68,68,0.08)",
              },
            ]}
          >
            <Text style={[styles.chipLabel, { color: colors.SEMANTIC.ERROR }]}>
              ↓ {formatINR(totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Error Banner ──────────────────────────────────────────── */}
      {error ? (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: isDark
                ? "rgba(239,68,68,0.15)"
                : "rgba(239,68,68,0.08)",
            },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.SEMANTIC.ERROR }]}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* ── Transactions List ─────────────────────────────────────── */}
      <FlatList
        data={transactions as Transaction[]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          transactions.length === 0 && styles.listEmpty,
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={BRAND.PRIMARY_START}
            colors={[BRAND.PRIMARY_START]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB ───────────────────────────────────────────────────── */}
      <FAB onPress={openAddExpense} />
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.MD,
  },
  loadingText: {
    fontSize: FONT_SIZE.SM,
  },
  headerContainer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG + 44, // safe area offset
    paddingBottom: SPACING.MD,
  },
  screenTitle: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.SM,
  },
  filterBtn: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.FULL,
  },
  filterBtnText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  chipRow: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  chip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.FULL,
  },
  chipLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  errorBanner: {
    padding: SPACING.SM,
    marginHorizontal: SPACING.LG,
    borderRadius: RADIUS.MD,
    marginBottom: SPACING.SM,
  },
  errorText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  listContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
    justifyContent: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 44 + SPACING.SM, // Past icon
  },
  footerLoader: {
    paddingVertical: SPACING.LG,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: SPACING.XXL,
    gap: SPACING.SM,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.SM,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.SM,
    textAlign: "center",
    maxWidth: 260,
  },
  fab: {
    position: "absolute",
    right: SPACING.LG,
    bottom: SPACING.XXL + 60,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAND.PRIMARY_START,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: BRAND.PRIMARY_START,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 30,
  },
});
