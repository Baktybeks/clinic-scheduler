import type { CreateAppointmentRequest } from "@/shared/types";

export interface ValidationErrors {
  doctorId?: string;
  patient?: string;
  phone?: string;
  timeRange?: string;
  type?: string;
}

export const validateAppointment = (
  data: Partial<CreateAppointmentRequest>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.doctorId) {
    errors.doctorId = "Выберите врача";
  }

  if (!data.patient || data.patient.length < 2) {
    errors.patient = "Введите имя пациента (минимум 2 символа)";
  }

  if (!data.phone) {
    errors.phone = "Введите номер телефона";
  } else if (!/^(\+?996)?[0-9\s]{9,12}$/.test(data.phone)) {
    errors.phone = "Некорректный номер телефона";
  }

  if (!data.timeStart || !data.timeEnd) {
    errors.timeRange = "Выберите время";
  }

  if (!data.type) {
    errors.type = "Выберите тип приема";
  }

  return errors;
};
