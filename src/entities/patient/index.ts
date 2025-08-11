export {
  patientApi,
  useGetPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetPatientsWithAppointmentsQuery,
  useGetPatientAppointmentStatsQuery,
  useGetPatientAppointmentHistoryQuery,
} from "./model/api";
export * from "./model/types";
export { usePatientStore } from "./model/store";
export * from "./ui";
