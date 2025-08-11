import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AppointmentPosition } from "@/shared/types";

export const CALENDAR_CONSTANTS = {
  SLOT_HEIGHT: 60,
  START_HOUR: 9,
  END_HOUR: 19,
  SLOT_DURATION: 30,
  MINIMUM_APPOINTMENT_HEIGHT: 30,
  APPOINTMENT_MARGIN: 8,
} as const;

export const timeUtils = {
  parseTime: (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  },

  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  },

  generateTimeSlots: (): string[] => {
    const slots: string[] = [];
    for (
      let hour = CALENDAR_CONSTANTS.START_HOUR;
      hour <= CALENDAR_CONSTANTS.END_HOUR;
      hour++
    ) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < CALENDAR_CONSTANTS.END_HOUR) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  },

  isTimeInWorkingHours: (time: string): boolean => {
    const minutes = timeUtils.parseTime(time);
    const workStart = CALENDAR_CONSTANTS.START_HOUR * 60;
    const workEnd = CALENDAR_CONSTANTS.END_HOUR * 60;
    return minutes >= workStart && minutes <= workEnd;
  },

  normalizeTimeToSlot: (time: string): string => {
    const minutes = timeUtils.parseTime(time);
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    const normalizedMinute = minute < 15 ? 0 : minute < 45 ? 30 : 60;

    if (normalizedMinute === 60) {
      return timeUtils.minutesToTime((hour + 1) * 60);
    }

    return timeUtils.minutesToTime(hour * 60 + normalizedMinute);
  },
};

export const positionUtils = {
  calculateAppointmentPosition: (
    timeStart: string,
    timeEnd: string
  ): AppointmentPosition => {
    const startMinutes = timeUtils.parseTime(timeStart);
    const endMinutes = timeUtils.parseTime(timeEnd);
    const duration = endMinutes - startMinutes;

    const workStartMinutes = CALENDAR_CONSTANTS.START_HOUR * 60;

    const minutesFromStart = startMinutes - workStartMinutes;

    const pixelsPerMinute =
      CALENDAR_CONSTANTS.SLOT_HEIGHT / CALENDAR_CONSTANTS.SLOT_DURATION;

    const top = Math.max(0, minutesFromStart * pixelsPerMinute);
    const height = Math.max(
      CALENDAR_CONSTANTS.MINIMUM_APPOINTMENT_HEIGHT,
      duration * pixelsPerMinute - CALENDAR_CONSTANTS.APPOINTMENT_MARGIN
    );

    return {
      top,
      height,
      zIndex: 10,
    };
  },

  calculateTimeFromPosition: (yPosition: number): string => {
    const pixelsPerMinute =
      CALENDAR_CONSTANTS.SLOT_HEIGHT / CALENDAR_CONSTANTS.SLOT_DURATION;
    const minutesFromStart = Math.round(yPosition / pixelsPerMinute);
    const totalMinutes = CALENDAR_CONSTANTS.START_HOUR * 60 + minutesFromStart;

    return timeUtils.minutesToTime(totalMinutes);
  },

  doAppointmentsOverlap: (
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
};

interface CalendarGridStore {
  timeSlots: string[];
  selectedTimeSlot: string | null;
  draggedAppointment: number | null;
  isLoading: boolean;
  gridColumns: number;
  positionCache: Map<string, AppointmentPosition>;
  setSelectedTimeSlot: (timeSlot: string | null) => void;
  setDraggedAppointment: (appointmentId: number | null) => void;
  setIsLoading: (loading: boolean) => void;
  setGridColumns: (columns: number) => void;
  calculateAppointmentPosition: (
    timeStart: string,
    timeEnd: string
  ) => AppointmentPosition;
  getTimeSlots: () => string[];
  clearPositionCache: () => void;
  getCachedPosition: (key: string) => AppointmentPosition | undefined;
  setCachedPosition: (key: string, position: AppointmentPosition) => void;
  isValidTimeSlot: (time: string) => boolean;
  canDropAppointment: (time: string, doctorId: number) => boolean;
}

export const useCalendarGridStore = create<CalendarGridStore>()(
  devtools(
    (set, get) => ({
      timeSlots: timeUtils.generateTimeSlots(),
      selectedTimeSlot: null,
      draggedAppointment: null,
      isLoading: false,
      gridColumns: 1,
      positionCache: new Map(),

      setSelectedTimeSlot: (timeSlot) =>
        set({ selectedTimeSlot: timeSlot }, false, "setSelectedTimeSlot"),

      setDraggedAppointment: (appointmentId) =>
        set(
          { draggedAppointment: appointmentId },
          false,
          "setDraggedAppointment"
        ),

      setIsLoading: (loading) =>
        set({ isLoading: loading }, false, "setIsLoading"),

      setGridColumns: (columns) =>
        set({ gridColumns: columns }, false, "setGridColumns"),

      calculateAppointmentPosition: (
        timeStart: string,
        timeEnd: string
      ): AppointmentPosition => {
        const cacheKey = `${timeStart}-${timeEnd}`;
        const cached = get().getCachedPosition(cacheKey);

        if (cached) {
          return cached;
        }

        const position = positionUtils.calculateAppointmentPosition(
          timeStart,
          timeEnd
        );
        get().setCachedPosition(cacheKey, position);

        return position;
      },

      getTimeSlots: () => get().timeSlots,

      clearPositionCache: () =>
        set(
          (state) => {
            state.positionCache.clear();
            return { positionCache: new Map() };
          },
          false,
          "clearPositionCache"
        ),

      getCachedPosition: (key: string) => get().positionCache.get(key),

      setCachedPosition: (key: string, position: AppointmentPosition) =>
        set(
          (state) => {
            const newCache = new Map(state.positionCache);
            newCache.set(key, position);
            return { positionCache: newCache };
          },
          false,
          "setCachedPosition"
        ),

      isValidTimeSlot: (time: string): boolean => {
        return (
          timeUtils.isTimeInWorkingHours(time) && get().timeSlots.includes(time)
        );
      },

      canDropAppointment: (time: string, doctorId: number): boolean => {
        if (!timeUtils.isTimeInWorkingHours(time)) {
          return false;
        }
        return true;
      },
    }),
    {
      name: "calendar-grid-store",
      serialize: (state: CalendarGridStore) => ({
        ...state,
        positionCache: `Map(${state.positionCache.size} items)`,
      }),
    }
  )
);

export const useTimeSlots = () =>
  useCalendarGridStore((state) => state.timeSlots);
export const useSelectedTimeSlot = () =>
  useCalendarGridStore((state) => state.selectedTimeSlot);
export const useAppointmentPosition = () =>
  useCalendarGridStore((state) => state.calculateAppointmentPosition);
export const useGridColumns = () =>
  useCalendarGridStore((state) => state.gridColumns);

export const selectGridConfig = (state: CalendarGridStore) => ({
  timeSlots: state.timeSlots,
  gridColumns: state.gridColumns,
  isLoading: state.isLoading,
});

export const selectDragState = (state: CalendarGridStore) => ({
  draggedAppointment: state.draggedAppointment,
  selectedTimeSlot: state.selectedTimeSlot,
});
