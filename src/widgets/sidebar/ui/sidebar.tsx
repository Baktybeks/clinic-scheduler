"use client";
import { Layout, Menu } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { menuItems, getRouteByKey } from "../model/config";
import type { MenuProps } from "antd";

const { Sider } = Layout;

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getSelectedKey = (): string[] => {
    switch (pathname) {
      case "/dashboard":
        return ["dashboard"];
      case "/calendar":
        return ["calendar"];
      case "/patients":
        return ["patients"];
      case "/settings":
        return ["settings"];
      default:
        return ["calendar"];
    }
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const route = getRouteByKey(key);
    router.push(route);
  };

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
        selectedKeys={getSelectedKey()}
        items={menuItems}
        className="border-r-0 bg-transparent"
        onClick={handleMenuClick}
      />
    </Sider>
  );
}
