import React, { useCallback, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { supabase } from "../../services/supabase/client";
import { SupabaseExpenseRepository } from "../../services/repositories/supabase-expense-repository";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { formatINR } from "../../utils/greeting";
import { Routes } from "../../constants/routes";

type ParamList = {
  TransactionDetail: { transactionId: string };
};

export const TransactionDetailScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ParamList, "TransactionDetail">>();
  const transactionId = route.params?.transactionId;

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);
  const [tx, setTx] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!transactionId) return;

    (async () => {
      setIsLoading(true);
      try {
        const data = await repo.getExpenseById(transactionId);
        setTx(data);
      } catch {
        Alert.alert("Error", "Failed to load transaction.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [transactionId, repo]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Transaction", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await repo.deleteExpense(transactionId);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Failed to delete transaction.");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  }, [transactionId, repo, navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate(Routes.TRANSACTION_EDIT, { transactionId });
  }, [transactionId, navigation]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
        edges={["top"]}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BRAND.PRIMARY_START} />
        </View>
      </SafeAreaView>
    );
  }

  if (!tx) {
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
        </View>
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.TEXT_TERTIARY }}>
            Transaction not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = tx.type === "income";
  const accentColor = isIncome
    ? colors.SEMANTIC.SUCCESS
    : colors.SEMANTIC.ERROR;

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
          Transaction
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Hero */}
        <Animated.View
          entering={FadeInUp.delay(0).duration(400)}
          style={styles.amountSection}
        >
          <Text style={[styles.typeBadge, { color: accentColor }]}>
            {isIncome ? "Income" : "Expense"}
          </Text>
          <Text style={[styles.amountText, { color: accentColor }]}>
            {isIncome ? "+" : "-"}
            {formatINR(tx.amount)}
          </Text>
        </Animated.View>

        {/* Details Card */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <GlassmorphicCard style={styles.detailCard}>
            <DetailRow
              label="Category"
              value={tx.categories?.name ?? "Uncategorized"}
              icon={tx.categories?.icon}
              colors={colors}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.DIVIDER }]}
            />
            <DetailRow label="Date" value={tx.date} colors={colors} />
            <View
              style={[styles.divider, { backgroundColor: colors.DIVIDER }]}
            />
            <DetailRow
              label="Description"
              value={tx.description || "No description"}
              colors={colors}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.DIVIDER }]}
            />
            <DetailRow label="Type" value={tx.type} colors={colors} />
          </GlassmorphicCard>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.actionsRow}
        >
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: isDark
                  ? "rgba(59,130,246,0.15)"
                  : "rgba(59,130,246,0.1)",
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleEdit}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={[styles.actionLabel, { color: colors.SEMANTIC.INFO }]}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,59,48,0.15)"
                  : "rgba(255,59,48,0.1)",
              },
              pressed && { opacity: 0.7 },
              isDeleting && { opacity: 0.5 },
            ]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text
              style={[styles.actionLabel, { color: colors.SEMANTIC.ERROR }]}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Detail Row ──────────────────────────────────────────────────────────────

const DetailRow: React.FC<{
  label: string;
  value: string;
  icon?: string;
  colors: any;
}> = ({ label, value, icon, colors }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, { color: colors.TEXT_TERTIARY }]}>
      {label}
    </Text>
    <View style={styles.detailValueRow}>
      {icon && <Text style={styles.detailIcon}>{icon}</Text>}
      <Text style={[styles.detailValue, { color: colors.TEXT_PRIMARY }]}>
        {value}
      </Text>
    </View>
  </View>
);

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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
    gap: SPACING.LG,
  },
  amountSection: { alignItems: "center", paddingVertical: SPACING.XL },
  typeBadge: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.XS,
  },
  amountText: { fontSize: 42, fontWeight: FONT_WEIGHT.BOLD },
  detailCard: { borderRadius: RADIUS.LG, overflow: "hidden" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  detailLabel: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.XS,
  },
  detailIcon: { fontSize: FONT_SIZE.MD },
  detailValue: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "capitalize",
  },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: SPACING.LG },
  actionsRow: { flexDirection: "row", gap: SPACING.MD },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.LG,
    gap: SPACING.SM,
  },
  actionIcon: { fontSize: 18 },
  actionLabel: { fontSize: FONT_SIZE.MD, fontWeight: FONT_WEIGHT.BOLD },
});
