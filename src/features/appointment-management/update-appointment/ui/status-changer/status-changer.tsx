"use client";
import { message } from "antd";
import { useUpdateAppointmentMutation } from "@/entities/appointment";
import { useUpdateAppointmentStore } from "../../model/store";
import type { Appointment, AppointmentStatus } from "@/shared/types";
import { cloneElement, isValidElement, ReactElement } from "react";

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
      console.log(`Changing status from ${appointment.status} to ${newStatus}`);

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
    console.log(
      "StatusChanger: double click detected for appointment",
      appointment.id
    );
    const newStatus = getNextStatus(appointment.status);
    console.log("StatusChanger: changing status to", newStatus);
    handleStatusChange(newStatus);
  };

  if (isValidElement(children)) {
    const childElement = children as ReactElement<any>;
    const existingProps = childElement.props || {};

    return cloneElement(childElement, {
      ...existingProps,
      onDoubleClick: handleDoubleClick,
    });
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        width: "100%",
        height: "100%",
        display: "contents",
      }}
    >
      {children}
    </div>
  );
}
