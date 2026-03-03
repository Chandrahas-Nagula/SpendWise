import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { useTheme } from "../../hooks/use-theme";
import { useAnalytics, Timeframe } from "../../hooks/use-analytics";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { CategoryIcon } from "../../components/ui/category-icon";
import { formatINR } from "../../utils/greeting";

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "This Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

export const AnalyticsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { data, isLoading, error, timeframe, setTimeframe } = useAnalytics();

  // ── Transform Data for Gifted Charts ───────────────────────────────
  const lineData = useMemo(() => {
    if (!data?.timeSeries?.length) return [];
    // Line chart needs { value, label? }
    // Only show labels for first and last, or evenly spaced to avoid clutter
    return data.timeSeries.map((d, i) => {
      // Show every 5th label or first/last
      const isLabelNode =
        i === 0 ||
        i === data.timeSeries.length - 1 ||
        (data.timeSeries.length > 10 &&
          i % Math.floor(data.timeSeries.length / 4) === 0);

      const dObj = new Date(d.date);
      const label = `${dObj.getDate()}/${dObj.getMonth() + 1}`;

      return {
        value: d.value,
        dataPointText: "", // We can show text on dots if we want
        label: isLabelNode ? label : "",
        labelTextStyle: {
          color: colors.TEXT_TERTIARY,
          fontSize: 10,
        },
      };
    });
  }, [data?.timeSeries, colors]);

  const pieData = useMemo(() => {
    if (!data?.categoryBreakdown?.length) return [];
    return data.categoryBreakdown.map((cat) => ({
      value: cat.spent,
      color: cat.color || BRAND.PRIMARY_START,
      text: `${Math.round((cat.spent / (data.totalSpent || 1)) * 100)}%`,
    }));
  }, [data?.categoryBreakdown, data?.totalSpent, colors]);

  // ───────────────────────────────────────────────────────────────────

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BRAND.PRIMARY_START} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.SEMANTIC.ERROR }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (!data) return null;

    return (
      <View style={styles.scrollContent}>
        {/* -- SUMMARY STATS -- */}
        <View style={styles.statsRow}>
          <GlassmorphicCard style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>
              Total Income
            </Text>
            <Text
              style={[styles.statValue, { color: colors.SEMANTIC.SUCCESS }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatINR(data.totalIncome)}
            </Text>
          </GlassmorphicCard>
          <GlassmorphicCard style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.TEXT_SECONDARY }]}>
              Total Spent
            </Text>
            <Text
              style={[styles.statValue, { color: colors.SEMANTIC.ERROR }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatINR(data.totalSpent)}
            </Text>
          </GlassmorphicCard>
        </View>

        {/* -- LINE CHART (TRENDS) -- */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
          Spending Trend
        </Text>
        <GlassmorphicCard style={styles.chartCard}>
          {lineData.length > 0 ? (
            <LineChart
              data={lineData}
              height={180}
              width={260}
              thickness={3}
              color={BRAND.PRIMARY_START}
              noOfSections={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              yAxisTextStyle={{ color: colors.TEXT_TERTIARY, fontSize: 10 }}
              isAnimated={Platform.OS === "ios"}
              animationDuration={800}
              dataPointsColor={BRAND.PRIMARY_START}
              dataPointsRadius={4}
              curved
              initialSpacing={10}
              endSpacing={10}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: colors.TEXT_TERTIARY }}>
                No spending data for this period
              </Text>
            </View>
          )}
        </GlassmorphicCard>

        {/* -- PIE CHART (BREAKDOWN) -- */}
        <Text style={[styles.sectionTitle, { color: colors.TEXT_PRIMARY }]}>
          Category Breakdown
        </Text>
        <GlassmorphicCard style={styles.chartCard}>
          {pieData.length > 0 ? (
            <View style={styles.pieContainer}>
              <PieChart
                data={pieData}
                donut
                radius={80}
                innerRadius={50}
                innerCircleColor={isDark ? colors.SURFACE_1 : colors.SURFACE_1}
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text
                      style={[
                        styles.pieCenterText,
                        { color: colors.TEXT_SECONDARY },
                      ]}
                    >
                      Total
                    </Text>
                    <Text
                      style={[
                        styles.pieCenterValue,
                        { color: colors.TEXT_PRIMARY },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {formatINR(data.totalSpent)}
                    </Text>
                  </View>
                )}
              />

              {/* Legend underneath */}
              <View style={styles.legendContainer}>
                {data.categoryBreakdown.map((cat) => (
                  <View key={cat.category_id} style={styles.legendRow}>
                    <View style={styles.legendItemLeft}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: cat.color },
                        ]}
                      />
                      <CategoryIcon
                        icon={cat.icon}
                        size={14}
                        style={styles.legendIcon as any}
                      />
                      <Text
                        style={[
                          styles.legendName,
                          { color: colors.TEXT_SECONDARY },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </View>
                    <View style={styles.legendItemRight}>
                      <Text
                        style={[
                          styles.legendAmount,
                          { color: colors.TEXT_PRIMARY },
                        ]}
                      >
                        {formatINR(cat.spent)}
                      </Text>
                      <Text
                        style={[
                          styles.legendPct,
                          { color: colors.TEXT_TERTIARY },
                        ]}
                      >
                        {Math.round((cat.spent / data.totalSpent) * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: colors.TEXT_TERTIARY }}>
                No category data for this period
              </Text>
            </View>
          )}
        </GlassmorphicCard>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          Analytics
        </Text>
        {/* Timeframe Selector */}
        <View style={styles.tabContainer}>
          {TIMEFRAMES.map((tf) => {
            const isActive = timeframe === tf.value;
            return (
              <Pressable
                key={tf.value}
                style={[
                  styles.tabButton,
                  isActive
                    ? { backgroundColor: BRAND.PRIMARY_START }
                    : { backgroundColor: "transparent" },
                ]}
                onPress={() => setTimeframe(tf.value)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? "#FFFFFF" : colors.TEXT_TERTIARY,
                      fontWeight: isActive
                        ? FONT_WEIGHT.BOLD
                        : FONT_WEIGHT.MEDIUM,
                    },
                  ]}
                >
                  {tf.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  title: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.MD,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: RADIUS.MD,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: RADIUS.SM,
  },
  tabText: {
    fontSize: FONT_SIZE.SM,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100, // Space for nav bar
  },
  scrollContent: {
    gap: SPACING.LG,
    paddingTop: SPACING.MD,
  },
  centerContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: FONT_SIZE.MD,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.MD,
  },
  statCard: {
    flex: 1,
    padding: SPACING.MD,
    borderRadius: RADIUS.LG,
  },
  statLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.XS,
  },
  statValue: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.LG,
    fontWeight: FONT_WEIGHT.BOLD,
    marginTop: SPACING.SM,
    marginBottom: -SPACING.SM,
  },
  chartCard: {
    padding: SPACING.MD,
    borderRadius: RADIUS.LG,
    alignItems: "center",
    minHeight: 220,
    justifyContent: "center",
  },
  emptyChart: {
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  pieContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: SPACING.MD,
  },
  pieCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  pieCenterText: {
    fontSize: FONT_SIZE.XS,
  },
  pieCenterValue: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  legendContainer: {
    width: "100%",
    marginTop: SPACING.XL,
    gap: SPACING.SM,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendIcon: {
    fontSize: FONT_SIZE.SM,
  },
  legendName: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  legendItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  legendAmount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  legendPct: {
    fontSize: FONT_SIZE.XS,
    width: 35,
    textAlign: "right",
  },
});
