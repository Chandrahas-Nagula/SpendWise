/**
 * GlassmorphicCard — Reusable frosted-glass container
 *
 * Follows specs from 2024-2025 UI trends doc:
 * - Light: rgba(255,255,255,0.12) bg, blur 16, border rgba(255,255,255,0.20)
 * - Dark:  rgba(31,38,50,0.70) bg, blur 16, border rgba(255,255,255,0.10)
 * - borderRadius 24px, elevation 8
 */

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { RADIUS, SPACING } from "../../constants/sizes";
import { useTheme } from "../../hooks/use-theme";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  style,
}) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.XXL,
    padding: SPACING.LG,
    overflow: "hidden",
    // Elevation / shadow removed or minimized to prevent dark underlay on Android
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 0,
  },
  cardLight: {
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.80)",
    shadowColor: "#000",
  },
  cardDark: {
    backgroundColor: "rgba(31, 38, 50, 0.70)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    shadowColor: "#000",
  },
});
