import { baseApi } from "@/shared/api/base";
import { supabase } from "@/shared/api/supabase";
import type { Doctor } from "@/shared/types";

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Рустам Торогелдие",
    specialty: "Терапевт Имплантолог",
    avatar: "👨‍⚕️",
    appointments: [
      {
        id: 1,
        timeStart: "11:30",
        timeEnd: "12:30",
        patient: "Анна Иванова",
        phone: "996550002342",
        status: "Пришел",
        type: "Лечение",
        comment: "Плановый осмотр",
      },
      {
        id: 2,
        timeStart: "15:00",
        timeEnd: "16:30",
        patient: "Ринат Иманкулов",
        phone: "996555123456",
        status: "Записан",
        type: "Консультация",
        comment: "просто комментарий",
      },
    ],
  },
  {
    id: 2,
    name: "Элеш Асанов",
    specialty: "Терапевт Имплантолог Ортопед",
    avatar: "👨‍⚕️",
    appointments: [
      {
        id: 3,
        timeStart: "10:00",
        timeEnd: "11:00",
        patient: "Мария Петрова",
        phone: "996700123456",
        status: "Завершен",
        type: "Лечение",
        comment: "Установка пломбы",
      },
    ],
  },
];

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<Doctor[], string | undefined>({
      queryFn: async (date) => {
        try {
          const targetDate = date || new Date().toISOString().split("T")[0];

          const { data: doctors, error: doctorsError } = await supabase
            .from("doctors")
            .select("*")
            .order("name");

          if (doctorsError) {
            console.warn("Doctors query error:", doctorsError);
            return { data: mockDoctors };
          }

          const { data: appointments, error: appointmentsError } =
            await supabase
              .from("appointments")
              .select("*")
              .eq("appointment_date", targetDate)
              .order("time_start");

          if (appointmentsError) {
            console.warn("Appointments query error:", appointmentsError);
          }

          const result: Doctor[] = (doctors || []).map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            avatar: doctor.avatar || "👨‍⚕️",
            appointments: (appointments || [])
              .filter((apt) => apt.doctor_id === doctor.id)
              .map((apt) => ({
                id: apt.id,
                timeStart: apt.time_start,
                timeEnd: apt.time_end,
                patient: apt.patient_name,
                phone: apt.patient_phone,
                status: apt.status,
                type: apt.appointment_type,
                comment: apt.comment || undefined,
              })),
          }));

          return { data: result.length > 0 ? result : mockDoctors };
        } catch (error) {
          console.error("Failed to fetch doctors:", error);
          return { data: mockDoctors };
        }
      },
      providesTags: ["Doctor"],
    }),
  }),
});

export const { useGetDoctorsQuery } = doctorApi;
