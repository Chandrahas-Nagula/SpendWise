import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import {
  useAchievements,
  AchievementStatus,
} from "../../hooks/use-achievements";
import { ACHIEVEMENT_CATEGORIES } from "../../constants/achievements";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { ConfettiCelebration } from "../../components/ui/confetti-celebration";

export const AchievementsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const {
    achievements,
    unlockedCount,
    totalCount,
    isLoading,
    newlyUnlocked,
    dismissCelebration,
  } = useAchievements();

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return achievements;
    return achievements.filter((a) => a.category === activeCategory);
  }, [achievements, activeCategory]);

  const progressPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

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
          Achievements
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BRAND.PRIMARY_START} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Banner */}
          <Animated.View entering={FadeInUp.delay(0).duration(400)}>
            <GlassmorphicCard style={styles.progressCard}>
              <Text style={[styles.progressEmoji]}>🏅</Text>
              <Text
                style={[styles.progressTitle, { color: colors.TEXT_PRIMARY }]}
              >
                {unlockedCount} / {totalCount} Unlocked
              </Text>
              <View
                style={[
                  styles.progressBarBg,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPct}%`,
                      backgroundColor: BRAND.PRIMARY_START,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressSubtext,
                  { color: colors.TEXT_TERTIARY },
                ]}
              >
                {unlockedCount >= totalCount
                  ? "🎉 You've unlocked everything! LEGENDARY!"
                  : `${totalCount - unlockedCount} more to go. Keep it up!`}
              </Text>
            </GlassmorphicCard>
          </Animated.View>

          {/* Category Filter Tabs */}
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}
            >
              <Pressable
                style={[
                  styles.tab,
                  activeCategory === "all" && {
                    backgroundColor: BRAND.PRIMARY_START,
                  },
                ]}
                onPress={() => setActiveCategory("all")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeCategory === "all"
                          ? "#FFF"
                          : colors.TEXT_TERTIARY,
                    },
                  ]}
                >
                  All ({totalCount})
                </Text>
              </Pressable>
              {ACHIEVEMENT_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                const count = achievements.filter(
                  (a) => a.category === cat.key,
                ).length;
                const unlocked = achievements.filter(
                  (a) => a.category === cat.key && a.unlocked,
                ).length;
                return (
                  <Pressable
                    key={cat.key}
                    style={[
                      styles.tab,
                      isActive && { backgroundColor: BRAND.PRIMARY_START },
                    ]}
                    onPress={() => setActiveCategory(cat.key)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color: isActive ? "#FFF" : colors.TEXT_TERTIARY,
                        },
                      ]}
                    >
                      {cat.icon} {cat.label} ({unlocked}/{count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Badge Grid */}
          <View style={styles.badgeGrid}>
            {filtered.map((badge, index) => (
              <Animated.View
                key={badge.key}
                entering={FadeInUp.delay(50 + index * 30).duration(300)}
                style={styles.badgeWrapper}
              >
                <GlassmorphicCard
                  style={{
                    ...styles.badgeCard,
                    ...(badge.unlocked ? {} : { opacity: 0.35 }),
                  }}
                >
                  {/* Unlocked check */}
                  {badge.unlocked && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✅</Text>
                    </View>
                  )}

                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text
                    style={[styles.badgeTitle, { color: colors.TEXT_PRIMARY }]}
                    numberOfLines={1}
                  >
                    {badge.title}
                  </Text>
                  <Text
                    style={[styles.badgeDesc, { color: colors.TEXT_TERTIARY }]}
                    numberOfLines={2}
                  >
                    {badge.description}
                  </Text>

                  {/* Status label */}
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: badge.unlocked
                          ? "rgba(76,175,80,0.15)"
                          : isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: badge.unlocked
                            ? "#4CAF50"
                            : colors.TEXT_TERTIARY,
                        },
                      ]}
                    >
                      {badge.unlocked ? "Unlocked" : "Locked"}
                    </Text>
                  </View>
                </GlassmorphicCard>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 🎉 Confetti Celebration Overlay */}
      {newlyUnlocked && (
        <ConfettiCelebration
          icon={newlyUnlocked.achievement.icon}
          title={newlyUnlocked.achievement.title}
          description={newlyUnlocked.achievement.description}
          onDismiss={dismissCelebration}
        />
      )}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
    gap: SPACING.LG,
  },
  progressCard: {
    borderRadius: RADIUS.LG,
    padding: SPACING.LG,
    alignItems: "center",
  },
  progressEmoji: {
    fontSize: 36,
    marginBottom: SPACING.XS,
  },
  progressTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.SM,
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: SPACING.SM,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressSubtext: { fontSize: FONT_SIZE.SM },
  tabRow: {
    gap: SPACING.XS,
    paddingRight: SPACING.LG,
  },
  tab: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.FULL,
    borderWidth: 1,
    borderColor: "rgba(108,99,255,0.2)",
  },
  tabText: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  badgeWrapper: {
    width: "48%",
  },
  badgeCard: {
    borderRadius: RADIUS.LG,
    padding: SPACING.MD,
    alignItems: "center",
    minHeight: 150,
    justifyContent: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  checkText: { fontSize: 14 },
  badgeIcon: { fontSize: 38, marginBottom: SPACING.XS },
  badgeTitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    textAlign: "center",
    marginBottom: 2,
  },
  badgeDesc: {
    fontSize: FONT_SIZE.XXS,
    textAlign: "center",
    lineHeight: 14,
    marginBottom: SPACING.SM,
  },
  statusBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 3,
    borderRadius: RADIUS.FULL,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.BOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
