"use client";
import { AppointmentCard } from "@/entities/appointment";
import type { Appointment } from "@/shared/types";

interface MobileAppointmentCardProps {
  appointment: Appointment;
  doctor: string;
}

export function MobileAppointmentCard({
  appointment,
  doctor,
}: MobileAppointmentCardProps) {
  return (
    <AppointmentCard appointment={appointment} doctor={doctor}>
      <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
        <div className="text-xs text-blue-600 font-medium">
          {appointment.timeStart} - {appointment.timeEnd}
        </div>
        <div className="text-sm font-semibold">{appointment.patient}</div>
        <div className="text-xs text-gray-500">
          {appointment.type} • {appointment.status}
        </div>
      </div>
    </AppointmentCard>
  );
}
