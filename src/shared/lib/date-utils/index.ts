import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

export const formatDate = (date: Dayjs): string => {
  const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const weekday = weekdays[date.day()];
  const day = date.date();
  const month = months[date.month()];
  const time = date.format("HH:mm");

  return `${weekday}, ${day} ${month} ${time}`;
};

export const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 19; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 19) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

export const isTimeInWorkingHours = (time: string): boolean => {
  const minutes = parseTime(time);
  const workStart = 9 * 60;
  const workEnd = 19 * 60;
  return minutes >= workStart && minutes <= workEnd;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const calculateAppointmentDuration = (
  timeStart: string,
  timeEnd: string
): number => {
  const start = dayjs(`2000-01-01 ${timeStart}`);
  const end = dayjs(`2000-01-01 ${timeEnd}`);
  return end.diff(start, "minute");
};

export const normalizeTimeToSlot = (time: string): string => {
  const minutes = parseTime(time);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  const normalizedMinute = minute < 15 ? 0 : minute < 45 ? 30 : 60;

  if (normalizedMinute === 60) {
    return `${(hour + 1).toString().padStart(2, "0")}:00`;
  }

  return `${hour.toString().padStart(2, "0")}:${normalizedMinute
    .toString()
    .padStart(2, "0")}`;
};

export const getSlotIndex = (time: string): number => {
  const slots = generateTimeSlots();
  const normalizedTime = normalizeTimeToSlot(time);
  return slots.indexOf(normalizedTime);
};
