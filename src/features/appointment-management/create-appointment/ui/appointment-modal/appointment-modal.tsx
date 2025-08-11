"use client";
import { Modal, Form, Input, Select, TimePicker, Button, message } from "antd";
import { useCreateAppointmentMutation } from "@/entities/appointment";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import type { CreateAppointmentRequest } from "@/shared/types";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTime?: string;
}

export function AppointmentModal({
  visible,
  onClose,
  selectedTime,
}: AppointmentModalProps) {
  const [form] = Form.useForm();
  const { currentDate } = useCalendarHeaderStore();
  const { data: doctors = [] } = useGetDoctorsQuery(undefined);
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (values: any) => {
    try {
      const appointmentData: CreateAppointmentRequest = {
        doctorId: values.doctorId,
        date: currentDate.format("YYYY-MM-DD"),
        timeStart: values.timeRange[0].format("HH:mm"),
        timeEnd: values.timeRange[1].format("HH:mm"),
        patient: values.patient,
        phone: values.phone.replace(/\s/g, ""),
        type: values.type,
        comment: values.comment || "",
      };

      await createAppointment(appointmentData).unwrap();
      message.success("Запись успешно создана!");
      form.resetFields();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Ошибка при создании записи";
      message.error(errorMessage);
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <Modal
      title="Новая запись"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          timeRange: selectedTime
            ? [
                dayjs(selectedTime, "HH:mm"),
                dayjs(selectedTime, "HH:mm").add(1, "hour"),
              ]
            : undefined,
        }}
      >
        <Form.Item
          name="doctorId"
          label="Врач"
          rules={[{ required: true, message: "Выберите врача" }]}
        >
          <Select placeholder="Выберите врача">
            {doctors.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="timeRange"
          label="Время"
          rules={[{ required: true, message: "Выберите время" }]}
        >
          <TimePicker.RangePicker
            format="HH:mm"
            minuteStep={30}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="patient"
          label="Пациент"
          rules={[
            { required: true, message: "Введите имя пациента" },
            { min: 2, message: "Минимум 2 символа" },
          ]}
        >
          <Input placeholder="Имя пациента" />
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
          <Input placeholder="996 XXX XXX XXX" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Тип приема"
          rules={[{ required: true, message: "Выберите тип приема" }]}
        >
          <Select placeholder="Выберите тип приема">
            <Option value="Консультация">Консультация</Option>
            <Option value="Лечение">Лечение</Option>
            <Option value="Имплантация">Имплантация</Option>
            <Option value="Профилактика">Профилактика</Option>
          </Select>
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <TextArea rows={3} placeholder="Дополнительная информация..." />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Создать запись
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
