"use client";
import { Card, Statistic, Row, Col, Select } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const mockStats = {
  totalAppointments: 25,
  completedAppointments: 18,
  cancelledAppointments: 2,
  todayAppointments: 8,
};

export function StatisticsPanel() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Статистика</h2>
        <Select defaultValue="today" style={{ width: 120 }}>
          <Option value="today">Сегодня</Option>
          <Option value="week">Неделя</Option>
          <Option value="month">Месяц</Option>
        </Select>
      </div>

      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Всего записей"
              value={mockStats.totalAppointments}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Завершено"
              value={mockStats.completedAppointments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Отменено"
              value={mockStats.cancelledAppointments}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Сегодня"
              value={mockStats.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
