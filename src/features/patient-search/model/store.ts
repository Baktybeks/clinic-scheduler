import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { SearchResult } from "@/shared/types";

interface PatientSearchStore {
  searchTerm: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  selectedPatient: SearchResult | null;
  searchHistory: string[];

  setSearchTerm: (term: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setIsSearching: (loading: boolean) => void;
  setSelectedPatient: (patient: SearchResult | null) => void;
  addToSearchHistory: (term: string) => void;
  clearSearch: () => void;
  clearHistory: () => void;
}

export const usePatientSearchStore = create<PatientSearchStore>()(
  devtools(
    (set) => ({
      searchTerm: "",
      searchResults: [],
      isSearching: false,
      selectedPatient: null,
      searchHistory: [],

      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, "setSearchTerm"),

      setSearchResults: (results) =>
        set({ searchResults: results }, false, "setSearchResults"),

      setIsSearching: (loading) =>
        set({ isSearching: loading }, false, "setIsSearching"),

      setSelectedPatient: (patient) =>
        set({ selectedPatient: patient }, false, "setSelectedPatient"),

      addToSearchHistory: (term) =>
        set(
          (state) => ({
            searchHistory: [
              term,
              ...state.searchHistory.filter((t) => t !== term),
            ].slice(0, 5),
          }),
          false,
          "addToSearchHistory"
        ),

      clearSearch: () =>
        set(
          {
            searchTerm: "",
            searchResults: [],
            selectedPatient: null,
            isSearching: false,
          },
          false,
          "clearSearch"
        ),

      clearHistory: () => set({ searchHistory: [] }, false, "clearHistory"),
    }),
    {
      name: "patient-search-store",
    }
  )
);
