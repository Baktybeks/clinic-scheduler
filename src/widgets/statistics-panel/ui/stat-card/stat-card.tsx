"use client";
import { Card, Statistic } from "antd";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: ReactNode;
  valueStyle?: React.CSSProperties;
}

export function StatCard({ title, value, prefix, valueStyle }: StatCardProps) {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        valueStyle={valueStyle}
      />
    </Card>
  );
}
