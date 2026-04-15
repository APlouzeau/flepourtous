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
    output: process.env.OUTPUT ? "export" : undefined,
    async rewrites() {
        return [
            {
                source: "/en/courses-offer/:slug",
                destination: "/en/offre-de-cours/:slug",
            },            {
                source: "/en/courses-offer",
                destination: "/en/offre-de-cours",
            },
            {
                source: "/ja/コースの提供/:slug",
                destination: "/ja/offre-de-cours/:slug",
            },
            {
                source: "/ja/コースの提供",
                destination: "/ja/offre-de-cours",
            },
        ];
    },
};

export default nextConfig;