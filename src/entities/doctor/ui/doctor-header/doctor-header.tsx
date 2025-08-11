import type { Doctor } from "@/shared/types";

interface DoctorHeaderProps {
  doctor: Doctor;
}

export function DoctorHeader({ doctor }: DoctorHeaderProps) {
  return (
    <div className="bg-white p-4 text-center border-r border-gray-200">
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-2">{doctor.avatar}</div>
        <div className="font-semibold text-gray-800 text-sm leading-tight">
          {doctor.name}
        </div>
        <div className="text-xs text-gray-500 mt-1">{doctor.specialty}</div>
      </div>
    </div>
  );
}
