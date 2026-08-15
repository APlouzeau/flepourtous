import createNextIntlPlugin from "next-intl/plugin";
import { localizedRoutes } from "./src/i18n/routes.ts";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default withNextIntl(nextConfig);