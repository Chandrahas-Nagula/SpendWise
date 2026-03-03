/**
 * FloatingTabBar — Floating Island Bottom Tab Bar
 *
 * Inspired by iOS Dynamic Island (per 2024-2025 UI trends doc).
 * Pill-shaped, 16px from bottom, borderRadius 24, glassmorphic bg, 60px height.
 *
 * Designed as a custom tabBar component for @react-navigation/bottom-tabs.
 */

import React, { useCallback } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useTheme } from '../hooks/use-theme';
import { TAB_CONFIG } from '../constants/routes';
import {
  FONT_SIZE,
  FONT_WEIGHT,
  ICON_SIZE,
  LAYOUT,
  RADIUS,
  SPACING,
} from '../constants/sizes';

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.GLASS.TAB_BAR_BG,
          borderColor: colors.GLASS.BORDER,
          shadowColor: colors.SHADOW_COLOR,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabConfig = TAB_CONFIG[index];

        const onPress = useCallback(() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }, [isFocused, route.key, route.name, route.params]);

        const onLongPress = useCallback(() => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        }, [route.key]);

        const iconName = isFocused
          ? tabConfig?.iconActive
          : tabConfig?.iconInactive;
        const label = tabConfig?.label ?? options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={`${label} tab`}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <Ionicons
              name={(iconName ?? 'ellipse') as keyof typeof Ionicons.glyphMap}
              size={ICON_SIZE.LG}
              color={
                isFocused
                  ? colors.TAB_BAR_ACTIVE
                  : colors.TAB_BAR_INACTIVE
              }
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused
                    ? colors.TAB_BAR_ACTIVE
                    : colors.TAB_BAR_INACTIVE,
                  fontWeight: isFocused
                    ? FONT_WEIGHT.SEMIBOLD
                    : FONT_WEIGHT.REGULAR,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {isFocused && (
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: colors.TAB_BAR_ACTIVE },
                ]}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
//  Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: LAYOUT.TAB_BAR_BOTTOM_OFFSET,
    left: LAYOUT.TAB_BAR_HORIZONTAL_MARGIN,
    right: LAYOUT.TAB_BAR_HORIZONTAL_MARGIN,
    height: LAYOUT.TAB_BAR_HEIGHT,
    borderRadius: RADIUS.XXL,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.SM,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XS,
    minHeight: 44, // WCAG AA min touch target
  },
  label: {
    fontSize: FONT_SIZE.XXXS,
    marginTop: SPACING.XXXS,
  },
  indicator: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
