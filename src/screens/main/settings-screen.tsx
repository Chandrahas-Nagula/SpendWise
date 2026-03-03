import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../stores/auth-provider";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { Routes } from "../../constants/routes";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";

// ── Types ───────────────────────────────────────────────────────────────────

interface SettingsToggleProps {
  icon: string;
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}

interface SettingsRowProps {
  icon: string;
  label: string;
  subtitle: string;
  value?: string;
  onPress?: () => void;
}

// ── Sub-components ──────────────────────────────────────────────────────────

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  icon,
  label,
  subtitle,
  value,
  onToggle,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowTextGroup}>
        <Text style={[styles.rowLabel, { color: colors.TEXT_PRIMARY }]}>
          {label}
        </Text>
        <Text style={[styles.rowSubtitle, { color: colors.TEXT_TERTIARY }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: colors.DIVIDER,
          true: BRAND.PRIMARY_START,
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  subtitle,
  value,
  onPress,
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
      onPress={onPress}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowTextGroup}>
        <Text style={[styles.rowLabel, { color: colors.TEXT_PRIMARY }]}>
          {label}
        </Text>
        <Text style={[styles.rowSubtitle, { color: colors.TEXT_TERTIARY }]}>
          {subtitle}
        </Text>
      </View>
      {value && (
        <Text style={[styles.rowValue, { color: colors.TEXT_SECONDARY }]}>
          {value}
        </Text>
      )}
      <Text style={[styles.rowChevron, { color: colors.TEXT_TERTIARY }]}>
        ›
      </Text>
    </Pressable>
  );
};

const Divider: React.FC = () => {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.DIVIDER }]} />;
};

// ── Screen ──────────────────────────────────────────────────────────────────

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggle } = useTheme();
  const { signOut } = useAuth();
  const navigation = useNavigation<any>();

  const [budgetAlerts, setBudgetAlerts] = React.useState(true);
  const [weeklySummary, setWeeklySummary] = React.useState(false);

  const handleSignOut = useCallback(async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }, [signOut]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.TEXT_PRIMARY }]}>
            ←
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Appearance ─────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(0).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            APPEARANCE
          </Text>
          <GlassmorphicCard style={styles.sectionCard}>
            <SettingsToggle
              icon="🌙"
              label="Dark Mode"
              subtitle="Switch between light and dark theme"
              value={isDark}
              onToggle={toggle}
            />
            <Divider />
            <SettingsRow
              icon="💱"
              label="Currency"
              subtitle="Default transaction currency"
              value="₹ INR"
              onPress={() =>
                Alert.alert(
                  "Currency",
                  "Multi-currency support is coming soon!",
                )
              }
            />
          </GlassmorphicCard>
        </Animated.View>

        {/* ── Notifications ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            NOTIFICATIONS
          </Text>
          <GlassmorphicCard style={styles.sectionCard}>
            <SettingsToggle
              icon="🔔"
              label="Budget Alerts"
              subtitle="Get notified when approaching limits"
              value={budgetAlerts}
              onToggle={setBudgetAlerts}
            />
            <Divider />
            <SettingsToggle
              icon="📊"
              label="Weekly Summary"
              subtitle="Receive weekly spending reports"
              value={weeklySummary}
              onToggle={setWeeklySummary}
            />
          </GlassmorphicCard>
        </Animated.View>

        {/* ── Data ───────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            DATA
          </Text>
          <GlassmorphicCard style={styles.sectionCard}>
            <SettingsRow
              icon="📤"
              label="Export Data"
              subtitle="Download your transactions as CSV"
              onPress={() => navigation.navigate(Routes.EXPORT_REPORT)}
            />
            <Divider />
            <SettingsRow
              icon="🗑️"
              label="Clear Local Cache"
              subtitle="Remove cached data from device"
              onPress={() =>
                Alert.alert("Cache Cleared", "Local cache has been reset.")
              }
            />
          </GlassmorphicCard>
        </Animated.View>

        {/* ── Account ────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
            ACCOUNT
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              {
                backgroundColor: isDark
                  ? "rgba(255,59,48,0.12)"
                  : "rgba(255,59,48,0.08)",
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutIcon}>🚪</Text>
            <Text
              style={[styles.signOutText, { color: colors.SEMANTIC.ERROR }]}
            >
              Sign Out
            </Text>
          </Pressable>
        </Animated.View>

        <Text style={[styles.footerText, { color: colors.TEXT_TERTIARY }]}>
          SpendWise v1.0.0 • Made with ❤️
        </Text>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    letterSpacing: 1,
    marginBottom: SPACING.SM,
    marginTop: SPACING.LG,
  },
  sectionCard: {
    borderRadius: RADIUS.LG,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  rowIcon: { fontSize: 20, width: 34 },
  rowTextGroup: { flex: 1 },
  rowLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    marginBottom: 2,
  },
  rowSubtitle: { fontSize: FONT_SIZE.XS },
  rowValue: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    marginRight: SPACING.XS,
  },
  rowChevron: { fontSize: 22, fontWeight: "bold" },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 56,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.LG,
    gap: SPACING.SM,
  },
  signOutIcon: { fontSize: 18 },
  signOutText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  footerText: {
    textAlign: "center",
    fontSize: FONT_SIZE.XS,
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
  },
});
