import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("ru");

export const CALENDAR_CONFIG = {
  WORK_START_HOUR: 9,
  WORK_END_HOUR: 19,
  SLOT_DURATION_MINUTES: 30,
  SLOT_HEIGHT_PIXELS: 60,
  TIMEZONE: "Asia/Bishkek",
  DATE_FORMAT: "YYYY-MM-DD",
  TIME_FORMAT: "HH:mm",
  DATETIME_FORMAT: "YYYY-MM-DD HH:mm",
} as const;

const timeCache = new Map<string, number>();
const slotsCache = new Map<string, string[]>();

export const timeUtils = {
  parseTime: (timeString: string): number => {
    if (timeCache.has(timeString)) {
      return timeCache.get(timeString)!;
    }

    const [hours, minutes] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    timeCache.set(timeString, totalMinutes);
    return totalMinutes;
  },
  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  },
  generateTimeSlots: (
    startHour: number = CALENDAR_CONFIG.WORK_START_HOUR,
    endHour: number = CALENDAR_CONFIG.WORK_END_HOUR,
    slotDuration: number = CALENDAR_CONFIG.SLOT_DURATION_MINUTES
  ): string[] => {
    const cacheKey = `${startHour}-${endHour}-${slotDuration}`;

    if (slotsCache.has(cacheKey)) {
      return slotsCache.get(cacheKey)!;
    }

    const slots: string[] = [];
    let currentMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    while (currentMinutes <= endMinutes) {
      slots.push(timeUtils.minutesToTime(currentMinutes));
      currentMinutes += slotDuration;
    }

    slotsCache.set(cacheKey, slots);
    return slots;
  },

  isTimeInWorkingHours: (
    time: string,
    startHour: number = CALENDAR_CONFIG.WORK_START_HOUR,
    endHour: number = CALENDAR_CONFIG.WORK_END_HOUR
  ): boolean => {
    const minutes = timeUtils.parseTime(time);
    const workStart = startHour * 60;
    const workEnd = endHour * 60;
    return minutes >= workStart && minutes <= workEnd;
  },

  normalizeTimeToSlot: (
    time: string,
    slotDuration: number = CALENDAR_CONFIG.SLOT_DURATION_MINUTES
  ): string => {
    const totalMinutes = timeUtils.parseTime(time);
    const normalizedMinutes =
      Math.round(totalMinutes / slotDuration) * slotDuration;
    return timeUtils.minutesToTime(normalizedMinutes);
  },
  calculateDuration: (startTime: string, endTime: string): number => {
    const start = timeUtils.parseTime(startTime);
    const end = timeUtils.parseTime(endTime);
    return Math.max(0, end - start);
  },
  addMinutes: (time: string, minutes: number): string => {
    const totalMinutes = timeUtils.parseTime(time) + minutes;
    return timeUtils.minutesToTime(totalMinutes);
  },
  doTimeRangesOverlap: (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean => {
    const start1Minutes = timeUtils.parseTime(start1);
    const end1Minutes = timeUtils.parseTime(end1);
    const start2Minutes = timeUtils.parseTime(start2);
    const end2Minutes = timeUtils.parseTime(end2);

    return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
  },
  clearCache: (): void => {
    timeCache.clear();
    slotsCache.clear();
  },
};
export const dateUtils = {
  formatDate: (date: Dayjs): string => {
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
    const year = date.year();

    return `${weekday}, ${day} ${month} ${year}`;
  },
  formatDateTime: (date: Dayjs): string => {
    return `${dateUtils.formatDate(date)} ${date.format("HH:mm")}`;
  },
  isWeekend: (date: Dayjs): boolean => {
    const day = date.day();
    return day === 0 || day === 6;
  },
  isToday: (date: Dayjs): boolean => {
    return date.isSame(dayjs(), "day");
  },
  isYesterday: (date: Dayjs): boolean => {
    return date.isSame(dayjs().subtract(1, "day"), "day");
  },
  isTomorrow: (date: Dayjs): boolean => {
    return date.isSame(dayjs().add(1, "day"), "day");
  },
  getWorkDayStart: (date: Dayjs): Dayjs => {
    return date
      .hour(CALENDAR_CONFIG.WORK_START_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0);
  },
  getWorkDayEnd: (date: Dayjs): Dayjs => {
    return date
      .hour(CALENDAR_CONFIG.WORK_END_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0);
  },
  generateDateRange: (startDate: Dayjs, endDate: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [];
    let currentDate = startDate;

    while (currentDate.isSameOrBefore(endDate, "day")) {
      dates.push(currentDate);
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  },
  getWorkingDaysInRange: (startDate: Dayjs, endDate: Dayjs): Dayjs[] => {
    return dateUtils
      .generateDateRange(startDate, endDate)
      .filter((date) => !dateUtils.isWeekend(date));
  },
  parseDate: (dateString: string, format?: string): Dayjs | null => {
    try {
      const parsed = format ? dayjs(dateString, format) : dayjs(dateString);
      return parsed.isValid() ? parsed : null;
    } catch {
      return null;
    }
  },
  safeFormat: (
    date: Dayjs | null,
    format: string = CALENDAR_CONFIG.DATE_FORMAT
  ): string => {
    return date?.isValid() ? date.format(format) : "";
  },
};
export const positionUtils = {
  timeToPixels: (time: string): number => {
    const totalMinutes = timeUtils.parseTime(time);
    const workStartMinutes = CALENDAR_CONFIG.WORK_START_HOUR * 60;
    const minutesFromStart = totalMinutes - workStartMinutes;
    const pixelsPerMinute =
      CALENDAR_CONFIG.SLOT_HEIGHT_PIXELS /
      CALENDAR_CONFIG.SLOT_DURATION_MINUTES;

    return Math.max(0, minutesFromStart * pixelsPerMinute);
  },
  pixelsToTime: (pixels: number): string => {
    const workStartMinutes = CALENDAR_CONFIG.WORK_START_HOUR * 60;
    const pixelsPerMinute =
      CALENDAR_CONFIG.SLOT_HEIGHT_PIXELS /
      CALENDAR_CONFIG.SLOT_DURATION_MINUTES;
    const totalMinutes = workStartMinutes + pixels / pixelsPerMinute;

    return timeUtils.minutesToTime(Math.round(totalMinutes));
  },
  durationToPixels: (durationMinutes: number): number => {
    const pixelsPerMinute =
      CALENDAR_CONFIG.SLOT_HEIGHT_PIXELS /
      CALENDAR_CONFIG.SLOT_DURATION_MINUTES;
    return Math.max(30, durationMinutes * pixelsPerMinute);
  },
  getSlotIndex: (time: string): number => {
    const slots = timeUtils.generateTimeSlots();
    const normalizedTime = timeUtils.normalizeTimeToSlot(time);
    return slots.indexOf(normalizedTime);
  },
};
export const validators = {
  isValidTime: (time: string): boolean => {
    const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
  },
  isValidDate: (date: string): boolean => {
    const parsed = dayjs(date);
    return parsed.isValid();
  },
  isValidTimeRange: (startTime: string, endTime: string): boolean => {
    if (
      !validators.isValidTime(startTime) ||
      !validators.isValidTime(endTime)
    ) {
      return false;
    }

    const start = timeUtils.parseTime(startTime);
    const end = timeUtils.parseTime(endTime);
    return end > start;
  },
  isNotPastDate: (date: Dayjs): boolean => {
    return date.isSameOrAfter(dayjs(), "day");
  },
  isWorkingDay: (date: Dayjs): boolean => {
    return !dateUtils.isWeekend(date);
  },
};
export {
  timeUtils as time,
  dateUtils as date,
  positionUtils as position,
  validators as validate,
  CALENDAR_CONFIG as config,
};
