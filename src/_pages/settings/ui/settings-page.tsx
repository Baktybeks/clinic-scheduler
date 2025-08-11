"use client";
import { Layout } from "antd";
import { Sidebar } from "@/widgets/sidebar";

const { Content, Header } = Layout;

export function SettingsPage() {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6">
          <h1 className="text-xl font-semibold">Настройки</h1>
        </Header>
        <Content className="p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Настройки системы</h2>
            <p className="text-gray-600">Страница настроек в разработке...</p>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
