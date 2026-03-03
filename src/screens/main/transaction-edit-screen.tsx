import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../hooks/use-theme";
import { supabase } from "../../services/supabase/client";
import { SupabaseExpenseRepository } from "../../services/repositories/supabase-expense-repository";
import { AmountInput } from "../../components/expense/amount-input";
import { CategoryChip } from "../../components/expense/category-chip";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { useCategories } from "../../hooks/use-categories";
import { BRAND } from "../../constants/colors";

type ParamList = {
  TransactionEdit: { transactionId: string };
};

export const TransactionEditScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "TransactionEdit">>();
  const transactionId = route.params?.transactionId;

  const repo = useMemo(() => new SupabaseExpenseRepository(supabase), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [amountStr, setAmountStr] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!transactionId) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await repo.getExpenseById(transactionId);
        if (data) {
          setAmountStr(String(data.amount));
          setSelectedCategory(data.category_id ?? "");
          setTxType(data.type as "expense" | "income");
          setDescription(data.description ?? "");
        }
      } catch {
        Alert.alert("Error", "Failed to load transaction.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [transactionId, repo]);

  const { expenseCategories, incomeCategories } = useCategories();

  const categories = txType === "income" ? incomeCategories : expenseCategories;

  const handleSave = useCallback(async () => {
    const amount = Number(amountStr);
    if (amount <= 0) {
      Alert.alert("Invalid", "Enter an amount greater than ₹0.");
      return;
    }
    setIsSaving(true);
    try {
      await repo.updateExpense(transactionId, {
        amount,
        category_id: selectedCategory,
        description: description || null,
      });
      Alert.alert("Saved", "Transaction updated successfully.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to update.");
    } finally {
      setIsSaving(false);
    }
  }, [
    amountStr,
    selectedCategory,
    description,
    transactionId,
    repo,
    navigation,
  ]);

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
          Edit Transaction
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Amount
            </Text>
            <AmountInput
              value={amountStr}
              onChange={setAmountStr}
              transactionType={txType}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Category
            </Text>
            <View style={styles.chipGrid}>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  selected={selectedCategory === cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Save */}
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
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveBtnWrapper,
              pressed && { opacity: 0.8 },
              isSaving && { opacity: 0.5 },
            ]}
          >
            <LinearGradient
              colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
              style={styles.saveBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? "Saving..." : "Update Transaction"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.XXL * 2,
    gap: SPACING.XL,
  },
  section: { gap: SPACING.SM },
  label: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.XS,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  footer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: 100,
    borderTopWidth: 1,
  },
  saveBtnWrapper: { borderRadius: RADIUS.MD, overflow: "hidden" },
  saveBtnGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
