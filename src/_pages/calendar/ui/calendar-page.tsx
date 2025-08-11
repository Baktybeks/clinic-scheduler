"use client";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/shared/lib/hooks";
import {
  Sidebar,
  CalendarHeader,
  CalendarGrid,
  MobileCalendar,
  StatisticsPanel,
} from "@/widgets";

const { Content } = Layout;

export function CalendarPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout className="min-h-screen">
        <div className="flex">
          <div className="w-60 bg-gray-50 animate-pulse" />
          <div className="flex-1">
            <div className="h-20 bg-white animate-pulse border-b" />
            <div className="p-4">
              <div className="h-32 bg-white animate-pulse rounded mb-4" />
              <div className="h-96 bg-white animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <CalendarHeader />
        <Content className="flex-1 overflow-hidden">
          <div className="p-4">
            {!isMobile && <StatisticsPanel />}
            {isMobile ? <MobileCalendar /> : <CalendarGrid />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
