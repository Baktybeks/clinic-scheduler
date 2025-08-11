import { List, Empty } from "antd";
import { PatientCard } from "../patient-card/patient-card";
import type { Patient } from "@/shared/types";

interface PatientListProps {
  patients: Patient[];
  onPatientSelect?: (patient: Patient) => void;
  loading?: boolean;
  compact?: boolean;
}

export function PatientList({
  patients,
  onPatientSelect,
  loading = false,
  compact = false,
}: PatientListProps) {
  if (patients.length === 0 && !loading) {
    return <Empty description="Пациенты не найдены" />;
  }

  return (
    <List
      loading={loading}
      dataSource={patients}
      renderItem={(patient) => (
        <List.Item>
          <PatientCard
            patient={patient}
            onClick={() => onPatientSelect?.(patient)}
            compact={compact}
          />
        </List.Item>
      )}
    />
  );
}
