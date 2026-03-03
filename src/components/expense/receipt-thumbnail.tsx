/**
 * ReceiptThumbnail — Receipt photo preview with Camera + Gallery options.
 *
 * Shows one "Add your receipt here" button. Clicking it gives an option
 * to take a photo or upload from gallery.
 * When a photo is selected, shows a thumbnail with an X to remove.
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";

interface ReceiptThumbnailProps {
  uri: string | null;
  onPick: (uri: string) => void;
  onRemove: () => void;
}

export const ReceiptThumbnail: React.FC<ReceiptThumbnailProps> = ({
  uri,
  onPick,
  onRemove,
}) => {
  const { colors, isDark } = useTheme();

  const takePhoto = useCallback(async () => {
    try {
      const permResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert(
          "Permission needed",
          "Please grant camera access to take receipt photos.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onPick(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to take photo.");
    }
  }, [onPick]);

  const pickFromGallery = useCallback(async () => {
    try {
      const permResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert(
          "Permission needed",
          "Please grant photo library access to attach receipts.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onPick(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image.");
    }
  }, [onPick]);

  const handlePressAdd = useCallback(() => {
    Alert.alert("Add Receipt", "Choose a photo source", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [takePhoto, pickFromGallery]);

  if (uri) {
    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
          Receipt
        </Text>
        <View style={styles.thumbnailRow}>
          <Image source={{ uri }} style={styles.thumbnail} />
          <TouchableOpacity
            style={[
              styles.removeBtn,
              { backgroundColor: colors.SEMANTIC.ERROR },
            ]}
            onPress={onRemove}
            accessibilityLabel="Remove receipt photo"
            accessibilityRole="button"
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
        Receipt
      </Text>

      <TouchableOpacity
        style={[
          styles.addBtn,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
            borderColor: colors.BORDER,
          },
        ]}
        onPress={handlePressAdd}
        accessibilityLabel="Add receipt photo"
        accessibilityRole="button"
      >
        <Text style={styles.addIcon}>📄</Text>
        <Text style={[styles.addText, { color: colors.TEXT_SECONDARY }]}>
          Add your receipt here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.SM,
  },
  thumbnailRow: {
    position: "relative",
    alignSelf: "flex-start",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.MD,
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: SPACING.SM,
  },
  addIcon: {
    fontSize: FONT_SIZE.MD,
  },
  addText: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
});
