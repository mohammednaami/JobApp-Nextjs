import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "vixzzi4frs.ufs.sh",
        port:"",
        protocol:"https",
      }
    ]
  }
};

export default nextConfig;
