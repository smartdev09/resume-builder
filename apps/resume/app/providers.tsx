'use client'

import { Provider } from "react-redux";
import { store } from "utils/lib/redux/store";
import { ReactNode } from "react";
import { useSaveStateToLocalStorageOnChange, useSetInitialStore } from "utils/lib/redux/hooks";

function ReduxStateManager() {
  useSaveStateToLocalStorageOnChange();
  useSetInitialStore();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxStateManager />
      {children}
    </Provider>
  );
} 