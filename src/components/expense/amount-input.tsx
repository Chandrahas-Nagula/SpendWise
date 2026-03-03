/**
 * AmountInput — Hero-style currency input for the Add Expense form.
 *
 * Shows a large ₹ prefix with a numeric text input.
 * Controlled via react-hook-form Controller.
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { DEFAULT_CURRENCY } from "../../constants/categories";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  transactionType: "expense" | "income";
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
  transactionType,
}) => {
  const { colors, isDark } = useTheme();

  const accentColor =
    transactionType === "income"
      ? colors.SEMANTIC.SUCCESS
      : colors.SEMANTIC.ERROR;

  const handleChange = useCallback(
    (text: string) => {
      // Allow only numbers and a single decimal point
      const cleaned = text.replace(/[^0-9.]/g, "");
      // Prevent multiple decimals
      const parts = cleaned.split(".");
      if (parts.length > 2) return;
      // Limit decimal places to 2
      if (parts[1] && parts[1].length > 2) return;
      onChange(cleaned);
    },
    [onChange],
  );

  const borderColor = error
    ? colors.SEMANTIC.ERROR
    : value && parseFloat(value) > 0
      ? accentColor
      : colors.BORDER;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.8)",
            borderColor,
          },
        ]}
      >
        <Text style={[styles.currency, { color: accentColor }]}>
          {DEFAULT_CURRENCY.SYMBOL}
        </Text>
        <TextInput
          style={[styles.input, { color: colors.TEXT_PRIMARY }]}
          value={value}
          onChangeText={handleChange}
          placeholder="0"
          placeholderTextColor={colors.TEXT_TERTIARY}
          keyboardType="decimal-pad"
          maxLength={10}
          accessibilityLabel="Enter amount"
          accessibilityHint={`Enter the ${transactionType} amount in rupees`}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.SEMANTIC.ERROR }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: RADIUS.XL,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  currency: {
    fontSize: 36,
    fontWeight: FONT_WEIGHT.BOLD,
    marginRight: SPACING.XS,
  },
  input: {
    flex: 1,
    fontSize: 36,
    fontWeight: FONT_WEIGHT.BOLD,
    padding: 0,
  },
  error: {
    fontSize: FONT_SIZE.XS,
    marginTop: SPACING.XXXS,
    marginLeft: SPACING.MD,
  },
});
