"use client";
import { Card, Row, Col, Input, Select, DatePicker, Button, Space } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface PatientFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (dates: any) => void;
  onReset: () => void;
}

export function PatientFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onReset,
}: PatientFiltersProps) {
  return (
    <Card className="mb-6">
      <Row gutter={16} align="middle">
        <Col xs={24} sm={8}>
          <Input
            placeholder="Поиск по имени, телефону или врачу..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={12} sm={4}>
          <Select
            placeholder="Статус"
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={onStatusChange}
          >
            <Option value="all">Все статусы</Option>
            <Option value="Активный">Активный</Option>
            <Option value="Записан">Записан</Option>
            <Option value="Завершен">Завершен</Option>
            <Option value="Отменен">Отменен</Option>
          </Select>
        </Col>
        <Col xs={12} sm={6}>
          <RangePicker
            placeholder={["Дата от", "Дата до"]}
            style={{ width: "100%" }}
            onChange={onDateRangeChange}
          />
        </Col>
        <Col xs={24} sm={6}>
          <Space>
            <Button icon={<FilterOutlined />}>Фильтры</Button>
            <Button onClick={onReset}>Сбросить</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
