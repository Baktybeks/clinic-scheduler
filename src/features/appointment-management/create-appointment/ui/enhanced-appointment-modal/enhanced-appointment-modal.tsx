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
} from "antd";
import { useCreateAppointmentMutation } from "@/entities/appointment";
import { useGetDoctorsQuery } from "@/entities/doctor";
import type { CreateAppointmentRequest } from "@/shared/types";
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
  };
}

export function EnhancedAppointmentModal({
  visible,
  onClose,
  initialValues,
}: EnhancedAppointmentModalProps) {
  const [form] = Form.useForm();
  const { data: doctors = [] } = useGetDoctorsQuery(undefined);
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (values: any) => {
    try {
      const appointmentData: CreateAppointmentRequest = {
        doctorId: values.doctorId,
        date: values.date
          ? values.date.format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
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

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Записать пациента на прием"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          patient: initialValues?.patient || "",
          phone: initialValues?.phone || "",
          date: initialValues?.date ? dayjs(initialValues.date) : dayjs(),
          timeRange: initialValues?.timeStart
            ? [
                dayjs(initialValues.timeStart, "HH:mm"),
                dayjs(initialValues.timeStart, "HH:mm").add(1, "hour"),
              ]
            : [dayjs("09:00", "HH:mm"), dayjs("10:00", "HH:mm")],
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="doctorId"
            label="Врач"
            rules={[{ required: true, message: "Выберите врача" }]}
          >
            <Select placeholder="Выберите врача" size="large">
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
              Создать запись
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
