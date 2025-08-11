"use client";
import { Layout, Card, Row, Col, Statistic, Button } from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useGetPatientsQuery } from "@/entities/patient";
import { PatientList } from "@/entities/patient";
import { EnhancedSearch } from "@/features/patient-search";
import { PatientModal } from "@/features/patient-management/create-patient";
import { Sidebar } from "@/widgets/sidebar";

const { Content, Header } = Layout;

export function PatientsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: patients = [], isLoading } = useGetPatientsQuery({});

  const todayPatients = patients.filter((patient) => {
    return true;
  });

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6">
          <div className="flex justify-between items-center h-full">
            <h1 className="text-xl font-semibold">Управление пациентами</h1>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalVisible(true)}
              size="large"
            >
              Добавить пациента
            </Button>
          </div>
        </Header>

        <Content className="p-6">
          <Row gutter={16} className="mb-6">
            <Col xs={12} sm={8}>
              <Card>
                <Statistic
                  title="Всего пациентов"
                  value={patients.length}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card>
                <Statistic
                  title="Записи сегодня"
                  value={todayPatients.length}
                  prefix={<PhoneOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card>
                <Statistic
                  title="Новые за месяц"
                  value={12}
                  prefix={<UserAddOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Поиск */}
            <Col xs={24} lg={8}>
              <Card title="Поиск пациентов" className="mb-4">
                <EnhancedSearch />
              </Card>
            </Col>

            {/* Список пациентов */}
            <Col xs={24} lg={16}>
              <Card title="Все пациенты">
                <PatientList
                  patients={patients}
                  loading={isLoading}
                  onPatientSelect={(patient) => {
                    console.log("Выбран пациент:", patient);
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>

      <PatientModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={(patientId) => {
          console.log("Создан новый пациент:", patientId);
        }}
      />
    </Layout>
  );
}
