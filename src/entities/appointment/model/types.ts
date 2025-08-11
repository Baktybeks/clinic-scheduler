export interface AppointmentState {
  selectedAppointmentId: number | null;
  filters: {
    status: string | null;
    type: string | null;
    dateRange: [string, string] | null;
  };
}
