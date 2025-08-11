"use client";
import { Spin, Alert, Button, FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { DoctorHeader } from "@/entities/doctor";
import { AppointmentCard } from "@/entities/appointment";
import { StatusChanger } from "@/features/appointment-management/update-appointment";
import { AppointmentModal } from "@/features/appointment-management/create-appointment";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import { useCalendarGridStore } from "../model/store";
import { isTimeInWorkingHours } from "@/shared/lib/date-utils";

export function CalendarGrid() {
  const { currentDate } = useCalendarHeaderStore();
  const { timeSlots, calculateAppointmentPosition } = useCalendarGridStore();
  const {
    data: doctors = [],
    isLoading,
    error,
    refetch,
  } = useGetDoctorsQuery(currentDate.format("YYYY-MM-DD"));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>();

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setIsModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
        <span className="ml-2">Загрузка календаря...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Ошибка загрузки"
          description="Не удалось загрузить данные календаря. Проверьте подключение к API серверу."
          type="error"
          action={
            <Button onClick={() => refetch()} type="link" size="small">
              Повторить
            </Button>
          }
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 relative">
      {/* Doctor Headers */}
      <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(300px,1fr))] gap-1 bg-gray-100 border-b border-gray-200">
        <div className="bg-white p-4"></div>
        {doctors.map((doctor) => (
          <DoctorHeader key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Time slots */}
        <div className="bg-white">
          {timeSlots.map((time) => (
            <div key={time} className="time-slot">
              {time}
            </div>
          ))}
        </div>

        {/* Doctor columns */}
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-column relative">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="time-slot bg-transparent border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleTimeSlotClick(time)}
                title={`Создать запись на ${time}`}
              />
            ))}

            {doctor.appointments
              .filter((appointment) =>
                isTimeInWorkingHours(appointment.timeStart)
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
                  <StatusChanger key={appointment.id} appointment={appointment}>
                    <div style={position}>
                      <AppointmentCard
                        appointment={appointment}
                        doctor={doctor.name}
                      />
                    </div>
                  </StatusChanger>
                );
              })}
          </div>
        ))}
      </div>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setIsModalVisible(true)}
        tooltip="Создать запись"
      />

      <AppointmentModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTime(undefined);
        }}
        selectedTime={selectedTime}
      />
    </div>
  );
}
