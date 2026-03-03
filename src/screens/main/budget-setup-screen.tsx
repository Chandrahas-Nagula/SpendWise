import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/use-theme";
import { useBudgets } from "../../hooks/use-budgets";
import { AmountInput } from "../../components/expense/amount-input";
import { CategoryChip } from "../../components/expense/category-chip";
import { useCategories } from "../../hooks/use-categories";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";

export const BudgetSetupScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { saveBudget, isSaving } = useBudgets();
  const { expenseCategories } = useCategories();

  const [amountStr, setAmountStr] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    expenseCategories[0]?.id || "",
  );

  const handleSave = useCallback(async () => {
    const amount = Number(amountStr);
    if (amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a budget greater than ₹0.");
      return;
    }

    try {
      await saveBudget(selectedCategory, amount);
      navigation.goBack();
    } catch (err) {
      // Error is handled/alerted by the hook (or we can just let it fail silently here if hook alerts)
      Alert.alert("Error", "Failed to save budget limit. Please try again.");
    }
  }, [amountStr, selectedCategory, saveBudget, navigation]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, { color: colors.TEXT_PRIMARY }]}>
            ←
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Set Budget Limit
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
          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Monthly Limit
            </Text>
            <AmountInput
              value={amountStr}
              onChange={setAmountStr}
              transactionType="expense"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Select Category
            </Text>
            <View style={styles.chipGrid}>
              {expenseCategories.map((cat: any) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    selected={isSelected}
                    onPress={() => setSelectedCategory(cat.id)}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.9)",
              borderTopColor: colors.BORDER,
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
              colors={["#3B82F6", "#2563EB"]} // Blue gradient
              style={styles.saveBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? "Saving..." : "Save Budget"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  backButton: {
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
    paddingBottom: SPACING.XXL * 2,
    gap: SPACING.XL,
  },
  section: {
    gap: SPACING.SM,
  },
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
    paddingBottom: 100, // Clear the floating tab bar
    borderTopWidth: 1,
  },
  saveBtnWrapper: {
    borderRadius: RADIUS.MD,
    overflow: "hidden",
  },
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
