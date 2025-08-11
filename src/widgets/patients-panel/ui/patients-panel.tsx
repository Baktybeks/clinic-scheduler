"use client";
import { Card, Button, Tabs, Badge } from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetPatientsQuery } from "@/entities/patient";
import { PatientList } from "@/entities/patient";
import { EnhancedSearch } from "@/features/patient-search";
import { PatientModal } from "@/features/patient-management/create-patient";
import type { SearchResult, Patient } from "@/shared/types";

const { TabPane } = Tabs;

interface PatientsPanelProps {
  onPatientSelect?: (patient: Patient | SearchResult) => void;
}

export function PatientsPanel({ onPatientSelect }: PatientsPanelProps) {
  const [activeTab, setActiveTab] = useState("recent");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: recentPatients = [], isLoading } = useGetPatientsQuery({
    limit: 10,
  });

  const handlePatientSelect = (patient: Patient | SearchResult) => {
    onPatientSelect?.(patient);
  };

  return (
    <Card
      title="Пациенты"
      extra={
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Новый пациент
        </Button>
      }
      className="h-full"
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <Badge count={recentPatients.length} size="small">
                Недавние
              </Badge>
            </span>
          }
          key="recent"
        >
          <PatientList
            patients={recentPatients}
            onPatientSelect={handlePatientSelect}
            loading={isLoading}
            compact
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <SearchOutlined />
              Поиск
            </span>
          }
          key="search"
        >
          <EnhancedSearch onPatientSelect={handlePatientSelect} />
        </TabPane>
      </Tabs>

      <PatientModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={(patientId) => {
          console.log("Создан новый пациент с ID:", patientId);
        }}
      />
    </Card>
  );
}
