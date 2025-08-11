"use client";
import { Tooltip } from "antd";
import type { Appointment, AppointmentStatus } from "@/shared/types";

interface AppointmentCardProps {
  appointment: Appointment;
  doctor: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  children?: React.ReactNode;
}

export function AppointmentCard({
  appointment,
  doctor,
  onClick,
  onDoubleClick,
  children,
}: AppointmentCardProps) {
  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case "Пришел":
        return "#10b981";
      case "Завершен":
        return "#34d399";
      case "Отменен":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const getAppointmentClass = (status: AppointmentStatus): string => {
    switch (status) {
      case "Завершен":
        return "appointment-block appointment-completed";
      case "Отменен":
        return "appointment-block appointment-cancelled";
      default:
        return "appointment-block";
    }
  };

  const tooltipContent = (
    <div className="text-sm">
      <div className="font-semibold mb-2">{appointment.patient}</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Телефон:</span> {appointment.phone}
        </div>
        <div>
          <span className="text-gray-400">Доктор:</span> {doctor}
        </div>
        <div>
          <span className="text-gray-400">Статус:</span>
          <span
            className="ml-1 px-2 py-1 rounded text-xs text-white"
            style={{ backgroundColor: getStatusColor(appointment.status) }}
          >
            {appointment.status}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Тип записи:</span> {appointment.type}
        </div>
        {appointment.comment && (
          <div>
            <span className="text-gray-400">Комментарий:</span>{" "}
            {appointment.comment}
          </div>
        )}
      </div>
    </div>
  );

  if (children) {
    return (
      <Tooltip
        title={tooltipContent}
        placement="top"
        overlayStyle={{ maxWidth: "300px" }}
      >
        <div onClick={onClick} onDoubleClick={onDoubleClick}>
          {children}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      overlayStyle={{ maxWidth: "300px" }}
    >
      <div
        className={getAppointmentClass(appointment.status)}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        title="Двойной клик для изменения статуса"
      >
        <div className="font-medium text-xs mb-1">
          {appointment.timeStart} - {appointment.timeEnd}
        </div>
        <div className="font-semibold text-xs">{appointment.patient}</div>
      </div>
    </Tooltip>
  );
}
