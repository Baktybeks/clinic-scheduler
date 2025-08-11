"use client";
import { Card, Button, Empty, message } from "antd";
import { PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { useUpdateAppointmentMutation } from "@/entities/appointment";
import { AppointmentModal } from "@/features/appointment-management/create-appointment";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import type { Doctor, AppointmentStatus, Appointment } from "@/shared/types";

interface SimpleMobileAppointmentCardProps {
  appointment: Appointment;
  doctor: string;
  onDoubleClick?: () => void;
}

const SimpleMobileAppointmentCard = ({
  appointment,
  doctor,
  onDoubleClick,
}: SimpleMobileAppointmentCardProps) => {
  const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
      case "Записан":
        return "bg-blue-50 border-blue-400 text-blue-600";
      case "Пришел":
        return "bg-orange-50 border-orange-400 text-orange-600";
      case "Завершен":
        return "bg-green-50 border-green-400 text-green-600";
      case "Отменен":
        return "bg-red-50 border-red-400 text-red-600";
      default:
        return "bg-blue-50 border-blue-400 text-blue-600";
    }
  };

  // Эмодзи типов приёма
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "Лечение":
        return "🦷";
      case "Консультация":
        return "🩺";
      case "Имплантация":
        return "⚕️";
      case "Профилактика":
        return "🧽";
      default:
        return "📋";
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDoubleClick?.();
  };

  return (
    <div
      className={`p-3 rounded border-l-4 cursor-pointer transition-all hover:shadow-md ${getStatusStyles(
        appointment.status
      )}`}
      onDoubleClick={handleDoubleClick}
      title="Двойной тап для изменения статуса"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-sm">
          📅 {appointment.timeStart} - {appointment.timeEnd}
        </div>
        <div className="text-xs px-2 py-1 rounded bg-white/50">
          {appointment.status}
        </div>
      </div>

      <div className="font-bold text-base mb-1">👤 {appointment.patient}</div>

      <div className="text-sm">
        {getTypeEmoji(appointment.type)} {appointment.type}
      </div>

      <div className="text-xs mt-1 opacity-75">👨‍⚕️ Врач: {doctor}</div>

      {appointment.comment && (
        <div className="text-xs mt-2 p-2 bg-white/30 rounded">
          💬 {appointment.comment}
        </div>
      )}
    </div>
  );
};

const getNextStatus = (currentStatus: AppointmentStatus): AppointmentStatus => {
  const statusCycle: Record<AppointmentStatus, AppointmentStatus> = {
    Записан: "Пришел",
    Пришел: "Завершен",
    Завершен: "Записан",
    Отменен: "Записан",
  };
  return statusCycle[currentStatus] || "Записан";
};

export function MobileCalendar() {
  const { currentDate, nextDay, prevDay } = useCalendarHeaderStore();
  const { data: doctors = [], isLoading } = useGetDoctorsQuery(
    currentDate.format("YYYY-MM-DD")
  );
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAppointmentStatusChange = async (
    appointmentId: number,
    newStatus: AppointmentStatus
  ) => {
    try {
      console.log(
        `Mobile: Updating appointment ${appointmentId} to status ${newStatus}`
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
      console.error("Mobile: Ошибка обновления:", error);
    }
  };

  const handleAppointmentDoubleClick = (appointment: Appointment) => {
    const newStatus = getNextStatus(appointment.status);
    handleAppointmentStatusChange(appointment.id, newStatus);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:hidden">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Загрузка календаря...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:hidden bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
        <Button
          icon={<LeftOutlined />}
          onClick={prevDay}
          type="text"
          size="large"
        />
        <div className="text-center">
          <div className="font-bold text-lg">
            {currentDate.format("DD.MM.YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {currentDate.format("dddd")}
          </div>
        </div>
        <Button
          icon={<RightOutlined />}
          onClick={nextDay}
          type="text"
          size="large"
        />
      </div>

      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          block
          size="large"
          className="h-12 font-semibold"
        >
          Создать новую запись
        </Button>
      </div>

      <div className="space-y-4">
        {doctors.length === 0 ? (
          <Card className="text-center py-8">
            <Empty
              description="Нет врачей на выбранную дату"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          doctors.map((doctor: Doctor) => (
            <Card
              key={doctor.id}
              className="shadow-sm"
              bodyStyle={{ padding: "16px" }}
            >
              <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
                <span className="text-2xl mr-3">{doctor.avatar}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">
                    {doctor.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {doctor.specialty}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {doctor.appointments.length}
                  </div>
                  <div className="text-xs text-gray-500">записей</div>
                </div>
              </div>

              <div className="space-y-3">
                {doctor.appointments.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <div className="text-4xl mb-2">📅</div>
                    <div className="text-sm">Нет записей на этот день</div>
                    <div className="text-xs mt-1">Свободное расписание</div>
                  </div>
                ) : (
                  doctor.appointments.map((appointment) => (
                    <SimpleMobileAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      doctor={doctor.name}
                      onDoubleClick={() =>
                        handleAppointmentDoubleClick(appointment)
                      }
                    />
                  ))
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs text-blue-600 text-center">
          💡 Двойной тап по записи для изменения статуса
        </div>
      </div>

      <AppointmentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
