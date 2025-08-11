import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Appointment, AppointmentStatus } from "@/shared/types";

interface AppointmentStore {
  selectedAppointmentId: number | null;
  isCreatingAppointment: boolean;
  isUpdatingAppointment: boolean;
  filters: {
    status: AppointmentStatus | null;
    dateRange: [string, string] | null;
    doctorId: number | null;
  };

  setSelectedAppointmentId: (id: number | null) => void;
  setIsCreatingAppointment: (creating: boolean) => void;
  setIsUpdatingAppointment: (updating: boolean) => void;
  setStatusFilter: (status: AppointmentStatus | null) => void;
  setDateRangeFilter: (range: [string, string] | null) => void;
  setDoctorFilter: (doctorId: number | null) => void;
  clearFilters: () => void;
}

export const useAppointmentStore = create<AppointmentStore>()(
  devtools(
    (set) => ({
      selectedAppointmentId: null,
      isCreatingAppointment: false,
      isUpdatingAppointment: false,
      filters: {
        status: null,
        dateRange: null,
        doctorId: null,
      },

      setSelectedAppointmentId: (id) =>
        set({ selectedAppointmentId: id }, false, "setSelectedAppointmentId"),

      setIsCreatingAppointment: (creating) =>
        set(
          { isCreatingAppointment: creating },
          false,
          "setIsCreatingAppointment"
        ),

      setIsUpdatingAppointment: (updating) =>
        set(
          { isUpdatingAppointment: updating },
          false,
          "setIsUpdatingAppointment"
        ),

      setStatusFilter: (status) =>
        set(
          (state) => ({
            filters: { ...state.filters, status },
          }),
          false,
          "setStatusFilter"
        ),

      setDateRangeFilter: (range) =>
        set(
          (state) => ({
            filters: { ...state.filters, dateRange: range },
          }),
          false,
          "setDateRangeFilter"
        ),

      setDoctorFilter: (doctorId) =>
        set(
          (state) => ({
            filters: { ...state.filters, doctorId },
          }),
          false,
          "setDoctorFilter"
        ),

      clearFilters: () =>
        set(
          {
            filters: { status: null, dateRange: null, doctorId: null },
          },
          false,
          "clearFilters"
        ),
    }),
    {
      name: "appointment-store",
    }
  )
);
