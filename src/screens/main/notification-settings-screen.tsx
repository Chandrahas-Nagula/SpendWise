import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";

export const NotificationSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);

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
          Notifications
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
          ALERTS
        </Text>
        <Animated.View entering={FadeInUp.delay(0).duration(400)}>
          <GlassmorphicCard style={styles.card}>
            <ToggleRow
              icon="🚨"
              label="Budget Alerts"
              subtitle="Notify when spending exceeds 80% of budget"
              value={budgetAlerts}
              onToggle={setBudgetAlerts}
            />
            <Divider />
            <ToggleRow
              icon="📝"
              label="Daily Reminder"
              subtitle="Remind to log expenses at 9 PM"
              value={dailyReminder}
              onToggle={setDailyReminder}
            />
          </GlassmorphicCard>
        </Animated.View>

        <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
          REPORTS
        </Text>
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <GlassmorphicCard style={styles.card}>
            <ToggleRow
              icon="📊"
              label="Weekly Report"
              subtitle="Receive spending summary every Sunday"
              value={weeklyReport}
              onToggle={setWeeklyReport}
            />
            <Divider />
            <ToggleRow
              icon="📅"
              label="Monthly Report"
              subtitle="Full month summary on the 1st"
              value={monthlyReport}
              onToggle={setMonthlyReport}
            />
          </GlassmorphicCard>
        </Animated.View>

        <Text style={[styles.noteText, { color: colors.TEXT_TERTIARY }]}>
          Notification preferences are saved to your profile. Push notifications
          require device permissions to be enabled.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const ToggleRow: React.FC<{
  icon: string;
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}> = ({ icon, label, subtitle, value, onToggle }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.TEXT_PRIMARY }]}>
          {label}
        </Text>
        <Text style={[styles.rowSub, { color: colors.TEXT_TERTIARY }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.DIVIDER, true: BRAND.PRIMARY_START }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const Divider: React.FC = () => {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.DIVIDER }]} />;
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
  card: { borderRadius: RADIUS.LG, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  rowIcon: { fontSize: 20, width: 34 },
  rowText: { flex: 1 },
  rowLabel: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    marginBottom: 2,
  },
  rowSub: { fontSize: FONT_SIZE.XS },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 56 },
  noteText: {
    fontSize: FONT_SIZE.XS,
    textAlign: "center",
    marginTop: SPACING.XL,
    paddingHorizontal: SPACING.LG,
    lineHeight: 18,
  },
});
