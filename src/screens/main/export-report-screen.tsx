import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { useAuth } from "../../stores/auth-provider";
import { supabase } from "../../services/supabase/client";
import { SupabaseExpenseRepository } from "../../services/repositories/supabase-expense-repository";
import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";

const EXPORT_OPTIONS = [
  {
    id: "csv",
    icon: "📊",
    title: "CSV Spreadsheet",
    desc: "Compatible with Excel and Google Sheets",
  },
  {
    id: "pdf",
    icon: "📄",
    title: "PDF Report",
    desc: "Formatted monthly summary report",
  },
  {
    id: "json",
    icon: "🔧",
    title: "JSON Data",
    desc: "Raw data for developers and apps",
  },
];

export const ExportReportScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  const { session } = useAuth();
  const userId = session?.user?.id ?? "4ee4719c-9a10-4df0-b99a-4fe3cd711c8c"; // Fallback dev user
  const repo = React.useMemo(() => new SupabaseExpenseRepository(supabase), []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (selected === "pdf") {
        Alert.alert(
          "PDF Export",
          "PDF formatting is coming soon. Please try CSV or JSON for now.",
        );
        return;
      }

      // Fetch all transactions for this user
      const expenses = await repo.getExpenses(userId, { limit: 1000 });

      let fileContent = "";
      let fileName = "spendwise_export";
      let mimeType = "";

      if (selected === "csv") {
        mimeType = "text/csv";
        fileName += ".csv";
        fileContent = "Date,Type,Amount,Category,Note\n";
        expenses.forEach((expense) => {
          const e = expense as any; // Assert to any to access joined categories relation
          const catName = e.categories ? e.categories.name : "Other";
          const _note = e.description
            ? `"${e.description.replace(/"/g, '""')}"`
            : "";
          fileContent += `${e.date},${e.type},${e.amount},"${catName}",${_note}\n`;
        });
      } else if (selected === "json") {
        mimeType = "application/json";
        fileName += ".json";
        fileContent = JSON.stringify(expenses, null, 2);
      }

      if (fileContent) {
        const _fs = FileSystem as any;
        const fileUri = (_fs.documentDirectory || "") + fileName;
        await _fs.writeAsStringAsync(fileUri, fileContent, {
          encoding: _fs.EncodingType.UTF8,
        });

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType,
            dialogTitle: "Export SpendWise Data",
          });
        } else {
          Alert.alert(
            "Export Error",
            "Sharing is not available on this device.",
          );
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Export Failed",
        error.message || "An unexpected error occurred.",
      );
    } finally {
      setIsExporting(false);
    }
  };

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
          Export Data
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.TEXT_TERTIARY }]}>
          SELECT FORMAT
        </Text>

        {EXPORT_OPTIONS.map((opt, index) => {
          const isActive = selected === opt.id;
          return (
            <Animated.View
              key={opt.id}
              entering={FadeInUp.delay(index * 80).duration(350)}
            >
              <Pressable
                onPress={() => setSelected(opt.id)}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <GlassmorphicCard
                  style={{
                    ...styles.optionCard,
                    ...(isActive
                      ? { borderWidth: 2, borderColor: BRAND.PRIMARY_START }
                      : {}),
                  }}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: colors.TEXT_PRIMARY },
                      ]}
                    >
                      {opt.title}
                    </Text>
                    <Text
                      style={[
                        styles.optionDesc,
                        { color: colors.TEXT_TERTIARY },
                      ]}
                    >
                      {opt.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isActive
                          ? BRAND.PRIMARY_START
                          : colors.BORDER,
                      },
                    ]}
                  >
                    {isActive && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: BRAND.PRIMARY_START },
                        ]}
                      />
                    )}
                  </View>
                </GlassmorphicCard>
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Export button */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Pressable
            onPress={handleExport}
            disabled={isExporting}
            style={({ pressed }) => [
              styles.exportBtnWrapper,
              pressed && { opacity: 0.8 },
              isExporting && { opacity: 0.5 },
            ]}
          >
            <LinearGradient
              colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
              style={styles.exportBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.exportBtnText}>
                {isExporting ? "Preparing..." : "Export Now"}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Text style={[styles.noteText, { color: colors.TEXT_TERTIARY }]}>
          Exported data includes all transactions from the current month. Full
          date-range export will be available in a future update.
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
    gap: SPACING.MD,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    letterSpacing: 1,
    marginTop: SPACING.SM,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.LG,
    borderRadius: RADIUS.LG,
  },
  optionIcon: { fontSize: 28, marginRight: SPACING.MD },
  optionText: { flex: 1 },
  optionTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: 2,
  },
  optionDesc: { fontSize: FONT_SIZE.XS },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  exportBtnWrapper: {
    borderRadius: RADIUS.MD,
    overflow: "hidden",
    marginTop: SPACING.MD,
  },
  exportBtnGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
  },
  exportBtnText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  noteText: {
    fontSize: FONT_SIZE.XS,
    textAlign: "center",
    lineHeight: 18,
    marginTop: SPACING.SM,
    paddingHorizontal: SPACING.LG,
  },
});
