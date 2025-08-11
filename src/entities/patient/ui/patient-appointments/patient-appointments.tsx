import { Card, Table, Tag, Button, Tooltip, Space, Avatar, Badge } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { formatPhone } from "@/shared/lib/phone-utils";

interface PatientAppointment {
  id: number;
  patientName: string;
  phone: string;
  doctor: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: string;
  notes?: string;
  duration?: number;
}

interface PatientAppointmentsProps {
  appointments: PatientAppointment[];
  loading?: boolean;
  onEdit?: (appointment: PatientAppointment) => void;
  onDelete?: (appointmentId: number) => void;
  onView?: (appointment: PatientAppointment) => void;
}

export function PatientAppointments({
  appointments,
  loading = false,
  onEdit,
  onDelete,
  onView,
}: PatientAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Записан":
        return "blue";
      case "Пришел":
        return "orange";
      case "Завершен":
        return "green";
      case "Отменен":
        return "red";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Лечение":
        return "🦷";
      case "Консультация":
        return "🩺";
      case "Имплантация":
        return "⚕️";
      case "Профилактика":
        return "🧽";
      default:
        return "📋";
    }
  };

  const isUpcoming = (date: string) => {
    return dayjs(date).isAfter(dayjs());
  };

  const columns = [
    {
      title: "Пациент",
      key: "patient",
      width: 200,
      render: (record: PatientAppointment) => (
        <div className="flex items-center space-x-3">
          <Avatar size={32} style={{ backgroundColor: "#f56a00" }}>
            {record.patientName.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium text-sm">{record.patientName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <PhoneOutlined className="mr-1" />
              {formatPhone(record.phone)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Врач",
      key: "doctor",
      width: 180,
      render: (record: PatientAppointment) => (
        <div>
          <div className="font-medium text-sm">{record.doctor}</div>
          <div className="text-xs text-gray-500">{record.doctorSpecialty}</div>
        </div>
      ),
    },
    {
      title: "Дата и время",
      key: "datetime",
      width: 150,
      sorter: (a: PatientAppointment, b: PatientAppointment) =>
        dayjs(a.appointmentDate).unix() - dayjs(b.appointmentDate).unix(),
      render: (record: PatientAppointment) => (
        <div>
          <div className="flex items-center text-sm font-medium">
            <CalendarOutlined className="mr-1 text-blue-500" />
            {dayjs(record.appointmentDate).format("DD.MM.YYYY")}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            {record.appointmentTime}
            {record.duration && ` (${record.duration} мин)`}
          </div>
        </div>
      ),
    },
    {
      title: "Тип приема",
      key: "type",
      width: 120,
      render: (record: PatientAppointment) => (
        <div className="flex items-center">
          <span className="mr-2">{getTypeIcon(record.appointmentType)}</span>
          <span className="text-sm">{record.appointmentType}</span>
        </div>
      ),
    },
    {
      title: "Статус",
      key: "status",
      width: 100,
      filters: [
        { text: "Записан", value: "Записан" },
        { text: "Пришел", value: "Пришел" },
        { text: "Завершен", value: "Завершен" },
        { text: "Отменен", value: "Отменен" },
      ],
      onFilter: (value: any, record: PatientAppointment) =>
        record.status === value,
      render: (record: PatientAppointment) => (
        <Tag color={getStatusColor(record.status)} className="text-xs">
          {record.status}
        </Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (record: PatientAppointment) => (
        <Space size="small">
          <Tooltip title="Просмотр">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView?.(record)}
            />
          </Tooltip>
          {isUpcoming(record.appointmentDate) && (
            <>
              <Tooltip title="Редактировать">
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onEdit?.(record)}
                />
              </Tooltip>
              <Tooltip title="Отменить">
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={() => onDelete?.(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Записи пациентов</span>
          <Badge
            count={appointments.length}
            style={{ backgroundColor: "#52c41a" }}
          />
        </div>
      }
      extra={
        <Button type="primary" icon={<CalendarOutlined />}>
          Новая запись
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} из ${total} записей`,
        }}
        rowClassName={(record) =>
          isUpcoming(record.appointmentDate) ? "bg-blue-50" : ""
        }
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
