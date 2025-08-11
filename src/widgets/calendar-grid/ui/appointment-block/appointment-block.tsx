"use client";
import { AppointmentCard } from "@/entities/appointment";
import { StatusChanger } from "@/features/appointment-management/update-appointment";
import { useUpdateAppointmentStore } from "@/features/appointment-management/update-appointment";
import type { Appointment, AppointmentStatus } from "@/shared/types";
import type { CSSProperties } from "react";

interface AppointmentBlockProps {
  appointment: Appointment;
  doctor: string;
  style: CSSProperties;
}

export function AppointmentBlock({
  appointment,
  doctor,
  style,
}: AppointmentBlockProps) {
  const { isUpdating } = useUpdateAppointmentStore();

  const handleStatusChange = (newStatus: AppointmentStatus) => {
    console.log(`Appointment ${appointment.id} status changed to ${newStatus}`);
  };

  return (
    <StatusChanger
      appointment={appointment}
      onStatusChange={handleStatusChange}
    >
      <div className={`${isUpdating ? "opacity-50" : ""}`} style={style}>
        <AppointmentCard appointment={appointment} doctor={doctor} />
        {isUpdating && (
          <div className="text-xs mt-1 opacity-75">Обновление...</div>
        )}
      </div>
    </StatusChanger>
  );
}
