"use client";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { SearchResult } from "@/shared/types";

interface QuickSearchProps {
  onSelect?: (patient: SearchResult) => void;
  onCreateNew?: (searchTerm: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function QuickSearch({
  onSelect,
  onCreateNew,
  placeholder = "Быстрый поиск пациента...",
  style,
}: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    console.log("Поиск:", value);
  };

  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      style={style}
      allowClear
    />
  );
}
