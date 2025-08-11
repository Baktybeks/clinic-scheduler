"use client";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Input,
  Space,
  Badge,
  Tooltip,
  Avatar,
  Select,
  DatePicker,
  Tabs,
  Spin,
  Empty,
} from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  PhoneOutlined,
  SearchOutlined,
  CalendarOutlined,
  MailOutlined,
  FilterOutlined,
  ExportOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useGetPatientsQuery } from "@/entities/patient";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { PatientModal } from "@/features/patient-management/create-patient";
import { EnhancedAppointmentModal } from "@/features/appointment-management/create-appointment";
import { Sidebar } from "@/widgets/sidebar";
import { formatPhone } from "@/shared/lib/phone-utils";
import type { Patient } from "@/shared/types";
import dayjs from "dayjs";

const { Content, Header } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

export function PatientsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] =
    useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: patients = [],
    isLoading: patientsLoading,
    error: patientsError,
    refetch: refetchPatients,
  } = useGetPatientsQuery({
    search: searchTerm.length >= 2 ? searchTerm : undefined,
    limit: 100,
  });

  const { data: doctors = [] } = useGetDoctorsQuery(undefined);

  const filteredPatients = useMemo(() => {
    if (!patients.length) return [];

    return patients.filter((patient) => {
      const matchesSearch =
        searchTerm.length < 2 ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.email &&
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [patients, searchTerm]);

  const stats = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");

    return {
      totalPatients: patients.length,
      activePatients: patients.filter(
        (p) =>
          p.createdAt &&
          dayjs(p.createdAt).isAfter(dayjs().subtract(30, "days"))
      ).length,
      scheduledToday: 0,
      newThisMonth: patients.filter(
        (p) => p.createdAt && dayjs(p.createdAt).isAfter(monthStart)
      ).length,
    };
  }, [patients]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Активный":
        return "processing";
      case "Записан":
        return "success";
      case "Завершен":
        return "default";
      case "Отменен":
        return "error";
      default:
        return "default";
    }
  };

  const handleRefresh = () => {
    refetchPatients();
  };

  const handleCreateAppointment = (patient: Patient) => {
    setSelectedPatientForAppointment(patient);
    setIsAppointmentModalVisible(true);
  };

  const handlePatientEdit = (patient: Patient) => {
    console.log("Редактировать пациента:", patient);
  };

  const handlePatientView = (patient: Patient) => {
    setSelectedPatient(patient);
    console.log("Просмотр пациента:", patient);
  };

  const columns = [
    {
      title: "Пациент",
      key: "patient",
      render: (record: Patient) => (
        <div className="flex items-center space-x-3">
          <Avatar size={40} style={{ backgroundColor: "#f56a00" }}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">
              {formatPhone(record.phone)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Контакты",
      key: "contacts",
      render: (record: Patient) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <PhoneOutlined className="text-gray-400" />
            <span className="text-sm">{formatPhone(record.phone)}</span>
          </div>
          {record.email && (
            <div className="flex items-center space-x-2">
              <MailOutlined className="text-gray-400" />
              <span className="text-sm">{record.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Дата рождения",
      key: "birthDate",
      render: (record: Patient) => (
        <div>
          {record.birthDate ? (
            <div>
              <div className="font-medium">
                {dayjs(record.birthDate).format("DD.MM.YYYY")}
              </div>
              <div className="text-sm text-gray-500">
                {dayjs().diff(dayjs(record.birthDate), "year")} лет
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Не указана</span>
          )}
        </div>
      ),
    },
    {
      title: "Дата регистрации",
      key: "createdAt",
      render: (record: Patient) => (
        <div>
          {record.createdAt ? (
            <div>
              <div className="font-medium">
                {dayjs(record.createdAt).format("DD.MM.YYYY")}
              </div>
              <div className="text-sm text-gray-500">
                {dayjs(record.createdAt).format("HH:mm")}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Неизвестно</span>
          )}
        </div>
      ),
    },
    {
      title: "Заметки",
      key: "notes",
      render: (record: Patient) => (
        <div className="max-w-xs">
          {record.notes ? (
            <Tooltip title={record.notes}>
              <div className="truncate text-sm text-gray-600">
                {record.notes}
              </div>
            </Tooltip>
          ) : (
            <span className="text-gray-400">Нет заметок</span>
          )}
        </div>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (record: Patient) => (
        <Space>
          <Tooltip title="Посмотреть профиль">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePatientView(record)}
            />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handlePatientEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Записать на прием">
            <Button
              icon={<CalendarOutlined />}
              size="small"
              type="primary"
              onClick={() => handleCreateAppointment(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (patientsError) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Sidebar />
        <Layout>
          <Content className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                Повторить
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar />
      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6">
          <div className="flex justify-between items-center h-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Пациенты</h1>
              <p className="text-sm text-gray-500">
                Управление базой пациентов и записями
              </p>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={patientsLoading}
              >
                Обновить
              </Button>
              <Button icon={<ExportOutlined />}>Экспорт</Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setIsModalVisible(true)}
                size="large"
              >
                Добавить пациента
              </Button>
            </Space>
          </div>
        </Header>

        <Content className="p-6">
          <Row gutter={16} className="mb-6">
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="Всего пациентов"
                  value={stats.totalPatients}
                  prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff" }}
                  loading={patientsLoading}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="Активных (30 дней)"
                  value={stats.activePatients}
                  prefix={<UserAddOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a" }}
                  loading={patientsLoading}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="Записей сегодня"
                  value={stats.scheduledToday}
                  prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
                  valueStyle={{ color: "#fa8c16" }}
                  loading={patientsLoading}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center">
                <Statistic
                  title="Новых за месяц"
                  value={stats.newThisMonth}
                  prefix={<PhoneOutlined style={{ color: "#722ed1" }} />}
                  valueStyle={{ color: "#722ed1" }}
                  loading={patientsLoading}
                />
              </Card>
            </Col>
          </Row>

          <Card className="mb-6">
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12}>
                <Input
                  placeholder="Поиск по имени, телефону или email..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12}>
                <Space>
                  <Button icon={<FilterOutlined />}>Фильтры</Button>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Сбросить
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={`Все пациенты (${filteredPatients.length})`}
                key="all"
              >
                {patientsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <Empty
                    description="Пациенты не найдены"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Table
                    columns={columns}
                    dataSource={filteredPatients}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} из ${total} пациентов`,
                    }}
                    scroll={{ x: 1200 }}
                  />
                )}
              </TabPane>

              <TabPane tab="Новые за месяц" key="new">
                <Table
                  columns={columns}
                  dataSource={filteredPatients.filter(
                    (p) =>
                      p.createdAt &&
                      dayjs(p.createdAt).isAfter(dayjs().startOf("month"))
                  )}
                  rowKey="id"
                  pagination={false}
                  loading={patientsLoading}
                />
              </TabPane>

              <TabPane tab="Активные" key="active">
                <Table
                  columns={columns}
                  dataSource={filteredPatients.filter(
                    (p) =>
                      p.createdAt &&
                      dayjs(p.createdAt).isAfter(dayjs().subtract(30, "days"))
                  )}
                  rowKey="id"
                  pagination={false}
                  loading={patientsLoading}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>

      <PatientModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={(patientId) => {
          console.log("Создан новый пациент:", patientId);
          refetchPatients();
        }}
      />

      <EnhancedAppointmentModal
        visible={isAppointmentModalVisible}
        onClose={() => {
          setIsAppointmentModalVisible(false);
          setSelectedPatientForAppointment(null);
        }}
        initialValues={
          selectedPatientForAppointment
            ? {
                patient: selectedPatientForAppointment.name,
                phone: selectedPatientForAppointment.phone,
              }
            : undefined
        }
      />
    </Layout>
  );
}
