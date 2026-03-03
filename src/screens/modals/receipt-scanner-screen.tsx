/**
 * ReceiptScannerScreen — Camera-based receipt scanning.
 *
 * Currently shows a "coming soon" state since OCR integration
 * requires backend processing (Google Cloud Vision or similar).
 */

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";

export const ReceiptScannerScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

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
          Scan Receipt
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            },
          ]}
        >
          <Text style={styles.emoji}>📷</Text>
          <Text
            style={[styles.comingSoonTitle, { color: colors.TEXT_PRIMARY }]}
          >
            Coming Soon
          </Text>
          <Text
            style={[styles.comingSoonDesc, { color: colors.TEXT_TERTIARY }]}
          >
            AI-powered receipt scanning will automatically extract amounts,
            categories, and dates from your receipts.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <View style={styles.featureList}>
            {[
              { icon: "🤖", text: "AI-powered text extraction" },
              { icon: "📋", text: "Auto-fill expense details" },
              { icon: "☁️", text: "Cloud-based processing" },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text
                  style={[styles.featureText, { color: colors.TEXT_SECONDARY }]}
                >
                  {f.text}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    justifyContent: "center",
    gap: SPACING.XL,
  },
  card: {
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    alignItems: "center",
    gap: SPACING.MD,
  },
  emoji: { fontSize: 64 },
  comingSoonTitle: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  comingSoonDesc: {
    fontSize: FONT_SIZE.SM,
    textAlign: "center",
    lineHeight: 22,
  },
  featureList: { gap: SPACING.MD },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  featureIcon: { fontSize: 24 },
  featureText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
});
