/**
 * PlaceholderScreen — Reusable empty screen template
 *
 * Shows the screen name centered with theme-aware styling.
 * Used for all 22 screens during Phase 1 until real UI is built.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/use-theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/sizes';

interface PlaceholderScreenProps {
  readonly name: string;
  readonly icon?: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  name,
  icon = '📱',
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.BACKGROUND,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.name, { color: colors.TEXT_PRIMARY }]}>
        {name}
      </Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_TERTIARY }]}>
        Coming soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  name: {
    fontSize: FONT_SIZE.XXL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.REGULAR,
  },
});
