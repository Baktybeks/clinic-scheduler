"use client";
import { Form, Input, DatePicker, Button } from "antd";
import { validatePhone } from "@/shared/lib/phone-utils";
import type { CreatePatientRequest } from "@/entities/patient";
import dayjs from "dayjs";

const { TextArea } = Input;

interface PatientFormProps {
  initialValues?: Partial<CreatePatientRequest>;
  onSubmit: (values: CreatePatientRequest) => void;
  loading?: boolean;
}

export function PatientForm({
  initialValues,
  onSubmit,
  loading = false,
}: PatientFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const patientData: CreatePatientRequest = {
      name: values.name,
      phone: values.phone.replace(/\s/g, ""),
      email: values.email || undefined,
      birthDate: values.birthDate
        ? values.birthDate.format("YYYY-MM-DD")
        : undefined,
      notes: values.notes || undefined,
    };

    onSubmit(patientData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        birthDate: initialValues?.birthDate
          ? dayjs(initialValues.birthDate)
          : undefined,
      }}
    >
      <Form.Item
        name="name"
        label="Имя пациента"
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
            validator: (_, value) => {
              if (!value || validatePhone(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Некорректный номер телефона"));
            },
          },
        ]}
      >
        <Input placeholder="996 XXX XXX XXX" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email (необязательно)"
        rules={[{ type: "email", message: "Некорректный email адрес" }]}
      >
        <Input placeholder="patient@example.com" />
      </Form.Item>

      <Form.Item name="birthDate" label="Дата рождения (необязательно)">
        <DatePicker
          placeholder="Выберите дату рождения"
          style={{ width: "100%" }}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item name="notes" label="Заметки (необязательно)">
        <TextArea
          rows={3}
          placeholder="Дополнительная информация о пациенте..."
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" loading={loading} block>
          Сохранить пациента
        </Button>
      </Form.Item>
    </Form>
  );
}
