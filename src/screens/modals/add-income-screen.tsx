/**
 * AddIncomeScreen — Redirect to the BottomSheet-based add expense flow (income mode).
 *
 * Deep-link redirect → opens the global add-expense sheet and pops back.
 */

import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAddExpenseSheet } from "../../providers/add-expense-provider";

export const AddIncomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { open } = useAddExpenseSheet();

  useEffect(() => {
    open();
    navigation.goBack();
  }, [open, navigation]);

  return <View style={{ flex: 1 }} />;
};
