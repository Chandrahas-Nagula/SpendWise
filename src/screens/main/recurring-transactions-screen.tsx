import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../stores/auth-provider";
import { supabase } from "../../services/supabase/client";
import { SupabaseExpenseRepository } from "../../services/repositories/supabase-expense-repository";
import type { Expense } from "../../services/repositories/interfaces";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { Skeleton } from "../../components/ui/skeleton";
import { CategoryIcon } from "../../components/ui/category-icon";

// Helper to get ordinal suffix for a day
const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const RecurringTransactionsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { session } = useAuth();
  const userId = session?.user?.id ?? "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c";

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecurring = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await repo.getRecurringExpenses(userId);
      setTransactions(data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load recurring transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, repo]);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.TEXT_PRIMARY }]}>
            ←
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Recurring
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            YOUR MONTHLY BILLS
          </Text>
          <GlassmorphicCard style={styles.listCard}>
            {[1, 2, 3, 4].map((_, i) => (
              <View key={i} style={[styles.row, { opacity: 1 - i * 0.15 }]}>
                <Skeleton
                  width={48}
                  height={48}
                  borderRadius={24}
                  style={{ marginRight: SPACING.MD }}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <Skeleton width="50%" height={16} />
                  <Skeleton width="30%" height={14} />
                </View>
                <Skeleton width={60} height={20} />
              </View>
            ))}
          </GlassmorphicCard>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            YOUR MONTHLY BILLS
          </Text>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔄</Text>
              <Text
                style={[styles.emptyText, { color: colors.TEXT_SECONDARY }]}
              >
                No recurring transactions found. Mark an expense as 'Recurring'
                when adding it!
              </Text>
            </View>
          ) : (
            <GlassmorphicCard style={styles.listCard}>
              {transactions.map((item, i) => {
                const expense = item as any; // Cast for joined category
                const catName = expense.categories?.name || "Other";
                const catColor =
                  expense.categories?.color || colors.TEXT_PRIMARY;
                const catIcon = expense.categories?.icon || "💰";
                const displayName = expense.description || catName;
                const dayStr = item.date
                  ? getOrdinal(new Date(item.date).getDate())
                  : "1st";

                return (
                  <Animated.View
                    key={item.id}
                    entering={FadeInUp.delay(i * 60).duration(350)}
                  >
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.iconBox,
                          { backgroundColor: `${catColor}20` },
                        ]}
                      >
                        <CategoryIcon
                          icon={catIcon}
                          size={24}
                          style={styles.rowIcon as any}
                        />
                      </View>
                      <View style={styles.rowText}>
                        <Text
                          style={[
                            styles.rowName,
                            { color: colors.TEXT_PRIMARY },
                          ]}
                        >
                          {displayName}
                        </Text>
                        <Text
                          style={[
                            styles.rowMeta,
                            { color: colors.TEXT_TERTIARY },
                          ]}
                        >
                          Monthly • Due {dayStr}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.rowAmount,
                          {
                            color:
                              item.type === "income"
                                ? colors.SEMANTIC.SUCCESS
                                : colors.SEMANTIC.ERROR,
                          },
                        ]}
                      >
                        {item.type === "income" ? "+" : "-"}₹
                        {item.amount.toLocaleString("en-IN")}
                      </Text>
                    </View>
                    {i < transactions.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.DIVIDER },
                        ]}
                      />
                    )}
                  </Animated.View>
                );
              })}
            </GlassmorphicCard>
          )}

          <View
            style={[
              styles.comingSoon,
              {
                backgroundColor: isDark
                  ? "rgba(108,99,255,0.1)"
                  : "rgba(108,99,255,0.06)",
              },
            ]}
          >
            <Text style={styles.comingSoonIcon}>🚀</Text>
            <Text
              style={[styles.comingSoonText, { color: colors.TEXT_SECONDARY }]}
            >
              Auto-log for recurring bills is coming soon!
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
    letterSpacing: 1,
  },
  listCard: {
    borderRadius: RADIUS.LG,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MD,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  rowIcon: {
    fontSize: 24,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    marginBottom: 4,
  },
  rowMeta: {
    fontSize: FONT_SIZE.SM,
  },
  rowAmount: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 80, // Offset for icon
  },
  comingSoon: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.MD,
    borderRadius: RADIUS.MD,
    marginTop: SPACING.XL,
    gap: SPACING.SM,
  },
  comingSoonIcon: {
    fontSize: 24,
  },
  comingSoonText: {
    flex: 1,
    fontSize: FONT_SIZE.SM,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: SPACING.XL,
    marginTop: SPACING.XL,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: FONT_SIZE.MD,
    textAlign: "center",
    lineHeight: 24,
  },
});
