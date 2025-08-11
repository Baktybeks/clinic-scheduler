import { create } from "zustand";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ru";

if (typeof window !== "undefined") {
  dayjs.locale("ru");
}

interface CalendarHeaderStore {
  currentDate: Dayjs;
  setCurrentDate: (date: Dayjs) => void;
  nextDay: () => void;
  prevDay: () => void;
  goToToday: () => void;
  formatCurrentDate: () => string;
}

export const useCalendarHeaderStore = create<CalendarHeaderStore>(
  (set, get) => ({
    currentDate: dayjs(),

    setCurrentDate: (date: Dayjs) => set({ currentDate: date }),

    nextDay: () =>
      set((state) => ({
        currentDate: state.currentDate.add(1, "day"),
      })),

    prevDay: () =>
      set((state) => ({
        currentDate: state.currentDate.subtract(1, "day"),
      })),

    goToToday: () => set({ currentDate: dayjs() }),

    formatCurrentDate: () => {
      const date = get().currentDate;
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
    },
  })
);
