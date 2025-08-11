"use client";
import { Button } from "antd";
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

export function CalendarHeader({ onPatientSelect }: CalendarHeaderProps) {
  const { nextDay, prevDay, goToToday, formatCurrentDate } =
    useCalendarHeaderStore();

  const handlePatientSelect = (patient: SearchResult) => {
    console.log("Выбран пациент:", patient);
    onPatientSelect?.(patient);
  };

  const handleCreateNewPatient = (searchTerm: string) => {
    console.log("Создать нового пациента с именем:", searchTerm);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
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
            {formatCurrentDate()}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <QuickSearch
              onSelect={handlePatientSelect}
              onCreateNew={handleCreateNewPatient}
              style={{ width: 300 }}
              placeholder="Поиск пациента..."
            />
          </div>
          <Button icon={<SearchOutlined />} className="md:hidden" />
        </div>
      </div>
    </div>
  );
}
