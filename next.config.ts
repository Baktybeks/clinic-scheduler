import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    esmExternals: "loose",
  },
  transpilePackages: ["antd", "@ant-design", "dayjs"],
};

export default nextConfig;
