"use client";
import { Button } from "antd";
import { useEffect, useState } from "react";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCalendarHeaderStore } from "../model/store";
import { QuickSearch } from "@/features/patient-search";
import type { SearchResult } from "@/shared/types";

interface CalendarHeaderProps {
  onPatientSelect?: (patient: SearchResult) => void;
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function CalendarHeader({ onPatientSelect }: CalendarHeaderProps) {
  const { nextDay, prevDay, goToToday, formatCurrentDate } =
    useCalendarHeaderStore();

  const isClient = useIsClient();

  const handlePatientSelect = (patient: SearchResult) => {
    console.log("Выбран пациент:", patient);
    onPatientSelect?.(patient);
  };

  const handleCreateNewPatient = (searchTerm: string) => {
    console.log("Создать нового пациента с именем:", searchTerm);
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button icon={<LeftOutlined />} onClick={prevDay} size="large" />
          <Button icon={<RightOutlined />} onClick={nextDay} size="large" />
          <Button
            icon={<CalendarOutlined />}
            onClick={goToToday}
            type="primary"
            className="hidden md:flex"
          >
            Сегодня
          </Button>
          <div className="text-lg font-semibold text-gray-800">
            {isClient ? formatCurrentDate() : "Загрузка..."}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            {isClient && (
              <QuickSearch
                onSelect={handlePatientSelect}
                onCreateNew={handleCreateNewPatient}
                style={{ width: 300 }}
                placeholder="Поиск пациента..."
              />
            )}
          </div>
          <Button icon={<SearchOutlined />} className="md:hidden" />
        </div>
      </div>
    </div>
  );
}
