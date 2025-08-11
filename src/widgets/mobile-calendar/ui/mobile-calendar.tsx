"use client";
import { Card, Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { AppointmentCard } from "@/entities/appointment";
import { AppointmentModal } from "@/features/appointment-management/create-appointment";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import type { Doctor } from "@/shared/types";

export function MobileCalendar() {
  const { currentDate, nextDay, prevDay } = useCalendarHeaderStore();
  const { data: doctors = [], isLoading } = useGetDoctorsQuery(
    currentDate.format("YYYY-MM-DD")
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 md:hidden">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:hidden">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevDay}>←</Button>
        <span className="font-semibold">
          {currentDate.format("DD.MM.YYYY")}
        </span>
        <Button onClick={nextDay}>→</Button>
      </div>

      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          block
        >
          Создать запись
        </Button>
      </div>

      <div className="space-y-4">
        {doctors.length === 0 ? (
          <Empty description="Нет врачей на сегодня" />
        ) : (
          doctors.map((doctor: Doctor) => (
            <Card key={doctor.id} size="small">
              <div className="flex items-center mb-3">
                <span className="text-xl mr-2">{doctor.avatar}</span>
                <div>
                  <div className="font-semibold text-sm">{doctor.name}</div>
                  <div className="text-xs text-gray-500">
                    {doctor.specialty}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {doctor.appointments.length === 0 ? (
                  <div className="text-center text-gray-400 py-4 text-sm">
                    Нет записей
                  </div>
                ) : (
                  doctor.appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      doctor={doctor.name}
                    >
                      <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                        <div className="text-xs text-blue-600 font-medium">
                          {appointment.timeStart} - {appointment.timeEnd}
                        </div>
                        <div className="text-sm font-semibold">
                          {appointment.patient}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.type} • {appointment.status}
                        </div>
                      </div>
                    </AppointmentCard>
                  ))
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <AppointmentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
