"use client";
import { AutoComplete, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSearchPatientsQuery } from "@/entities/appointment";
import { usePatientSearchStore } from "../../model/store";
import { useDebounce } from "@/shared/lib/hooks";
import { useMemo } from "react";
import type { SearchResult } from "@/shared/types";

interface SearchInputProps {
  placeholder?: string;
  onSelect?: (patient: SearchResult) => void;
  style?: React.CSSProperties;
}

interface SearchOption {
  value: string;
  label: React.ReactNode;
  patient: SearchResult;
}

export function SearchInput({
  placeholder = "Поиск пациента...",
  onSelect,
  style,
}: SearchInputProps) {
  const { searchTerm, setSearchTerm, setSelectedPatient, addToSearchHistory } =
    usePatientSearchStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults = [], isLoading } = useSearchPatientsQuery(
    debouncedSearchTerm,
    { skip: debouncedSearchTerm.length < 2 }
  );

  const searchOptions = useMemo<SearchOption[]>(() => {
    return searchResults.map((result) => ({
      value: result.patient,
      label: (
        <div className="flex justify-between">
          <span>{result.patient}</span>
          <span className="text-gray-400">{result.phone}</span>
        </div>
      ),
      patient: result,
    }));
  }, [searchResults]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelect = (value: string, option: SearchOption) => {
    setSelectedPatient(option.patient);
    addToSearchHistory(value);
    onSelect?.(option.patient);
  };

  const notFoundContent = useMemo(() => {
    if (isLoading && searchTerm.length >= 2) {
      return (
        <div className="flex items-center justify-center py-2">
          <Spin size="small" indicator={<LoadingOutlined spin />} />
          <span className="ml-2 text-gray-500">Поиск...</span>
        </div>
      );
    }

    if (searchTerm.length >= 2 && searchResults.length === 0 && !isLoading) {
      return (
        <div className="py-2 text-center text-gray-500">
          Пациенты не найдены
        </div>
      );
    }

    if (searchTerm.length > 0 && searchTerm.length < 2) {
      return (
        <div className="py-2 text-center text-gray-400 text-xs">
          Введите минимум 2 символа
        </div>
      );
    }

    return null;
  }, [isLoading, searchTerm.length, searchResults.length]);

  return (
    <AutoComplete
      options={searchOptions}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder={placeholder}
      allowClear
      style={style}
      notFoundContent={notFoundContent}
      value={searchTerm}
      onChange={setSearchTerm}
    />
  );
}
