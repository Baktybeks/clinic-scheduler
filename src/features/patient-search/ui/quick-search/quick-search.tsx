"use client";
import { AutoComplete, Spin } from "antd";
import { LoadingOutlined, UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSearchPatientsQuery } from "@/entities/appointment";
import { useDebounce } from "@/shared/lib/hooks";
import { formatPhone } from "@/shared/lib/phone-utils";
import type { SearchResult } from "@/shared/types";

interface QuickSearchProps {
  onSelect?: (patient: SearchResult) => void;
  onCreateNew?: (searchTerm: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

interface SearchOption {
  value: string;
  label: React.ReactNode;
  patient?: SearchResult;
  isCreateNew?: boolean;
}

export function QuickSearch({
  onSelect,
  onCreateNew,
  placeholder = "Быстрый поиск пациента...",
  style,
}: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults = [], isLoading } = useSearchPatientsQuery(
    debouncedSearchTerm,
    { skip: debouncedSearchTerm.length < 2 }
  );

  const options: SearchOption[] = [
    ...searchResults.map((result) => ({
      value: `${result.patient}-${result.id}`,
      label: (
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{result.patient}</div>
            <div className="text-xs text-gray-400">
              {formatPhone(result.phone)}
            </div>
          </div>
          <div className="text-xs text-gray-400">{result.doctor}</div>
        </div>
      ),
      patient: result,
    })),

    ...(searchTerm.length >= 2 &&
    searchResults.length === 0 &&
    !isLoading &&
    onCreateNew
      ? [
          {
            value: `create-new-${searchTerm}`,
            label: (
              <div className="flex items-center text-blue-600">
                <UserAddOutlined className="mr-2" />
                Создать нового пациента "{searchTerm}"
              </div>
            ),
            isCreateNew: true,
          },
        ]
      : []),
  ];

  const handleSelect = (value: string, option: SearchOption) => {
    if (option.isCreateNew) {
      onCreateNew?.(searchTerm);
    } else if (option.patient) {
      onSelect?.(option.patient);
    }
    setSearchTerm("");
  };

  const notFoundContent = isLoading ? (
    <div className="flex items-center justify-center py-2">
      <Spin size="small" indicator={<LoadingOutlined spin />} />
      <span className="ml-2 text-gray-500">Поиск...</span>
    </div>
  ) : null;

  return (
    <AutoComplete
      options={options}
      onSearch={setSearchTerm}
      onSelect={handleSelect}
      placeholder={placeholder}
      allowClear
      style={style}
      notFoundContent={notFoundContent}
      value={searchTerm}
      filterOption={false}
    />
  );
}
