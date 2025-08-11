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

export interface PatientWithAppointments extends Patient {
  appointments: PatientAppointment[];
  upcomingAppointments: number;
  totalAppointments: number;
  lastVisit?: string;
}

export interface PatientAppointment {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  type: string;
  status: string;
  comment?: string;
  doctor: {
    id: number;
    name: string;
    specialty: string;
  };
}

export interface PatientAppointmentStats {
  totalPatients: number;
  activePatients: number;
  patientsWithUpcomingAppointments: number;
  newPatientsThisMonth: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
}

export interface PatientState {
  selectedPatientId: number | null;
  searchTerm: string;
  patients: Patient[];
  isLoading: boolean;
}

export interface CreatePatientRequest {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdatePatientRequest {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  notes?: string;
}
