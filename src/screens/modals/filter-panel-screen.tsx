/**
 * FilterPanelScreen — Full-screen filter overlay for transactions
 *
 * Filters: Transaction type (Expense/Income/All), Category, Date range.
 * Results are passed back via navigation params.
 */

import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { useCategories } from "../../hooks/use-categories";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";

// ── Types ───────────────────────────────────────────────────────────────────

type FilterType = "all" | "expense" | "income";

export interface FilterState {
  type: FilterType;
  categoryId: string | null;
  startDate: string | null;
  endDate: string | null;
}

// ── Quick Date Presets ──────────────────────────────────────────────────────

const DATE_PRESETS = [
  { key: "all", label: "All Time", icon: "📅" },
  { key: "today", label: "Today", icon: "🕐" },
  { key: "week", label: "This Week", icon: "📆" },
  { key: "month", label: "This Month", icon: "🗓️" },
  { key: "3months", label: "Last 3 Months", icon: "📋" },
  { key: "year", label: "This Year", icon: "🎯" },
] as const;

function getDateRange(preset: string): {
  start: string | null;
  end: string | null;
} {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      return { start: fmt(now), end: fmt(now) };
    case "week": {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return { start: fmt(start), end: fmt(now) };
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: fmt(start), end: fmt(now) };
    }
    case "3months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return { start: fmt(start), end: fmt(now) };
    }
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start: fmt(start), end: fmt(now) };
    }
    default:
      return { start: null, end: null };
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export const FilterPanelScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<
    RouteProp<
      {
        FilterPanel: {
          onApply?: (f: FilterState) => void;
          current?: FilterState;
        };
      },
      "FilterPanel"
    >
  >();
  const onApply = (route.params as any)?.onApply;
  const current = (route.params as any)?.current as FilterState | undefined;

  const [selectedType, setSelectedType] = useState<FilterType>(
    current?.type ?? "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    current?.categoryId ?? null,
  );
  const [selectedPreset, setSelectedPreset] = useState("all");

  // Category chips based on selected type
  const { expenseCategories, incomeCategories } = useCategories();

  const currentCategories = useMemo(() => {
    if (selectedType === "all")
      return [...expenseCategories, ...incomeCategories];
    if (selectedType === "expense") return expenseCategories;
    return incomeCategories;
  }, [selectedType, expenseCategories, incomeCategories]);

  const handleApply = useCallback(() => {
    const dateRange = getDateRange(selectedPreset);
    const filters: FilterState = {
      type: selectedType,
      categoryId: selectedCategory,
      startDate: dateRange.start,
      endDate: dateRange.end,
    };
    if (onApply) {
      onApply(filters);
    }
    navigation.goBack();
  }, [selectedType, selectedCategory, selectedPreset, onApply, navigation]);

  const handleReset = useCallback(() => {
    setSelectedType("all");
    setSelectedCategory(null);
    setSelectedPreset("all");
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.TEXT_PRIMARY }]}>
            ←
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Filter Transactions
        </Text>
        <Pressable onPress={handleReset}>
          <Text style={[styles.resetText, { color: BRAND.PRIMARY_START }]}>
            Reset
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Type Filter ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(0).duration(300)}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
            Transaction Type
          </Text>
          <View style={styles.typeRow}>
            {(["all", "expense", "income"] as FilterType[]).map((t) => {
              const isActive = selectedType === t;
              const label =
                t === "all"
                  ? "All"
                  : t === "expense"
                    ? "💸 Expense"
                    : "💵 Income";
              return (
                <Pressable
                  key={t}
                  onPress={() => setSelectedType(t)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isActive
                        ? BRAND.PRIMARY_START
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      borderColor: isActive
                        ? BRAND.PRIMARY_START
                        : colors.BORDER,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: isActive ? "#FFF" : colors.TEXT_PRIMARY },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Date Presets ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(100).duration(300)}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
            Date Range
          </Text>
          <View style={styles.presetGrid}>
            {DATE_PRESETS.map((preset) => {
              const isActive = selectedPreset === preset.key;
              return (
                <Pressable
                  key={preset.key}
                  onPress={() => setSelectedPreset(preset.key)}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isActive
                        ? BRAND.PRIMARY_START
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      borderColor: isActive
                        ? BRAND.PRIMARY_START
                        : colors.BORDER,
                    },
                  ]}
                >
                  <Text style={styles.presetIcon}>{preset.icon}</Text>
                  <Text
                    style={[
                      styles.presetLabel,
                      { color: isActive ? "#FFF" : colors.TEXT_PRIMARY },
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Category Filter ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(200).duration(300)}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT_SECONDARY }]}>
            Category
          </Text>
          <View style={styles.categoryGrid}>
            {/* All categories chip */}
            <Pressable
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === null
                      ? BRAND.PRIMARY_START
                      : isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                  borderColor:
                    selectedCategory === null
                      ? BRAND.PRIMARY_START
                      : colors.BORDER,
                },
              ]}
            >
              <Text style={styles.categoryIcon}>🌐</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color:
                      selectedCategory === null ? "#FFF" : colors.TEXT_PRIMARY,
                  },
                ]}
              >
                All
              </Text>
            </Pressable>

            {currentCategories.map((cat: any) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive
                        ? `${cat.color}30`
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      borderColor: isActive ? cat.color : colors.BORDER,
                    },
                  ]}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: isActive ? cat.color : colors.TEXT_PRIMARY },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Apply Button ────────────────────────────────────────────────── */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.BORDER,
            backgroundColor: isDark
              ? "rgba(0,0,0,0.8)"
              : "rgba(255,255,255,0.9)",
          },
        ]}
      >
        <Pressable
          onPress={handleApply}
          style={({ pressed }) => [
            styles.applyBtnWrapper,
            pressed && { opacity: 0.8 },
          ]}
        >
          <LinearGradient
            colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
            style={styles.applyBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  backIcon: { fontSize: 24, fontWeight: "bold" },
  title: { fontSize: FONT_SIZE.LG, fontWeight: FONT_WEIGHT.BOLD },
  resetText: { fontSize: FONT_SIZE.SM, fontWeight: FONT_WEIGHT.SEMIBOLD },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
    gap: SPACING.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.SM,
  },
  typeRow: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  typeChip: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    alignItems: "center",
  },
  typeChipText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  presetChip: {
    width: "31%",
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    alignItems: "center",
    gap: SPACING.XXXS,
  },
  presetIcon: { fontSize: 20 },
  presetLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.FULL,
    borderWidth: 1,
    gap: SPACING.XS,
  },
  categoryIcon: { fontSize: 16 },
  categoryLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  footer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  applyBtnWrapper: { borderRadius: RADIUS.MD, overflow: "hidden" },
  applyBtnGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
