export const TIME_SLOTS = {
  START_HOUR: 9,
  END_HOUR: 19,
  SLOT_DURATION: 30,
  SLOT_HEIGHT: 60,
  WORKING_DAYS: [1, 2, 3, 4, 5],
} as const;

export const BREAK_TIMES = [
  { start: "13:00", end: "14:00", label: "Обеденный перерыв" },
] as const;
