import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Doctor } from "@/shared/types";

interface DoctorStore {
  selectedDoctorId: number | null;
  favoriteDoctors: number[];
  filters: {
    specialty: string | null;
    availability: boolean;
  };

  setSelectedDoctorId: (id: number | null) => void;
  toggleFavoriteDoctor: (id: number) => void;
  setSpecialtyFilter: (specialty: string | null) => void;
  setAvailabilityFilter: (availability: boolean) => void;
  clearFilters: () => void;
}

export const useDoctorStore = create<DoctorStore>()(
  devtools(
    (set) => ({
      selectedDoctorId: null,
      favoriteDoctors: [],
      filters: {
        specialty: null,
        availability: true,
      },

      setSelectedDoctorId: (id) =>
        set({ selectedDoctorId: id }, false, "setSelectedDoctorId"),

      toggleFavoriteDoctor: (id) =>
        set(
          (state) => ({
            favoriteDoctors: state.favoriteDoctors.includes(id)
              ? state.favoriteDoctors.filter((doctorId) => doctorId !== id)
              : [...state.favoriteDoctors, id],
          }),
          false,
          "toggleFavoriteDoctor"
        ),

      setSpecialtyFilter: (specialty) =>
        set(
          (state) => ({
            filters: { ...state.filters, specialty },
          }),
          false,
          "setSpecialtyFilter"
        ),

      setAvailabilityFilter: (availability) =>
        set(
          (state) => ({
            filters: { ...state.filters, availability },
          }),
          false,
          "setAvailabilityFilter"
        ),

      clearFilters: () =>
        set(
          {
            filters: { specialty: null, availability: true },
          },
          false,
          "clearFilters"
        ),
    }),
    {
      name: "doctor-store",
    }
  )
);
