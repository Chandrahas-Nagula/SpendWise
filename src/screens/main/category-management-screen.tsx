import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import { useCategories } from "../../hooks/use-categories";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { GlassmorphicCard } from "../../components/ui/glassmorphic-card";
import { Skeleton } from "../../components/ui/skeleton";
import { CategoryIcon } from "../../components/ui/category-icon";
import { LinearGradient } from "expo-linear-gradient";
import { BRAND } from "../../constants/colors";

const ICONS = ["🛒", "🎬", "🍔", "🚗", "🏠", "💡", "🎮", "✈️", "🎁", "💊"];
const COLORS = [
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
];

export const CategoryManagementScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const {
    expenseCategories,
    incomeCategories,
    repo,
    userId,
    refresh,
    isLoading,
  } = useCategories();

  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState(ICONS[0]);
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const categories =
    activeTab === "expense" ? expenseCategories : incomeCategories;

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      Alert.alert("Invalid", "Please provide a name for the category.");
      return;
    }
    setIsSaving(true);
    try {
      await repo.addCategory({
        user_id: userId,
        name: newName.trim(),
        icon: newIcon,
        color: newColor,
        type: activeTab,
      });
      setNewName("");
      setIsAdding(false);
      refresh();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to add category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete '${name}'? Existing transactions will retain their data but lose the category tag.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await repo.deleteCategory(id);
              refresh();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to delete.");
            }
          },
        },
      ],
    );
  };

  const renderCategoryList = () => {
    if (isLoading) {
      return (
        <GlassmorphicCard style={styles.listCard}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={[styles.catRow, { opacity: 1 - i * 0.15 }]}>
              <Skeleton width={36} height={36} borderRadius={18} />
              <Skeleton
                width="40%"
                height={20}
                style={{ marginLeft: SPACING.SM, flex: 1 }}
              />
              <Skeleton
                width={12}
                height={12}
                borderRadius={6}
                style={{ marginHorizontal: SPACING.SM }}
              />
            </View>
          ))}
        </GlassmorphicCard>
      );
    }

    return (
      <Animated.View entering={FadeInUp.delay(0).duration(400)}>
        <GlassmorphicCard style={styles.listCard}>
          {categories.map((cat, i) => (
            <React.Fragment key={cat.id || i}>
              <View style={styles.catRow}>
                <CategoryIcon
                  icon={cat.icon}
                  size={22}
                  style={styles.catIcon as any}
                />
                <Text style={[styles.catName, { color: colors.TEXT_PRIMARY }]}>
                  {cat.name}
                </Text>
                <View
                  style={[styles.colorDot, { backgroundColor: cat.color }]}
                />
                {(cat as any).user_id && (
                  <Pressable
                    onPress={() => handleDeleteCategory(cat.id, cat.name)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </Pressable>
                )}
              </View>
              {i < categories.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: colors.DIVIDER }]}
                />
              )}
            </React.Fragment>
          ))}
        </GlassmorphicCard>
      </Animated.View>
    );
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
          Categories
        </Text>
        <Pressable onPress={() => setIsAdding(!isAdding)} style={styles.addBtn}>
          <Text style={{ color: BRAND.PRIMARY_START, fontWeight: "bold" }}>
            {isAdding ? "Cancel" : "Add New"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        {(["expense", "income"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: BRAND.PRIMARY_START },
            ]}
            onPress={() => {
              setActiveTab(tab);
              setIsAdding(false);
            }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab
                      ? BRAND.PRIMARY_START
                      : colors.TEXT_TERTIARY,
                },
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isAdding && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <GlassmorphicCard style={styles.addForm}>
              <Text style={[styles.formTitle, { color: colors.TEXT_PRIMARY }]}>
                New {activeTab === "expense" ? "Expense" : "Income"} Category
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.TEXT_PRIMARY,
                    borderColor: colors.BORDER,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  },
                ]}
                placeholder="Category Name"
                placeholderTextColor={colors.TEXT_TERTIARY}
                value={newName}
                onChangeText={setNewName}
              />

              <Text
                style={[styles.formLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Select Icon
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pickerRow}
              >
                {ICONS.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setNewIcon(icon)}
                    style={[
                      styles.iconOption,
                      newIcon === icon && {
                        borderColor: BRAND.PRIMARY_START,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <CategoryIcon icon={icon} size={24} />
                  </Pressable>
                ))}
              </ScrollView>

              <Text
                style={[styles.formLabel, { color: colors.TEXT_SECONDARY }]}
              >
                Select Color
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pickerRow}
              >
                {COLORS.map((col) => (
                  <Pressable
                    key={col}
                    onPress={() => setNewColor(col)}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: col,
                        opacity: newColor === col ? 1 : 0.4,
                      },
                      newColor === col && {
                        borderColor: isDark ? "#fff" : "#000",
                        borderWidth: 2,
                      },
                    ]}
                  />
                ))}
              </ScrollView>

              <Pressable
                onPress={handleAddCategory}
                disabled={isSaving}
                style={styles.submitBtn}
              >
                <LinearGradient
                  colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitText}>
                    {isSaving ? "Saving..." : "Add Category"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </GlassmorphicCard>
          </Animated.View>
        )}

        {!isAdding && renderCategoryList()}
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
  addBtn: { padding: SPACING.SM },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.2)",
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.SM,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  listCard: { borderRadius: RADIUS.LG, overflow: "hidden" },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  catIcon: { fontSize: 22, width: 36 },
  catName: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: SPACING.SM,
  },
  deleteBtn: { padding: SPACING.XS },
  deleteIcon: { fontSize: 16 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 56 },

  addForm: {
    padding: SPACING.LG,
    borderRadius: RADIUS.LG,
    marginBottom: SPACING.LG,
  },
  formTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.LG,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.MD,
    padding: SPACING.MD,
    fontSize: FONT_SIZE.MD,
    marginBottom: SPACING.LG,
  },
  formLabel: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.SM,
    textTransform: "uppercase",
  },
  pickerRow: {
    flexDirection: "row",
    marginBottom: SPACING.LG,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.SM,
    backgroundColor: "rgba(150,150,150,0.1)",
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.SM,
  },
  submitBtn: {
    marginTop: SPACING.SM,
    borderRadius: RADIUS.MD,
    overflow: "hidden",
  },
  submitGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: FONT_SIZE.MD,
  },
});
