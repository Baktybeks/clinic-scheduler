"use client";
import { Card, Statistic, Row, Col, Select, Spin } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useGetDoctorsQuery } from "@/entities/doctor";
import { useCalendarHeaderStore } from "@/widgets/calendar-header";
import dayjs from "dayjs";

const { Option } = Select;

interface StatisticsPanelProps {
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export function StatisticsPanel({
  selectedPeriod = "today",
  onPeriodChange,
}: StatisticsPanelProps) {
  const { currentDate } = useCalendarHeaderStore();

  const {
    data: doctors = [],
    isLoading,
    error,
  } = useGetDoctorsQuery(currentDate.format("YYYY-MM-DD"));

  const statistics = useMemo(() => {
    if (!doctors.length) {
      return {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        todayAppointments: 0,
        scheduledAppointments: 0,
        arrivedAppointments: 0,
        isToday: false,
        displayDate: currentDate.format("DD.MM.YYYY"),
      };
    }

    const allAppointments = doctors.flatMap(
      (doctor) => doctor.appointments || []
    );

    const today = dayjs().format("YYYY-MM-DD");
    const currentDateStr = currentDate.format("YYYY-MM-DD");
    const isToday = currentDateStr === today;

    let filteredAppointments = allAppointments;

    switch (selectedPeriod) {
      case "today":
        filteredAppointments = allAppointments;
        break;
      case "week":
        filteredAppointments = allAppointments;
        break;
      case "month":
        filteredAppointments = allAppointments;
        break;
      default:
        filteredAppointments = allAppointments;
    }

    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(
      (apt) => apt.status === "Завершен"
    ).length;
    const cancelledAppointments = filteredAppointments.filter(
      (apt) => apt.status === "Отменен"
    ).length;
    const scheduledAppointments = filteredAppointments.filter(
      (apt) => apt.status === "Записан"
    ).length;
    const arrivedAppointments = filteredAppointments.filter(
      (apt) => apt.status === "Пришел"
    ).length;

    const actualTodayAppointments = isToday ? totalAppointments : 0;

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      todayAppointments: actualTodayAppointments,
      scheduledAppointments,
      arrivedAppointments,
      isToday,
      displayDate: currentDate.format("DD.MM.YYYY"),
    };
  }, [doctors, currentDate, selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    onPeriodChange?.(period);
  };

  const getFourthCardTitle = () => {
    if (selectedPeriod === "today" && statistics.isToday) {
      return "Записи сегодня";
    }
    if (selectedPeriod === "today" && !statistics.isToday) {
      return "Записаны";
    }
    return "Записаны";
  };

  const getFourthCardValue = () => {
    if (selectedPeriod === "today" && statistics.isToday) {
      return statistics.todayAppointments;
    }
    return statistics.scheduledAppointments;
  };

  const getFourthCardDescription = () => {
    if (selectedPeriod === "today" && statistics.isToday) {
      return dayjs().format("DD.MM.YYYY");
    }
    if (selectedPeriod === "today" && !statistics.isToday) {
      return `Ожидают приёма на ${statistics.displayDate}`;
    }
    return "Ожидают приёма";
  };

  if (error) {
    return (
      <div className="mb-6">
        <Card>
          <div className="text-center text-red-500">
            Ошибка загрузки статистики
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Статистика на {statistics.displayDate}
          {statistics.isToday && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
              Сегодня
            </span>
          )}
        </h2>
        <Select
          defaultValue={selectedPeriod}
          style={{ width: 150 }}
          onChange={handlePeriodChange}
        >
          <Option value="today">Выбранный день</Option>
          <Option value="week">За неделю</Option>
          <Option value="month">За месяц</Option>
        </Select>
      </div>

      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Всего записей"
              value={statistics.totalAppointments}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
              loading={isLoading}
            />
            {!isLoading && (
              <div className="text-xs text-gray-500 mt-1">
                На {statistics.displayDate}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Завершено"
              value={statistics.completedAppointments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              loading={isLoading}
            />
            {!isLoading && statistics.totalAppointments > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(
                  (statistics.completedAppointments /
                    statistics.totalAppointments) *
                    100
                )}
                % от всех
              </div>
            )}
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Отменено"
              value={statistics.cancelledAppointments}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
              loading={isLoading}
            />
            {!isLoading && statistics.totalAppointments > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(
                  (statistics.cancelledAppointments /
                    statistics.totalAppointments) *
                    100
                )}
                % от всех
              </div>
            )}
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title={getFourthCardTitle()}
              value={getFourthCardValue()}
              prefix={<CalendarOutlined />}
              valueStyle={{
                color: statistics.isToday ? "#1890ff" : "#722ed1",
              }}
              loading={isLoading}
            />
            {!isLoading && (
              <div className="text-xs text-gray-500 mt-1">
                {getFourthCardDescription()}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {!isLoading && statistics.totalAppointments > 0 && (
        <Row gutter={16} className="mt-4">
          <Col xs={12} sm={8}>
            <Card size="small">
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-500">
                  {statistics.arrivedAppointments}
                </div>
                <div className="text-xs text-gray-500">Пришли на приём</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card size="small">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-500">
                  {doctors.length}
                </div>
                <div className="text-xs text-gray-500">Врачей работает</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-500">
                  {statistics.isToday ? "🎯 Текущий день" : "📅 Другая дата"}
                </div>
                <div className="text-xs text-gray-500">
                  {statistics.isToday
                    ? "Сегодняшние записи"
                    : `Записи на ${statistics.displayDate}`}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {process.env.NODE_ENV === "development" && !isLoading && (
        <Card size="small" className="mt-2" style={{ fontSize: "10px" }}>
          <div className="text-xs text-gray-400">
            Debug: {doctors.length} врачей, {statistics.totalAppointments}{" "}
            записей всего, выбранная дата: {statistics.displayDate}, сегодня:{" "}
            {dayjs().format("DD.MM.YYYY")}, isToday:{" "}
            {statistics.isToday ? "да" : "нет"}, период: {selectedPeriod}
          </div>
        </Card>
      )}
    </div>
  );
}
