/**
 * AddExpenseProvider — Global provider for the Add Expense bottom sheet.
 *
 * Wraps the app with BottomSheetModalProvider and exposes
 * useAddExpenseSheet() hook with open()/close() methods.
 *
 * This ensures a single BottomSheet instance accessible from any screen
 * (Home FAB, Transactions FAB, etc.).
 */

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { AddExpenseSheet } from "../components/expense/add-expense-sheet";

// ---------------------------------------------------------------------------
//  Context
// ---------------------------------------------------------------------------

interface AddExpenseSheetContextValue {
  open: () => void;
  close: () => void;
}

const AddExpenseSheetContext = createContext<AddExpenseSheetContextValue>({
  open: () => {},
  close: () => {},
});

export const useAddExpenseSheet = (): AddExpenseSheetContextValue =>
  useContext(AddExpenseSheetContext);

// ---------------------------------------------------------------------------
//  Provider
// ---------------------------------------------------------------------------

interface AddExpenseProviderProps {
  children: ReactNode;
}

export const AddExpenseProvider: React.FC<AddExpenseProviderProps> = ({
  children,
}) => {
  const sheetRef = useRef<BottomSheet>(null);

  const open = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <AddExpenseSheetContext.Provider value={{ open, close }}>
      {children}
      <AddExpenseSheet ref={sheetRef} />
    </AddExpenseSheetContext.Provider>
  );
};
