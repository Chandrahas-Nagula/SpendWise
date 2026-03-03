import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useTheme } from "../../hooks/use-theme";
import { useBudgets } from "../../hooks/use-budgets";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { BudgetProgressBar } from "../../components/budget/budget-progress-bar";
import { CategoryIcon } from "../../components/ui/category-icon";
import { formatINR } from "../../utils/greeting";
import { Routes, Navigators } from "../../constants/routes";
import { MainTabsParamList } from "../../types/navigation";

export const BudgetDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { budgets, progress, isLoading, error } = useBudgets();

  const handleEditBudgets = () => {
    // Navigate to BudgetSetup inside ProfileStack
    navigation.navigate(Navigators.PROFILE_STACK, {
      screen: Routes.BUDGET_SETUP,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BRAND.PRIMARY_START} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.SEMANTIC.ERROR }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (budgets.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyIcon]}>🎯</Text>
          <Text style={[styles.emptyTitle, { color: colors.TEXT_PRIMARY }]}>
            No Budgets Set
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.TEXT_SECONDARY }]}>
            Create category limits to keep your spending on track.
          </Text>
          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: BRAND.PRIMARY_START },
            ]}
            onPress={handleEditBudgets}
          >
            <Text style={styles.primaryButtonText}>Set Budgets</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {budgets.map((budget, index) => {
          const cat = budget.categories;
          const spent = progress[budget.category_id] || 0;
          const limit = budget.amount;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;

          // Determine status text/color based on percentage
          let statusText = "On Track";
          let statusColor = colors.SEMANTIC.SUCCESS;

          if (percentage >= 100) {
            statusText = "Exceeded";
            statusColor = colors.SEMANTIC.ERROR;
          } else if (percentage >= 80) {
            statusText = "Warning";
            statusColor = colors.SEMANTIC.WARNING;
          }

          return (
            <GlassmorphicCard key={budget.id} style={styles.budgetCard}>
              <View style={styles.cardHeader}>
                <View style={styles.catInfo}>
                  <CategoryIcon
                    icon={cat?.icon}
                    size={24}
                    style={styles.catIcon as any}
                  />
                  <Text
                    style={[styles.catName, { color: colors.TEXT_PRIMARY }]}
                  >
                    {cat?.name || "Unknown"}
                  </Text>
                </View>
                <Text style={[styles.statusBadge, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>

              <View style={styles.amountsRow}>
                <View>
                  <Text
                    style={[styles.spentText, { color: colors.TEXT_PRIMARY }]}
                  >
                    {formatINR(spent)}
                  </Text>
                  <Text
                    style={[styles.limitText, { color: colors.TEXT_TERTIARY }]}
                  >
                    of {formatINR(limit)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.percentageText,
                    { color: colors.TEXT_PRIMARY },
                  ]}
                >
                  {Math.round(percentage)}%
                </Text>
              </View>

              <BudgetProgressBar
                percentage={percentage}
                delay={index * 100}
                height={8}
              />
            </GlassmorphicCard>
          );
        })}

        <Pressable
          style={[styles.outlineButton, { borderColor: colors.BORDER }]}
          onPress={handleEditBudgets}
        >
          <Text
            style={[styles.outlineButtonText, { color: colors.TEXT_PRIMARY }]}
          >
            Edit Budgets
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Budgets
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120, // Tab bar spacing
  },
  centerContainer: {
    minHeight: 400,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  errorText: {
    fontSize: FONT_SIZE.MD,
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.SM,
  },
  emptyDesc: {
    fontSize: FONT_SIZE.MD,
    textAlign: "center",
    marginBottom: SPACING.XL,
    lineHeight: 22,
  },
  primaryButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: RADIUS.MD,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  outlineButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    alignItems: "center",
    marginTop: SPACING.MD,
  },
  outlineButtonText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  listContainer: {
    gap: SPACING.MD,
  },
  budgetCard: {
    padding: SPACING.LG,
    borderRadius: RADIUS.LG,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  catInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  catIcon: {
    fontSize: FONT_SIZE.LG,
  },
  catName: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  statusBadge: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    textTransform: "uppercase",
  },
  amountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: SPACING.SM,
  },
  spentText: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  limitText: {
    fontSize: FONT_SIZE.SM,
    marginTop: 2,
  },
  percentageText: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
