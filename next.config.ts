import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Flags
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },

      // Pinterest
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },

      // Domínios próprios
      {
        protocol: "https",
        hostname: "imlinkey.store",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "korddyfire.imlinkey.store",
        pathname: "/**",
      },

      // Instagram CDN
      {
        protocol: "https",
        hostname: "instagram.flad4-1.fna.fbcdn.net",
        pathname: "/**",
      },

      // Supabase Storage
      {
        protocol: "https",
        hostname: "wxmbjwyiqzhzflmqkqzr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;