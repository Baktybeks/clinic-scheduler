"use client";
import { Tooltip } from "antd";
import { memo } from "react";
import type { Appointment, AppointmentStatus } from "@/shared/types";

interface AppointmentCardProps {
  appointment: Appointment;
  doctor: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  busyLevel?: 1 | 2 | 3;
}

const getBusyLevel = (status: AppointmentStatus): 1 | 2 | 3 => {
  switch (status) {
    case "Записан":
      return 2;
    case "Пришел":
      return 3;
    case "Завершен":
      return 1;
    case "Отменен":
      return 1;
    default:
      return 2;
  }
};

const getStatusConfig = (status: AppointmentStatus) => {
  const statusConfig = {
    Записан: {
      baseClass: "status-scheduled",
      borderColor: "#6b46c1",
      textColor: "#6b46c1",
      description: "Время забронировано",
      occupancyType: "Диагональная штриховка",
    },
    Пришел: {
      baseClass: "status-arrived",
      borderColor: "#7c3aed",
      textColor: "#7c3aed",
      description: "Пациент на приёме",
      occupancyType: "Плотная горизонтальная штриховка",
    },
    Завершен: {
      baseClass: "status-completed",
      borderColor: "#8b5cf6",
      textColor: "#8b5cf6",
      description: "Приём завершён",
      occupancyType: "Вертикальная штриховка (архив)",
    },
    Отменен: {
      baseClass: "status-cancelled",
      borderColor: "#a855f7",
      textColor: "#a855f7",
      description: "Запись отменена",
      occupancyType: "Разреженная штриховка (время освободилось)",
    },
  };

  return statusConfig[status] || statusConfig["Записан"];
};

const getBusyEmoji = (busyLevel: number): string => {
  switch (busyLevel) {
    case 1:
      return "🟢";
    case 2:
      return "🟡";
    case 3:
      return "🔴";
    default:
      return "⚪";
  }
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

const TooltipContent = memo<{
  appointment: Appointment;
  doctor: string;
  statusConfig: any;
  busyLevel: number;
}>(({ appointment, doctor, statusConfig, busyLevel }) => {
  return (
    <div className="text-sm max-w-xs">
      <div className="font-semibold mb-3 text-white flex items-center justify-between">
        <span>{appointment.patient}</span>
        <span>{getBusyEmoji(busyLevel)}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-purple-200">Время:</span>
          <span className="text-white font-medium">
            {appointment.timeStart} - {appointment.timeEnd}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-200">Телефон:</span>
          <span className="text-white">{appointment.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-200">Врач:</span>
          <span className="text-white">{doctor}</span>
        </div>

        <div className="border-t border-purple-400 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-purple-200">Статус:</span>
            <span
              className="px-2 py-1 rounded text-xs text-white font-medium"
              style={{ backgroundColor: statusConfig.borderColor }}
            >
              {appointment.status}
            </span>
          </div>
          <div className="text-xs text-purple-300">
            {statusConfig.description}
          </div>
        </div>

        <div className="border-t border-purple-400 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-purple-200">Занятость времени:</span>
            <span className="text-white flex items-center">
              {getBusyEmoji(busyLevel)}
              <span className="ml-1 text-xs">
                {busyLevel === 1
                  ? "Низкая"
                  : busyLevel === 2
                  ? "Средняя"
                  : "Высокая"}
              </span>
            </span>
          </div>
          <div className="text-xs text-purple-300">
            {statusConfig.occupancyType}
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-purple-200">Тип:</span>
          <span className="text-white">
            {getTypeEmoji(appointment.type)} {appointment.type}
          </span>
        </div>

        {appointment.comment && (
          <div className="pt-2 border-t border-purple-400">
            <div className="text-purple-200 text-xs mb-1">Комментарий:</div>
            <div className="text-white text-xs">{appointment.comment}</div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-purple-400 text-xs text-purple-300">
        <div>Двойной клик для изменения статуса</div>
        <div className="mt-1">
          💡 Штриховка показывает уровень занятости времени
        </div>
      </div>
    </div>
  );
});

TooltipContent.displayName = "TooltipContent";

export const AppointmentCard = memo<AppointmentCardProps>(
  ({
    appointment,
    doctor,
    onClick,
    onDoubleClick,
    className = "",
    style,
    busyLevel,
  }) => {
    const statusConfig = getStatusConfig(appointment.status);
    const typeEmoji = getTypeEmoji(appointment.type);
    const actualBusyLevel = busyLevel || getBusyLevel(appointment.status);

    const cssClasses = [
      "appointment-card",
      statusConfig.baseClass,
      `busy-level-${actualBusyLevel}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const getFallbackBackground = (level: number) => {
      const color = statusConfig.borderColor;
      switch (level) {
        case 1:
          return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 2px, white 2px, white 18px)`;
        case 2:
          return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 6px, white 6px, white 12px)`;
        case 3:
          return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 8px, white 8px, white 8px)`;
        default:
          return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 6px, white 6px, white 12px)`;
      }
    };

    const fallbackStyle: React.CSSProperties = {
      background: getFallbackBackground(actualBusyLevel),
      borderColor: statusConfig.borderColor,
      color: statusConfig.textColor,
      boxShadow: `0 2px 4px ${statusConfig.borderColor}40`,
      opacity:
        appointment.status === "Завершен"
          ? 0.7
          : appointment.status === "Отменен"
          ? 0.5
          : 1,
      ...style,
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.();
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      console.log(
        "AppointmentCard: double click detected for appointment:",
        appointment.id
      );
      onDoubleClick?.();
    };

    return (
      <Tooltip
        title={
          <TooltipContent
            appointment={appointment}
            doctor={doctor}
            statusConfig={statusConfig}
            busyLevel={actualBusyLevel}
          />
        }
        placement="top"
        overlayStyle={{
          maxWidth: "350px",
          zIndex: 9999,
        }}
        overlayClassName="appointment-tooltip"
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.1}
        trigger={["hover"]}
        destroyTooltipOnHide={false}
      >
        <div
          className={cssClasses}
          style={fallbackStyle}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          role="button"
          tabIndex={0}
          aria-label={`Занятое время: ${appointment.patient}, ${appointment.timeStart}-${appointment.timeEnd}, Уровень занятости: ${actualBusyLevel}/3`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick?.();
            }
          }}
        >
          <div className="absolute top-1 left-1 text-xs">
            {getBusyEmoji(actualBusyLevel)}
          </div>

          <div
            className="font-semibold text-xs mb-1 mt-2"
            style={{ color: statusConfig.textColor }}
          >
            {appointment.timeStart} - {appointment.timeEnd}
          </div>

          <div
            className="font-bold text-sm mb-1 truncate"
            style={{ color: statusConfig.textColor }}
            title={appointment.patient}
          >
            {appointment.patient}
          </div>

          <div
            className="text-xs truncate"
            style={{ color: statusConfig.textColor, opacity: 0.8 }}
            title={appointment.type}
          >
            {typeEmoji} {appointment.type}
          </div>

          {appointment.comment && (
            <div
              className="absolute top-1 right-1 text-xs"
              style={{ color: statusConfig.textColor, opacity: 0.7 }}
            >
              💬
            </div>
          )}

          <div
            className="absolute bottom-1 right-1 text-xs"
            style={{ color: statusConfig.textColor, opacity: 0.6 }}
          >
            {"█".repeat(actualBusyLevel)}
            {"░".repeat(3 - actualBusyLevel)}
          </div>
        </div>
      </Tooltip>
    );
  }
);

AppointmentCard.displayName = "AppointmentCard";

export default AppointmentCard;
