/**
 * MainTabNavigator — Bottom Tab Navigator with Floating Island Tab Bar
 *
 * Houses the 4 tab stacks: Home, Transactions, Analytics, Profile.
 * Uses the custom FloatingTabBar component.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Navigators } from '../constants/routes';
import { useTheme } from '../hooks/use-theme';
import type { MainTabsParamList } from '../types/navigation';

import { FloatingTabBar } from './floating-tab-bar';
import {
  HomeStackNavigator,
  TransactionsStackNavigator,
  AnalyticsStackNavigator,
  ProfileStackNavigator,
} from './stacks';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Transparent so floating tab bar shows over content
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name={Navigators.HOME_STACK}
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name={Navigators.TRANSACTIONS_STACK}
        component={TransactionsStackNavigator}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen
        name={Navigators.ANALYTICS_STACK}
        component={AnalyticsStackNavigator}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen
        name={Navigators.PROFILE_STACK}
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
