// app/[locale]/layout.tsx
import { pageMetadata } from "@/lib/metadata";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import LayoutWrapper from "./LayoutWrapper";
import { Providers } from "./providers";
import { getSlugs } from "@/lib/lessons";
import { getMessages } from "next-intl/server"; // 👈 ajout

// Valeurs par défaut (celles de l'accueil) pour toute page qui ne définit pas les siennes.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return pageMetadata(locale, "home");
}

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
