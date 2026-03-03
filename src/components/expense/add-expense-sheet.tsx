/**
 * AddExpenseSheet — Full BottomSheetModal form for adding expenses/income.
 *
 * Sections:
 * 1. Amount Input (hero)
 * 2. Type Toggle (Expense/Income)
 * 3. Category Chips (scrollable grid)
 * 4. Date Picker
 * 5. Description (TextInput, 120 char max)
 * 6. Receipt Photo (optional, thumbnail preview)
 * 7. Save Button
 */

import React, { useCallback, useState, forwardRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../hooks/use-theme";
import {
  useAddExpense,
  type AddExpenseData,
} from "../../hooks/use-add-expense";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import type {
  TransactionType,
  CategoryDefinition,
} from "../../constants/categories";

// Components
import { AmountInput } from "./amount-input";
import { TypeToggle } from "./type-toggle";
import { CategoryPicker } from "./category-chip";
import { ReceiptThumbnail } from "./receipt-thumbnail";

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

export interface AddExpenseSheetRef {
  open: () => void;
  close: () => void;
}

// ---------------------------------------------------------------------------
//  Component
// ---------------------------------------------------------------------------

export const AddExpenseSheet = forwardRef<BottomSheet, object>(
  (_props, ref) => {
    const { colors, isDark } = useTheme();
    const { submitExpense, isSubmitting, error, isSuccess, reset } =
      useAddExpense();

    // ── Form state ──────────────────────────────────────────────────
    const [amount, setAmount] = useState("");
    const [txType, setTxType] = useState<TransactionType>("expense");
    const [selectedCategory, setSelectedCategory] =
      useState<CategoryDefinition | null>(null);
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");
    const [receiptUri, setReceiptUri] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Date constraints: current month only
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // ── Snap points ─────────────────────────────────────────────────
    const snapPoints = useMemo(() => ["92%"], []);

    // ── Validation ──────────────────────────────────────────────────
    const amountNum = parseFloat(amount);
    const isAmountValid = !isNaN(amountNum) && amountNum > 0;
    const isCategoryValid = selectedCategory !== null;
    const canSave = isAmountValid && isCategoryValid && !isSubmitting;

    // ── Handlers ────────────────────────────────────────────────────
    const resetForm = useCallback(() => {
      setAmount("");
      setTxType("expense");
      setSelectedCategory(null);
      setDate(new Date());
      setDescription("");
      setReceiptUri(null);
      reset();
    }, [reset]);

    const handleTypeChange = useCallback((type: TransactionType) => {
      setTxType(type);
      // Clear category when switching type since categories are different
      setSelectedCategory(null);
    }, []);

    const handleCategorySelect = useCallback((cat: CategoryDefinition) => {
      setSelectedCategory(cat);
    }, []);

    const handleSave = useCallback(async () => {
      if (!canSave || !selectedCategory) return;

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const data: AddExpenseData = {
        amount: amountNum,
        type: txType,
        categoryId: selectedCategory.id,
        date,
        description: description.trim() || undefined,
        receiptUri: receiptUri || undefined,
      };

      const result = await submitExpense(data);
      if (result) {
        // Success! Close the sheet
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        resetForm();
        // Close the bottom sheet
        if (ref && "current" in ref && ref.current) {
          ref.current.close();
        }
      }
    }, [
      canSave,
      amountNum,
      txType,
      selectedCategory,
      date,
      description,
      receiptUri,
      submitExpense,
      resetForm,
      ref,
    ]);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          // Sheet fully closed
          resetForm();
        }
      },
      [resetForm],
    );

    // ── Backdrop ────────────────────────────────────────────────────
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    // ── Accent color ────────────────────────────────────────────────
    const accentColor =
      txType === "income" ? colors.SEMANTIC.SUCCESS : colors.SEMANTIC.ERROR;

    const saveGradient: [string, string] =
      txType === "income" ? ["#10B981", "#059669"] : ["#3B82F6", "#2563EB"];

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colors.TEXT_TERTIARY,
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopLeftRadius: RADIUS.XXL,
          borderTopRightRadius: RADIUS.XXL,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ──────────────────────────────────────── */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
              {txType === "income" ? "Add Income" : "Add Expense"}
            </Text>
          </View>

          {/* ── Type Toggle ─────────────────────────────────── */}
          <TypeToggle value={txType} onChange={handleTypeChange} />

          {/* ── Amount ──────────────────────────────────────── */}
          <AmountInput
            value={amount}
            onChange={setAmount}
            error={
              amount && !isAmountValid ? "Enter a valid amount" : undefined
            }
            transactionType={txType}
          />

          {/* ── Category ────────────────────────────────────── */}
          <CategoryPicker
            transactionType={txType}
            selectedId={selectedCategory?.id ?? null}
            onSelect={handleCategorySelect}
            error={undefined}
          />

          {/* ── Date ────────────────────────────────────────── */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.TEXT_SECONDARY }]}>
              Date
            </Text>
            <TouchableOpacity
              style={[
                styles.dateField,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: colors.BORDER,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
              accessibilityLabel="Select date"
              accessibilityRole="button"
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={[styles.dateText, { color: colors.TEXT_PRIMARY }]}>
                {formatDateLabel(date)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={monthStart}
                maximumDate={today}
                onChange={(
                  _event: DateTimePickerEvent,
                  selectedDate?: Date,
                ) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* ── Description ─────────────────────────────────── */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeaderRow}>
              <Text
                style={[styles.fieldLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Description
              </Text>
              <Text style={[styles.charCount, { color: colors.TEXT_TERTIARY }]}>
                {description.length}/120
              </Text>
            </View>
            <TextInput
              style={[
                styles.descriptionInput,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: colors.BORDER,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
              value={description}
              onChangeText={(t) => t.length <= 120 && setDescription(t)}
              placeholder="What was this for?"
              placeholderTextColor={colors.TEXT_TERTIARY}
              maxLength={120}
              multiline
              numberOfLines={2}
              accessibilityLabel="Transaction description"
            />
          </View>

          {/* ── Receipt ─────────────────────────────────────── */}
          <ReceiptThumbnail
            uri={receiptUri}
            onPick={setReceiptUri}
            onRemove={() => setReceiptUri(null)}
          />

          {/* ── Error message ───────────────────────────────── */}
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
              <Text
                style={[styles.errorText, { color: colors.SEMANTIC.ERROR }]}
              >
                {error}
              </Text>
            </View>
          ) : null}

          {/* ── Save Button ─────────────────────────────────── */}
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            style={({ pressed }) => [
              styles.saveButton,
              !canSave && styles.saveButtonDisabled,
              pressed && canSave && { opacity: 0.9 },
            ]}
            accessibilityLabel={`Save ${txType}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
          >
            <LinearGradient
              colors={canSave ? saveGradient : ["#9CA3AF", "#9CA3AF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveText}>
                  {isSuccess
                    ? "✓ Saved!"
                    : `Save ${txType === "income" ? "Income" : "Expense"}`}
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Bottom padding for keyboard avoidance */}
          <View style={styles.bottomPadding} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

// ── Helper ──────────────────────────────────────────────────────────────────

function formatDateLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diff = today.getTime() - selected.getTime();
  const dayMs = 86400000;

  if (diff === 0) return "Today";
  if (diff === dayMs) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.XXL,
  },
  header: {
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  fieldContainer: {
    marginBottom: SPACING.MD,
  },
  fieldHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.SM,
  },
  charCount: {
    fontSize: FONT_SIZE.XS,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    gap: SPACING.SM,
  },
  dateIcon: {
    fontSize: FONT_SIZE.MD,
  },
  dateText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: FONT_SIZE.MD,
    minHeight: 60,
    textAlignVertical: "top",
  },
  errorBanner: {
    padding: SPACING.SM,
    borderRadius: RADIUS.MD,
    marginBottom: SPACING.MD,
  },
  errorText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  saveButton: {
    borderRadius: RADIUS.LG,
    overflow: "hidden",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.LG,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  bottomPadding: {
    height: 40,
  },
});
