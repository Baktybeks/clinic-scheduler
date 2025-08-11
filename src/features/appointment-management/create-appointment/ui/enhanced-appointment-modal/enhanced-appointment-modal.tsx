"use client";
import {
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  Button,
  message,
  DatePicker,
  Card,
} from "antd";
import { useCreateAppointmentMutation } from "@/entities/appointment";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import type { CreateAppointmentRequest, Doctor } from "@/shared/types";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface EnhancedAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  initialValues?: {
    patient?: string;
    phone?: string;
    date?: string;
    timeStart?: string;
    doctorId?: number;
    doctorName?: string;
  };
}

export function EnhancedAppointmentModal({
  visible,
  onClose,
  initialValues,
}: EnhancedAppointmentModalProps) {
  const [form] = Form.useForm();
  const { currentDate } = useCalendarHeaderStore();
  const { data: doctors = [] } = useGetDoctorsQuery(
    currentDate.format("YYYY-MM-DD")
  );
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const preselectedDoctor = initialValues?.doctorId
    ? doctors.find((d) => d.id === initialValues.doctorId)
    : null;

  const handleSubmit = async (values: any) => {
    try {
      const appointmentData: CreateAppointmentRequest = {
        doctorId: values.doctorId,
        date: values.date
          ? values.date.format("YYYY-MM-DD")
          : currentDate.format("YYYY-MM-DD"),
        timeStart: values.timeRange[0].format("HH:mm"),
        timeEnd: values.timeRange[1].format("HH:mm"),
        patient: values.patient,
        phone: values.phone.replace(/\s/g, ""),
        type: values.type,
        comment: values.comment || "",
      };

      await createAppointment(appointmentData).unwrap();

      const selectedDoctor = doctors.find((d) => d.id === values.doctorId);
      message.success(
        `Запись создана! Пациент ${values.patient} записан к врачу ${
          selectedDoctor?.name
        } на ${values.timeRange[0].format("HH:mm")}`
      );

      form.resetFields();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Ошибка при создании записи";
      message.error(errorMessage);
      console.error("Error creating appointment:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const getInitialFormValues = () => {
    const baseValues = {
      patient: initialValues?.patient || "",
      phone: initialValues?.phone || "",
      date: initialValues?.date ? dayjs(initialValues.date) : currentDate,
      timeRange: initialValues?.timeStart
        ? [
            dayjs(initialValues.timeStart, "HH:mm"),
            dayjs(initialValues.timeStart, "HH:mm").add(1, "hour"),
          ]
        : [dayjs("09:00", "HH:mm"), dayjs("10:00", "HH:mm")],
    };

    if (initialValues?.doctorId) {
      return {
        ...baseValues,
        doctorId: initialValues.doctorId,
      };
    }

    return baseValues;
  };

  const filterDoctorOption = (input: string, option: any) => {
    const doctorName =
      option?.props?.children?.props?.children?.[1]?.props?.children?.[0] || "";
    const doctorSpecialty =
      option?.props?.children?.props?.children?.[1]?.props?.children?.[1]?.props
        ?.children || "";

    return (
      doctorName.toLowerCase().includes(input.toLowerCase()) ||
      doctorSpecialty.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <Modal
      title={
        <div>
          <span>Новая запись</span>
          {preselectedDoctor && (
            <div className="text-sm text-gray-500 mt-1">
              Время: {initialValues?.timeStart} у врача {preselectedDoctor.name}
            </div>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      {initialValues?.timeStart && preselectedDoctor && (
        <Card size="small" className="mb-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-800">
                📅 Выбранное время: {initialValues.timeStart}
              </div>
              <div className="text-sm text-blue-600">
                👨‍⚕️ Врач: {preselectedDoctor.name} -{" "}
                {preselectedDoctor.specialty}
              </div>
              <div className="text-xs text-blue-500">
                📍 Дата: {currentDate.format("DD.MM.YYYY")}
              </div>
            </div>
            <div className="text-2xl">{preselectedDoctor.avatar}</div>
          </div>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={getInitialFormValues()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="doctorId"
            label="Врач"
            rules={[{ required: true, message: "Выберите врача" }]}
          >
            <Select
              placeholder="Выберите врача"
              size="large"
              showSearch
              filterOption={filterDoctorOption}
            >
              {doctors.map((doctor) => (
                <Option key={doctor.id} value={doctor.id}>
                  <div className="flex items-center">
                    <span className="mr-2">{doctor.avatar}</span>
                    <div>
                      <div>{doctor.name}</div>
                      <div className="text-xs text-gray-500">
                        {doctor.specialty}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Дата записи"
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD.MM.YYYY"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </div>

        <Form.Item
          name="timeRange"
          label="Время приема"
          rules={[{ required: true, message: "Выберите время" }]}
        >
          <TimePicker.RangePicker
            format="HH:mm"
            minuteStep={30}
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="patient"
            label="Имя пациента"
            rules={[
              { required: true, message: "Введите имя пациента" },
              { min: 2, message: "Минимум 2 символа" },
            ]}
          >
            <Input
              placeholder="Имя пациента"
              size="large"
              disabled={!!initialValues?.patient}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Телефон"
            rules={[
              { required: true, message: "Введите номер телефона" },
              {
                pattern: /^(\+?996)?[0-9\s]{9,12}$/,
                message: "Некорректный номер телефона",
              },
            ]}
          >
            <Input
              placeholder="996 XXX XXX XXX"
              size="large"
              disabled={!!initialValues?.phone}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="type"
          label="Тип приема"
          rules={[{ required: true, message: "Выберите тип приема" }]}
        >
          <Select placeholder="Выберите тип приема" size="large">
            <Option value="Консультация">🩺 Консультация</Option>
            <Option value="Лечение">🦷 Лечение</Option>
            <Option value="Имплантация">⚕️ Имплантация</Option>
            <Option value="Профилактика">🧽 Профилактика</Option>
          </Select>
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <TextArea
            rows={3}
            placeholder="Дополнительная информация о приеме..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-2">
            <Button onClick={handleCancel} size="large">
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
            >
              {preselectedDoctor
                ? `Записать к ${preselectedDoctor.name}`
                : "Создать запись"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
