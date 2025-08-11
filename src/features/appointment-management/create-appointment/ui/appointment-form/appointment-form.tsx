"use client";
import { Form, Input, Select, TimePicker, Button, Divider } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { QuickSearch } from "@/features/patient-search";
import { PatientModal } from "@/features/patient-management/create-patient";
import { validatePhone } from "@/shared/lib/phone-utils";
import type { CreateAppointmentRequest, SearchResult } from "@/shared/types";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface AppointmentFormProps {
  initialValues?: Partial<CreateAppointmentRequest>;
  onSubmit: (values: CreateAppointmentRequest) => void;
  loading?: boolean;
  selectedTime?: string;
}

export function AppointmentForm({
  initialValues,
  onSubmit,
  loading = false,
  selectedTime,
}: AppointmentFormProps) {
  const [form] = Form.useForm();
  const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SearchResult | null>(
    null
  );

  const { data: doctors = [] } = useGetDoctorsQuery(undefined);

  const handleSubmit = (values: any) => {
    const appointmentData: CreateAppointmentRequest = {
      doctorId: values.doctorId,
      date: values.date || new Date().toISOString().split("T")[0],
      timeStart: values.timeRange[0].format("HH:mm"),
      timeEnd: values.timeRange[1].format("HH:mm"),
      patient: values.patient,
      phone: values.phone.replace(/\s/g, ""),
      type: values.type,
      comment: values.comment || "",
    };

    onSubmit(appointmentData);
  };

  const handlePatientSelect = (patient: SearchResult) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      patient: patient.patient,
      phone: patient.phone,
    });
  };

  const handleCreateNewPatient = (searchTerm: string) => {
    setIsPatientModalVisible(true);
  };

  const handlePatientCreated = (patientId: number) => {
    console.log("Создан новый пациент:", patientId);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...initialValues,
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
          <Select placeholder="Выберите врача" size="large">
            {doctors.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                <div className="flex items-center">
                  <span className="mr-2">{doctor.avatar}</span>
                  {doctor.name} - {doctor.specialty}
                </div>
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
            size="large"
          />
        </Form.Item>

        <Divider orientation="left">Пациент</Divider>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Поиск существующего пациента
          </label>
          <QuickSearch
            onSelect={handlePatientSelect}
            onCreateNew={handleCreateNewPatient}
            placeholder="Найти пациента по имени или телефону..."
            style={{ width: "100%" }}
          />
        </div>

        {selectedPatient && (
          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Выбранный пациент:</strong> {selectedPatient.patient}
            </div>
            <div className="text-xs text-blue-600">
              Телефон: {selectedPatient.phone}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="patient"
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
                  return Promise.reject(
                    new Error("Некорректный номер телефона")
                  );
                },
              },
            ]}
          >
            <Input placeholder="996 XXX XXX XXX" />
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
            placeholder="Дополнительная информация..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-between items-center">
            <Button
              icon={<UserAddOutlined />}
              onClick={() => setIsPatientModalVisible(true)}
            >
              Новый пациент
            </Button>
            <div className="space-x-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Создать запись
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>

      <PatientModal
        visible={isPatientModalVisible}
        onClose={() => setIsPatientModalVisible(false)}
        onSuccess={handlePatientCreated}
      />
    </>
  );
}
