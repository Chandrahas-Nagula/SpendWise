import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryIconProps {
  icon: string | undefined | null;
  size?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  size = 20,
  color,
  style,
}) => {
  if (!icon) {
    return <Text style={[styles.emoji, style, { fontSize: size }]}>💰</Text>;
  }

  // If the icon name looks like an Ionicon name (has a dash and length > 2)
  if (icon.length > 2) {
    return (
      <Ionicons name={icon as any} size={size} color={color} style={style} />
    );
  }

  // Otherwise it's likely an emoji
  return <Text style={[styles.emoji, style, { fontSize: size }]}>{icon}</Text>;
};

const styles = StyleSheet.create({
  emoji: {
    textAlign: "center",
  },
});
