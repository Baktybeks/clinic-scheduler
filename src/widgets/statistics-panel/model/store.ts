import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StatisticsPanelStore {
  selectedPeriod: string;
  isExpanded: boolean;

  setSelectedPeriod: (period: string) => void;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
}

export const useStatisticsPanelStore = create<StatisticsPanelStore>()(
  devtools(
    (set) => ({
      selectedPeriod: "today",
      isExpanded: true,

      setSelectedPeriod: (period) =>
        set({ selectedPeriod: period }, false, "setSelectedPeriod"),

      setIsExpanded: (expanded) =>
        set({ isExpanded: expanded }, false, "setIsExpanded"),

      toggleExpanded: () =>
        set(
          (state) => ({ isExpanded: !state.isExpanded }),
          false,
          "toggleExpanded"
        ),
    }),
    {
      name: "statistics-panel-store",
    }
  )
);
