/**
 * CategoryChip — Selectable category pill + CategoryPicker container.
 *
 * Displays emoji icon + name. Selected state fills background
 * with category color at low opacity.
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import {
  type CategoryDefinition,
  type TransactionType,
} from "../../constants/categories";
import { useCategories } from "../../hooks/use-categories";
import { CategoryIcon } from "../ui/category-icon";

// ── Single Chip ──────────────────────────────────────────────────────────

interface CategoryChipProps {
  category: any;
  selected: boolean;
  onPress: (category: any) => void;
}

const CategoryChipItem: React.FC<CategoryChipProps> = React.memo(
  ({ category, selected, onPress }) => {
    const { colors, isDark } = useTheme();

    const handlePress = useCallback(() => {
      onPress(category);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, [category, onPress]);

    const chipBg = selected
      ? isDark
        ? `${category.color}33` // 20% opacity
        : `${category.color}1A` // 10% opacity
      : isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.04)";

    const borderCol = selected ? category.color : "transparent";

    return (
      <Pressable
        style={[
          styles.chip,
          { backgroundColor: chipBg, borderColor: borderCol },
        ]}
        onPress={handlePress}
        accessibilityLabel={`${category.name} category`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <CategoryIcon icon={category.icon} size={18} style={styles.chipIcon} />
        <Text
          style={[
            styles.chipLabel,
            {
              color: selected ? category.color : colors.TEXT_SECONDARY,
              fontWeight: selected ? FONT_WEIGHT.SEMIBOLD : FONT_WEIGHT.REGULAR,
            },
          ]}
        >
          {category.name}
        </Text>
      </Pressable>
    );
  },
);

// ── Category Picker (scrollable grid) ────────────────────────────────────

interface CategoryPickerProps {
  transactionType: TransactionType;
  selectedId: string | null;
  onSelect: (category: any) => void;
  error?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  transactionType,
  selectedId,
  onSelect,
  error,
}) => {
  const { colors } = useTheme();

  const { expenseCategories, incomeCategories } = useCategories();

  const categories = useMemo(
    () =>
      transactionType === "expense" ? expenseCategories : incomeCategories,
    [transactionType, expenseCategories, incomeCategories],
  );

  return (
    <View style={styles.pickerContainer}>
      <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
        Category
      </Text>
      <View style={styles.chipGrid}>
        {categories.map((cat) => (
          <CategoryChipItem
            key={cat.id}
            category={cat}
            selected={selectedId === cat.id}
            onPress={onSelect}
          />
        ))}
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.SEMANTIC.ERROR }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export { CategoryChipItem as CategoryChip };

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.FULL,
    borderWidth: 1.5,
    gap: SPACING.XXXS,
  },
  chipIcon: {
    fontSize: FONT_SIZE.SM,
  },
  chipLabel: {
    fontSize: FONT_SIZE.XS,
  },
  pickerContainer: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.SM,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.XS,
  },
  error: {
    fontSize: FONT_SIZE.XS,
    marginTop: SPACING.XXXS,
  },
});
