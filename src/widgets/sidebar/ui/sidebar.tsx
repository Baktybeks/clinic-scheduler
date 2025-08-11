"use client";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
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

export function Sidebar() {
  return (
    <Sider
      width={240}
      className="h-screen border-r border-gray-200"
      style={{ background: "var(--color-sidebar)" }}
      breakpoint="lg"
      collapsedWidth="80"
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">MedCal</h1>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["calendar"]}
        items={menuItems}
        className="border-r-0 bg-transparent"
      />
    </Sider>
  );
}
