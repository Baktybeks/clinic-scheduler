import { ROUTES } from "@/shared";
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "calendar",
    icon: <CalendarOutlined />,
    label: "Календарь",
  },
  {
    key: "patients",
    icon: <UserOutlined />,
    label: "Пациенты",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Настройки",
  },
];

export const getRouteByKey = (key: string): string => {
  switch (key) {
    case "dashboard":
      return ROUTES.DASHBOARD;
    case "calendar":
      return ROUTES.CALENDAR;
    case "patients":
      return ROUTES.PATIENTS;
    case "settings":
      return ROUTES.SETTINGS;
    default:
      return ROUTES.HOME;
  }
};
