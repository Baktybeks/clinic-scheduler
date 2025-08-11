import { baseApi } from "@/shared/api/base";
import { supabase } from "@/shared/api/supabase";
import type {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
} from "./types";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<Patient[], { search?: string; limit?: number }>({
      queryFn: async ({ search, limit = 50 } = {}) => {
        try {
          let query = supabase
            .from("patients")
            .select("*")
            .limit(limit)
            .order("name");

          if (search && search.length >= 2) {
            query = query.or(
              `name.ilike.%${search}%,phone.like.%${search}%,email.ilike.%${search}%`
            );
          }

          const { data, error } = await query;

          if (error) {
            console.warn("Patients query error:", error);
            return { data: [] };
          }

          const patients: Patient[] = (data || []).map((patient) => ({
            id: patient.id,
            name: patient.name,
            phone: patient.phone,
            email: patient.email || undefined,
            birthDate: patient.birth_date || undefined,
            notes: patient.notes || undefined,
            createdAt: patient.created_at,
            updatedAt: patient.updated_at,
          }));

          return { data: patients };
        } catch (error) {
          console.error("Failed to fetch patients:", error);
          return { data: [] };
        }
      },
      providesTags: ["Patient"],
    }),

    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      queryFn: async (newPatient) => {
        try {
          const { data, error } = await supabase
            .from("patients")
            .insert({
              name: newPatient.name,
              phone: newPatient.phone,
              email: newPatient.email || null,
              birth_date: newPatient.birthDate || null,
              notes: newPatient.notes || null,
            })
            .select()
            .single();

          if (error) throw error;

          const patient: Patient = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email || undefined,
            birthDate: data.birth_date || undefined,
            notes: data.notes || undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          return { data: patient };
        } catch (error) {
          console.error("Create patient error:", error);
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: ["Patient"],
    }),

    updatePatient: builder.mutation<Patient, UpdatePatientRequest>({
      queryFn: async ({ id, ...updates }) => {
        try {
          const updateData: any = {};

          if (updates.name) updateData.name = updates.name;
          if (updates.phone) updateData.phone = updates.phone;
          if (updates.email !== undefined) updateData.email = updates.email;
          if (updates.birthDate !== undefined)
            updateData.birth_date = updates.birthDate;
          if (updates.notes !== undefined) updateData.notes = updates.notes;

          updateData.updated_at = new Date().toISOString();

          const { data, error } = await supabase
            .from("patients")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          const patient: Patient = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email || undefined,
            birthDate: data.birth_date || undefined,
            notes: data.notes || undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          return { data: patient };
        } catch (error) {
          console.error("Update patient error:", error);
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Patient", id },
        "Patient",
      ],
    }),

    deletePatient: builder.mutation<void, number>({
      queryFn: async (id) => {
        try {
          const { error } = await supabase
            .from("patients")
            .delete()
            .eq("id", id);

          if (error) throw error;

          return { data: undefined };
        } catch (error) {
          console.error("Delete patient error:", error);
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;

export {
  useGetPatientsWithAppointmentsQuery,
  useGetPatientAppointmentStatsQuery,
  useGetPatientAppointmentHistoryQuery,
} from "./appointments-api";

export type {
  PatientWithAppointments,
  PatientAppointmentStats,
  PatientAppointmentHistory,
} from "./appointments-api";
