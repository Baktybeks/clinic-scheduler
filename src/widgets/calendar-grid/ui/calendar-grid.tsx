"use client";
import { Spin, Alert, Button, FloatButton, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { DoctorHeader } from "@/entities/doctor";
import { AppointmentCard } from "@/entities/appointment";
import { useUpdateAppointmentMutation } from "@/entities/appointment";
import { EnhancedAppointmentModal } from "@/features/appointment-management/create-appointment";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import { useCalendarGridStore, timeUtils, positionUtils } from "../model/store";
import type {
  Doctor,
  Appointment,
  AppointmentPosition,
  AppointmentStatus,
} from "@/shared/types";

interface CalendarGridProps {
  className?: string;
}

const getNextStatus = (currentStatus: AppointmentStatus): AppointmentStatus => {
  const statusCycle: Record<AppointmentStatus, AppointmentStatus> = {
    Записан: "Пришел",
    Пришел: "Завершен",
    Завершен: "Записан",
    Отменен: "Записан",
  };
  return statusCycle[currentStatus] || "Записан";
};

interface TimeSlotProps {
  time: string;
  doctorId: number;
  doctorName: string;
  onClick: (time: string, doctorId: number, doctorName: string) => void;
}

const TimeSlot = ({ time, doctorId, doctorName, onClick }: TimeSlotProps) => (
  <div
    className="time-slot bg-transparent border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
    onClick={() => onClick(time, doctorId, doctorName)}
    title={`Записать пациента на ${time} к врачу ${doctorName}`}
  >
    <span className="text-xs font-medium text-gray-600">{time}</span>
  </div>
);

interface AppointmentBlockProps {
  appointment: Appointment;
  doctor: string;
  position: AppointmentPosition;
  onStatusChange: (newStatus: AppointmentStatus) => void;
}

const AppointmentBlock = ({
  appointment,
  doctor,
  position,
  onStatusChange,
}: AppointmentBlockProps) => {
  const handleDoubleClick = () => {
    console.log(
      "AppointmentBlock: double click detected for appointment",
      appointment.id
    );
    const newStatus = getNextStatus(appointment.status);
    console.log("AppointmentBlock: changing status to", newStatus);
    onStatusChange(newStatus);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        height: `${position.height}px`,
        left: "4px",
        right: "4px",
        zIndex: position.zIndex,
      }}
    >
      <AppointmentCard
        appointment={appointment}
        doctor={doctor}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
};

interface DoctorColumnProps {
  doctor: Doctor;
  timeSlots: string[];
  onTimeSlotClick: (time: string, doctorId: number, doctorName: string) => void;
  onAppointmentStatusChange: (
    appointmentId: number,
    newStatus: AppointmentStatus
  ) => void;
}

