/**
 * AddExpenseScreen — Redirect to the BottomSheet-based add expense flow.
 *
 * This screen exists only for deep-link routing purposes.
 * Opening it immediately triggers the global add-expense sheet and pops back.
 */

import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAddExpenseSheet } from "../../providers/add-expense-provider";

export const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { open } = useAddExpenseSheet();

  useEffect(() => {
    open();
    navigation.goBack();
  }, [open, navigation]);

  return <View style={{ flex: 1 }} />;
};
