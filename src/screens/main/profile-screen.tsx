import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../stores/auth-provider";
import { useDashboardData } from "../../hooks/use-dashboard-data";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { Routes } from "../../constants/routes";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";

// ── Menu item data ──────────────────────────────────────────────────────────

interface MenuItem {
  icon: string;
  label: string;
  subtitle: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: "👤",
    label: "Edit Profile",
    subtitle: "Name, avatar & personal info",
    route: Routes.EDIT_PROFILE,
  },
  {
    icon: "⚙️",
    label: "Settings",
    subtitle: "Theme, currency & preferences",
    route: Routes.SETTINGS,
  },
  {
    icon: "📁",
    label: "Categories",
    subtitle: "Manage your expense categories",
    route: Routes.CATEGORY_MANAGEMENT,
  },
  {
    icon: "💰",
    label: "Budget Setup",
    subtitle: "Set monthly spending limits",
    route: Routes.BUDGET_SETUP,
  },
  {
    icon: "🔔",
    label: "Notifications",
    subtitle: "Budget alerts & reminders",
    route: Routes.NOTIFICATION_SETTINGS,
  },
  {
    icon: "🔄",
    label: "Recurring",
    subtitle: "Manage recurring transactions",
    route: Routes.RECURRING_TRANSACTIONS,
  },
  {
    icon: "🏆",
    label: "Achievements",
    subtitle: "Badges & milestones",
    route: Routes.ACHIEVEMENTS,
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export const ProfileScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { session, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const { summary, recentTransactions } = useDashboardData();

  const userName =
    session?.user?.user_metadata?.full_name ??
    session?.user?.email?.split("@")[0] ??
    "User";
  const userEmail = session?.user?.email ?? "user@example.com";
  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  const totalTransactions = recentTransactions?.length ?? 0;
  const savings = summary ? summary.total_income - summary.total_spent : 0;

  const handleMenuPress = useCallback(
    (route: string) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar + Name Header ───────────────────────────────────── */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.headerSection}
        >
          <LinearGradient
            colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
            style={styles.avatarGradientRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View
              style={[
                styles.avatarInner,
                { backgroundColor: colors.BACKGROUND },
              ]}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          </LinearGradient>

          <Text style={[styles.userName, { color: colors.TEXT_PRIMARY }]}>
            {userName}
          </Text>
          <Text style={[styles.userEmail, { color: colors.TEXT_TERTIARY }]}>
            {userEmail}
          </Text>
        </Animated.View>

        {/* ── Quick Stats Row ────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={styles.statsRow}
        >
          <GlassmorphicCard style={styles.statCard}>
            <Text
              style={[styles.statValue, { color: colors.SEMANTIC.SUCCESS }]}
            >
              ₹{Math.round(summary?.total_income ?? 0).toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_TERTIARY }]}>
              Income
            </Text>
          </GlassmorphicCard>
          <GlassmorphicCard style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.SEMANTIC.ERROR }]}>
              ₹{Math.round(summary?.total_spent ?? 0).toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_TERTIARY }]}>
              Spent
            </Text>
          </GlassmorphicCard>
          <GlassmorphicCard style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    savings >= 0
                      ? colors.SEMANTIC.SUCCESS
                      : colors.SEMANTIC.ERROR,
                },
              ]}
            >
              ₹{Math.round(Math.abs(savings)).toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.statLabel, { color: colors.TEXT_TERTIARY }]}>
              Saved
            </Text>
          </GlassmorphicCard>
        </Animated.View>

        {/* ── Menu Items ─────────────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.menuSection}
        >
          <GlassmorphicCard style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.route}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { opacity: 0.6 },
                  ]}
                  onPress={() => handleMenuPress(item.route)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <View style={styles.menuTextGroup}>
                    <Text
                      style={[styles.menuLabel, { color: colors.TEXT_PRIMARY }]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.menuSubtitle,
                        { color: colors.TEXT_TERTIARY },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.menuChevron,
                      { color: colors.TEXT_TERTIARY },
                    ]}
                  >
                    ›
                  </Text>
                </Pressable>
                {index < MENU_ITEMS.length - 1 && (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: colors.DIVIDER },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </GlassmorphicCard>
        </Animated.View>

        {/* ── Sign Out Button ────────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
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

        <Text style={[styles.versionText, { color: colors.TEXT_TERTIARY }]}>
          SpendWise v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: SPACING.XL,
    paddingBottom: SPACING.LG,
  },
  avatarGradientRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.MD,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarEmoji: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  userName: {
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZE.SM,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.SM,
    marginBottom: SPACING.LG,
  },
  statCard: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: RADIUS.LG,
    alignItems: "center",
  },
  statValue: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  menuSection: {
    marginBottom: SPACING.LG,
  },
  menuCard: {
    borderRadius: RADIUS.LG,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  menuIcon: {
    fontSize: 22,
    width: 36,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE.XS,
  },
  menuChevron: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: SPACING.SM,
  },
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
    marginBottom: SPACING.MD,
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  versionText: {
    textAlign: "center",
    fontSize: FONT_SIZE.XS,
    marginBottom: SPACING.XL,
  },
});