const DoctorColumn = ({
  doctor,
  timeSlots,
  onTimeSlotClick,
  onAppointmentStatusChange,
}: DoctorColumnProps) => {
  const validAppointments = useMemo(() => {
    return doctor.appointments.filter((appointment) =>
      timeUtils.isTimeInWorkingHours(appointment.timeStart)
    );
  }, [doctor.appointments]);

  const appointmentPositions = useMemo(() => {
    return validAppointments.map((appointment) => ({
      appointment,
      position: positionUtils.calculateAppointmentPosition(
        appointment.timeStart,
        appointment.timeEnd
      ),
    }));
  }, [validAppointments]);

  const occupiedTimeSlots = useMemo(() => {
    return new Set(validAppointments.map((apt) => apt.timeStart));
  }, [validAppointments]);

  return (
    <div className="doctor-column relative bg-white border-r border-gray-100">
      {timeSlots.map((time) => {
        const isOccupied = occupiedTimeSlots.has(time);
        return (
          <div key={time} className="relative">
            {!isOccupied ? (
              <TimeSlot
                time={time}
                doctorId={doctor.id}
                doctorName={doctor.name}
                onClick={onTimeSlotClick}
              />
            ) : (
              <div className="time-slot bg-transparent border-b border-gray-200">
                <span className="text-xs font-medium text-gray-400">
                  {time}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {appointmentPositions.map(({ appointment, position }) => (
        <AppointmentBlock
          key={appointment.id}
          appointment={appointment}
          doctor={doctor.name}
          position={position}
          onStatusChange={(newStatus) =>
            onAppointmentStatusChange(appointment.id, newStatus)
          }
        />
      ))}
    </div>
  );
};

export function CalendarGrid({ className = "" }: CalendarGridProps) {
  const { currentDate } = useCalendarHeaderStore();
  const {
    data: doctors = [],
    isLoading,
    error,
    refetch,
  } = useGetDoctorsQuery(currentDate.format("YYYY-MM-DD"));

  const [updateAppointment] = useUpdateAppointmentMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    time?: string;
    doctorId?: number;
    doctorName?: string;
  }>({});

  const timeSlots = useMemo(() => timeUtils.generateTimeSlots(), []);

  const handleTimeSlotClick = (
    time: string,
    doctorId: number,
    doctorName: string
  ) => {
    console.log(
      `Clicked time slot: ${time} for doctor ${doctorName} (ID: ${doctorId})`
    );

    setSelectedSlot({
      time,
      doctorId,
      doctorName,
    });
    setIsModalVisible(true);
  };

  const handleFloatingButtonClick = () => {
    setSelectedSlot({});
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSlot({});
  };

  const handleAppointmentStatusChange = async (
    appointmentId: number,
    newStatus: AppointmentStatus
  ) => {
    try {
      console.log(
        `Updating appointment ${appointmentId} to status ${newStatus}`
      );

      await updateAppointment({
        id: appointmentId,
        status: newStatus,
      }).unwrap();

      message.success(`Статус изменен на "${newStatus}"`);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Ошибка при обновлении статуса";
      message.error(errorMessage);
      console.error("Ошибка обновления:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-2 text-gray-600">Загрузка календаря...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg">
        <Alert
          message="Ошибка загрузки календаря"
          description="Не удалось загрузить данные календаря. Проверьте подключение к серверу."
          type="error"
          showIcon
          action={
            <Button onClick={() => refetch()} type="primary" size="small">
              Повторить
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-gray-50 relative ${className}`}>
      <div
        className="grid gap-1 bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-20"
        style={{
          gridTemplateColumns: `80px repeat(${doctors.length}, minmax(280px, 1fr))`,
        }}
      >
        <div className="bg-white p-3 text-center font-medium text-gray-700 border-r border-gray-200">
          Время
        </div>

        {doctors.map((doctor) => (
          <DoctorHeader key={doctor.id} doctor={doctor} />
        ))}
      </div>

      <div
        className="grid gap-1 bg-gray-100 relative"
        style={{
          gridTemplateColumns: `80px repeat(${doctors.length}, minmax(280px, 1fr))`,
        }}
      >
        <div className="bg-white border-r border-gray-200">
          {timeSlots.map((time) => (
            <div key={time} className="time-slot text-center">
              <span className="time-slot-label">{time}</span>
            </div>
          ))}
        </div>

        {doctors.map((doctor) => (
          <DoctorColumn
            key={doctor.id}
            doctor={doctor}
            timeSlots={timeSlots}
            onTimeSlotClick={handleTimeSlotClick}
            onAppointmentStatusChange={handleAppointmentStatusChange}
          />
        ))}
      </div>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleFloatingButtonClick}
        tooltip="Создать новую запись"
        style={{ right: 24, bottom: 24 }}
      />

      <EnhancedAppointmentModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        initialValues={{
          timeStart: selectedSlot.time,
          doctorId: selectedSlot.doctorId,
          doctorName: selectedSlot.doctorName,
          date: currentDate.format("YYYY-MM-DD"),
        }}
      />
    </div>
  );
}
