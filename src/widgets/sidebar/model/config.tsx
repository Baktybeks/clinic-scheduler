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
    // onClick: () => navigate(ROUTES.HOME)
  },
  {
    key: "calendar",
    icon: <CalendarOutlined />,
    label: "Календарь",
    // onClick: () => navigate(ROUTES.CALENDAR)
  },
  {
    key: "patients",
    icon: <UserOutlined />,
    label: "Пациенты",
    // onClick: () => navigate(ROUTES.PATIENTS)
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Настройки",
    // onClick: () => navigate(ROUTES.SETTINGS)
  },
];
