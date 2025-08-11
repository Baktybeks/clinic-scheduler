import { create } from "zustand";
import { generateTimeSlots, parseTime } from "@/shared/lib/date-utils";
import { TIME_SLOTS } from "@/shared/constants";
import type { AppointmentPosition } from "@/shared/types";

interface CalendarGridStore {
  timeSlots: string[];
  selectedTimeSlot: string | null;

  setSelectedTimeSlot: (timeSlot: string | null) => void;
  calculateAppointmentPosition: (
    timeStart: string,
    timeEnd: string
  ) => AppointmentPosition;
  getTimeSlots: () => string[];
}

export const useCalendarGridStore = create<CalendarGridStore>((set, get) => ({
  timeSlots: generateTimeSlots(),
  selectedTimeSlot: null,

  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),

  calculateAppointmentPosition: (
    timeStart: string,
    timeEnd: string
  ): AppointmentPosition => {
    const startMinutes = parseTime(timeStart);
    const endMinutes = parseTime(timeEnd);
    const duration = endMinutes - startMinutes;

    const workStartMinutes = TIME_SLOTS.START_HOUR * 60;
    const minutesFromStart = startMinutes - workStartMinutes;
    const slotsFromStart = minutesFromStart / TIME_SLOTS.SLOT_DURATION;

    return {
      top: slotsFromStart * TIME_SLOTS.SLOT_HEIGHT + 4,
      height:
        (duration / TIME_SLOTS.SLOT_DURATION) * TIME_SLOTS.SLOT_HEIGHT - 8,
      zIndex: 10,
    };
  },

  getTimeSlots: () => get().timeSlots,
}));
