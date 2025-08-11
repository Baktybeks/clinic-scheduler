import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Patient } from "@/shared/types";

interface PatientStore {
  selectedPatient: Patient | null;
  searchTerm: string;
  isSearching: boolean;
  recentPatients: Patient[];

  setSelectedPatient: (patient: Patient | null) => void;
  setSearchTerm: (term: string) => void;
  setIsSearching: (searching: boolean) => void;
  setRecentPatients: (patients: Patient[]) => void;
  addRecentPatient: (patient: Patient) => void;
  clearSelection: () => void;
  clearSearch: () => void;
}

export const usePatientStore = create<PatientStore>()(
  devtools(
    (set, get) => ({
      selectedPatient: null,
      searchTerm: "",
      isSearching: false,
      recentPatients: [],

      setSelectedPatient: (patient) =>
        set({ selectedPatient: patient }, false, "setSelectedPatient"),

      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, "setSearchTerm"),

      setIsSearching: (searching) =>
        set({ isSearching: searching }, false, "setIsSearching"),

      setRecentPatients: (patients) =>
        set({ recentPatients: patients }, false, "setRecentPatients"),

      addRecentPatient: (patient) =>
        set(
          (state) => ({
            recentPatients: [
              patient,
              ...state.recentPatients.filter((p) => p.id !== patient.id),
            ].slice(0, 10),
          }),
          false,
          "addRecentPatient"
        ),

      clearSelection: () =>
        set({ selectedPatient: null }, false, "clearSelection"),

      clearSearch: () =>
        set(
          {
            searchTerm: "",
            isSearching: false,
          },
          false,
          "clearSearch"
        ),
    }),
    {
      name: "patient-store",
    }
  )
);
