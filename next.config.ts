import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output "standalone" removido: na Vercel o roteamento de funcoes exige
  // o output padrao do Next.js (o standalone destina-se a self-hosting).
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
