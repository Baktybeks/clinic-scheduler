export interface DoctorState {
  selectedDoctorId: number | null;
  filters: {
    specialty: string | null;
    availability: boolean;
  };
}
