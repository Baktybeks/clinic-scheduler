import { Card } from "antd";
import { PatientInfo } from "../patient-info/patient-info";
import type { Patient } from "@/shared/types";

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
  compact?: boolean;
}

export function PatientCard({
  patient,
  onClick,
  compact = false,
}: PatientCardProps) {
  return (
    <Card
      size={compact ? "small" : "default"}
      hoverable={!!onClick}
      onClick={onClick}
      className="cursor-pointer"
    >
      <PatientInfo
        name={patient.name}
        phone={patient.phone}
        email={patient.email}
        compact={compact}
      />
      {patient.notes && !compact && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-500">Заметки</label>
          <div className="text-sm text-gray-600">{patient.notes}</div>
        </div>
      )}
    </Card>
  );
}
