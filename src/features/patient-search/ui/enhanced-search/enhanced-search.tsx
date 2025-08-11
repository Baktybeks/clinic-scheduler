"use client";
import { Input, Drawer, Button, Spin } from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSearchPatientsQuery } from "@/entities/appointment";
import { useDebounce } from "@/shared/lib/hooks";
import { SearchResults } from "../search-results/search-results";
import { PatientModal } from "@/features/patient-management/create-patient";
import type { SearchResult } from "@/shared/types";

interface EnhancedSearchProps {
  onPatientSelect?: (patient: SearchResult) => void;
  placeholder?: string;
}

export function EnhancedSearch({
  onPatientSelect,
  placeholder = "Поиск пациента...",
}: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults = [], isLoading } = useSearchPatientsQuery(
    debouncedSearchTerm,
    { skip: debouncedSearchTerm.length < 2 }
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 1) {
      setIsDrawerOpen(true);
    }
  };

  const handlePatientSelect = (patient: SearchResult) => {
    onPatientSelect?.(patient);
    setIsDrawerOpen(false);
    setSearchTerm("");
  };

  const handleCreateNew = () => {
    setIsPatientModalOpen(true);
    setIsDrawerOpen(false);
  };

  const suffix = isLoading ? (
    <Spin size="small" indicator={<LoadingOutlined spin />} />
  ) : (
    <SearchOutlined />
  );

  return (
    <>
      <div className="relative">
        <Input
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          suffix={suffix}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 1 && setIsDrawerOpen(true)}
          size="large"
        />
      </div>

      <Drawer
        title="Результаты поиска"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleCreateNew}
          >
            Новый пациент
          </Button>
        }
      >
        <SearchResults
          results={searchResults}
          onSelect={handlePatientSelect}
          onCreateNew={handleCreateNew}
          loading={isLoading}
        />
      </Drawer>

      <PatientModal
        visible={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
