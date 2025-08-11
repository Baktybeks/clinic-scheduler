"use client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { store } from "./store";
import { theme } from "@/shared/config/theme";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ConfigProvider locale={ruRU} theme={theme}>
        {children}
      </ConfigProvider>
    </Provider>
  );
}
