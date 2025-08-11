import { baseApi } from "@/shared/api/base";
import { supabase } from "@/shared/api/supabase";

interface SupabaseDoctor {
  id: number;
  name: string;
  specialty: string;
  avatar?: string;
}

interface SupabaseAppointment {
  id: number;
  appointment_date: string;
  time_start: string;
  time_end: string;
  appointment_type: string;
  status: string;
  comment?: string;
  created_at?: string;
  doctors: SupabaseDoctor | SupabaseDoctor[] | null;
}

export interface PatientWithAppointments {
  id: number;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  appointments: {
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
  }[];
  upcomingAppointments: number;
  totalAppointments: number;
  lastVisit?: string;
}

export interface PatientAppointmentStats {
  totalPatients: number;
  activePatients: number;
  patientsWithUpcomingAppointments: number;
  newPatientsThisMonth: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
}

export interface PatientAppointmentHistory {
  appointments: {
    id: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    type: string;
    status: string;
    comment?: string;
    createdAt: string;
    doctor: {
      id: number;
      name: string;
      specialty: string;
      avatar?: string;
    };
  }[];
  totalCount: number;
}

export const patientAppointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientsWithAppointments: builder.query<
      PatientWithAppointments[],
      {
        search?: string;
        status?: string;
        doctorId?: number;
        dateFrom?: string;
        dateTo?: string;
        limit?: number;
        offset?: number;
      }
    >({
      queryFn: async (params = {}) => {
        try {
          const {
            search,
            status,
            doctorId,
            dateFrom,
            dateTo,
            limit = 50,
            offset = 0,
          } = params;

          let patientsQuery = supabase
            .from("patients")
            .select(
              `
              id,
              name,
              phone,
              email,
              birth_date,
              notes,
              created_at,
              updated_at
            `
            )
            .range(offset, offset + limit - 1)
            .order("name");

          if (search && search.length >= 2) {
            patientsQuery = patientsQuery.or(
              `name.ilike.%${search}%,phone.like.%${search}%,email.ilike.%${search}%`
            );
          }

          const { data: patients, error: patientsError } = await patientsQuery;

          if (patientsError) {
            console.warn("Patients query error:", patientsError);
            return { data: [] };
          }

          if (!patients || patients.length === 0) {
            return { data: getMockPatientsWithAppointments() };
          }

          const patientsWithAppointments: PatientWithAppointments[] =
            await Promise.all(
              patients.map(async (patient) => {
                let appointmentsQuery = supabase
                  .from("appointments")
                  .select(
                    `
                  id,
                  appointment_date,
                  time_start,
                  time_end,
                  appointment_type,
                  status,
                  comment,
                  doctor_id,
                  doctors!inner (
                    id,
                    name,
                    specialty
                  )
                `
                  )
                  .eq("patient_phone", patient.phone)
                  .order("appointment_date", { ascending: false });

                if (status && status !== "all") {
                  appointmentsQuery = appointmentsQuery.eq("status", status);
                }

                if (doctorId) {
                  appointmentsQuery = appointmentsQuery.eq(
                    "doctor_id",
                    doctorId
                  );
                }

                if (dateFrom) {
                  appointmentsQuery = appointmentsQuery.gte(
                    "appointment_date",
                    dateFrom
                  );
                }

                if (dateTo) {
                  appointmentsQuery = appointmentsQuery.lte(
                    "appointment_date",
                    dateTo
                  );
                }

                const { data: appointments, error: appointmentsError } =
                  await appointmentsQuery;

                if (appointmentsError) {
                  console.warn("Appointments query error:", appointmentsError);
                }

                const appointmentList = (appointments || []).map((apt) => {
                  const doctorData = extractDoctorData(apt.doctors);

                  return {
                    id: apt.id,
                    date: apt.appointment_date,
                    timeStart: apt.time_start,
                    timeEnd: apt.time_end,
                    type: apt.appointment_type,
                    status: apt.status,
                    comment: apt.comment,
                    doctor: {
                      id: doctorData.id,
                      name: doctorData.name,
                      specialty: doctorData.specialty,
                    },
                  };
                });

                const now = new Date().toISOString().split("T")[0];
                const upcomingAppointments = appointmentList.filter(
                  (apt) => apt.date >= now && apt.status !== "Отменен"
                ).length;

                const lastVisit = appointmentList
                  .filter((apt) => apt.date < now && apt.status === "Завершен")
                  .sort((a, b) => b.date.localeCompare(a.date))[0]?.date;

                return {
                  id: patient.id,
                  name: patient.name,
                  phone: patient.phone,
                  email: patient.email,
                  birthDate: patient.birth_date,
                  notes: patient.notes,
                  createdAt: patient.created_at,
                  updatedAt: patient.updated_at,
                  appointments: appointmentList,
                  upcomingAppointments,
                  totalAppointments: appointmentList.length,
                  lastVisit,
                };
              })
            );

          return { data: patientsWithAppointments };
        } catch (error) {
          console.error("Failed to fetch patients with appointments:", error);
          return { data: getMockPatientsWithAppointments() };
        }
      },
      providesTags: ["Patient", "Appointment"],
    }),

    getPatientAppointmentStats: builder.query<PatientAppointmentStats, void>({
      queryFn: async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekStartStr = weekStart.toISOString().split("T")[0];

          const monthStart = new Date();
          monthStart.setDate(1);
          const monthStartStr = monthStart.toISOString().split("T")[0];

          const { count: totalPatients } = await supabase
            .from("patients")
            .select("*", { count: "exact", head: true });

          if (totalPatients === null) {
            return { data: getMockPatientStats() };
          }

          const { data: activeAppointments } = await supabase
            .from("appointments")
            .select("patient_phone")
            .gte("appointment_date", today)
            .neq("status", "Отменен");

          const activePatients = new Set(
            activeAppointments?.map((apt) => apt.patient_phone) || []
          ).size;

          const { count: newPatientsThisMonth } = await supabase
            .from("patients")
            .select("*", { count: "exact", head: true })
            .gte("created_at", monthStartStr);

          const { count: appointmentsToday } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("appointment_date", today)
            .neq("status", "Отменен");

          const { count: appointmentsThisWeek } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", weekStartStr)
            .neq("status", "Отменен");

          const { data: upcomingAppointments } = await supabase
            .from("appointments")
            .select("patient_phone")
            .gte("appointment_date", today)
            .neq("status", "Отменен");

          const patientsWithUpcomingAppointments = new Set(
            upcomingAppointments?.map((apt) => apt.patient_phone) || []
          ).size;

          return {
            data: {
              totalPatients: totalPatients || 0,
              activePatients,
              patientsWithUpcomingAppointments,
              newPatientsThisMonth: newPatientsThisMonth || 0,
              appointmentsToday: appointmentsToday || 0,
              appointmentsThisWeek: appointmentsThisWeek || 0,
            },
          };
        } catch (error) {
          console.error("Failed to fetch patient appointment stats:", error);
          return { data: getMockPatientStats() };
        }
      },
      providesTags: ["Patient", "Appointment"],
    }),

    getPatientAppointmentHistory: builder.query<
      PatientAppointmentHistory,
      {
        patientId: number;
        limit?: number;
        offset?: number;
      }
    >({
      queryFn: async ({ patientId, limit = 20, offset = 0 }) => {
        try {
          const { data: patient } = await supabase
            .from("patients")
            .select("phone")
            .eq("id", patientId)
            .single();

          if (!patient) {
            return { data: { appointments: [], totalCount: 0 } };
          }

          const {
            data: appointments,
            error,
            count,
          } = await supabase
            .from("appointments")
            .select(
              `
              id,
              appointment_date,
              time_start,
              time_end,
              appointment_type,
              status,
              comment,
              created_at,
              doctor_id,
              doctors!inner (
                id,
                name,
                specialty,
                avatar
              )
            `,
              { count: "exact" }
            )
            .eq("patient_phone", patient.phone)
            .order("appointment_date", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) {
            console.error("Error fetching patient appointments:", error);
            return { data: { appointments: [], totalCount: 0 } };
          }

          const formattedAppointments = (appointments || []).map((apt) => {
            const doctorData = extractDoctorData(apt.doctors);

            return {
              id: apt.id,
              date: apt.appointment_date,
              timeStart: apt.time_start,
              timeEnd: apt.time_end,
              type: apt.appointment_type,
              status: apt.status,
              comment: apt.comment,
              createdAt: apt.created_at,
              doctor: {
                id: doctorData.id,
                name: doctorData.name,
                specialty: doctorData.specialty,
                avatar: doctorData.avatar,
              },
            };
          });

          return {
            data: {
              appointments: formattedAppointments,
              totalCount: count || 0,
            },
          };
        } catch (error) {
          console.error("Failed to fetch patient appointment history:", error);
          return { data: { appointments: [], totalCount: 0 } };
        }
      },
      providesTags: (result, error, { patientId }) => [
        { type: "Patient", id: patientId },
        "Appointment",
      ],
    }),
  }),
});

