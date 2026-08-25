// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_PEACH_ENTITY_ID: process.env.NEXT_PUBLIC_PEACH_ENTITY_ID || '',
  },
};

export default nextConfig;
