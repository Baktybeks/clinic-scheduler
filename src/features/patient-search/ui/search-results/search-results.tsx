"use client";
import { List, Button, Empty } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { PatientInfo } from "@/entities/patient";
import type { SearchResult } from "@/shared/types";

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onCreateNew?: () => void;
  loading?: boolean;
}

export function SearchResults({
  results,
  onSelect,
  onCreateNew,
  loading = false,
}: SearchResultsProps) {
  if (loading) {
    return <List loading />;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Empty description="Пациенты не найдены" />
        {onCreateNew && (
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={onCreateNew}
            className="mt-4"
          >
            Добавить нового пациента
          </Button>
        )}
      </div>
    );
  }

  return (
    <List
      dataSource={results}
      renderItem={(result) => (
        <List.Item
          className="hover:bg-gray-50 cursor-pointer rounded"
          onClick={() => onSelect(result)}
        >
          <div className="w-full flex justify-between items-center">
            <PatientInfo name={result.patient} phone={result.phone} compact />
            <div className="text-xs text-gray-400">{result.doctor}</div>
          </div>
        </List.Item>
      )}
    />
  );
}
