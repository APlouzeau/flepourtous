// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import LayoutWrapper from "./LayoutWrapper";
import { Providers } from "./providers";
import { getSlugs } from "@/lib/lessons";
import { getMessages } from "next-intl/server"; // 👈 ajout

export const metadata: Metadata = {
    title: "FLE pour tous",
    description: "Cours de français langue étrangère pour tous les niveaux",
};

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const session = await getSession();
    const isLoggedIn = !!session.get("session")?.value;
    const { locale } = await params;
    const slugs = await getSlugs();
    const messages = await getMessages(); // 👈 ajout — charge les fichiers JSON de traduction

    return (
        <html lang={locale}>
            {" "}
            {/* 👈 lang dynamique plutôt que hardcodé "fr" */}
            <body
                className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}
                suppressHydrationWarning={true}
            >
                <Providers locale={locale} messages={messages}>
                    {" "}
                    {/* 👈 messages passé en prop */}
                    <LayoutWrapper isLoggedIn={isLoggedIn} slugs={slugs}>
                        {children}
                    </LayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
