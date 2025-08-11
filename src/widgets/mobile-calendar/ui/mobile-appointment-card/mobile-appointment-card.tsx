"use client";
import { Tooltip } from "antd";
import type { Appointment, AppointmentStatus } from "@/shared/types";

interface MobileAppointmentCardProps {
  appointment: Appointment;
  doctor: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const getMobileStatusStyles = (status: AppointmentStatus) => {
  const statusConfig = {
    Записан: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-600",
    },
    Пришел: {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-400",
      textColor: "text-orange-600",
    },
    Завершен: {
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-600",
    },
    Отменен: {
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-600",
    },
  };

  return statusConfig[status] || statusConfig["Записан"];
};

const getTypeEmoji = (type: string): string => {
  const typeEmojis = {
    Лечение: "🦷",
    Консультация: "🩺",
    Имплантация: "⚕️",
    Профилактика: "🧽",
  };
  return typeEmojis[type as keyof typeof typeEmojis] || "📋";
};

const MobileTooltipContent = ({
  appointment,
  doctor,
}: {
  appointment: Appointment;
  doctor: string;
}) => (
  <div className="text-sm">
    <div className="font-semibold mb-2 text-white">{appointment.patient}</div>
    <div className="space-y-1">
      <div className="text-gray-300">
        Врач: <span className="text-white">{doctor}</span>
      </div>
      <div className="text-gray-300">
        Время:{" "}
        <span className="text-white">
          {appointment.timeStart} - {appointment.timeEnd}
        </span>
      </div>
      <div className="text-gray-300">
        Телефон: <span className="text-white">{appointment.phone}</span>
      </div>
      <div className="text-gray-300">
        Статус: <span className="text-white">{appointment.status}</span>
      </div>
      {appointment.comment && (
        <div className="text-gray-300">
          Комментарий: <span className="text-white">{appointment.comment}</span>
        </div>
      )}
    </div>
    <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
      Двойной клик для изменения статуса
    </div>
  </div>
);

export function MobileAppointmentCard({
  appointment,
  doctor,
  onClick,
  onDoubleClick,
}: MobileAppointmentCardProps) {
  const statusStyles = getMobileStatusStyles(appointment.status);
  const typeEmoji = getTypeEmoji(appointment.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(
      "MobileAppointmentCard: double click detected for appointment:",
      appointment.id
    );
    onDoubleClick?.();
  };

  return (
    <Tooltip
      title={<MobileTooltipContent appointment={appointment} doctor={doctor} />}
      placement="top"
      overlayStyle={{
        maxWidth: "280px",
        zIndex: 9999,
      }}
      mouseEnterDelay={0.3}
      mouseLeaveDelay={0.1}
      trigger={["hover"]}
    >
      <div
        className={`${statusStyles.bgColor} p-3 rounded-lg border-l-4 ${statusStyles.borderColor} shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`Запись: ${appointment.patient}, ${appointment.timeStart}-${appointment.timeEnd}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className={`text-sm font-semibold ${statusStyles.textColor} mb-2`}>
          📅 {appointment.timeStart} - {appointment.timeEnd}
        </div>

        <div className="text-base font-bold text-gray-800 mb-1">
          👤 {appointment.patient}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {typeEmoji} {appointment.type}
          </div>
          <div
            className={`text-xs font-medium px-2 py-1 rounded ${statusStyles.bgColor} ${statusStyles.textColor}`}
          >
            {appointment.status}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">👨‍⚕️ Врач: {doctor}</div>

        {appointment.comment && (
          <div className="absolute top-2 right-2 text-xs">💬</div>
        )}
      </div>
    </Tooltip>
  );
}
