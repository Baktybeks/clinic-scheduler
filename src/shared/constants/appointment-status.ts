export const APPOINTMENT_STATUSES = {
  SCHEDULED: "Записан",
  ARRIVED: "Пришел",
  COMPLETED: "Завершен",
  CANCELLED: "Отменен",
} as const;

export const APPOINTMENT_TYPES = {
  TREATMENT: "Лечение",
  CONSULTATION: "Консультация",
  IMPLANTATION: "Имплантация",
  PREVENTION: "Профилактика",
} as const;
