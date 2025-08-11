"use client";
import { message } from "antd";
import { useUpdateAppointmentMutation } from "@/entities/appointment";
import { useUpdateAppointmentStore } from "../../model/store";
import type { Appointment, AppointmentStatus } from "@/shared/types";

interface StatusChangerProps {
  appointment: Appointment;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  children: React.ReactNode;
}

export function StatusChanger({
  appointment,
  onStatusChange,
  children,
}: StatusChangerProps) {
  const [updateAppointment] = useUpdateAppointmentMutation();
  const { getNextStatus, setIsUpdating } = useUpdateAppointmentStore();

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    try {
      setIsUpdating(true);
      await updateAppointment({
        id: appointment.id,
        status: newStatus,
      }).unwrap();

      message.success(`Статус изменен на "${newStatus}"`);
      onStatusChange?.(newStatus);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Ошибка при обновлении статуса";
      message.error(errorMessage);
      console.error("Ошибка обновления:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDoubleClick = () => {
    const newStatus = getNextStatus(appointment.status);
    handleStatusChange(newStatus);
  };

  return <div onDoubleClick={handleDoubleClick}>{children}</div>;
}