function getMockPatientsWithAppointments(): PatientWithAppointments[] {
  return [
    {
      id: 1,
      name: "Анна Иванова",
      phone: "996550001234",
      email: "anna@example.com",
      birthDate: "1990-05-15",
      notes: "Регулярный пациент",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-08-10T14:30:00Z",
      appointments: [
        {
          id: 1,
          date: "2025-08-15",
          timeStart: "14:00",
          timeEnd: "15:00",
          type: "Лечение",
          status: "Записан",
          comment: "Плановый осмотр",
          doctor: {
            id: 1,
            name: "Рустам Торогелдие",
            specialty: "Терапевт Имплантолог",
          },
        },
        {
          id: 2,
          date: "2025-08-05",
          timeStart: "11:00",
          timeEnd: "12:00",
          type: "Консультация",
          status: "Завершен",
          comment: "Первичная консультация",
          doctor: {
            id: 1,
            name: "Рустам Торогелдие",
            specialty: "Терапевт Имплантолог",
          },
        },
      ],
      upcomingAppointments: 1,
      totalAppointments: 2,
      lastVisit: "2025-08-05",
    },
    {
      id: 2,
      name: "Ринат Иманкулов",
      phone: "996555123456",
      email: "rinat@example.com",
      birthDate: "1985-03-22",
      notes: "",
      createdAt: "2025-02-01T09:00:00Z",
      updatedAt: "2025-08-08T16:00:00Z",
      appointments: [
        {
          id: 3,
          date: "2025-08-12",
          timeStart: "15:30",
          timeEnd: "16:30",
          type: "Консультация",
          status: "Записан",
          comment: "Повторная консультация",
          doctor: {
            id: 2,
            name: "Элеш Асанов",
            specialty: "Терапевт Имплантолог Ортопед",
          },
        },
      ],
      upcomingAppointments: 1,
      totalAppointments: 1,
      lastVisit: undefined,
    },
    {
      id: 3,
      name: "Мария Петрова",
      phone: "996700123456",
      email: "maria@example.com",
      birthDate: "1992-11-08",
      notes: "Аллергия на анестезию",
      createdAt: "2024-12-10T11:00:00Z",
      updatedAt: "2025-08-05T13:45:00Z",
      appointments: [
        {
          id: 4,
          date: "2025-08-05",
          timeStart: "10:00",
          timeEnd: "11:00",
          type: "Лечение",
          status: "Завершен",
          comment: "Установка пломбы",
          doctor: {
            id: 2,
            name: "Элеш Асанов",
            specialty: "Терапевт Имплантолог Ортопед",
          },
        },
      ],
      upcomingAppointments: 0,
      totalAppointments: 1,
      lastVisit: "2025-08-05",
    },
  ];
}

function getMockPatientStats(): PatientAppointmentStats {
  return {
    totalPatients: 3,
    activePatients: 2,
    patientsWithUpcomingAppointments: 2,
    newPatientsThisMonth: 1,
    appointmentsToday: 0,
    appointmentsThisWeek: 2,
  };
}

function extractDoctorData(doctors: any): {
  id: number;
  name: string;
  specialty: string;
  avatar?: string;
} {
  if (!doctors) {
    return {
      id: 0,
      name: "Неизвестный врач",
      specialty: "",
      avatar: "👨‍⚕️",
    };
  }

  const doctor = Array.isArray(doctors) ? doctors[0] : doctors;

  return {
    id: doctor?.id || 0,
    name: doctor?.name || "Неизвестный врач",
    specialty: doctor?.specialty || "",
    avatar: doctor?.avatar || "👨‍⚕️",
  };
}

export const {
  useGetPatientsWithAppointmentsQuery,
  useGetPatientAppointmentStatsQuery,
  useGetPatientAppointmentHistoryQuery,
} = patientAppointmentsApi;
