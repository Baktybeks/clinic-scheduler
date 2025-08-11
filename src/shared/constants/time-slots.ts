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

export const MINUTES_PER_HOUR = 60;
export const PIXELS_PER_MINUTE =
  TIME_SLOTS.SLOT_HEIGHT / TIME_SLOTS.SLOT_DURATION;

export const timeToPixels = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * MINUTES_PER_HOUR + minutes;
  const workStartMinutes = TIME_SLOTS.START_HOUR * MINUTES_PER_HOUR;
  return (totalMinutes - workStartMinutes) * PIXELS_PER_MINUTE;
};

export const pixelsToTime = (pixels: number): string => {
  const workStartMinutes = TIME_SLOTS.START_HOUR * MINUTES_PER_HOUR;
  const totalMinutes = workStartMinutes + pixels / PIXELS_PER_MINUTE;
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = Math.round(totalMinutes % MINUTES_PER_HOUR);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
