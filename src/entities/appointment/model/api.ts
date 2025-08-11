import { baseApi } from "@/shared/api/base";
import { supabase } from "@/shared/api/supabase";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  SearchResult,
} from "@/shared/types";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      queryFn: async (newAppointment) => {
        try {
          const { data, error } = await supabase
            .from("appointments")
            .insert({
              doctor_id: newAppointment.doctorId,
              appointment_date: newAppointment.date,
              time_start: newAppointment.timeStart,
              time_end: newAppointment.timeEnd,
              patient_name: newAppointment.patient,
              patient_phone: newAppointment.phone,
              appointment_type: newAppointment.type,
              comment: newAppointment.comment || null,
              status: "Записан",
            })
            .select()
            .single();

          if (error) throw error;

          const appointment: Appointment = {
            id: data.id,
            timeStart: data.time_start,
            timeEnd: data.time_end,
            patient: data.patient_name,
            phone: data.patient_phone,
            status: data.status,
            type: data.appointment_type,
            comment: data.comment || undefined,
          };

          return { data: appointment };
        } catch (error) {
          console.error("Create appointment error:", error);
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: ["Doctor", "Appointment"],
    }),

    updateAppointment: builder.mutation<Appointment, UpdateAppointmentRequest>({
      queryFn: async ({ id, ...updates }) => {
        try {
          const updateData: any = {};

          if (updates.status) updateData.status = updates.status;
          if (updates.timeStart) updateData.time_start = updates.timeStart;
          if (updates.timeEnd) updateData.time_end = updates.timeEnd;
          if (updates.patient) updateData.patient_name = updates.patient;
          if (updates.phone) updateData.patient_phone = updates.phone;
          if (updates.type) updateData.appointment_type = updates.type;
          if (updates.comment !== undefined)
            updateData.comment = updates.comment;

          updateData.updated_at = new Date().toISOString();

          const { data, error } = await supabase
            .from("appointments")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          const appointment: Appointment = {
            id: data.id,
            timeStart: data.time_start,
            timeEnd: data.time_end,
            patient: data.patient_name,
            phone: data.patient_phone,
            status: data.status,
            type: data.appointment_type,
            comment: data.comment || undefined,
          };

          return { data: appointment };
        } catch (error) {
          console.error("Update appointment error:", error);
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Appointment", id },
        "Doctor",
      ],
    }),

    searchPatients: builder.query<SearchResult[], string>({
      queryFn: async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
          return { data: [] };
        }

        try {
          const { data: appointments, error } = await supabase
            .from("appointments")
            .select(
              `
              *,
              doctors (name)
            `
            )
            .or(
              `patient_name.ilike.%${searchTerm}%,patient_phone.like.%${searchTerm}%`
            )
            .limit(10);

          if (error) {
            console.warn("Search error:", error);
            return { data: [] };
          }

          const results: SearchResult[] = (appointments || []).map((apt) => ({
            id: apt.id,
            timeStart: apt.time_start,
            timeEnd: apt.time_end,
            patient: apt.patient_name,
            phone: apt.patient_phone,
            status: apt.status,
            type: apt.appointment_type,
            comment: apt.comment || undefined,
            doctor: apt.doctors?.name || "Неизвестный врач",
          }));

          return { data: results };
        } catch (error) {
          console.error("Search failed:", error);
          return { data: [] };
        }
      },
      providesTags: ["Patient"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useSearchPatientsQuery,
} = appointmentApi;
