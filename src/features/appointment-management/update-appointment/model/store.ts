import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AppointmentStatus } from "@/shared/types";

interface UpdateAppointmentStore {
  isUpdating: boolean;
  lastUpdatedId: number | null;

  setIsUpdating: (loading: boolean) => void;
  setLastUpdatedId: (id: number | null) => void;
  getNextStatus: (currentStatus: AppointmentStatus) => AppointmentStatus;
}

export const useUpdateAppointmentStore = create<UpdateAppointmentStore>()(
  devtools(
    (set, get) => ({
      isUpdating: false,
      lastUpdatedId: null,

      setIsUpdating: (loading) =>
        set({ isUpdating: loading }, false, "setIsUpdating"),

      setLastUpdatedId: (id) =>
        set({ lastUpdatedId: id }, false, "setLastUpdatedId"),

      getNextStatus: (currentStatus: AppointmentStatus): AppointmentStatus => {
        const statusCycle: Record<AppointmentStatus, AppointmentStatus> = {
          Записан: "Пришел",
          Пришел: "Завершен",
          Завершен: "Записан",
          Отменен: "Записан",
        };
        return statusCycle[currentStatus] || "Записан";
      },
    }),
    {
      name: "update-appointment-store",
    }
  )
);
