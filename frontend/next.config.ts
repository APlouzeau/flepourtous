import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.daisyui.com",
                port: "",
                pathname: "/images/**",
            },
        ],
    },
    output: process.env.OUTPUT ? "export" : undefined,
};

export default nextConfig;
