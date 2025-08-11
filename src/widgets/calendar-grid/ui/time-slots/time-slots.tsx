"use client";
import { useCalendarGridStore } from "../../model/store";

interface TimeSlotsProps {
  onTimeSlotClick?: (timeSlot: string) => void;
}

export function TimeSlots({ onTimeSlotClick }: TimeSlotsProps) {
  const { timeSlots } = useCalendarGridStore();

  return (
    <div className="bg-white">
      {timeSlots.map((time) => (
        <div
          key={time}
          className="time-slot"
          onClick={() => onTimeSlotClick?.(time)}
        >
          {time}
        </div>
      ))}
    </div>
  );
}
