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
