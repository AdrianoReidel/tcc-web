import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: false, // desativa a verificação automática de tipos
  },
};

export default nextConfig;
