/**
 * DatePickerField — Compact date display + native date picker.
 *
 * Shows "Today" / "Yesterday" / formatted date.
 * Tapping opens the platform date picker.
 */

import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";

interface DatePickerFieldProps {
  value: Date;
  onChange: (date: Date) => void;
}

const formatDateLabel = (date: Date): string => {
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
};

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
}) => {
  const { colors, isDark } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = useCallback(() => {
    setShowPicker(true);
  }, []);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      setShowPicker(Platform.OS === "ios"); // iOS keeps open, Android closes
      if (date) {
        onChange(date);
      }
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>Date</Text>
      <Pressable
        style={[
          styles.field,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
            borderColor: colors.BORDER,
          },
        ]}
        onPress={handlePress}
        accessibilityLabel="Select date"
        accessibilityRole="button"
      >
        <Text style={styles.icon}>📅</Text>
        <Text style={[styles.dateText, { color: colors.TEXT_PRIMARY }]}>
          {formatDateLabel(value)}
        </Text>
      </Pressable>

      {(showPicker || Platform.OS === "web") && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.SM,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    gap: SPACING.SM,
  },
  icon: {
    fontSize: FONT_SIZE.MD,
  },
  dateText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
});
