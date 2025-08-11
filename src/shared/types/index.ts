export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  appointments: Appointment[];
}

export interface Appointment {
  id: number;
  timeStart: string;
  timeEnd: string;
  patient: string;
  phone: string;
  status: AppointmentStatus;
  type: AppointmentType;
  comment?: string;
}

export type AppointmentStatus = "Записан" | "Пришел" | "Завершен" | "Отменен";
export type AppointmentType =
  | "Лечение"
  | "Консультация"
  | "Имплантация"
  | "Профилактика";

export interface CreateAppointmentRequest {
  doctorId: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  patient: string;
  phone: string;
  type: AppointmentType;
  comment?: string;
}

export interface UpdateAppointmentRequest {
  id: number;
  status?: AppointmentStatus;
  timeStart?: string;
  timeEnd?: string;
  patient?: string;
  phone?: string;
  type?: AppointmentType;
  comment?: string;
}

export interface SearchResult extends Appointment {
  doctor: string;
}

export interface Stats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
}

export interface AppointmentPosition {
  top: number;
  height: number;
  zIndex: number;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
