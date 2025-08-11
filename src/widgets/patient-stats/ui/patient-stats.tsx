"use client";
import { Card, Statistic, Row, Col, Spin } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  CalendarOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useGetPatientAppointmentStatsQuery } from "@/entities/patient";

export function PatientStats() {
  const { data: stats, isLoading } = useGetPatientAppointmentStatsQuery();

  if (isLoading) {
    return (
      <Row gutter={16} className="mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Col xs={12} sm={6} key={i}>
            <Card className="text-center">
              <Spin />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={16} className="mb-6">
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <Statistic
            title="Всего пациентов"
            value={stats?.totalPatients || 0}
            prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <Statistic
            title="Активных"
            value={stats?.activePatients || 0}
            prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <Statistic
            title="Записей сегодня"
            value={stats?.appointmentsToday || 0}
            prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card className="text-center">
          <Statistic
            title="Новых за месяц"
            value={stats?.newPatientsThisMonth || 0}
            prefix={<UserAddOutlined style={{ color: "#722ed1" }} />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
