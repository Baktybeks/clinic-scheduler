"use client";
import { Modal, message } from "antd";
import { useCreatePatientMutation } from "@/entities/patient";
import { PatientForm } from "../patient-form/patient-form";
import type { CreatePatientRequest } from "@/entities/patient";

interface PatientModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (patientId: number) => void;
}

export function PatientModal({
  visible,
  onClose,
  onSuccess,
}: PatientModalProps) {
  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const handleSubmit = async (values: CreatePatientRequest) => {
    try {
      const result = await createPatient(values).unwrap();
      message.success("Пациент успешно добавлен!");
      onSuccess?.(result.id);
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Ошибка при создании пациента";
      message.error(errorMessage);
      console.error("Error creating patient:", error);
    }
  };

  return (
    <Modal
      title="Новый пациент"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <PatientForm onSubmit={handleSubmit} loading={isLoading} />
    </Modal>
  );
}
