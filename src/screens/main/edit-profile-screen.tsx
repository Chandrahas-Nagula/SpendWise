import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../stores/auth-provider";
import { supabase } from "../../services/supabase/client";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";

export const EditProfileScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { session } = useAuth();

  const [displayName, setDisplayName] = useState(
    session?.user?.user_metadata?.full_name ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Please enter a display name.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName.trim() },
      });
      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }, [displayName, navigation]);

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
          Edit Profile
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
              style={styles.avatarRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View
                style={[
                  styles.avatarInner,
                  { backgroundColor: colors.BACKGROUND },
                ]}
              >
                <Text style={styles.avatarLetter}>
                  {(displayName || "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Display Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Display Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.TEXT_PRIMARY,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: colors.BORDER,
                },
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={colors.TEXT_TERTIARY}
              maxLength={50}
              autoCapitalize="words"
            />
          </View>

          {/* Email (read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
              Email
            </Text>
            <View
              style={[
                styles.readOnlyField,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: colors.BORDER,
                },
              ]}
            >
              <Text
                style={[styles.readOnlyText, { color: colors.TEXT_TERTIARY }]}
              >
                {session?.user?.email ?? "—"}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.BORDER,
              backgroundColor: isDark
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.9)",
            },
          ]}
        >
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveBtnWrapper,
              pressed && { opacity: 0.8 },
              isSaving && { opacity: 0.5 },
            ]}
          >
            <LinearGradient
              colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
              style={styles.saveBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: SPACING.XXL,
    gap: SPACING.LG,
  },
  avatarSection: { alignItems: "center", paddingVertical: SPACING.LG },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontSize: 40, fontWeight: "bold", color: "#6C63FF" },
  fieldGroup: { gap: SPACING.XS },
  label: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    fontSize: FONT_SIZE.MD,
    borderWidth: 1,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  readOnlyField: {
    borderWidth: 1,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  readOnlyText: { fontSize: FONT_SIZE.MD },
  footer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
    paddingBottom: 100,
    borderTopWidth: 1,
  },
  saveBtnWrapper: { borderRadius: RADIUS.MD, overflow: "hidden" },
  saveBtnGradient: {
    paddingVertical: SPACING.MD,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
