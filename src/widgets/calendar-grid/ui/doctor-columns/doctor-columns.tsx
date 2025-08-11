"use client";
import { DoctorHeader } from "@/entities/doctor";
import { AppointmentBlock } from "../appointment-block/appointment-block";
import { useCalendarGridStore, timeUtils } from "../../model/store";
import type { Doctor } from "@/shared/types";

interface DoctorColumnsProps {
  doctors: Doctor[];
  onTimeSlotClick?: (
    timeSlot: string,
    doctorId: number,
    doctorName: string
  ) => void;
}

export function DoctorColumns({
  doctors,
  onTimeSlotClick,
}: DoctorColumnsProps) {
  const { timeSlots, calculateAppointmentPosition } = useCalendarGridStore();

  return (
    <>
      {doctors.map((doctor) => (
        <div key={doctor.id} className="doctor-column relative">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="time-slot bg-transparent border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => onTimeSlotClick?.(time, doctor.id, doctor.name)}
              title={`Создать запись на ${time} к врачу ${doctor.name}`}
            />
          ))}

          {doctor.appointments
            .filter((appointment) =>
              timeUtils.isTimeInWorkingHours(appointment.timeStart)
            )
            .map((appointment) => {
              const position = calculateAppointmentPosition(
                appointment.timeStart,
                appointment.timeEnd
              );

              if (position.top < 0) {
                console.warn(
                  `Appointment ${appointment.id} has negative position`
                );
                return null;
              }

              return (
                <AppointmentBlock
                  key={appointment.id}
                  appointment={appointment}
                  doctor={doctor.name}
                  style={position}
                />
              );
            })}
        </div>
      ))}
    </>
  );
}
