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

const CalendarSkeleton = () => (
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

export function CalendarPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CalendarSkeleton />;
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar />
      <Layout>
        <CalendarHeader />
        <Content className="flex-1 overflow-hidden">
          <div className="h-full">
            {!isMobile && (
              <div className="p-4 pb-0">
                <StatisticsPanel />
              </div>
            )}

            <div className="flex-1 h-full">
              {isMobile ? (
                <MobileCalendar />
              ) : (
                <div className="h-full p-4 pt-2">
                  <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <CalendarGrid className="h-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
